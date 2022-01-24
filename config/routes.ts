export default [
  {
    path: "/user",
    component: "../layouts/UserLayout",
    routes: [
      {
        name: "login",
        path: "/user/login",
        component: "./user/login",
      },
    ],
  },
  {
    path: "/",
    component: "../layouts/SecurityLayout",
    routes: [
      {
        path: "/",
        component: "../layouts/BasicLayout",
        authority: ["admin", "user"],
        routes: [
          {
            path: "/",
            redirect: "/welcome",
          },
          {
            path: "/welcome",
            name: "欢迎",
            icon: "smile",
            component: "./Welcome",
          },
          {
            path: "/admin",
            name: "管理权限",
            icon: "crown",
            component: "./Admin",
            authority: ["admin"],
            routes: [
              {
                path: "/admin/sub-page",
                name: "子页面",
                icon: "smile",
                component: "./Welcome",
                authority: ["admin"],
              },
            ],
          },
          {
            name: "表格页面",
            icon: "table",
            path: "/list",
            component: "./ListTableList",
          },
          {
            component: "./404",
          },
        ],
      },
      {
        component: "./404",
      },
    ],
  },
  {
    component: "./404",
  },
];
