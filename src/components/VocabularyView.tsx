import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  RotateCcw, 
  Search, 
  Volume2, 
  Star, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Bookmark, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  StickyNote,
  ArrowLeftRight,
  HelpCircle
} from 'lucide-react';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { VocabularyItem, FlashcardItem } from '../types';
import { speechService } from '../services/speechService';
import { storageService } from '../services/storageService';
import { PhoneticsGuideModal } from './PhoneticsGuideModal';
import { AdjektivAndPrepositionMatrixModal } from './AdjektivAndPrepositionMatrixModal';

interface VocabularyViewProps {
  onOpenNotes?: (targetId: string, defaultTitle: string) => void;
}

const VOCAB_TOPICS = [
  { id: 'all', label: 'Tất cả chủ đề' },
  { id: 'alphabet_numbers', label: 'Bảng chữ cái & Số đếm' },
  { id: 'greetings_intro', label: 'Chào hỏi & Giới thiệu' },
  { id: 'family', label: 'Gia đình' },
  { id: 'food_drinks', label: 'Đồ ăn & Thức uống' },
  { id: 'shopping', label: 'Mua sắm & Giá cả' },
  { id: 'home_furniture', label: 'Nhà cửa & Đồ đạc' },
  { id: 'daily_routine', label: 'Sinh hoạt hàng ngày' },
  { id: 'hobbies_free_time', label: 'Sở thích & Giải trí' },
  { id: 'transport_travel', label: 'Giao thông & Đi lại' },
  { id: 'health_body', label: 'Sức khỏe & Cơ thể' },
  { id: 'work_school', label: 'Công việc & Trường học' },
  { id: 'weather_seasons', label: 'Thời tiết & 4 Mùa' },
];

