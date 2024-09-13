import GlobalLayout from "./pages/_layout";
import Index from "./pages/Index";
import Page404 from "./pages/error/Page404";
import Register from "@/pages/Register.tsx";

export const routes = [
  {
    path: "",
    element: <GlobalLayout />,
    children: [
      { path: "/", element: <Index />, index: true,  },
      { path: "/register", element: <Register /> },
      { path: "*", element: <Page404 /> },
    ],
  },
];
