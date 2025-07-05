import CustomerPortalDashboard from '@/sections/customer/customer-portal-dashboard';

export const metadata = {
  title: 'Customer Portal | Furnerio Admin',
  description: 'Customer portal dashboard for order tracking and account management'
};

interface CustomerPortalPageProps {
  params: {
    customerId: string;
  };
}

export default function CustomerPortalPage({ params }: CustomerPortalPageProps) {
  return <CustomerPortalDashboard customerId={params.customerId} />;
}
