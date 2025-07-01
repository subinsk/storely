import { useMemo } from "react";
// routes
import { paths } from "@/routes/paths";
// locales
import { useLocales } from "@/locales";
// components
import SvgColor from "@/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon("ic_job"),
  blog: icon("ic_blog"),
  chat: icon("ic_chat"),
  mail: icon("ic_mail"),
  user: icon("ic_user"),
  file: icon("ic_file"),
  lock: icon("ic_lock"),
  tour: icon("ic_tour"),
  order: icon("ic_order"),
  label: icon("ic_label"),
  blank: icon("ic_blank"),
  kanban: icon("ic_kanban"),
  folder: icon("ic_folder"),
  banking: icon("ic_banking"),
  booking: icon("ic_booking"),
  invoice: icon("ic_invoice"),
  product: icon("ic_product"),
  calendar: icon("ic_calendar"),
  disabled: icon("ic_disabled"),
  external: icon("ic_external"),
  menuItem: icon("ic_menu_item"),
  ecommerce: icon("ic_ecommerce"),
  analytics: icon("ic_analytics"),
  dashboard: icon("ic_dashboard"),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { t } = useLocales();

  const data = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: "Overview",
        items: [
          {
            title: "Dashboard",
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
          {
            title: "Analytics",
            path: paths.dashboard.analytics,
            icon: ICONS.analytics,
            roles: ["org_admin", "org_user"],
          },
          {
            title: "Project Status",
            path: paths.dashboard.projectStatus,
            icon: ICONS.analytics,
            roles: ["super_admin"],
          },
        ],
      },

      // CATALOG MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: "Catalog",
        items: [
          {
            title: "Categories",
            path: paths.dashboard.categories.root,
            icon: ICONS.label,
            roles: ["org_admin", "org_user"],
          },
          {
            title: "Products",
            path: paths.dashboard.products.root,
            icon: ICONS.product,
            roles: ["org_admin", "org_user"],
          },
          {
            title: "Banner Images",
            path: paths.dashboard.bannerImages.root,
            icon: ICONS.kanban,
            roles: ["org_admin", "org_user"],
          },
        ],
      },

      // SALES & ORDERS
      // ----------------------------------------------------------------------
      {
        subheader: "Sales",
        items: [
          {
            title: "Orders",
            path: paths.dashboard.orders.root,
            icon: ICONS.order,
            roles: ["org_admin", "org_user"],
          },
          {
            title: "Discounts & Coupons",
            path: paths.dashboard.discount.management,
            icon: ICONS.label,
            roles: ["org_admin", "org_user"],
          },
          {
            title: "Customer Segmentation",
            path: paths.dashboard.customer.segmentation,
            icon: ICONS.user,
            roles: ["org_admin", "org_user"],
          },
          {
            title: "Reports",
            path: paths.dashboard.reports.sales,
            icon: ICONS.analytics,
            roles: ["org_admin", "org_user"],
            children: [
              {
                title: "Sales Report",
                path: paths.dashboard.reports.sales,
              },
              {
                title: "Product Performance",
                path: paths.dashboard.reports.products,
              },
              {
                title: "Customer Analytics",
                path: paths.dashboard.reports.customers,
              },
              {
                title: "Scheduled Reports",
                path: paths.dashboard.reports.scheduled,
              },
            ],
          },
        ],
      },

      // STORE CONFIGURATION
      // ----------------------------------------------------------------------
      {
        subheader: "Store Configuration",
        items: [
          {
            title: "Payment Methods",
            path: paths.dashboard.payment.configuration,
            icon: ICONS.banking,
            roles: ["org_admin"],
          },
          {
            title: "Shipping & Delivery",
            path: paths.dashboard.shipping.configuration,
            icon: ICONS.ecommerce,
            roles: ["org_admin"],
          },
          {
            title: "Tax Configuration",
            path: paths.dashboard.tax.configuration,
            icon: ICONS.invoice,
            roles: ["org_admin"],
          },
          {
            title: "Multi-Currency",
            path: paths.dashboard.currency.configuration,
            icon: ICONS.banking,
            roles: ["org_admin"],
          },
          {
            title: "Store Settings",
            path: paths.dashboard.store.settings,
            icon: ICONS.ecommerce,
            roles: ["org_admin"],
            children: [
              {
                title: "General Settings",
                path: paths.dashboard.store.settings,
              },
              {
                title: "Theme & Branding",
                path: paths.dashboard.store.theme,
              },
              {
                title: "Navigation",
                path: paths.dashboard.store.navigation,
              },
            ],
          },
        ],
      },

      // WEBSITE MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: "Website",
        items: [
          {
            title: "Footer Configuration",
            path: paths.dashboard.website.footer,
            icon: ICONS.ecommerce,
            roles: ["org_admin", "org_user"],
          },
          {
            title: "Custom Pages",
            path: paths.dashboard.website.pages,
            icon: ICONS.file,
            roles: ["org_admin", "org_user"],
          },
        ],
      },

      // SYSTEM MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: "System",
        items: [
          {
            title: "System Configuration",
            path: paths.dashboard.system.configuration,
            icon: ICONS.file,
            roles: ["super_admin", "org_admin"],
          },
          {
            title: "System Logs",
            path: paths.dashboard.system.logs,
            icon: ICONS.file,
            roles: ["super_admin", "org_admin"],
          },
          {
            title: "Backup & Restore",
            path: paths.dashboard.system.backup,
            icon: ICONS.folder,
            roles: ["super_admin", "org_admin"],
          },
        ],
      },

      // SECURITY & COMPLIANCE
      // ----------------------------------------------------------------------
      {
        subheader: "Security",
        items: [
          {
            title: "Audit Logs",
            path: paths.dashboard.security.auditLogs,
            icon: ICONS.lock,
            roles: ["super_admin", "org_admin"],
          },
          {
            title: "GDPR Compliance",
            path: paths.dashboard.security.gdpr,
            icon: ICONS.lock,
            roles: ["super_admin", "org_admin"],
          },
          {
            title: "Two-Factor Auth",
            path: paths.dashboard.security.twoFactor,
            icon: ICONS.lock,
            roles: ["super_admin", "org_admin"],
          },
        ],
      },

      // INTEGRATIONS
      // ----------------------------------------------------------------------
      {
        subheader: "Integrations",
        items: [
          {
            title: "Third-Party Apps",
            path: paths.dashboard.integrations,
            icon: ICONS.external,
            roles: ["super_admin", "org_admin"],
          },
        ],
      },

      // ADMINISTRATION
      // ----------------------------------------------------------------------
      {
        subheader: "Administration",
        items: [
          {
            title: "Admin Settings",
            path: paths.dashboard.settings.admin,
            icon: ICONS.menuItem,
            roles: ["super_admin", "org_admin"],
          },
          {
            title: "Organizations",
            path: paths.dashboard.organizations.root,
            icon: ICONS.user,
            roles: ["super_admin"],
          },
          {
            title: "Users",
            path: paths.dashboard.users.root,
            icon: ICONS.user,
            roles: ["org_admin", "super_admin"],
          },
        ],
      },
    ],
    []
  );

  return data;
}
