import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  GoogleAuthProvider,
  User,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'firebase/auth';
import { Firestore, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { storageService } from './storageService';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined,
};

const ALLOWED_UID = (import.meta.env.VITE_FIREBASE_ALLOWED_UID || '').trim();
const LAST_SYNC_KEY = 'deutschstart_cloud_last_sync_v1';

export interface PersonalCloudSyncState {
  configured: boolean;
  personalLockConfigured: boolean;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  authorized: boolean;
  syncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
}

const isConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

class PersonalCloudSyncService {
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private started = false;
  private authUnsubscribe: (() => void) | null = null;
  private storageUnsubscribe: (() => void) | null = null;
  private listeners = new Set<(state: PersonalCloudSyncState) => void>();
  private uploadTimer: number | null = null;
  private suppressStorageSync = false;

  private state: PersonalCloudSyncState = {
    configured: isConfigured,
    personalLockConfigured: Boolean(ALLOWED_UID),
    user: null,
    authorized: false,
    syncing: false,
    lastSyncedAt:
      typeof window !== 'undefined' ? localStorage.getItem(LAST_SYNC_KEY) : null,
    error: null,
  };

  public getState(): PersonalCloudSyncState {
    return { ...this.state, user: this.state.user ? { ...this.state.user } : null };
  }

  public subscribe(listener: (state: PersonalCloudSyncState) => void) {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private emit(patch: Partial<PersonalCloudSyncState>) {
    this.state = { ...this.state, ...patch };
    const snapshot = this.getState();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private ensureFirebase() {
    if (!isConfigured) {
      throw new Error('Firebase chưa được cấu hình cho DeutschStart.');
    }

    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    if (!this.auth) this.auth = getAuth(app);
    if (!this.db) this.db = getFirestore(app);
  }

  public start() {
    if (this.started) return;
    this.started = true;

    if (!isConfigured) return;

    this.ensureFirebase();

    getRedirectResult(this.auth!).catch((error) => {
      this.emit({ error: this.errorMessage(error) });
    });

    this.authUnsubscribe = onAuthStateChanged(this.auth!, (user) => {
      void this.handleAuthState(user);
    });

    this.storageUnsubscribe = storageService.subscribe(() => {
      this.scheduleUpload();
    });
  }

  private async handleAuthState(user: User | null) {
    if (!user) {
      this.emit({ user: null, authorized: false, syncing: false });
      return;
    }

    const publicUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    if (!ALLOWED_UID) {
      this.emit({
        user: publicUser,
        authorized: false,
        error: null,
      });
      return;
    }

    if (user.uid !== ALLOWED_UID) {
      this.emit({
        user: publicUser,
        authorized: false,
        error: 'Tài khoản Google này không phải tài khoản cá nhân đã được phép đồng bộ.',
      });
      await signOut(this.auth!);
      return;
    }

    this.emit({ user: publicUser, authorized: true, error: null });
    await this.reconcileAfterLogin();
  }

  public async signInWithGoogle() {
    this.ensureFirebase();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone);
    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    try {
      if (standalone || isiOS) {
        await signInWithRedirect(this.auth!, provider);
      } else {
        await signInWithPopup(this.auth!, provider);
      }
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked') {
        await signInWithRedirect(this.auth!, provider);
        return;
      }
      this.emit({ error: this.errorMessage(error) });
      throw error;
    }
  }

  public async signOut() {
    if (!this.auth) return;
    await signOut(this.auth);
    this.emit({ user: null, authorized: false, error: null });
  }

  private cloudDoc() {
    if (!this.db || !this.state.user) {
      throw new Error('Chưa đăng nhập Firebase.');
    }
    return doc(this.db, 'users', this.state.user.uid, 'appState', 'main');
  }

  private assertReadyForSync() {
    if (!this.state.personalLockConfigured) {
      throw new Error('Chưa khóa VITE_FIREBASE_ALLOWED_UID nên cloud sync đang tạm tắt.');
    }
    if (!this.state.authorized || !this.state.user) {
      throw new Error('Tài khoản hiện tại chưa được phép đồng bộ.');
    }
    if (!this.db) {
      throw new Error('Firestore chưa sẵn sàng.');
    }
  }

