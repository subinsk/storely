// ----------------------------------------------------------------------

export function emptyRows(
  page: number,
  rowsPerPage: number,
  arrayLength: number
) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T): number {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy]! < a[orderBy]!) {
    return -1;
  }
  if (b[orderBy]! > a[orderBy]!) {
    return 1;
  }
  return 0;
}

export function getComparator<T>(
  order: string,
  orderBy: keyof T
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator<T>(a, b, orderBy)
    : (a, b) => -descendingComparator<T>(a, b, orderBy);
}
