// utils
import { flattenArray } from "@/utils/flatten-array";

// ----------------------------------------------------------------------

export function getAllItems({
  data,
}: {
  data: {
    subheader: string;
    items: {
      title: string;
      path: string;
      children?: any;
    }[];
  }[];
}) {
  const reduceItems = data
    .map((list) => handleLoop(list.items, list.subheader))
    .flat();

  const items = flattenArray(reduceItems).map(
    (
      option:
        | {
            title: string;
            path: string;
            children: any;
          }
        | { title: string; path: string }
    ) => {
      const group = splitPath(reduceItems, option.path);

      return {
        group:
          group && group.length > 1
            ? group[0]
            : (option as { title: string; path: string }).title,
        title: option.title,
        path: option.path,
      };
    }
  );

  return items;
}

// ----------------------------------------------------------------------

export function applyFilter({
  inputData,
  query,
}: {
  inputData: { title: string; path: string }[];
  query: string;
}) {
  if (query) {
    inputData = inputData.filter(
      (item) =>
        item.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        item.path.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function splitPath(
  array: {
    title: string;
    path: string;
    children?: any;
  }[],
  key: string
) {
  let stack = array.map((item) => ({
    path: [item.title],
    currItem: item,
  }));

  while (stack.length) {
    const { path, currItem } = stack.pop() as {
      path: string[];
      currItem: { title: string; path: string; children: any };
    };

    if (currItem.path === key) {
      return path;
    }

    if (currItem.children?.length) {
      stack = stack.concat(
        currItem.children.map(
          (item: { title: string; path: string; children: any }) => ({
            path: path.concat(item.title),
            currItem: item,
          })
        )
      );
    }
  }
  return null;
}

// ----------------------------------------------------------------------

export function handleLoop(
  array:
    | {
        title: string;
        path: string;
        children?: any;
      }[],
  subheader: string
): {
  title: string;
  path: string;
  children?: any;
  subheader: string;
}[] {
  return array?.map((list) => ({
    subheader,
    ...list,
    ...(list.children && {
      children: handleLoop(list.children, subheader),
    }),
  }));
}

// ----------------------------------------------------------------------

export function groupedData(
  array:
    | {
        group: string;
        title: string;
        path: string;
      }[]
) {
  const group: { [key: string]: any[] } = array.reduce(
    (groups: { [key: string]: any[] }, item) => {
      groups[item.group] = groups[item.group] || [];

      groups[item.group].push(item);

      return groups;
    },
    {}
  );

  return group;
}
