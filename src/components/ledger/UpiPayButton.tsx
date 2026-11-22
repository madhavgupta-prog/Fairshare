import { formatMoney } from '../../lib/format';
import { buildUpiLink } from '../../lib/upi';
import type { Profile } from '../../lib/types';

export default function UpiPayButton({
  recipient,
  amount,
  note,
}: {
  recipient: Profile | undefined;
  amount: number;
  note: string;
}) {
  const upiId = recipient?.upi_id;

  if (!upiId) {
    return (
      <button
        type="button"
        disabled
        title="Ask them to add a UPI ID in Profile."
        className="btn-gold px-3 py-1.5 text-xs"
      >
        Pay
      </button>
    );
  }

  const href = buildUpiLink({
    upiId,
    name: recipient.name,
    amount,
    note,
  });

  return (
    <a
      href={href}
      className="btn-gold inline-block px-3 py-1.5 text-xs"
      title={`Pay ${formatMoney(amount)} to ${recipient.name} over UPI`}
    >
      Pay
    </a>
  );
}
