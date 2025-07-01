import { memo, useState, useCallback } from "react";
// @mui
import List from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
//
import { navVerticalConfig } from "../config";
import { StyledSubheader } from "./styles";

import NavList from "./nav-list";

// ----------------------------------------------------------------------

function NavSectionVertical({
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
          subheader={group.subheader}
          items={group.items}
          config={navVerticalConfig(config)}
        />
      ))}
    </Stack>
  );
}

export default memo(NavSectionVertical);

// ----------------------------------------------------------------------

function Group({
  subheader,
  items,
  config,
}: {
  subheader: any;
  items: any;
  config: any;
}) {
  const [open, setOpen] = useState(true);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const renderContent = items
    .filter((list: any) => {
      // Filter based on roles if specified
      if (list.roles && config.currentRole) {
        return list.roles.includes(config.currentRole);
      }
      return true;
    })
    .map((list: { title: any; path: any; children: any }) => (
      <NavList
        key={list.title + list.path}
        data={list}
        depth={1}
        hasChild={!!list.children}
        config={config}
      />
    ));

  return (
    <List disablePadding>
      {subheader ? (
        <>
          <StyledSubheader
            onClick={handleToggle}
            config={config}
            disableGutters
            disableSticky
          >
            {subheader}
          </StyledSubheader>

          <Collapse in={open}>{renderContent}</Collapse>
        </>
      ) : (
        renderContent
      )}
    </List>
  );
}
