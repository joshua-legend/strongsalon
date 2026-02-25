'use client';

import { useState, useMemo } from 'react';
import { attendance } from '@/data/attendance';
import { getMonthGrid, getWeekDays, isToday } from '@/utils/calendar';

const typeColor: Record<string, string> = {
  pt: 'var(--orange)',
  self: 'var(--green)',
  both: 'var(--purple)',
};

const typeLabel: Record<string, string> = {
  pt: 'PT',
  self: '자',
  both: 'P+자',
};

export default function AttendCalendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const grid = useMemo(() => getMonthGrid(year, month), [year, month]);
  const dayNames = getWeekDays();

  const attendMap = useMemo(() => {
    const map: Record<string, string> = {};
    attendance.forEach(a => { map[a.date] = a.type; });
    return map;
  }, []);

  const monthRecords = useMemo(() => {
    return attendance.filter(a => {
      const [y, m] = a.date.split('-').map(Number);
      return y === year && m === month + 1;
    });
  }, [year, month]);

  const ptCount = monthRecords.filter(r => r.type === 'pt').length;
  const selfCount = monthRecords.filter(r => r.type === 'self').length;
  const bothCount = monthRecords.filter(r => r.type === 'both').length;
  const totalDays = monthRecords.length;

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="card">
      <p className="card-label mb-3">📅 출석 캘린더</p>

      <div className="flex items-center gap-3 mb-3 justify-center">
        {[
          { color: typeColor.pt, label: 'PT수업' },
          { color: typeColor.self, label: '개인운동' },
          { color: typeColor.both, label: 'PT+개인' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
            <span className="font-space text-[8px]" style={{ color: 'var(--muted2)' }}>{l.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="text-[16px] px-2" style={{ color: 'var(--muted2)' }}>‹</button>
        <span className="font-bebas text-[18px]" style={{ color: 'var(--text)' }}>
          {year}년 {month + 1}월
        </span>
        <button onClick={nextMonth} className="text-[16px] px-2" style={{ color: 'var(--muted2)' }}>›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(d => (
          <div key={d} className="text-center font-space text-[8px] py-1" style={{ color: 'var(--muted)' }}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.map((day, i) => {
          if (day === null) return <div key={i} className="h-9" />;
          const dateKey = `${year}-${month + 1}-${day}`;
          const type = attendMap[dateKey];
          const today = isToday(year, month, day);

          return (
            <div
              key={i}
              className="h-9 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[11px] relative"
              style={{
                background: type ? `${typeColor[type]}15` : 'transparent',
                border: today ? '1.5px solid var(--orange)' : type ? `1px solid ${typeColor[type]}30` : '1px solid transparent',
                color: type ? typeColor[type] : 'var(--muted2)',
              }}
            >
              <span className="leading-none">{day}</span>
              {type && (
                <span className="font-space text-[6px] leading-none opacity-80">
                  {typeLabel[type]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="grid grid-cols-3 gap-3 text-center mb-3">
          <div>
            <p className="font-bebas text-[22px] leading-none" style={{ color: 'var(--orange)' }}>{totalDays}</p>
            <p className="font-space text-[8px]" style={{ color: 'var(--muted)' }}>총 출석일</p>
          </div>
          <div>
            <p className="font-bebas text-[22px] leading-none" style={{ color: 'var(--green)' }}>
              {totalDays > 0 ? Math.round((totalDays / 22) * 100) : 0}%
            </p>
            <p className="font-space text-[8px]" style={{ color: 'var(--muted)' }}>출석률</p>
          </div>
          <div>
            <p className="font-bebas text-[22px] leading-none" style={{ color: 'var(--yellow)' }}>12</p>
            <p className="font-space text-[8px]" style={{ color: 'var(--muted)' }}>연속 출석</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { label: 'PT수업', count: ptCount, color: typeColor.pt },
            { label: '개인운동', count: selfCount, color: typeColor.self },
            { label: 'PT+개인', count: bothCount, color: typeColor.both },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-[10px] w-14 shrink-0" style={{ color: 'var(--muted2)' }}>{item.label}</span>
              <div className="flex-1 h-[4px] rounded-full overflow-hidden" style={{ background: 'var(--s3)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: totalDays > 0 ? `${(item.count / totalDays) * 100}%` : '0%',
                    background: item.color,
                    transition: 'width 0.8s cubic-bezier(.4,0,.2,1)',
                  }}
                />
              </div>
              <span className="font-space text-[9px] w-10 text-right" style={{ color: 'var(--muted2)' }}>
                {item.count}회
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
