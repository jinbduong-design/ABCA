/**
 * Speech Service: Handles text-to-speech (TTS) in native German and
 * speech recognition (STT) for pronunciation practice.
 */

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private germanVoice: SpeechSynthesisVoice | null = null;
  private activeRecognition: any = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoice();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    // Prioritize natural German voices
    const deVoices = voices.filter((v) => v.lang.startsWith('de'));
    const preferred =
      deVoices.find(
        (v) =>
          v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Premium')
      ) || deVoices[0];
    this.germanVoice = preferred || null;
  }

  /**
   * Speak German text with rate control
   */
  public speak(text: string, rate: number = 0.9): Promise<void> {
    return new Promise((resolve) => {
      if (!this.synth || typeof window === 'undefined') {
        resolve();
        return;
      }

      this.synth.cancel(); // Stop any pending speech

      const cleanText = text.replace(/\[.*?\]/g, '').trim();
      if (!cleanText) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'de-DE';
      utterance.rate = rate; // 0.8-0.9 for beginners
      utterance.pitch = 1.0;

      if (this.germanVoice) {
        utterance.voice = this.germanVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  /**
   * Stop speaking
   */
  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  /**
   * Check if speech recognition is available in browser
   */
  public isRecognitionSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return Boolean(
      (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition
    );
  }

  /**
   * Start listening for German speech
   */
  public startSpeechRecognition(
    onResult: (transcript: string) => void,
    onError?: (err: string) => void
  ) {
    if (!this.isRecognitionSupported()) {
      if (onError) onError('Trình duyệt không hỗ trợ nhận diện giọng nói');
      return;
    }

    try {
      this.stopSpeechRecognition();
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'de-DE';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.onerror = (event: any) => {
        if (onError) onError(event.error || 'Lỗi micro');
      };

      this.activeRecognition = recognition;
      recognition.start();
    } catch (err: any) {
      if (onError) onError(err.message || 'Không thể khởi động micro');
    }
  }

  /**
   * Stop speech recognition
   */
  public stopSpeechRecognition() {
    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch (e) {}
      this.activeRecognition = null;
    }
  }

  /**
   * Calculate pronunciation similarity score (0 to 100)
   */
  public calculateSimilarity(spoken: string, target: string): number {
    const cleanSpoken = spoken
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .trim();
    const cleanTarget = target
      .toLowerCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '')
      .trim();

    if (!cleanSpoken || !cleanTarget) return 0;
    if (cleanSpoken === cleanTarget) return 100;

    const distance = this.levenshtein(cleanSpoken, cleanTarget);
    const maxLen = Math.max(cleanSpoken.length, cleanTarget.length);
    return Math.max(0, Math.round((1 - distance / maxLen) * 100));
  }

  public evaluatePronunciation(
    spoken: string,
    target: string
  ): {
    score: number;
    match: boolean;
    feedback: string;
  } {
    const score = this.calculateSimilarity(spoken, target);

    let feedback = '';
    if (score >= 80) {
      feedback = 'Rất tốt! Bạn phát âm gần như chuẩn bản xứ.';
    } else if (score >= 55) {
      feedback = 'Khá ổn! Hãy chú ý âm đuôi và các nguyên âm biến âm (ä, ö, ü).';
    } else {
      feedback = 'Cần luyện thêm. Hãy nghe phát âm mẫu và lặp lại chậm rãi nhé.';
    }

    return {
      score,
      match: score >= 70,
      feedback,
    };
  }

  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }
}

export const speechService = new SpeechService();
