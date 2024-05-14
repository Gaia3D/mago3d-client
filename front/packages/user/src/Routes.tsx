import GlobalLayout from "./pages/_layout";
import Index from "./pages/Index";
import Page404 from "./pages/error/Page404";

export const routes = [
  {
    path: "",
    element: <GlobalLayout />,
    children: [
      { path: "/user", element: <Index />, index: true,  },
      { path: "*", element: <Page404 /> },
    ],
  },
];
