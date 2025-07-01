import { useScroll } from "framer-motion";
import { useState, useEffect, useMemo, useCallback, RefObject } from "react";

// ----------------------------------------------------------------------

export function useOffSetTop(
  top: number = 0,
  options?: {
    container?: RefObject<HTMLElement>;
  }
) {
  const { scrollY } = useScroll(options);

  const [value, setValue] = useState(false);

  const onOffSetTop = useCallback(() => {
    scrollY.on("change", (scrollHeight) => {
      if (scrollHeight > top) {
        setValue(true);
      } else {
        setValue(false);
      }
    });
  }, [scrollY, top]);

  useEffect(() => {
    onOffSetTop();
  }, [onOffSetTop]);

  const memoizedValue = useMemo(() => value, [value]);

  return memoizedValue;
}

// Usage
// const offset = useOffSetTop(100);

// Or
// const offset = useOffSetTop(100, {
//   container: ref,
// });
