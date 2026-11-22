import PageShell from '../components/layout/PageShell';
import ProfileForm from '../components/profile/ProfileForm';

export default function Profile() {
  return (
    <PageShell title="Profile" subtitle="Your details and payment info">
      <ProfileForm />
    </PageShell>
  );
}
