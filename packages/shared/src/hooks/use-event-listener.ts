import { useEffect, useRef, useLayoutEffect } from "react";

// ----------------------------------------------------------------------

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export interface EventListenerOptions {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
}

export function useEventListener<T extends Event>(
  eventName: string,
  handler: (event: T) => void,
  element?: React.RefObject<HTMLElement> | null,
  options?: EventListenerOptions
): void {
  const savedHandler = useRef<(event: T) => void>(handler);

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const targetElement = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    const eventListener: (event: Event) => void = (event: Event) =>
      savedHandler.current(event as T); // Add type assertion here

    targetElement.addEventListener(eventName, eventListener, options);

    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, options]);
}
