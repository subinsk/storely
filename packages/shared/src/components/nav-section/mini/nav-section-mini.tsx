import { memo } from "react";
import Stack from "@mui/material/Stack";
//
import { navMiniConfig } from "../config";
import NavList from "./nav-list";

// ----------------------------------------------------------------------

function NavSectionMini({
  data,
  config,
  sx,
  ...other
}: {
  data: any;
  config: any;
  sx?: any;
  [key: string]: any;
}) {
  return (
    <Stack sx={sx} {...other}>
      {data.map((group: { subheader: any; items: any }, index: number) => (
        <Group
          key={group.subheader || index}
          items={group.items}
          config={navMiniConfig(config)}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionMini);

// ----------------------------------------------------------------------

function Group({ items, config }: { items: any; config: any }) {
  return (
    <>
      {items.map((list: { title: any; path: any; children: any }) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={1}
          hasChild={!!list.children}
          config={config}
        />
      ))}
    </>
  );
}
