export interface StoreSettings {
  id: string;
  organizationId: string;
  storeName: string;
  storeUrl?: string;
  logo?: string;
  favicon?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  currency: string;
  timezone: string;
  language: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
  businessHours?: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
}

export interface ThemeSettings {
  id: string;
  organizationId: string;
  themeName: string;
  colorScheme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPrimary: string;
  fontSecondary: string;
  borderRadius: number;
  spacing: number;
  shadows: boolean;
  customCSS?: string;
  layout?: {
    headerStyle?: 'default' | 'centered' | 'minimal';
    footerStyle?: 'default' | 'minimal' | 'detailed';
    productGridColumns?: number;
    productCardStyle?: 'default' | 'minimal' | 'detailed';
  };
  components?: {
    buttons?: {
      borderRadius?: number;
      fontWeight?: string;
      textTransform?: string;
    };
    cards?: {
      borderRadius?: number;
      shadow?: string;
      border?: string;
    };
  };
}

export interface NavigationMenu {
  id: string;
  organizationId: string;
  name: string;
  type: 'header' | 'footer' | 'sidebar';
  items: NavigationItem[];
  isActive: boolean;
  position: number;
}

export interface NavigationItem {
  id: string;
  label: string;
  url: string;
  icon?: string;
  target?: '_blank' | '_self';
  children?: NavigationItem[];
  isActive: boolean;
  position: number;
}

export interface CustomPage {
  id: string;
  organizationId: string;
  title: string;
  slug: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
