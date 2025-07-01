import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Orders | Furnerio Store',
  description: 'View and track your orders'
};

export default function OrdersPage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h1>Orders Page</h1>
      <p>This page will show user order history and tracking information.</p>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        🚧 Under Construction - This page needs to be implemented with order management features.
      </p>
    </div>
  );
}
