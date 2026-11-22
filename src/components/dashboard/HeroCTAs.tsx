import { Link } from 'react-router-dom';

export default function HeroCTAs({
  onNewTrip,
  onJoinTrip,
}: {
  onNewTrip: () => void;
  onJoinTrip: () => void;
}) {
  return (
    <div className="card flex flex-wrap items-center gap-3 p-5">
      <button type="button" onClick={onNewTrip} className="btn-gold px-5 py-2.5 text-sm">
        + New trip
      </button>
      <button type="button" onClick={onJoinTrip} className="btn-ghost px-5 py-2.5 text-sm">
        Join with invite code
      </button>
      <Link
        to="/active-trips"
        className="ml-auto text-sm text-[color:var(--muted)] hover:text-[color:var(--cream)]"
      >
        View all active trips →
      </Link>
    </div>
  );
}
