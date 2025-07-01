const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

const MOCK_ID = "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1";
const MOCK_TITLE = "Sample Post Title";

export const paths = {
  auth: {
    root: ROOTS.AUTH,
    login: `${ROOTS.AUTH}/login`,
  },
  dashboard: {
    root: ROOTS.DASHBOARD,
    analytics: `${ROOTS.DASHBOARD}/analytics`,
    projectStatus: `${ROOTS.DASHBOARD}/project-status`,
    categories: {
      root: `${ROOTS.DASHBOARD}/categories`,
      new: `${ROOTS.DASHBOARD}/add-category`,
    },
    products: {
      root: `${ROOTS.DASHBOARD}/products`,
      new: `${ROOTS.DASHBOARD}/add-product`,
    },
    orders: {
      root: `${ROOTS.DASHBOARD}/orders`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    bannerImages: {
      root: `${ROOTS.DASHBOARD}/banner-images`,
    },
    organizations: {
      root: `${ROOTS.DASHBOARD}/organizations`,
    },
    users: {
      root: `${ROOTS.DASHBOARD}/users`,
    },
    store: {
      settings: `${ROOTS.DASHBOARD}/store/settings`,
      theme: `${ROOTS.DASHBOARD}/store/theme`,
      navigation: `${ROOTS.DASHBOARD}/store/navigation`,
    },
    reports: {
      sales: `${ROOTS.DASHBOARD}/reports/sales`,
      products: `${ROOTS.DASHBOARD}/reports/products`,
      customers: `${ROOTS.DASHBOARD}/reports/customers`,
      scheduled: `${ROOTS.DASHBOARD}/reports/scheduled`,
    },
    payment: {
      configuration: `${ROOTS.DASHBOARD}/payment/configuration`,
    },
    shipping: {
      configuration: `${ROOTS.DASHBOARD}/shipping/configuration`,
    },
    discount: {
      management: `${ROOTS.DASHBOARD}/discount/management`,
    },
    tax: {
      configuration: `${ROOTS.DASHBOARD}/tax/configuration`,
    },
    currency: {
      configuration: `${ROOTS.DASHBOARD}/currency/configuration`,
    },
    customer: {
      segmentation: `${ROOTS.DASHBOARD}/customer/segmentation`,
    },
    website: {
      footer: `${ROOTS.DASHBOARD}/website/footer`,
      pages: `${ROOTS.DASHBOARD}/website/pages`,
    },
    system: {
      configuration: `${ROOTS.DASHBOARD}/system/configuration`,
      logs: `${ROOTS.DASHBOARD}/system/logs`,
      backup: `${ROOTS.DASHBOARD}/system/backup`,
    },
    security: {
      auditLogs: `${ROOTS.DASHBOARD}/security/audit-logs`,
      gdpr: `${ROOTS.DASHBOARD}/security/gdpr`,
      twoFactor: `${ROOTS.DASHBOARD}/security/two-factor`,
    },
    settings: {
      admin: `${ROOTS.DASHBOARD}/settings/admin`,
    },
    integrations: `${ROOTS.DASHBOARD}/integrations`,
  },
};
