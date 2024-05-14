import {Navigate} from "react-router-dom";
import LayerIndex, {LayerDetail, LayerGroupList, LayerList, LayerPublish, MapList, UpdateLayerGroupBasic, UpdateLayerGroupData, UpdateLayerGroupIndex} from "../pages/layerset";

export default {
  path: '/layerset', element: <LayerIndex/>, children: [
    {element: <Navigate to="group" replace/>, index: true},
    {path: 'group', children: [
        {element: <LayerGroupList/>, index: true},
        {
          path: 'update', element: <UpdateLayerGroupIndex/>, children: [
            {path: 'basic/:id', element: <UpdateLayerGroupBasic/>},
            {path: 'data/:id', element: <UpdateLayerGroupData/>},
          ]
        },
      ]},
    {
      path: 'layer', children: [
        {element: <LayerList/>, index: true},
        {path: 'detail/:id', element: <LayerDetail/>},
      ]
    },
    {
      path: 'publish', children: [
        {path: ':id', element: <LayerPublish/>},
      ]
    },
    {path: 'map', element: <MapList/>},
  ]
}