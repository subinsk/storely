import { memo } from "react";
// @mui
import Stack from "@mui/material/Stack";
// theme
import { hideScroll } from "@/theme/css";
//
import { navHorizontalConfig } from "../config";
import NavList from "./nav-list";

// ----------------------------------------------------------------------

function NavSectionHorizontal({
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
    <Stack
      direction="row"
      sx={{
        mx: "auto",
        ...hideScroll,
        ...sx,
      }}
      {...other}
    >
      {data.map((group: { subheader: any; items: any }, index: number) => (
        <Group
          key={group.subheader || index}
          items={group.items}
          config={navHorizontalConfig(config)}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionHorizontal);

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
