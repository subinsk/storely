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

import { MotionLazy } from "@/components/animate/motion-lazy";
import { SettingsDrawer, SettingsProvider } from "@/components/settings";
import { SnackbarProvider } from "@/components/snackbar";
import { LocalizationProvider } from "@/locales";
import ThemeProvider from "@/theme";
import ProgressBar from "@/components/progress-bar/progress-bar";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { IKContext } from "imagekitio-react";
import { IMAGE_KIT_PUBLIC_KEY, IMAGE_KIT_URL_ENDPOINT } from "@/config";
import { imageKitAuthenticator } from "@/lib";
import Navbar from "@/sections/common/navbar";
import { usePathname } from "next/navigation";
import Footer from "@/sections/common/footer";
import {CheckoutProvider} from "@/sections/checkout/context"

export default function RootLayout({
  children,
  categories,
}: {
  children: React.ReactNode;
  categories: any[];
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
                  <CheckoutProvider>
                    <SettingsDrawer />
                    <ProgressBar />
                    {!pathname.startsWith("/auth") && (
                      <Navbar categories={categories} />
                    )}
                    {children}
                    <Footer />
                  </CheckoutProvider>
                </IKContext>
              </SnackbarProvider>
            </MotionLazy>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </SettingsProvider>
    </LocalizationProvider>
  );
}
