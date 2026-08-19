import React, { useState, useEffect } from 'react';
import { StickyNote, X, Plus, Trash2, Tag, Calendar } from 'lucide-react';
import { storageService } from '../services/storageService';
import { UserNote } from '../types';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string;
  targetType?: 'vocab' | 'grammar' | 'lesson' | 'custom';
  defaultTitle?: string;
}

export const NotesModal: React.FC<NotesModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType = 'custom',
  defaultTitle = '',
}) => {
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState(defaultTitle);
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadNotes();
      if (defaultTitle) {
        setNewTitle(defaultTitle);
        setIsCreating(true);
      }
    }
  }, [isOpen, defaultTitle]);

  const loadNotes = () => {
    const allNotes = storageService.getNotes();
    if (targetId) {
      setNotes(allNotes.filter((n) => n.targetId === targetId));
    } else {
      setNotes(allNotes);
    }
  };

  const handleCreateNote = () => {
    if (!newContent.trim()) return;

    const tagsArray = newTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    storageService.saveNote({
      targetId: targetId || `note_${Date.now()}`,
      targetType,
      title: newTitle.trim() || 'Ghi chú tiếng Đức',
      content: newContent.trim(),
      tags: tagsArray.length > 0 ? tagsArray : ['tiếng Đức', targetType],
    });

    setNewTitle('');
    setNewContent('');
    setNewTags('');
    setIsCreating(false);
    loadNotes();
  };

  const handleDeleteNote = (id: string) => {
    storageService.deleteNote(id);
    loadNotes();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-amber-500/10">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-amber-700" />
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Sổ tay Ghi chú Cá nhân
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 rounded-full text-slate-500 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Create Button or Form */}
          {!isCreating ? (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full py-3 px-4 border-2 border-dashed border-amber-300 hover:border-amber-500 rounded-xl text-amber-700 font-semibold text-sm flex items-center justify-center gap-2 bg-amber-50/50 hover:bg-amber-50 transition-all"
            >
              <Plus className="w-4 h-4" /> Thêm ghi chú mới
            </button>
          ) : (
            <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Tạo ghi chú mới
              </h4>
              <input
                type="text"
                placeholder="Tiêu đề ghi chú (VD: Mẹo nhớ giống đực der)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <textarea
                placeholder="Nội dung ghi chú, câu ví dụ của bạn, mẹo học cá nhân..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <input
                type="text"
                placeholder="Thẻ tag cách nhau bằng dấu phẩy (VD: ngữ pháp, mẹo, A1)"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  onClick={handleCreateNote}
                  className="px-4 py-1.5 text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 rounded-lg shadow-sm"
                >
                  Lưu ghi chú
                </button>
              </div>
            </div>
          )}

          {/* Notes List */}
          {notes.length === 0 && !isCreating && (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <StickyNote className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-medium text-slate-500">Chưa có ghi chú nào</p>
              <p className="text-xs text-slate-400">
                Hãy ghi lại các mẹo nhớ từ vựng hoặc cấu trúc câu đặc biệt của bạn!
              </p>
            </div>
          )}

          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{note.title}</h4>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Xóa ghi chú"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {note.content}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {note.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md text-[11px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3" />
                    {new Date(note.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
