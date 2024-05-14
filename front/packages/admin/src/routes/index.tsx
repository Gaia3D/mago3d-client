import {Navigate} from 'react-router-dom';
import Userset from './Userset';
import Dataset from './Dataset';
import Layerset from './Layerset';
import SymbolRoute from './Symbol'
import StatisticsRoute from './Statistics'
import DashboardRoute from "./Dashboard";
import {RootLayout} from "../layout";
import ErrorPage from "../pages/Error";

export const routes = [
  {
    element: <RootLayout/>,
    errorElement: <ErrorPage/>,
    children: [
      {path: '/', element: <Navigate to="dataset"/>},
      Userset,
      Dataset,
      Layerset,
      SymbolRoute,
      StatisticsRoute,
      DashboardRoute,
    ],
  },
]