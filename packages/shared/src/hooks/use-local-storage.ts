import { useEffect, useState, useCallback } from "react";

// ----------------------------------------------------------------------
export interface LocalStorageState {
  [key: string]: any;
}

export function useLocalStorage<T extends LocalStorageState>(
  key: string,
  initialState: T
): {
  state: T;
  update: (name: keyof T, updateValue: T[keyof T]) => void;
  reset: () => void;
} {
  const [state, setState] = useState<T>(initialState);

  useEffect(() => {
    const restored = getStorage<T>(key);

    if (restored) {
      setState((prevValue) => ({
        ...prevValue,
        ...restored,
      }));
    }
  }, [key]);

  const updateState = useCallback(
    (updateValue: Partial<T>) => {
      setState((prevValue) => {
        setStorage(key, {
          ...prevValue,
          ...updateValue,
        });

        return {
          ...prevValue,
          ...updateValue,
        };
      });
    },
    [key]
  );

  const update = useCallback(
    (name: keyof T, updateValue: T[keyof T]) => {
      updateState({
        [name]: updateValue,
      } as Partial<T>);
    },
    [updateState]
  );

  const reset = useCallback(() => {
    removeStorage(key);
    setState(initialState);
  }, [initialState, key]);

  return {
    state,
    update,
    reset,
  };
}

// ----------------------------------------------------------------------

export const getStorage = <T>(key: string): T | null => {
  let value: T | null = null;

  try {
    const result = window.localStorage.getItem(key);

    if (result) {
      value = JSON.parse(result);
    }
  } catch (error) {
    console.error(error);
  }

  return value;
};

export const setStorage = <T>(key: string, value: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeStorage = (key: string): void => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
