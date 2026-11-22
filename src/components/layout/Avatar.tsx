import { initials } from '../../lib/format';

export default function Avatar({
  name,
  url,
  size = 32,
}: {
  name: string;
  url?: string | null;
  size?: number;
}) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        style={{ width: size, height: size }}
        className="rounded-full object-cover"
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-[color:var(--surface-2)] font-semibold text-[color:var(--gold)] ring-1 ring-[color:var(--edge)]"
      title={name}
    >
      {initials(name)}
    </span>
  );
}
