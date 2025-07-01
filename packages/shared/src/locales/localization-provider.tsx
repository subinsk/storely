// @mui
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider as MuiLocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
//
import { enUS } from "date-fns/locale";
import useLocales from "./use-locales";

// ----------------------------------------------------------------------

export default function LocalizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentLang } = useLocales();

  return (
    <MuiLocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={{ ...currentLang.adapterLocale, enUS }}
    >
      {children}
    </MuiLocalizationProvider>
  );
}
