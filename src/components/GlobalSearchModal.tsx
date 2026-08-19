import React, { useState, useMemo } from 'react';
import { Search, X, Volume2, BookOpen, Layers, ArrowRight, Sparkles } from 'lucide-react';
import { VOCABULARY_LIST } from '../data/vocabularyData';
import { GRAMMAR_LIBRARY } from '../data/grammarData';
import { COURSES_DATA } from '../data/coursesData';
import { speechService } from '../services/speechService';
import { VocabularyItem, GrammarLesson } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson?: (lessonId: string) => void;
  onSelectGrammar?: (grammarId: string) => void;
  onSelectVocab?: (vocab: VocabularyItem) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  onSelectGrammar,
  onSelectVocab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'vocab' | 'grammar' | 'lessons'>('all');

  const filteredResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { vocab: [], grammar: [], lessons: [] };

    // Search Vocab
    const vocab = VOCABULARY_LIST.filter(
      (v) =>
        v.german.toLowerCase().includes(q) ||
        v.vietnamese.toLowerCase().includes(q) ||
        v.english.toLowerCase().includes(q) ||
        (v.exampleSentence && v.exampleSentence.toLowerCase().includes(q))
    ).slice(0, 8);

    // Search Grammar
    const grammar = GRAMMAR_LIBRARY.filter(
      (g) =>
        g.title.toLowerCase().includes(q) ||
        g.germanTitle.toLowerCase().includes(q) ||
        g.vietnameseExplanation.toLowerCase().includes(q)
    ).slice(0, 5);

    // Search Lessons
    const lessons: { id: string; title: string; titleVietnamese: string; level: string }[] = [];
    Object.values(COURSES_DATA).forEach((level) => {
      level.topics.forEach((topic) => {
        topic.lessons.forEach((l) => {
          if (
            l.title.toLowerCase().includes(q) ||
            l.titleVietnamese.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q)
          ) {
            lessons.push({
              id: l.id,
              title: l.title,
              titleVietnamese: l.titleVietnamese,
              level: l.level,
            });
          }
        });
      });
    });

    return { vocab, grammar, lessons: lessons.slice(0, 5) };
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    filteredResults.vocab.length +
    filteredResults.grammar.length +
    filteredResults.lessons.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/70">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            placeholder="Tra cứu từ vựng (gehen, Haus...), ngữ pháp, bài học..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-base sm:text-lg font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg shrink-0 border border-slate-200"
          >
            Đóng [ESC]
          </button>
        </div>

        {/* Filter Chips */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              selectedFilter === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({totalResults})
          </button>
          <button
            onClick={() => setSelectedFilter('vocab')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              selectedFilter === 'vocab'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Từ vựng ({filteredResults.vocab.length})
          </button>
          <button
            onClick={() => setSelectedFilter('grammar')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              selectedFilter === 'grammar'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Ngữ pháp ({filteredResults.grammar.length})
          </button>
          <button
            onClick={() => setSelectedFilter('lessons')}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              selectedFilter === 'lessons'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Bài học ({filteredResults.lessons.length})
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-6">
          {!query && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-amber-400/80" />
              <p className="font-medium text-slate-600">Tìm kiếm nhanh mọi nội dung tiếng Đức</p>
              <p className="text-xs text-slate-400">
                Thử gõ: "Haus", "sein", "wohnen", "số đếm", "Akkusativ"...
              </p>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="font-medium text-slate-600">Không tìm thấy kết quả cho "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Hãy thử tìm bằng từ tiếng Đức hoặc nghĩa tiếng Việt tương đương.
              </p>
            </div>
          )}

          {/* Vocab Section */}
          {(selectedFilter === 'all' || selectedFilter === 'vocab') &&
            filteredResults.vocab.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  Từ vựng ({filteredResults.vocab.length})
                </h4>
                <div className="space-y-2">
                  {filteredResults.vocab.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelectVocab) onSelectVocab(item);
                      }}
                      className="p-3 bg-slate-50 hover:bg-slate-100/90 rounded-xl border border-slate-200/80 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {item.article && item.article !== 'none' && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${
                                item.article === 'der'
                                  ? 'bg-blue-100 text-blue-700'
                                  : item.article === 'die' || item.article === 'plural-die'
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
                            <span className="text-xs text-slate-400">
                              (Pl: {item.plural})
                            </span>
                          )}
                          <span className="text-xs text-amber-700 font-mono">
                            {item.pronunciation}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 font-medium">
                          {item.vietnamese}{' '}
                          <span className="text-xs text-slate-400">({item.english})</span>
                        </p>
                        {item.exampleSentence && (
                          <p className="text-xs text-slate-500 italic">
                            VD: {item.exampleSentence} – {item.exampleTranslation}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
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
                          title="Nghe phát âm"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Grammar Section */}
          {(selectedFilter === 'all' || selectedFilter === 'grammar') &&
            filteredResults.grammar.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-500" />
                  Ngữ pháp ({filteredResults.grammar.length})
                </h4>
                <div className="space-y-2">
                  {filteredResults.grammar.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelectGrammar) {
                          onSelectGrammar(item.id);
                          onClose();
                        }
                      }}
                      className="p-3 bg-purple-50/50 hover:bg-purple-100/60 rounded-xl border border-purple-100 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-purple-200 text-purple-800 rounded font-semibold">
                            {item.level}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {item.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                          {item.vietnameseExplanation}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover:text-purple-700 transition-colors shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Lessons Section */}
          {(selectedFilter === 'all' || selectedFilter === 'lessons') &&
            filteredResults.lessons.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  Bài học ({filteredResults.lessons.length})
                </h4>
                <div className="space-y-2">
                  {filteredResults.lessons.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelectLesson) {
                          onSelectLesson(item.id);
                          onClose();
                        }
                      }}
                      className="p-3 bg-emerald-50/40 hover:bg-emerald-100/60 rounded-xl border border-emerald-100 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded font-semibold">
                            {item.level}
                          </span>
                          <span className="font-bold text-slate-900 text-sm">
                            {item.titleVietnamese}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{item.title}</p>
                      </div>
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        Học ngay <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
