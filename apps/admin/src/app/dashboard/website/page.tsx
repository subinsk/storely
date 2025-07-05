import WebsiteContentManager from '@/sections/website/website-content-manager';

export const dynamic = 'force-dynamic';


export const metadata = {
  title: 'Website Content Management | Furnerio Admin',
  description: 'Manage homepage content and navigation menus for your webstore'
};

export default function WebsiteContentPage() {
  return <WebsiteContentManager />;
}
