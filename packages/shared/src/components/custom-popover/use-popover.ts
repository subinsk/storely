import { useCallback, useState } from "react";

// ----------------------------------------------------------------------

export default function usePopover() {
  const [open, setOpen] = useState<HTMLElement | HTMLInputElement | null>(null);

  const onOpen = useCallback(
    (
      event: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLInputElement>
    ) => {
      setOpen(event.currentTarget);
    },
    []
  );

  const onClose = useCallback(() => {
    setOpen(null);
  }, []);

  return {
    open,
    onOpen,
    onClose,
    setOpen,
  };
}
