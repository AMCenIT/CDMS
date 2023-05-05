const routes = [
  {
    path: "/",
    component: () => import("layouts/Login.vue"),
    children: [{ path: "", component: () => import("pages/Index.vue") }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },

  {
    path: "/MainLayout",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "Transaction",
        component: () => import("pages/Transaction.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Dashboard",
        component: () => import("pages/Dashboard.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "resetPassword",
        component: () => import("pages/resetPassword.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "crudCustomer",
        component: () => import("pages/crudCustomer.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "Home",
        component: () => import("layouts/Home.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "DownloadableFiles",
        component: () => import("pages/DownloadableFiles.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "GenerateReport",
        component: () => import("pages/GenerateReport.vue"),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },

  {
    path: "/Login",
    component: () => import("layouts/Login.vue"),
  },
  {
    path: "/addCustomer",
    component: () => import("components/addCustomer.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

export default routes;
