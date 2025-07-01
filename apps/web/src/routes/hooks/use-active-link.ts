// ----------------------------------------------------------------------

import { usePathname } from "next/navigation";

export function useActiveLink(path: string, deep = true) {
  const pathname = usePathname();

  const normalActive = path === pathname;

  const deepActive = pathname.includes(path);

  return deep ? deepActive : normalActive;
}
