'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NumberModalProps {
  open: boolean;
  title: string;
  unit: string;
  initial: number;
  onConfirm: (val: number) => void;
  onClose: () => void;
}

export default function NumberModal({ open, title, unit, initial, onConfirm, onClose }: NumberModalProps) {
  const [display, setDisplay] = useState(String(initial));

  const handleKey = (key: string) => {
    if (key === '⌫') {
      setDisplay(prev => prev.length <= 1 ? '0' : prev.slice(0, -1));
    } else if (key === '.5') {
      if (!display.includes('.')) {
        setDisplay(prev => prev + '.5');
      }
    } else {
      setDisplay(prev => prev === '0' ? key : prev + key);
    }
  };

  const handleConfirm = () => {
    const val = parseFloat(display) || 0;
    onConfirm(val);
    onClose();
  };

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.5', '0', '⌫'];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(0,0,0,.6)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[101] rounded-t-3xl p-5 pb-8"
            style={{
              background: 'var(--og-s1, #220c00)',
              maxWidth: 480,
              margin: '0 auto',
            }}
          >
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: 'var(--border2)' }} />

            <p className="text-[12px] text-center mb-2" style={{ color: 'var(--text2, var(--muted2))' }}>
              {title}
            </p>

            <div className="text-center mb-5">
              <span className="font-bebas text-[58px] leading-none" style={{ color: 'var(--og, var(--orange))' }}>
                {display}
              </span>
              <span className="font-space text-[16px] ml-1" style={{ color: 'var(--text3, var(--muted))' }}>
                {unit}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {keys.map(k => (
                <button
                  key={k}
                  onClick={() => handleKey(k)}
                  className="h-12 rounded-xl text-[18px] font-medium transition-all active:scale-95"
                  style={{
                    background: k === '⌫' ? 'rgba(239,68,68,.15)' : 'var(--og-s2, var(--s2))',
                    color: k === '⌫' ? 'var(--red)' : 'var(--text)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {k === '.5' ? '+.5' : k}
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              className="w-full py-3.5 rounded-xl text-[14px] font-bold"
              style={{ background: 'var(--og, var(--orange))', color: 'white' }}
            >
              확인
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
