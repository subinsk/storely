import { useTranslation } from "react-i18next";
import { useCallback } from "react";
// utils
import { localStorageGetItem } from "@storely/shared/utils/storage-available";
// components
import { useSettingsContext } from "@storely/shared/components/settings";
//
import { allLangs, defaultLang } from "./config-lang";

// ----------------------------------------------------------------------

export default function useLocales() {
  const { i18n, t } = useTranslation();

  const settings: any = useSettingsContext();

  const langStorage = localStorageGetItem("i18nextLng");

  const currentLang =
    allLangs.find((lang) => lang.value === langStorage) || defaultLang;

  const onChangeLang = useCallback(
    (newlang: string) => {
      i18n.changeLanguage(newlang);
      settings.onChangeDirectionByLang(newlang);
    },
    [i18n, settings]
  );

  return {
    allLangs,
    t,
    currentLang,
    onChangeLang,
  };
}
