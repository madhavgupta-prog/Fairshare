import type { ReactNode } from 'react';

/**
 * Owns the one-time reload animation from Section 3 of the spec.
 * Plain CSS keyframes — see .mountain-bg / .hero-content in index.css.
 */
export default function MountainHero({ children }: { children: ReactNode }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="mountain-bg absolute inset-0" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#16261F]/70 via-[#16261F]/55 to-[#16261F]"
        aria-hidden
      />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6">
        {children}
      </div>
    </section>
  );
}
