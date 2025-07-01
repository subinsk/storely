import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Furnerio Store',
  description: 'Get in touch with us'
};

export default function ContactPage() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h1>Contact Us</h1>
      <p>This page will contain contact information and contact forms.</p>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>
        🚧 Under Construction - This page needs to be implemented with contact forms and information.
      </p>
    </div>
  );
}
