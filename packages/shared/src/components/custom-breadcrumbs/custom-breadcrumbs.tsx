import PropTypes from "prop-types";
import { useMemo } from "react";
// @mui
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
//
import LinkItem from "./link-item";

// ----------------------------------------------------------------------

interface BreadcrumbItem {
  name: string;
  href?: string;
  icon?: any;
}

interface CustomBreadcrumbsProps {
  links?: BreadcrumbItem[];
  action?: React.ReactNode;
  heading?: string;
  moreLink?: string[];
  activeLast?: boolean;
  sx?: any;
  // Dynamic props
  pathname?: string;
  categoryName?: string;
  productName?: string;
  customItems?: BreadcrumbItem[];
  autogenerate?: boolean;
  dashboardPaths?: {
    root: string;
    categories: { root: string };
    products: { root: string };
  };
}

export default function CustomBreadcrumbs({
  links,
  action,
  heading,
  moreLink,
  activeLast,
  sx,
  pathname,
  categoryName,
  productName,
  customItems,
  autogenerate = false,
  dashboardPaths,
  ...other
}: CustomBreadcrumbsProps) {
  
  // Generate dynamic breadcrumbs if autogenerate is true
  const dynamicBreadcrumbs = useMemo(() => {
    if (!autogenerate || !pathname || !dashboardPaths) {
      return { items: links || [], dynamicHeading: heading };
    }

    const items: BreadcrumbItem[] = [
      {
        name: "Dashboard",
        href: dashboardPaths.root,
      },
    ];

    // Handle custom items first
    if (customItems) {
      const dynamicHeading = customItems[customItems.length - 1]?.name || "Dashboard";
      return { items: [...items, ...customItems], dynamicHeading };
    }

    // Auto-generate based on pathname
    const segments = pathname.split("/").filter(Boolean);
    
    // Remove 'dashboard' from segments as it's already in base items
    const routeSegments = segments.slice(1);

    routeSegments.forEach((segment, index) => {
      switch (segment) {
        case "categories":
          items.push({
            name: "Categories",
            href: index === routeSegments.length - 1 ? undefined : dashboardPaths.categories.root,
          });
          break;
        case "products":
          items.push({
            name: "Products",
            href: index === routeSegments.length - 1 ? undefined : dashboardPaths.products.root,
          });
          break;
        case "add-category":
        case "new-category":
          items.push({
            name: "Categories",
            href: dashboardPaths.categories.root,
          });
          items.push({
            name: "Add Category",
          });
          break;
        case "edit-category":
          items.push({
            name: "Categories",
            href: dashboardPaths.categories.root,
          });
          items.push({
            name: categoryName ? `Edit ${categoryName}` : "Edit Category",
          });
          break;
        case "add-product":
        case "new-product":
          items.push({
            name: "Products",
            href: dashboardPaths.products.root,
          });
          items.push({
            name: "Add Product",
          });
          break;
        case "edit-product":
          items.push({
            name: "Products",
            href: dashboardPaths.products.root,
          });
          items.push({
            name: productName ? `Edit ${productName}` : "Edit Product",
          });
          break;
        default:
          // Handle dynamic segments like category slugs
          if (segment && !segment.startsWith("[") && !segment.startsWith("(")) {
            // If we're in categories and have a categoryName, use it
            if (pathname.includes("/categories/") && categoryName) {
              items.push({
                name: categoryName,
              });
            }
            // If we're in products and have a productName, use it
            else if (pathname.includes("/products/") && productName) {
              items.push({
                name: productName,
              });
            }
          }
          break;
      }
    });

    const dynamicHeading = items[items.length - 1]?.name || "Dashboard";
    return { items, dynamicHeading };
  }, [autogenerate, pathname, categoryName, productName, customItems, links, dashboardPaths, heading]);

  const finalLinks = autogenerate ? dynamicBreadcrumbs.items : (links || []);
  const finalHeading = autogenerate ? dynamicBreadcrumbs.dynamicHeading : heading;
  const lastLink = finalLinks.length > 0 ? finalLinks[finalLinks.length - 1].name : "";

  return (
    <Box sx={{ ...sx }}>
      <Stack direction="row" alignItems="center">
        <Box sx={{ flexGrow: 1 }}>
          {/* HEADING */}
          {finalHeading && (
            <Typography variant="h4" gutterBottom>
              {finalHeading}
            </Typography>
          )}

          {/* BREADCRUMBS */}
          {!!finalLinks.length && (
            <Breadcrumbs separator={<Separator />} {...other}>
              {finalLinks.slice(0, -1).map((link: BreadcrumbItem) => (
                <LinkItem
                  key={link.name || ""}
                  link={link}
                  activeLast={activeLast}
                  disabled={link.name === lastLink}
                />
              ))}
            </Breadcrumbs>
          )}
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}> {action} </Box>}
      </Stack>

      {/* MORE LINK */}
      {!!moreLink && (
        <Box sx={{ mt: 2 }}>
          {moreLink.map((href: string) => (
            <Link
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: "table" }}
            >
              {href}
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
}

CustomBreadcrumbs.propTypes = {
  sx: PropTypes.object,
  action: PropTypes.node,
  links: PropTypes.array,
  heading: PropTypes.string,
  moreLink: PropTypes.array,
  activeLast: PropTypes.bool,
};

// ----------------------------------------------------------------------

function Separator() {
  return (
    <Box
      component="span"
      sx={{
        width: 4,
        height: 4,
        borderRadius: "50%",
        bgcolor: "text.disabled",
      }}
    />
  );
}
