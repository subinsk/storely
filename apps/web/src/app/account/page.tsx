import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Furnerio Store',
  description: 'Manage your account settings'
};

export default function AccountPage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h1>My Account</h1>
      <p>This page will contain account management features.</p>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        🚧 Under Construction - This page needs to be implemented with account settings, profile management, etc.
      </p>
    </div>
  );
}
