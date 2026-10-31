import React, { useMemo } from 'react';

interface Petal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: number;
  type: 'petal' | 'gold';
  opacity: number;
}

export const PetalBackground: React.FC = () => {
  // Generate 24 deterministic floating elements
  const items = useMemo<Petal[]>(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.2 + (i % 5) * 3) % 96}%`,
      delay: `${(i * 0.7) % 8}s`,
      duration: `${8 + (i % 7) * 2}s`,
      size: i % 3 === 0 ? 18 : i % 2 === 0 ? 14 : 10,
      type: i % 4 === 0 ? 'gold' : 'petal',
      opacity: 0.4 + (i % 5) * 0.1,
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
    >
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute"
          style={{
            left: item.left,
            top: '-5%',
            animation: `petalFall ${item.duration} linear infinite`,
            animationDelay: item.delay,
            opacity: item.opacity,
          }}
        >
          {item.type === 'petal' ? (
            // Delicate rose petal SVG
            <svg
              width={item.size}
              height={item.size * 1.3}
              viewBox="0 0 30 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transform rotate-12 drop-shadow-sm"
            >
              <path
                d="M15 0C6 10 0 20 0 28C0 35 7 40 15 40C23 40 30 35 30 28C30 20 24 10 15 0Z"
                fill="url(#petalGradient)"
              />
              <defs>
                <linearGradient id="petalGradient" x1="0" y1="0" x2="30" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f43f5e" stopOpacity="0.75" />
                  <stop offset="0.6" stopColor="#e11d48" stopOpacity="0.65" />
                  <stop offset="1" stopColor="#9f1239" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            // Golden shimmer star / spark
            <div
              style={{
                width: `${item.size * 0.7}px`,
                height: `${item.size * 0.7}px`,
              }}
              className="rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
            />
          )}
        </div>
      ))}
    </div>
  );
};
