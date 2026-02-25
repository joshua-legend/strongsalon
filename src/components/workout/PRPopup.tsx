'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkout } from '@/context/WorkoutContext';

export default function PRPopup() {
  const { showPR, dispatch } = useWorkout();

  useEffect(() => {
    if (showPR) {
      const t = setTimeout(() => dispatch({ type: 'SHOW_PR', show: false }), 4000);
      return () => clearTimeout(t);
    }
  }, [showPR, dispatch]);

  return (
    <AnimatePresence>
      {showPR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          className="mx-4 rounded-2xl p-4 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(255,77,0,.2), rgba(245,197,24,.1))',
            border: '1px solid rgba(255,77,0,.4)',
          }}
        >
          <p className="text-[28px] mb-1">🏅</p>
          <p className="font-bebas text-[24px]" style={{ color: 'var(--og, var(--orange))' }}>
            신기록 달성!
          </p>
          <p className="text-[11px]" style={{ color: 'var(--text2, var(--muted2))' }}>
            축하합니다! 새로운 PR을 기록했습니다
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
