import PropTypes from "prop-types";
import { useState, useEffect, useCallback } from "react";
// @mui
import Collapse from "@mui/material/Collapse";
// routes
import { useActiveLink } from "../../../hooks/use-active-link";
//
import NavItem from "./nav-item";
import { usePathname } from "next/navigation";

// ----------------------------------------------------------------------

export default function NavList({
  data,
  depth,
  hasChild,
  config,
}: {
  data: any;
  depth: number;
  hasChild: boolean;
  config: any;
}) {
  const pathname = usePathname();

  const active = useActiveLink(data.path, hasChild);

  const externalLink = data.path.includes("http");

  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (!active) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      <NavItem
        item={data}
        depth={depth}
        open={open}
        active={active}
        externalLink={externalLink}
        onClick={handleToggle}
        config={config}
      />

      {hasChild && (
        <Collapse in={open} unmountOnExit>
          <NavSubList data={data.children} depth={depth} config={config} />
        </Collapse>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

function NavSubList({
  data,
  depth,
  config,
}: {
  data: any;
  depth: number;
  config: any;
}) {
  return (
    <>
      {data.map((list: { title: any; path: any; children: any }) => (
        <NavList
          key={list.title + list.path}
          data={list}
          depth={depth + 1}
          hasChild={!!list.children}
          config={config}
        />
      ))}
    </>
  );
}
