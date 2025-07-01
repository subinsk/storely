// ----------------------------------------------------------------------

export function flattenArray(
  list:
    | {
        title: string;
        path: string;
        children?: any;
      }[],
  key = "children"
): any {
  let children: any = [];

  const flatten = list?.map((item: any) => {
    if (item[key] && item[key].length) {
      children = [...children, ...item[key]];
    }
    return item;
  });

  return flatten?.concat(
    children.length ? flattenArray(children, key) : children
  );
}
