import {
  SymbolGroupList,
  SymbolIndex,
  SymbolList,
  SymbolRegisterForm,
  SymbolUpdateForm,
} from "../pages/symbol";
import {Navigate} from "react-router-dom";

export default {
  path: "/symbol",
  element: <SymbolIndex />,
  children: [
    {element: <Navigate to="group" replace/>, index: true},
    { path: "group", element: <SymbolGroupList /> },
    { path: "list", element: <SymbolList /> },
    { path: "list/:id", element: <SymbolList /> },
    { path: "register", element: <SymbolRegisterForm /> },
    { path: "register/:id", element: <SymbolUpdateForm /> },
  ],
};
