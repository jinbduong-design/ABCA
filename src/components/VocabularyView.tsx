import React, { useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Layers,
  RotateCcw,
  Search,
  Star,
  StickyNote,
  Volume2,
} from 'lucide-react';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { FlashcardItem, VocabularyItem } from '../types';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { PhoneticsGuideModal } from './PhoneticsGuideModal';
import { AdjektivAndPrepositionMatrixModal } from './AdjektivAndPrepositionMatrixModal';

interface VocabularyViewProps {
  onOpenNotes?: (targetId: string, defaultTitle: string) => void;
}

const VOCAB_TOPICS = [
  { id: 'all', label: 'Tất cả chủ đề' },
  { id: 'alphabet_numbers', label: 'Bảng chữ cái & Số' },
  { id: 'greetings_intro', label: 'Chào hỏi' },
  { id: 'family', label: 'Gia đình' },
  { id: 'food_drinks', label: 'Ăn uống' },
  { id: 'shopping', label: 'Mua sắm' },
  { id: 'home_furniture', label: 'Nhà cửa' },
  { id: 'daily_routine', label: 'Sinh hoạt' },
  { id: 'hobbies_free_time', label: 'Sở thích' },
  { id: 'transport_travel', label: 'Đi lại' },
  { id: 'health_body', label: 'Sức khỏe' },
  { id: 'work_school', label: 'Công việc' },
  { id: 'weather_seasons', label: 'Thời tiết' },
];

const articleClass = (article?: string) => {
  if (article === 'der') return 'bg-blue-50 text-blue-700';
  if (article === 'die') return 'bg-red-50 text-red-700';
  if (article === 'das') return 'bg-emerald-50 text-emerald-700';
  return 'bg-slate-100 text-slate-600';
};