export const VocabularyView: React.FC<VocabularyViewProps> = ({ onOpenNotes }) => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'list'>('flashcards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyDueForReview, setOnlyDueForReview] = useState(false);

  // Flashcard Direction: 'de_to_vn' (Thuận: Đức -> Việt) vs 'vn_to_de' (Active Recall: Việt -> Đức + der/die/das)
  const [cardDirection, setCardDirection] = useState<'de_to_vn' | 'vn_to_de'>('de_to_vn');

  // Flashcard State
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [srsCards, setSrsCards] = useState<{ [id: string]: FlashcardItem }>({});

  // Modals state
  const [selectedWord, setSelectedWord] = useState<VocabularyItem | null>(null);
  const [isPhoneticsOpen, setIsPhoneticsOpen] = useState(false);
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load SRS cards and favorites on mount
  React.useEffect(() => {
    const cards = storageService.getFlashcards();
    const map: { [id: string]: FlashcardItem } = {};
    cards.forEach((c) => {
      map[c.vocabId] = c;
    });
    setSrsCards(map);

    const savedFavs = localStorage.getItem('deutsch_start_fav_words');
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('deutsch_start_fav_words', JSON.stringify(next));
      return next;
    });
  };

  // Filtered Vocabulary List
  const filteredVocab = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const now = new Date();

    return VOCABULARY_LIST.filter((v) => {
      // Search
      if (
        q &&
        !v.german.toLowerCase().includes(q) &&
        !v.vietnamese.toLowerCase().includes(q) &&
        !v.english.toLowerCase().includes(q)
      ) {
        return false;
      }

      // Level
      if (selectedLevel !== 'all' && v.level !== selectedLevel) return false;

      // Article
      if (selectedArticle !== 'all' && v.article !== selectedArticle) return false;

      // Topic
      if (selectedTopic !== 'all' && v.topicId !== selectedTopic && v.topic !== selectedTopic) return false;

      // Favorites
      if (onlyFavorites && !favorites.includes(v.id)) return false;

      // Due for review
      if (onlyDueForReview) {
        const card = srsCards[v.id];
        if (!card || new Date(card.nextReviewDate) > now) return false;
      }

      return true;
    });
  }, [
    searchQuery,
    selectedLevel,
    selectedArticle,
    selectedTopic,
    onlyFavorites,
    onlyDueForReview,
    favorites,
    srsCards,
  ]);

  const activeCard: VocabularyItem | undefined = filteredVocab[currentCardIdx];

  // Handle SRS Leitner Rating
  const handleRateFlashcard = (rating: 1 | 2 | 3 | 4) => {
    if (!activeCard) return;

    storageService.updateFlashcardReview(activeCard.id, rating);
    if (rating >= 3) {
      speechService.playSuccessSound();
    } else {
      speechService.playErrorSound();
    }

    // Refresh state
    const cards = storageService.getFlashcards();
    const map: { [id: string]: FlashcardItem } = {};
    cards.forEach((c) => {
      map[c.vocabId] = c;
    });
    setSrsCards(map);

    // Flip back and move to next
    setIsCardFlipped(false);
    if (currentCardIdx + 1 < filteredVocab.length) {
      setCurrentCardIdx((p) => p + 1);
    } else {
      setCurrentCardIdx(0);
    }
  };

  const currentSRSInfo = activeCard ? srsCards[activeCard.id] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-amber-600" />
            Kho Từ Vựng & Flashcards
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhớ từ vựng kèm quán từ <span className="font-bold text-blue-600">der</span>,{' '}
            <span className="font-bold text-red-600">die</span>,{' '}
            <span className="font-bold text-emerald-600">das</span> qua Spaced Repetition.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              activeTab === 'flashcards'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Flashcards (SRS)
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" /> Danh sách từ ({VOCABULARY_LIST.length})
          </button>
        </div>
      </div>

      {/* Quick Tool Banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setIsPhoneticsOpen(true)}
          className="p-3.5 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-200 rounded-2xl flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🗣️</span>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                Cẩm Nang Khẩu Hình & Phát Âm Chuẩn
              </p>
              <p className="text-[11px] text-slate-500">
                Làm chủ âm ch, r, ö, ü, ä, ß, sp, st cho người Việt
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-700">Xem ngay →</span>
        </button>

        <button
          onClick={() => setIsMatrixOpen(true)}
          className="p-3.5 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 border border-blue-200 rounded-2xl flex items-center justify-between text-left transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">📐</span>
            <div>
              <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                Ma Trận Giới Từ 2 Cách & Đuôi Tính Từ
              </p>
              <p className="text-[11px] text-slate-500">
                Bảng 4 cách (Kasus), Wechselpräpositionen & Adjektiv
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700">Tra cứu →</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm từ vựng tiếng Đức, tiếng Việt, tiếng Anh..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentCardIdx(0);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-medium"
          />
        </div>

        {/* Filters Grid */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={(e) => {
              setSelectedLevel(e.target.value);
              setCurrentCardIdx(0);
            }}
            className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-700 outline-none shrink-0"
          >
            <option value="all">Mọi trình độ (A0-A2)</option>
            <option value="A0">Cấp độ A0</option>
            <option value="A1">Cấp độ A1</option>
            <option value="A2">Cấp độ A2</option>
          </select>

          {/* Topic Filter */}
          <select
            value={selectedTopic}
            onChange={(e) => {
              setSelectedTopic(e.target.value);
              setCurrentCardIdx(0);
            }}
            className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-700 outline-none shrink-0"
          >
            {VOCAB_TOPICS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Article Filter */}
          <select
            value={selectedArticle}
            onChange={(e) => {
              setSelectedArticle(e.target.value);
              setCurrentCardIdx(0);
            }}
            className="px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 font-semibold text-slate-700 outline-none shrink-0"
          >
            <option value="all">Mọi quán từ</option>
            <option value="der">🟦 der (Đực)</option>
            <option value="die">🟥 die (Cái)</option>
            <option value="das">🟩 das (Trung)</option>
            <option value="none">Động từ / Tính từ</option>
          </select>

          {/* Due for Review Toggle */}
          <button
            onClick={() => {
              setOnlyDueForReview((p) => !p);
              setCurrentCardIdx(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors flex items-center gap-1 shrink-0 ${
              onlyDueForReview
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Cần ôn hôm nay
          </button>

          {/* Favorites Toggle */}
          <button
            onClick={() => {
              setOnlyFavorites((p) => !p);
              setCurrentCardIdx(0);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-colors flex items-center gap-1 shrink-0 ${
              onlyFavorites
                ? 'bg-amber-500 text-slate-950 border-amber-500'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Đã lưu ({favorites.length})
          </button>
        </div>
      </div>

      {/* ======================================================================= */}
      {/* FLASHCARDS VIEW (Spaced Repetition System) */}
      {/* ======================================================================= */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          {/* Active Recall Direction Switcher */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <ArrowLeftRight className="w-4 h-4 text-amber-600" />
              Chế độ lật thẻ:
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setCardDirection('de_to_vn');
                  setIsCardFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  cardDirection === 'de_to_vn'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🇩🇪 Đức ➔ 🇻🇳 Việt
              </button>
              <button
                onClick={() => {
                  setCardDirection('vn_to_de');
                  setIsCardFlipped(false);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  cardDirection === 'vn_to_de'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⚡ 🇻🇳 Việt ➔ 🇩🇪 Đức (Active Recall)
              </button>
            </div>
          </div>

          {filteredVocab.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-amber-400" />
              <p className="font-bold text-slate-700">Không tìm thấy từ vựng phù hợp</p>
              <p className="text-xs">Hãy thử bỏ bớt bộ lọc để hiển thị nhiều từ hơn.</p>
            </div>
          ) : activeCard ? (
            <div className="space-y-4">
              {/* Card Index & Leitner Box Indicator */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>
                  Thẻ {currentCardIdx + 1} / {filteredVocab.length}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold text-[11px]">
                    Hộp SRS: {currentSRSInfo?.repetitionBox || 1} / 5
                  </span>
                  <button
                    onClick={() => toggleFavorite(activeCard.id)}
                    className="p-1 text-slate-400 hover:text-amber-500"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        favorites.includes(activeCard.id)
                          ? 'text-amber-500 fill-amber-500'
                          : ''
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* The Interactive Flipping Card */}
              <div
                onClick={() => setIsCardFlipped((p) => !p)}
                className="w-full min-h-[320px] bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-400/80 shadow-md hover:shadow-xl transition-all cursor-pointer p-8 flex flex-col justify-between text-center relative overflow-hidden group select-none"
              >
                {/* MODE 1: DE TO VN */}
                {cardDirection === 'de_to_vn' ? (
                  <>
                    {/* Article Badge Accent on Front */}
                    {activeCard.article && activeCard.article !== 'none' && (
                      <div className="flex justify-center">
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-black uppercase tracking-wider ${
                            activeCard.article === 'der'
                              ? 'bg-blue-600 text-white'
                              : activeCard.article === 'die'
                              ? 'bg-red-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {activeCard.article === 'der'
                            ? 'der (Giống Đực)'
                            : activeCard.article === 'die'
                            ? 'die (Giống Cái)'
                            : 'das (Giống Trung)'}
                        </span>
                      </div>
                    )}

                    <div className="my-auto space-y-3">
                      {!isCardFlipped ? (
                        <div className="space-y-2">
                          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                            {activeCard.german}
                          </h2>
                          <p className="text-sm font-mono text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
                            {activeCard.pronunciation}
                          </p>
                          {activeCard.plural && (
                            <p className="text-xs text-slate-400">Plural: {activeCard.plural}</p>
                          )}
                          <p className="text-xs text-slate-400 pt-4 flex items-center justify-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Bấm vào thẻ để lật xem nghĩa tiếng Việt
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 animate-fadeIn">
                          <p className="text-2xl sm:text-3xl font-black text-slate-900">
                            {activeCard.vietnamese}
                          </p>
                          <p className="text-xs text-slate-400">({activeCard.english})</p>

                          {activeCard.exampleSentence && (
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 text-left max-w-md mx-auto">
                              <p className="font-bold text-slate-800">
                                💬 {activeCard.exampleSentence}
                              </p>
                              <p className="text-slate-500">{activeCard.exampleTranslation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* MODE 2: VN TO DE (ACTIVE RECALL) */
                  <>
                    <div className="flex justify-center">
                      <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-amber-100 text-amber-800">
                        ⚡ Hãy tự nhớ lại quán từ (der/die/das) & từ tiếng Đức!
                      </span>
                    </div>

                    <div className="my-auto space-y-3">
                      {!isCardFlipped ? (
                        <div className="space-y-2">
                          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                            {activeCard.vietnamese}
                          </h2>
                          <p className="text-xs text-slate-400">({activeCard.english})</p>
                          <p className="text-xs text-amber-700 font-semibold pt-4 flex items-center justify-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Bấm để lật xem câu trả lời tiếng Đức chuẩn
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 animate-fadeIn">
                          {activeCard.article && activeCard.article !== 'none' && (
                            <div className="flex justify-center">
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-black uppercase ${
                                  activeCard.article === 'der'
                                    ? 'bg-blue-600 text-white'
                                    : activeCard.article === 'die'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-emerald-600 text-white'
                                }`}
                              >
                                {activeCard.article}
                              </span>
                            </div>
                          )}
                          <h2 className="text-4xl sm:text-5xl font-black text-slate-900">
                            {activeCard.german}
                          </h2>
                          <p className="text-sm font-mono text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block">
                            {activeCard.pronunciation}
                          </p>
                          {activeCard.plural && (
                            <p className="text-xs text-slate-500 font-bold">Số nhiều: {activeCard.plural}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Audio Button */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speechService.speak(
                        activeCard.article && activeCard.article !== 'none'
                          ? `${activeCard.article} ${activeCard.german}`
                          : activeCard.german
                      );
                    }}
                    className="px-4 py-2 bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" /> Nghe phát âm
                  </button>
                </div>
              </div>

              {/* Leitner SRS Evaluation Buttons */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-wider">
                  Đánh giá mức độ ghi nhớ của bạn:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleRateFlashcard(1)}
                    className="p-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs transition-all text-center space-y-0.5"
                  >
                    <p>🔴 Quên hoàn toàn</p>
                    <p className="text-[10px] font-normal text-red-500">Ôn lại sau 1 ngày</p>
                  </button>
                  <button
                    onClick={() => handleRateFlashcard(2)}
                    className="p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-xs transition-all text-center space-y-0.5"
                  >
                    <p>🟠 Hơi khó</p>
                    <p className="text-[10px] font-normal text-orange-500">Ôn lại sau 2 ngày</p>
                  </button>
                  <button
                    onClick={() => handleRateFlashcard(3)}
                    className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-all text-center space-y-0.5"
                  >
                    <p>🟢 Nhớ tốt</p>
                    <p className="text-[10px] font-normal text-emerald-500">Ôn lại sau 4 ngày</p>
                  </button>
                  <button
                    onClick={() => handleRateFlashcard(4)}
                    className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs transition-all text-center space-y-0.5"
                  >
                    <p>🔵 Rất dễ</p>
                    <p className="text-[10px] font-normal text-blue-500">Ôn lại sau 7 ngày</p>
                  </button>
                </div>
              </div>

              {/* Prev / Next Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentCardIdx === 0}
                  onClick={() => {
                    setIsCardFlipped(false);
                    setCurrentCardIdx((p) => p - 1);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Thẻ trước
                </button>
                <button
                  disabled={currentCardIdx + 1 >= filteredVocab.length}
                  onClick={() => {
                    setIsCardFlipped(false);
                    setCurrentCardIdx((p) => p + 1);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 disabled:opacity-30 hover:bg-slate-50 flex items-center gap-1"
                >
                  Thẻ tiếp theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* ======================================================================= */}
      {/* VOCABULARY LIST / TABLE VIEW */}
      {/* ======================================================================= */}
      {activeTab === 'list' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
            <span>Hiển thị {filteredVocab.length} từ vựng</span>
            <span>Bấm vào từ để xem chi tiết & ghi chú</span>
          </div>

          <div className="space-y-2">
            {filteredVocab.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedWord(item)}
                className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.article && item.article !== 'none' && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-black uppercase ${
                          item.article === 'der'
                            ? 'bg-blue-100 text-blue-700'
                            : item.article === 'die'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.article}
                      </span>
                    )}
                    <span className="font-bold text-slate-900 text-base">
                      {item.german}
                    </span>
                    {item.plural && (
                      <span className="text-xs text-slate-400 font-medium">
                        (Pl: {item.plural})
                      </span>
                    )}
                    <span className="text-xs font-mono text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {item.pronunciation}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">
                    {item.vietnamese}{' '}
                    <span className="text-xs text-slate-400">({item.english})</span>
                  </p>
                  {item.exampleSentence && (
                    <p className="text-xs text-slate-500 italic">
                      💬 {item.exampleSentence} – {item.exampleTranslation}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      speechService.speak(
                        item.article && item.article !== 'none'
                          ? `${item.article} ${item.german}`
                          : item.german
                      );
                    }}
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Phát âm"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={(e) => toggleFavorite(item.id, e)}
                    className="p-2 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        favorites.includes(item.id) ? 'text-amber-500 fill-amber-500' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WORD DETAIL MODAL */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                Chi tiết từ vựng
              </span>
              <button
                onClick={() => setSelectedWord(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400"
              >
                Đóng ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {selectedWord.article && selectedWord.article !== 'none' && (
                  <span
                    className={`text-xs px-2.5 py-1 rounded font-black uppercase ${
                      selectedWord.article === 'der'
                        ? 'bg-blue-600 text-white'
                        : selectedWord.article === 'die'
                        ? 'bg-red-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {selectedWord.article}
                  </span>
                )}
                <h2 className="text-2xl font-black text-slate-900">
                  {selectedWord.german}
                </h2>
                <button
                  onClick={() =>
                    speechService.speak(
                      selectedWord.article && selectedWord.article !== 'none'
                        ? `${selectedWord.article} ${selectedWord.german}`
                        : selectedWord.german
                    )
                  }
                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              <p className="text-base font-bold text-slate-800">
                Nghĩa tiếng Việt: {selectedWord.vietnamese}
              </p>
              <p className="text-xs font-mono text-amber-700">
                Phiên âm: {selectedWord.pronunciation}
              </p>
              {selectedWord.plural && (
                <p className="text-xs text-slate-600">
                  Dạng số nhiều (Plural):{' '}
                  <strong className="text-slate-900">{selectedWord.plural}</strong>
                </p>
              )}

              {selectedWord.exampleSentence && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-800">
                    💬 {selectedWord.exampleSentence}
                  </p>
                  <p className="text-slate-500">{selectedWord.exampleTranslation}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  if (onOpenNotes) {
                    onOpenNotes(
                      selectedWord.id,
                      `Mẹo nhớ từ: ${selectedWord.article || ''} ${selectedWord.german}`
                    );
                    setSelectedWord(null);
                  }
                }}
                className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <StickyNote className="w-4 h-4" /> Thêm ghi chú cho từ này
              </button>

              <button
                onClick={() => setSelectedWord(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              >
                Xong
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phonetics Guide Modal */}
      <PhoneticsGuideModal
        isOpen={isPhoneticsOpen}
        onClose={() => setIsPhoneticsOpen(false)}
      />

      {/* Adjektiv & Prepositions Matrix Modal */}
      <AdjektivAndPrepositionMatrixModal
        isOpen={isMatrixOpen}
        onClose={() => setIsMatrixOpen(false)}
      />
    </div>
  );
};
