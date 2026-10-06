import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Volume2,
} from 'lucide-react';
import {
  DailyLessonData,
  dailyLessonService,
} from '../services/dailyLessonService';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';

interface DailyDataLessonPlayerProps {
  lesson: DailyLessonData;
  onClose: () => void;
  onCompleted: () => void;
}

export const DailyDataLessonPlayer: React.FC<DailyDataLessonPlayerProps> = ({
  lesson,
  onClose,
  onCompleted,
}) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [showVietnamese, setShowVietnamese] = useState(false);
  const [learnerName, setLearnerName] = useState(
    () => dailyLessonService.getLearnerName()
  );
  const [response, setResponse] = useState('');
  const [helpLevel, setHelpLevel] = useState(-1);
  const [helpUsed, setHelpUsed] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const step = lesson.flow[stepIndex] || lesson.flow[0];
  const progress = Math.round(((stepIndex + 1) / lesson.flow.length) * 100);

  const chunk = useMemo(
    () =>
      lesson.core_chunks.find(
        (item) => item.id === String(step?.target_id || '')
      ),
    [lesson.core_chunks, step]
  );

  const fillName = (value?: string) =>
    String(value || '').replaceAll('{name}', learnerName.trim() || '...');

  const resetLocal = () => {
    setShowVietnamese(false);
    setResponse('');
    setHelpLevel(-1);
    setSubIndex(0);
    setRevealed(false);
  };

  const goNext = () => {
    speechService.stop();
    resetLocal();
    setStepIndex((current) =>
      Math.min(lesson.flow.length - 1, current + 1)
    );
  };

  const useHelp = (levels?: string[]) => {
    if (!levels?.length) return;
    setHelpUsed((value) => value + 1);
    setHelpLevel((value) => Math.min(levels.length - 1, value + 1));
  };

  const finishLesson = () => {
    dailyLessonService.completeDay(
      lesson,
      helpUsed,
      learnerName.trim() || undefined
    );
    storageService.addStudyTime(
      Math.max(1, lesson.learner_profile.session_minutes || 1)
    );
    speechService.playSuccessSound();
    onCompleted();
  };

  const AudioButton = ({
    text,
    rate = 0.82,
    label = 'Nghe',
  }: {
    text: string;
    rate?: number;
    label?: string;
  }) => (
    <button
      type="button"
      onClick={() => speechService.speak(fillName(text), rate)}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-xs font-black text-slate-700"
    >
      <Volume2 className="h-4 w-4" />
      {label}
    </button>
  );

  const Translation = ({
    english,
    vietnamese,
  }: {
    english?: string;
    vietnamese?: string;
  }) => (
    <div className="mt-3">
      {english && (
        <p className="text-sm font-semibold leading-6 text-slate-500">
          {fillName(english)}
        </p>
      )}
      {vietnamese && (
        <>
          {showVietnamese && (
            <p className="mt-2 text-xs leading-5 text-amber-800">
              {fillName(vietnamese)}
            </p>
          )}
          <button
            type="button"
            onClick={() => setShowVietnamese((value) => !value)}
            className="mt-2 text-[11px] font-black text-amber-700"
          >
            {showVietnamese
              ? 'Ẩn tiếng Việt'
              : 'Không hiểu? Xem tiếng Việt'}
          </button>
        </>
      )}
    </div>
  );

  const ContinueButton = ({
    label = 'Tiếp tục',
    disabled = false,
    onClick = goNext,
  }: {
    label?: string;
    disabled?: boolean;
    onClick?: () => void;
  }) => (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-black text-white disabled:opacity-30"
    >
      {label}
      <ChevronRight className="h-4 w-4" />
    </button>
  );

  const renderChunk = (
    instruction: string,
    actionLabel: string,
    action?: () => void
  ) => {
    if (!chunk) return <ContinueButton />;

    return (
      <div>
        <p className="text-xs font-black uppercase tracking-[0.13em] text-amber-700">
          {instruction}
        </p>
        <h2 className="mt-5 text-[32px] font-black leading-tight tracking-[-0.03em] text-slate-950">
          {fillName(chunk.german)}
        </h2>
        <Translation
          english={chunk.english}
          vietnamese={chunk.vietnamese}
        />
        <div className="mt-6">
          <AudioButton
            text={chunk.german}
            rate={chunk.audio_speed || 0.82}
            label="Nghe lại"
          />
        </div>
        <ContinueButton label={actionLabel} onClick={action || goNext} />
      </div>
    );
  };

  const renderMicroDialogue = () => {
    const dialogue = Array.isArray(step.dialogue) ? step.dialogue : [];
    const turn = dialogue[subIndex];

    if (!turn) {
      return (
        <div>
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          <h2 className="mt-4 text-2xl font-black text-slate-950">
            Xong lượt hội thoại có hướng dẫn.
          </h2>
          <ContinueButton />
        </div>
      );
    }

    const advance = () => {
      setResponse('');
      setHelpLevel(-1);
      setShowVietnamese(false);
      if (subIndex >= dialogue.length - 1) {
        goNext();
      } else {
        setSubIndex((value) => value + 1);
      }
    };

    if (turn.speaker === 'partner') {
      return (
        <div>
          <p className="text-xs font-black uppercase tracking-[0.13em] text-slate-400">
            Người đối diện nói
          </p>
          <h2 className="mt-5 text-[30px] font-black leading-tight text-slate-950">
            {fillName(turn.german)}
          </h2>
          <Translation english={turn.english} vietnamese={turn.vietnamese} />
          <div className="mt-6">
            <AudioButton text={turn.german} />
          </div>
          <ContinueButton label="Đến lượt tao" onClick={advance} />
        </div>
      );
    }

    const levels = Array.isArray(turn.help_levels) ? turn.help_levels : [];
    const visibleHelp =
      helpLevel >= 0 ? fillName(levels[helpLevel] || '') : '';

    return (
      <div>
        <p className="text-xs font-black uppercase tracking-[0.13em] text-amber-700">
          Đến lượt mày
        </p>
        <h2 className="mt-4 text-2xl font-black leading-tight text-slate-950">
          Tự nói trước. Chưa nhớ thì xin gợi ý.
        </h2>

        {visibleHelp && (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-base font-black text-amber-950">
            {visibleHelp}
          </div>
        )}

        <input
          value={response}
          onChange={(event) => setResponse(event.target.value)}
          placeholder="Gõ câu mày vừa nói…"
          className="mt-5 min-h-12 w-full rounded-2xl bg-slate-50 px-4 text-base font-semibold outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-amber-400"
        />

        <button
          type="button"
          onClick={() => useHelp(levels)}
          className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-black text-amber-700"
        >
          <Lightbulb className="h-4 w-4" />
          {helpLevel < 0 ? 'Bí → gợi ý 1 chút' : 'Cần thêm gợi ý'}
        </button>

        <ContinueButton
          label="Xong lượt của tao"
          disabled={!response.trim() && helpLevel < 0}
          onClick={advance}
        />
      </div>
    );
  };

  const renderRetrieval = () => {
    const prompts = Array.isArray(step.prompts) ? step.prompts : [];
    const item = prompts[subIndex];

    if (!item) return <ContinueButton />;

    const levels = Array.isArray(item.help_levels) ? item.help_levels : [];
    const visibleHelp =
      helpLevel >= 0 ? fillName(levels[helpLevel] || '') : '';

    const advance = () => {
      if (subIndex >= prompts.length - 1) {
        goNext();
      } else {
        setSubIndex((value) => value + 1);
        setResponse('');
        setHelpLevel(-1);
        setRevealed(false);
      }
    };

    return (
      <div>
        <p className="text-xs font-black uppercase tracking-[0.13em] text-amber-700">
          Tự nhớ · {subIndex + 1}/{prompts.length}
        </p>
        <h2 className="mt-5 text-2xl font-black leading-tight text-slate-950">
          {fillName(item.prompt_en)}
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Đừng xem đáp án ngay. Thử kéo câu tiếng Đức ra khỏi trí nhớ trước.
        </p>

        {!revealed ? (
          <>
            {visibleHelp && (
              <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-base font-black text-amber-950">
                {visibleHelp}
              </div>
            )}

            <input
              value={response}
              onChange={(event) => setResponse(event.target.value)}
              placeholder="Câu tiếng Đức…"
              className="mt-5 min-h-12 w-full rounded-2xl bg-slate-50 px-4 text-base font-semibold outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-amber-400"
            />

            <button
              type="button"
              onClick={() => useHelp(levels)}
              className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-black text-amber-700"
            >
              <Lightbulb className="h-4 w-4" />
              {helpLevel < 0 ? 'Không nhớ → gợi ý' : 'Thêm gợi ý'}
            </button>

            <ContinueButton
              label="Kiểm tra bằng đáp án"
              disabled={!response.trim() && helpLevel < 0}
              onClick={() => setRevealed(true)}
            />
          </>
        ) : (
          <>
            <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                Câu mẫu
              </p>
              <p className="mt-1 text-xl font-black text-emerald-950">
                {fillName(item.expected)}
              </p>
            </div>
            <ContinueButton
              label={
                subIndex >= prompts.length - 1
                  ? 'Sang tình huống cuối'
                  : 'Câu tiếp theo'
              }
              onClick={advance}
            />
          </>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (step.type) {
      case 'scene':
        return (
          <div>
            <p className="text-xs font-black uppercase tracking-[0.13em] text-amber-700">
              {step.title || 'Tình huống'}
            </p>
            <h2 className="mt-5 text-3xl font-black leading-tight tracking-[-0.03em] text-slate-950">
              {step.content?.vi || lesson.outcome.real_world_scene}
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              Hôm nay chỉ cần làm được đúng một việc nhỏ. Không có bài kiểm tra.
            </p>
            <ContinueButton label="Bắt đầu" />
          </div>
        );

      case 'listen_and_understand':
        return renderChunk(
          step.instruction_vi || 'Nghe trước',
          'Tao đã nghe'
        );

      case 'imitate':
        return renderChunk(
          step.instruction_vi || 'Nói theo',
          'Tao đã nói theo'
        );

      case 'personalize':
        return (
          <div>
            <p className="text-xs font-black uppercase tracking-[0.13em] text-amber-700">
              Biến thành câu của mày
            </p>
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              Tên mày muốn dùng trong bài?
            </h2>
            <input
              value={learnerName}
              onChange={(event) => setLearnerName(event.target.value)}
              placeholder="Nhập tên…"
              className="mt-5 min-h-12 w-full rounded-2xl bg-slate-50 px-4 text-base font-semibold outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-amber-400"
            />
            {learnerName.trim() && (
              <div className="mt-5 border-l-2 border-amber-400 pl-4">
                <p className="text-2xl font-black text-slate-950">
                  {fillName(step.template)}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  My name is {learnerName.trim()}.
                </p>
                <div className="mt-4">
                  <AudioButton text={step.template} rate={0.78} />
                </div>
              </div>
            )}
            <ContinueButton
              label="Tao đã nói câu này"
              disabled={!learnerName.trim()}
            />
          </div>
        );

      case 'micro_dialogue_guided':
        return renderMicroDialogue();

      case 'retrieval':
        return renderRetrieval();

      case 'mini_real_scene':
        return (
          <div>
            <p className="text-xs font-black uppercase tracking-[0.13em] text-amber-700">
              {step.title || 'Tình huống thật'}
            </p>
            <div className="mt-5 border-l-2 border-amber-400 pl-4">
              <p className="text-2xl font-black leading-tight text-slate-950">
                {fillName(step.partner_opening?.german)}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {fillName(step.partner_opening?.english)}
              </p>
              <div className="mt-4">
                <AudioButton text={step.partner_opening?.german || ''} />
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-slate-600">
              {step.learner_goal}
            </p>

            {!revealed ? (
              <>
                <textarea
                  value={response}
                  onChange={(event) => setResponse(event.target.value)}
                  rows={3}
                  placeholder="Nói thành tiếng trước, rồi gõ lại câu mày vừa nói…"
                  className="mt-4 w-full rounded-2xl bg-slate-50 p-4 text-base font-semibold outline-none ring-1 ring-black/[0.06] focus:ring-2 focus:ring-amber-400"
                />
                <ContinueButton
                  label="Tao đã trả lời"
                  disabled={!response.trim()}
                  onClick={() => setRevealed(true)}
                />
              </>
            ) : (
              <>
                <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
                    Chỉ cần đạt được ý này
                  </p>
                  <div className="mt-2 space-y-1">
                    {(step.minimum_success || []).map(
                      (item: string, index: number) => (
                        <p
                          key={index}
                          className="text-base font-black text-emerald-950"
                        >
                          {fillName(item)}
                        </p>
                      )
                    )}
                  </div>
                </div>
                <ContinueButton label="Kết thúc bài" />
              </>
            )}
          </div>
        );

      case 'finish':
        return (
          <div>
            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
            <p className="mt-5 text-xs font-black uppercase tracking-[0.13em] text-emerald-700">
              Day {lesson.day} xong
            </p>
            <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.03em] text-slate-950">
              {step.title || 'Hôm nay mày làm được'}
            </h2>
            <div className="mt-6 space-y-3">
              {(step.can_do_items || []).map(
                (item: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-sm font-black text-slate-800"
                  >
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    {item}
                  </div>
                )
              )}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">
              {step.message_vi}
            </p>
            <button
              type="button"
              onClick={finishLesson}
              className="mt-7 min-h-12 w-full rounded-2xl bg-emerald-700 px-5 text-sm font-black text-white"
            >
              Hoàn thành Day {lesson.day}
            </button>
          </div>
        );

      default:
        return (
          <div>
            <h2 className="text-2xl font-black text-slate-950">
              {step.title || 'Tiếp tục bài học'}
            </h2>
            <ContinueButton />
          </div>
        );
    }
  };

  return (
    <div className="lesson-screen-safe fixed inset-0 z-50 flex flex-col overflow-hidden bg-[#f7f7f5]">
      <header className="shrink-0 border-b border-black/[0.06] bg-[#f7f7f5]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-3 py-3 sm:px-5">
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-slate-600 ring-1 ring-black/[0.06]"
            aria-label="Đóng bài học"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-slate-950">
              Day {lesson.day} · {lesson.title}
            </p>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-amber-400 transition-all duration-300"
                style={{ width: String(progress) + '%' }}
              />
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-400">
            {stepIndex + 1}/{lesson.flow.length}
          </span>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex min-h-full w-full max-w-2xl items-center px-4 py-8 sm:px-6 sm:py-10">
          <div className="w-full">{renderStep()}</div>
        </div>
      </main>
    </div>
  );
};
