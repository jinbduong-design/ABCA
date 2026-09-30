import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Copy,
  DownloadCloud,
  LogIn,
  LogOut,
  RefreshCw,
  UploadCloud,
} from 'lucide-react';
import {
  PersonalCloudSyncState,
  personalCloudSyncService,
} from '../services/personalCloudSyncService';

const initialState = personalCloudSyncService.getState();

export const PersonalCloudSyncCard: React.FC = () => {
  const [state, setState] = useState<PersonalCloudSyncState>(initialState);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => personalCloudSyncService.subscribe(setState), []);

  const formatTime = (value: string | null) => {
    if (!value) return 'Chưa đồng bộ';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Chưa đồng bộ';
    return date.toLocaleString('vi-VN');
  };

  const handleBackupNow = async () => {
    try {
      await personalCloudSyncService.backupNow();
      setActionMessage('Đã sao lưu dữ liệu hiện tại lên Firebase.');
    } catch {
      setActionMessage(null);
    }
  };

  const handleRestore = async () => {
    if (!window.confirm('Khôi phục từ cloud sẽ thay dữ liệu hiện tại trên thiết bị này. Tiếp tục?')) {
      return;
    }

    try {
      const count = await personalCloudSyncService.restoreFromCloud();
      setActionMessage(`Đã khôi phục ${count} nhóm dữ liệu. App sẽ tải lại.`);
      window.setTimeout(() => window.location.reload(), 600);
    } catch {
      setActionMessage(null);
    }
  };

  const copyUid = async () => {
    if (!state.user?.uid) return;
    try {
      await navigator.clipboard.writeText(state.user.uid);
      setActionMessage('Đã copy Firebase UID.');
    } catch {
      setActionMessage(`UID: ${state.user.uid}`);
    }
  };

  return (
    <section className="mt-7 rounded-[22px] border border-black/[0.06] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <Cloud className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-black text-slate-950">Cloud cá nhân</h2>
            {state.authorized ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-black text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />Đang bật
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-black text-slate-500">
                Chưa bật
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Local vẫn là dữ liệu chính trên máy. Firebase chỉ dùng để backup và đồng bộ giữa các thiết bị của riêng bạn.
          </p>
        </div>
      </div>

      {!state.configured && (
        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
          <div className="flex gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <div>
              <p className="text-xs font-black text-amber-900">Firebase chưa được cấu hình</p>
              <p className="mt-1 text-xs leading-5 text-amber-800">
                App vẫn lưu local và backup JSON bình thường. Khi thêm các biến VITE_FIREBASE_* thì phần cloud mới hoạt động.
              </p>
            </div>
          </div>
        </div>
      )}

      {state.configured && !state.user && (
        <button
          onClick={() => void personalCloudSyncService.signInWithGoogle()}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 text-xs font-black text-white hover:bg-slate-800"
        >
          <LogIn className="h-4 w-4" />Đăng nhập Google
        </button>
      )}

      {state.user && (
        <div className="mt-4 space-y-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Tài khoản</p>
            <p className="mt-1 truncate text-xs font-black text-slate-900">
              {state.user.email || state.user.displayName || 'Google account'}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded-lg bg-white px-2 py-1.5 text-[10px] font-bold text-slate-500 ring-1 ring-black/[0.05]">
                UID: {state.user.uid}
              </code>
              <button
                onClick={copyUid}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-slate-500 ring-1 ring-black/[0.05] hover:text-slate-950"
                title="Copy Firebase UID"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {!state.personalLockConfigured && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              <span className="font-black">Cloud chưa được khóa UID.</span> Copy UID phía trên, đặt nó vào
              <code className="mx-1 rounded bg-white/80 px-1 py-0.5 font-bold">VITE_FIREBASE_ALLOWED_UID</code>
              rồi deploy lại. Trước bước đó app sẽ không tự upload dữ liệu.
            </div>
          )}

          {state.personalLockConfigured && !state.authorized && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs font-bold text-red-700">
              Tài khoản hiện tại không khớp UID được phép.
            </div>
          )}

          {state.authorized && (
            <>
              <div className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] p-3">
                <div>
                  <p className="text-xs font-black text-slate-900">
                    {state.syncing ? 'Đang đồng bộ…' : 'Đồng bộ tự động'}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold text-slate-400">
                    Lần gần nhất: {formatTime(state.lastSyncedAt)}
                  </p>
                </div>
                <RefreshCw className={`h-4 w-4 text-blue-600 ${state.syncing ? 'animate-spin' : ''}`} />
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <button
                  disabled={state.syncing}
                  onClick={handleBackupNow}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-black text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <UploadCloud className="h-4 w-4" />Sao lưu ngay
                </button>
                <button
                  disabled={state.syncing}
                  onClick={handleRestore}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 text-xs font-black text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  <DownloadCloud className="h-4 w-4" />Khôi phục cloud
                </button>
              </div>
            </>
          )}

          <button
            onClick={() => void personalCloudSyncService.signOut()}
            className="inline-flex min-h-9 items-center gap-2 text-xs font-black text-slate-400 hover:text-red-600"
          >
            <LogOut className="h-3.5 w-3.5" />Đăng xuất Google
          </button>
        </div>
      )}

      {state.error && (
        <div className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
          {state.error}
        </div>
      )}
      {actionMessage && !state.error && (
        <div className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
          {actionMessage}
        </div>
      )}
    </section>
  );
};
