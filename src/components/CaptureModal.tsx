/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Camera, FileText, X, Send, AlertCircle } from 'lucide-react';
import { InputType } from '../types';
import { cn } from '../lib/utils';

interface CaptureModalProps {
  type: InputType | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string) => Promise<void>;
  isLoading: boolean;
}

export const CaptureModal = ({ type, isOpen, onClose, onSubmit, isLoading }: CaptureModalProps) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('Please enter content');
      return;
    }

    try {
      setError(null);
      await onSubmit(content);
      setContent('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'voice':
        return Mic;
      case 'photo':
        return Camera;
      case 'text':
        return FileText;
      default:
        return FileText;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'voice':
        return 'Record Voice Note';
      case 'photo':
        return 'Capture Photo';
      case 'text':
        return 'Write Note';
      default:
        return 'Capture Input';
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case 'voice':
        return 'Describe what you just did...';
      case 'photo':
        return 'Describe the photo or what it represents...';
      case 'text':
        return 'Write your thoughts, observations, or progress...';
      default:
        return 'Enter content...';
    }
  };

  const Icon = getIcon();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md mx-4 p-8 bg-[#1a1c1a] rounded-2xl border border-white/10 shadow-2xl"
          >
            <button
              onClick={onClose}
              disabled={isLoading}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white/40" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <Icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-xl font-mono uppercase tracking-widest text-white">
                {getTitle()}
              </h2>
            </div>

            {type === 'voice' && (
              <div className="mb-6">
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  disabled={isLoading}
                  className={cn(
                    'w-full py-4 rounded-xl font-mono uppercase tracking-widest text-sm transition-all disabled:opacity-50',
                    isRecording
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                  )}
                >
                  {isRecording ? '⏹ Stop Recording' : '🎤 Start Recording'}
                </button>
                <p className="text-xs text-white/40 mt-3 font-mono">
                  Note: Voice recording preview. Submit will save the note.
                </p>
              </div>
            )}

            {type === 'photo' && (
              <div className="mb-6">
                <input
                  type="file"
                  accept="image/*"
                  disabled={isLoading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setContent(file.name);
                    }
                  }}
                  className="hidden"
                  id="photo-input"
                />
                <label
                  htmlFor="photo-input"
                  className="block w-full py-4 rounded-xl font-mono uppercase tracking-widest text-sm text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 cursor-pointer transition-all disabled:opacity-50 text-center"
                >
                  📷 Choose Photo
                </label>
                {content && (
                  <p className="text-xs text-emerald-400 mt-3 font-mono truncate">
                    Selected: {content}
                  </p>
                )}
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={getPlaceholder()}
              disabled={isLoading}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all font-mono text-sm resize-none h-32 disabled:opacity-50"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mt-4 bg-red-500/10 border border-red-500/30 rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-xs text-red-300 font-mono">{error}</p>
              </motion.div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading || !content.trim()}
              className="w-full py-3 px-4 mt-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono uppercase tracking-widest text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isLoading ? 'Logging XP...' : 'Log XP'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
