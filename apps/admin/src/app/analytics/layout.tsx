import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard | Storely Admin',
  description: 'Comprehensive analytics and business intelligence dashboard for Storely admin',
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
