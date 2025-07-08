"use client";

// i18n
import "@/locales/i18n";

// scrollbar
import "simplebar-react/dist/simplebar.min.css";

// lightbox
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// map
import "mapbox-gl/dist/mapbox-gl.css";

// editor
import "react-quill/dist/quill.snow.css";

// carousel
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// image
import "react-lazy-load-image-component/src/effects/blur.css";

import { MotionLazy } from "@storely/shared/components/animate/motion-lazy";
import { SettingsProvider } from "@storely/shared/components/settings";
import { SnackbarProvider } from "@storely/shared/components/snackbar";
import { LocalizationProvider } from "@/locales";
import {ThemeProvider} from "@storely/shared/theme";
import ProgressBar from "@storely/shared/components/progress-bar/progress-bar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { IKContext } from "imagekitio-react";
import { IMAGE_KIT_PUBLIC_KEY, IMAGE_KIT_URL_ENDPOINT } from "@/config";
import { imageKitAuthenticator } from "@storely/shared/lib";
import Navbar from "@/sections/common/navbar";
import { usePathname } from "next/navigation";
import Footer from "@/sections/common/footer";
import {CheckoutProvider} from "@/sections/checkout/context"
import { OrganizationProvider } from "@/contexts/OrganizationContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import StoreAccessGuard from "@/components/StoreAccessGuard";

export default function RootLayout({
  children,
  categories,
  organizationId,
}: {
  children: React.ReactNode;
  categories: any[];
  organizationId?: string;
}) {
  // hooks
  const pathname = usePathname();

  return (
    <LocalizationProvider>
      <SettingsProvider
        defaultSettings={{
          themeMode: "light", // 'light' | 'dark'
          themeDirection: "ltr", //  'rtl' | 'ltr'
          themeContrast: "default", // 'default' | 'bold'
          themeLayout: "vertical", // 'vertical' | 'horizontal' | 'mini'
          themeColorPresets: "default", // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
          themeStretch: false,
        }}
      >
        <AppRouterCacheProvider>
          <ThemeProvider>
            <MotionLazy>
              <SnackbarProvider>
                <IKContext
                  urlEndpoint={IMAGE_KIT_URL_ENDPOINT}
                  publicKey={IMAGE_KIT_PUBLIC_KEY}
                  authenticator={imageKitAuthenticator}
                >
                  <OrganizationProvider organizationId={organizationId}>
                    <AuthProvider>
                      <CartProvider>
                        <StoreAccessGuard>
                          <ProgressBar />
                          {!pathname?.startsWith("/auth") && (
                            <Navbar categories={categories} />
                          )}
                          {children}
                          <Footer />
                        </StoreAccessGuard>
                      </CartProvider>
                    </AuthProvider>
                  </OrganizationProvider>
                </IKContext>
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
}