export const VocabularyView: React.FC<VocabularyViewProps> = ({ onOpenNotes }) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'list'>('flashcards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyDueForReview, setOnlyDueForReview] = useState(false);
  const [cardDirection, setCardDirection] = useState<'de_to_vn' | 'vn_to_de'>('de_to_vn');
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [srsCards, setSrsCards] = useState<Record<string, FlashcardItem>>({});
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [isPhoneticsOpen, setIsPhoneticsOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  React.useEffect(() => {
    const cards = storageService.getFlashcards();
    setSrsCards(Object.fromEntries(cards.map((card) => [card.vocabId, card])));
    const saved = localStorage.getItem('deutsch_start_fav_words');
    if (saved) {
      try { setFavorites(JSON.parse(saved)); } catch { /* ignore corrupt legacy value */ }
    }
  }, []);

  const resetCard = () => {
    setCurrentCardIdx(0);
    setIsCardFlipped(false);
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('deutsch_start_fav_words', JSON.stringify(next));
      return next;
    });
  };

  const dueCount = useMemo(() => {
    const now = new Date();
    return (Object.values(srsCards) as FlashcardItem[]).filter((card) => new Date(card.nextReviewDate) <= now).length;
  }, [srsCards]);

  const filteredVocab = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const now = new Date();
    return VOCABULARY_LIST.filter((item) => {
      if (q && !`${item.german} ${item.vietnamese} ${item.english}`.toLowerCase().includes(q)) return false;
      if (selectedLevel !== 'all' && item.level !== selectedLevel) return false;
      if (selectedArticle !== 'all' && item.article !== selectedArticle) return false;
      if (selectedTopic !== 'all' && item.topicId !== selectedTopic && item.topic !== selectedTopic) return false;
      if (onlyFavorites && !favorites.includes(item.id)) return false;
      if (onlyDueForReview) {
        const card = srsCards[item.id];
        if (!card || new Date(card.nextReviewDate) > now) return false;
      }
      return true;
    });
  }, [searchQuery, selectedLevel, selectedArticle, selectedTopic, onlyFavorites, onlyDueForReview, favorites, srsCards]);

  const activeCard = filteredVocab[currentCardIdx] || filteredVocab[0];
  const currentSRSInfo = activeCard ? srsCards[activeCard.id] : null;

  const handleRateFlashcard = (rating: 1 | 2 | 3 | 4) => {
    if (!activeCard) return;
    storageService.updateFlashcardReview(activeCard.id, rating);
    rating >= 3 ? speechService.playSuccessSound() : speechService.playErrorSound();
    const cards = storageService.getFlashcards();
    setSrsCards(Object.fromEntries(cards.map((card) => [card.vocabId, card])));
    setIsCardFlipped(false);
    setCurrentCardIdx((current) => filteredVocab.length ? (current + 1) % filteredVocab.length : 0);
  };

  const speak = (item: VocabularyItem) => speechService.speak(item.article && item.article !== 'none' ? `${item.article} ${item.german}` : item.german);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-28 pt-5 sm:px-6 sm:pt-7 lg:pb-10 animate-fadeIn">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">Từ vựng</p><h1 className="mt-1 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">Ôn hôm nay, tra khi cần</h1></div>
        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
          <button onClick={() => setActiveTab('flashcards')} className={`min-h-10 rounded-lg px-3 text-xs font-black ${activeTab === 'flashcards' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}><RotateCcw className="mr-1.5 inline h-3.5 w-3.5" />Flashcards</button>
          <button onClick={() => setActiveTab('list')} className={`min-h-10 rounded-lg px-3 text-xs font-black ${activeTab === 'list' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500'}`}><Bookmark className="mr-1.5 inline h-3.5 w-3.5" />Danh sách</button>
        </div>
      </header>

      <section className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
        <button onClick={() => { setOnlyDueForReview(true); setActiveTab('flashcards'); resetCard(); }} className="flex items-center justify-between rounded-[22px] bg-slate-950 p-5 text-left text-white">
          <div><p className="text-[11px] font-black uppercase tracking-[0.15em] text-amber-400">Cần ôn</p><p className="mt-1 text-2xl font-black">{dueCount} từ</p><p className="mt-1 text-xs font-medium text-slate-400">Ôn theo SRS trước khi học từ mới</p></div><span className="grid h-10 w-10 place-items-center rounded-full bg-amber-400 text-slate-950"><RotateCcw className="h-4 w-4" /></span>
        </button>
        <div className="grid grid-cols-2 gap-2 sm:w-[250px]">
          <button onClick={() => setIsPhoneticsOpen(true)} className="rounded-[20px] border border-black/[0.06] bg-white p-4 text-left shadow-sm"><Volume2 className="h-4 w-4 text-amber-700" /><p className="mt-3 text-xs font-black">Phát âm</p></button>
          <button onClick={() => setIsMatrixOpen(true)} className="rounded-[20px] border border-black/[0.06] bg-white p-4 text-left shadow-sm"><Layers className="h-4 w-4 text-amber-700" /><p className="mt-3 text-xs font-black">Tra cứu</p></button>
        </div>
      </section>

      <section className="mt-4 rounded-[22px] border border-black/[0.06] bg-white p-3 shadow-sm sm:p-4">
        <div className="relative"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); resetCard(); }} placeholder="Tìm tiếng Đức hoặc tiếng Việt" className="min-h-11 w-full rounded-xl bg-[#f7f7f5] pl-10 pr-4 text-sm font-medium outline-none ring-1 ring-black/[0.05] focus:ring-2 focus:ring-amber-400" /></div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 text-xs">
          <select value={selectedLevel} onChange={(e) => { setSelectedLevel(e.target.value); resetCard(); }} className="min-h-9 shrink-0 rounded-xl bg-slate-100 px-3 font-bold text-slate-600 outline-none"><option value="all">A0–A2</option><option value="A0">A0</option><option value="A1">A1</option><option value="A2">A2</option></select>
          <select value={selectedTopic} onChange={(e) => { setSelectedTopic(e.target.value); resetCard(); }} className="min-h-9 shrink-0 rounded-xl bg-slate-100 px-3 font-bold text-slate-600 outline-none">{VOCAB_TOPICS.map((topic) => <option key={topic.id} value={topic.id}>{topic.label}</option>)}</select>
          <select value={selectedArticle} onChange={(e) => { setSelectedArticle(e.target.value); resetCard(); }} className="min-h-9 shrink-0 rounded-xl bg-slate-100 px-3 font-bold text-slate-600 outline-none"><option value="all">Mọi quán từ</option><option value="der">der</option><option value="die">die</option><option value="das">das</option><option value="none">Không quán từ</option></select>
          <button onClick={() => { setOnlyDueForReview((value) => !value); resetCard(); }} className={`min-h-9 shrink-0 rounded-xl px-3 font-black ${onlyDueForReview ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}><Clock3 className="mr-1 inline h-3.5 w-3.5" />Cần ôn</button>
          <button onClick={() => { setOnlyFavorites((value) => !value); resetCard(); }} className={`min-h-9 shrink-0 rounded-xl px-3 font-black ${onlyFavorites ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'}`}><Star className="mr-1 inline h-3.5 w-3.5" />Đã lưu</button>
        </div>
      </section>

      {activeTab === 'flashcards' && (
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between gap-3"><div className="flex rounded-xl bg-slate-100 p-1 text-[11px] font-black"><button onClick={() => { setCardDirection('de_to_vn'); setIsCardFlipped(false); }} className={`rounded-lg px-3 py-2 ${cardDirection === 'de_to_vn' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Đức → Việt</button><button onClick={() => { setCardDirection('vn_to_de'); setIsCardFlipped(false); }} className={`rounded-lg px-3 py-2 ${cardDirection === 'vn_to_de' ? 'bg-white shadow-sm' : 'text-slate-500'}`}><ArrowLeftRight className="mr-1 inline h-3 w-3" />Việt → Đức</button></div><p className="text-xs font-bold text-slate-400">{filteredVocab.length ? `${Math.min(currentCardIdx + 1, filteredVocab.length)}/${filteredVocab.length}` : '0/0'}</p></div>

          {!activeCard ? <div className="rounded-[24px] border border-dashed border-slate-200 bg-white py-16 text-center text-sm font-bold text-slate-400">Không có từ phù hợp với bộ lọc.</div> : (
            <>
              <button type="button" onClick={() => setIsCardFlipped((value) => !value)} className="flex min-h-[300px] w-full flex-col rounded-[26px] border border-black/[0.07] bg-white p-6 text-center shadow-sm sm:p-8">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400"><span>Hộp SRS {currentSRSInfo?.repetitionBox || 1}/5</span><span onClick={(e) => toggleFavorite(activeCard.id, e)} className="grid h-8 w-8 place-items-center rounded-full bg-slate-50"><Star className={`h-4 w-4 ${favorites.includes(activeCard.id) ? 'fill-amber-400 text-amber-400' : ''}`} /></span></div>
                <div className="my-auto">
                  {cardDirection === 'de_to_vn' ? (!isCardFlipped ? <><div className="mb-3 flex justify-center">{activeCard.article && activeCard.article !== 'none' && <span className={`rounded-lg px-2.5 py-1 text-xs font-black ${articleClass(activeCard.article)}`}>{activeCard.article}</span>}</div><h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">{activeCard.german}</h2><p className="mt-2 text-sm font-mono text-amber-700">{activeCard.pronunciation}</p></> : <><h2 className="text-3xl font-black text-slate-950">{activeCard.vietnamese}</h2><p className="mt-1 text-xs font-medium text-slate-400">{activeCard.english}</p>{activeCard.exampleSentence && <div className="mx-auto mt-5 max-w-md rounded-2xl bg-[#f7f7f5] p-4 text-left text-xs"><p className="font-bold text-slate-800">{activeCard.exampleSentence}</p><p className="mt-1 text-slate-500">{activeCard.exampleTranslation}</p></div>}</>) : (!isCardFlipped ? <><h2 className="text-3xl font-black text-slate-950">{activeCard.vietnamese}</h2><p className="mt-2 text-xs text-slate-400">Tự nhớ lại từ và quán từ tiếng Đức</p></> : <><div className="mb-3 flex justify-center">{activeCard.article && activeCard.article !== 'none' && <span className={`rounded-lg px-2.5 py-1 text-xs font-black ${articleClass(activeCard.article)}`}>{activeCard.article}</span>}</div><h2 className="text-4xl font-black text-slate-950">{activeCard.german}</h2><p className="mt-2 font-mono text-sm text-amber-700">{activeCard.pronunciation}</p></>)}
                </div>
                <p className="text-[11px] font-bold text-slate-400">Chạm thẻ để lật</p>
              </button>

              <div className="mt-3 flex justify-center"><button onClick={() => speak(activeCard)} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-slate-100 px-4 text-xs font-black text-slate-700"><Volume2 className="h-4 w-4" />Nghe phát âm</button></div>
              <div className="mt-4 grid grid-cols-4 gap-2 text-[10px] font-black"><button onClick={() => handleRateFlashcard(1)} className="min-h-12 rounded-xl bg-red-50 text-red-700">Quên</button><button onClick={() => handleRateFlashcard(2)} className="min-h-12 rounded-xl bg-orange-50 text-orange-700">Khó</button><button onClick={() => handleRateFlashcard(3)} className="min-h-12 rounded-xl bg-emerald-50 text-emerald-700">Nhớ</button><button onClick={() => handleRateFlashcard(4)} className="min-h-12 rounded-xl bg-blue-50 text-blue-700">Rất dễ</button></div>
              <div className="mt-3 flex justify-between"><button disabled={currentCardIdx === 0} onClick={() => { setCurrentCardIdx((i) => Math.max(0, i - 1)); setIsCardFlipped(false); }} className="inline-flex min-h-10 items-center gap-1 rounded-xl px-3 text-xs font-bold text-slate-500 disabled:opacity-30"><ChevronLeft className="h-4 w-4" />Trước</button><button disabled={currentCardIdx + 1 >= filteredVocab.length} onClick={() => { setCurrentCardIdx((i) => Math.min(filteredVocab.length - 1, i + 1)); setIsCardFlipped(false); }} className="inline-flex min-h-10 items-center gap-1 rounded-xl px-3 text-xs font-bold text-slate-500 disabled:opacity-30">Tiếp<ChevronRight className="h-4 w-4" /></button></div>
            </>
          )}
        </section>
      )}

      {activeTab === 'list' && (
        <section className="mt-5 space-y-2">
          <p className="px-1 text-xs font-bold text-slate-400">{filteredVocab.length} từ</p>
          {filteredVocab.map((item) => <div key={item.id} role="button" tabIndex={0} onClick={() => setSelectedWord(item)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedWord(item); }} className="flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-4 py-3.5 text-left shadow-sm transition hover:border-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><div className="min-w-0 flex-1"><div className="flex items-center gap-2">{item.article && item.article !== 'none' && <span className={`rounded-md px-2 py-0.5 text-[10px] font-black ${articleClass(item.article)}`}>{item.article}</span>}<p className="truncate text-sm font-black text-slate-950">{item.german}</p><span className="hidden text-[11px] font-mono text-amber-700 sm:inline">{item.pronunciation}</span></div><p className="mt-1 truncate text-xs font-medium text-slate-500">{item.vietnamese}</p></div><button type="button" onClick={(e) => { e.stopPropagation(); speak(item); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500"><Volume2 className="h-4 w-4" /></button><button type="button" onClick={(e) => toggleFavorite(item.id, e)} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400"><Star className={`h-4 w-4 ${favorites.includes(item.id) ? 'fill-amber-400 text-amber-400' : ''}`} /></button></div>)}
        </section>
      )}

      {selectedWord && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm" onClick={() => setSelectedWord(null)}><div className="w-full max-w-lg rounded-[26px] bg-white p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}><div className="flex items-start justify-between gap-4"><div>{selectedWord.article && selectedWord.article !== 'none' && <span className={`rounded-md px-2 py-1 text-[10px] font-black ${articleClass(selectedWord.article)}`}>{selectedWord.article}</span>}<h2 className="mt-2 text-2xl font-black text-slate-950">{selectedWord.german}</h2><p className="mt-1 text-sm font-bold text-slate-500">{selectedWord.vietnamese}</p></div><button onClick={() => speak(selectedWord)} className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-700"><Volume2 className="h-4 w-4" /></button></div>{selectedWord.exampleSentence && <div className="mt-5 rounded-2xl bg-[#f7f7f5] p-4 text-xs"><p className="font-bold text-slate-800">{selectedWord.exampleSentence}</p><p className="mt-1 text-slate-500">{selectedWord.exampleTranslation}</p></div>}<div className="mt-5 flex items-center justify-between"><button onClick={() => { onOpenNotes?.(selectedWord.id, `Mẹo nhớ từ: ${selectedWord.article || ''} ${selectedWord.german}`); setSelectedWord(null); }} className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-amber-50 px-4 text-xs font-black text-amber-800"><StickyNote className="h-4 w-4" />Ghi chú</button><button onClick={() => setSelectedWord(null)} className="min-h-10 rounded-xl bg-slate-950 px-4 text-xs font-black text-white">Xong</button></div></div></div>}

      <PhoneticsGuideModal isOpen={isPhoneticsOpen} onClose={() => setIsPhoneticsOpen(false)} />
      <AdjektivAndPrepositionMatrixModal isOpen={isMatrixOpen} onClose={() => setIsMatrixOpen(false)} />
    </div>
  );
};
