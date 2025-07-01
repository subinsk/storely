const ROOTS = {
  AUTH: "/auth",
  DASHBOARD: "/dashboard",
};

export const paths = {
  auth: {
    root: ROOTS.AUTH,
    login: `${ROOTS.AUTH}/login`,
    signup: `${ROOTS.AUTH}/signup`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
  },
  home: {
    root: "/",
  },
  about:"/about",
  contact:"/contact",
  faqs:"/faqs",
  checkout: `/checkout`,
  user:{
    root:"/user",
    profile:"/user/profile",
  },
  product: {
    root: `/product`,
    details: (slug: string) => `/product/${slug}`,
  },
};