  public async backupNow() {
    this.assertReadyForSync();
    this.emit({ syncing: true, error: null });

    try {
      const updatedAt = storageService.ensureLastChangedAt();
      const syncedAt = new Date().toISOString();
      await setDoc(this.cloudDoc(), {
        schemaVersion: 1,
        updatedAt,
        syncedAt,
        backup: storageService.createBackup(),
      });
      localStorage.setItem(LAST_SYNC_KEY, syncedAt);
      this.emit({ syncing: false, lastSyncedAt: syncedAt, error: null });
    } catch (error) {
      const message = this.errorMessage(error);
      this.emit({ syncing: false, error: message });
      throw error;
    }
  }

  public async restoreFromCloud(): Promise<number> {
    this.assertReadyForSync();
    this.emit({ syncing: true, error: null });

    try {
      const snapshot = await getDoc(this.cloudDoc());
      if (!snapshot.exists()) {
        throw new Error('Chưa có bản sao cloud để khôi phục.');
      }

      const data = snapshot.data();
      if (!data?.backup) {
        throw new Error('Bản sao cloud không hợp lệ.');
      }

      this.suppressStorageSync = true;
      let restored = 0;
      try {
        restored = storageService.restoreBackup(data.backup);
      } finally {
        this.suppressStorageSync = false;
      }

      const syncedAt = new Date().toISOString();
      localStorage.setItem(LAST_SYNC_KEY, syncedAt);
      this.emit({ syncing: false, lastSyncedAt: syncedAt, error: null });
      return restored;
    } catch (error) {
      const message = this.errorMessage(error);
      this.emit({ syncing: false, error: message });
      throw error;
    }
  }

  private async reconcileAfterLogin() {
    if (!this.state.authorized || !this.state.personalLockConfigured) return;

    this.emit({ syncing: true, error: null });

    try {
      const snapshot = await getDoc(this.cloudDoc());

      if (!snapshot.exists()) {
        this.emit({ syncing: false });
        await this.backupNow();
        return;
      }

      const data = snapshot.data();
      const cloudUpdatedAt =
        typeof data?.updatedAt === 'string' ? data.updatedAt : null;
      const localUpdatedAt = storageService.getLastChangedAt();

      if (!localUpdatedAt && data?.backup) {
        this.suppressStorageSync = true;
        try {
          storageService.restoreBackup(data.backup);
        } finally {
          this.suppressStorageSync = false;
        }
      } else if (
        cloudUpdatedAt &&
        localUpdatedAt &&
        new Date(cloudUpdatedAt).getTime() > new Date(localUpdatedAt).getTime() &&
        data?.backup
      ) {
        this.suppressStorageSync = true;
        try {
          storageService.restoreBackup(data.backup);
        } finally {
          this.suppressStorageSync = false;
        }
      } else if (
        localUpdatedAt &&
        (!cloudUpdatedAt ||
          new Date(localUpdatedAt).getTime() > new Date(cloudUpdatedAt).getTime())
      ) {
        this.emit({ syncing: false });
        await this.backupNow();
        return;
      }

      const syncedAt =
        typeof data?.syncedAt === 'string' ? data.syncedAt : new Date().toISOString();
      localStorage.setItem(LAST_SYNC_KEY, syncedAt);
      this.emit({ syncing: false, lastSyncedAt: syncedAt, error: null });
    } catch (error) {
      this.emit({ syncing: false, error: this.errorMessage(error) });
    }
  }

  private scheduleUpload() {
    if (
      this.suppressStorageSync ||
      !this.state.authorized ||
      !this.state.personalLockConfigured
    ) {
      return;
    }

    if (this.uploadTimer !== null) window.clearTimeout(this.uploadTimer);
    this.uploadTimer = window.setTimeout(() => {
      this.uploadTimer = null;
      void this.backupNow().catch(() => {
        // Error state is already surfaced by backupNow.
      });
    }, 1500);
  }

  private errorMessage(error: unknown) {
    if (error instanceof Error && error.message) return error.message;
    return 'Không thể đồng bộ dữ liệu cloud lúc này.';
  }
}

export const personalCloudSyncService = new PersonalCloudSyncService();
