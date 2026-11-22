import AuthCard from '../components/landing/AuthCard';
import MountainHero from '../components/landing/MountainHero';
import ThemeToggle from '../components/layout/ThemeToggle';

export default function Landing() {
  return (
    <MountainHero>
      <div className="flex items-center justify-between text-[color:var(--cream)]">
        <span className="font-display text-lg font-bold tracking-tight">
          Fair<span className="text-[color:var(--gold)]">Share</span>
        </span>
        <ThemeToggle />
      </div>

      <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_auto]">
        <div className="hero-content max-w-xl">
          <h1 className="font-display text-4xl leading-tight font-bold text-[color:var(--cream)] sm:text-5xl">
            Every trip. Every rupee. <span className="text-[color:var(--gold)]">Squared up.</span>
          </h1>
          <p className="mt-4 text-base text-[color:var(--cream)]/80 sm:text-lg">
            Add friends to a trip, log expenses as they happen, and let FairShare work out who owes
            whom — in the fewest payments possible.
          </p>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[color:var(--cream)]/70">
            <li>Unlimited trips and members</li>
            <li>Equal or custom splits</li>
            <li>Settle up over UPI</li>
          </ul>
        </div>

        <div className="flex justify-start lg:justify-end">
          <AuthCard />
        </div>
      </div>
    </MountainHero>
  );
}
