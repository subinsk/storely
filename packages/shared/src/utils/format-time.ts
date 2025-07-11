import { format, getTime, formatDistanceToNow } from "date-fns";

// ----------------------------------------------------------------------

export function fDate(
  date: string | number | Date | undefined,
  newFormat?: string | undefined
) {
  const fm = newFormat || "dd MMM yyyy";

  return date ? format(new Date(date), fm) : "";
}

export function fDateTime(
  date: string | number | Date | undefined,
  newFormat?: string | undefined
) {
  const fm = newFormat || "dd MMM yyyy p";

  return date ? format(new Date(date), fm) : "";
}

export function fTimestamp(date: string | number | Date | undefined) {
  return date ? getTime(new Date(date)) : "";
}

export function fToNow(date: string | number | Date | undefined) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : "";
}
