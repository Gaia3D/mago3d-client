import {Navigate} from "react-router-dom";
import {Create3D, CreateAssetIndex, CreateAssetRaster, CreateAssetVector, DatasetAssetDetail, DatasetAssetIndex, DataList, UpdateAsset3d, UpdateAssetIndex, UpdateAssetRaster, UpdateAssetVector} from "../pages/dataset/asset";
import {GroupLayout, GroupList, UpdateGroupBasic, UpdateGroupData, UpdateGroupIndex} from "../pages/dataset/group";

export default {
  path: '/dataset', children: [
    {element: <Navigate to="group" replace/>, index: true},
    {
      path: 'group', element: <GroupLayout/>, children: [
        {element: <GroupList/>, index: true},
        {
          path: 'update', element: <UpdateGroupIndex/>, children: [
            {path: 'basic/:id', element: <UpdateGroupBasic/>},
            {path: 'data/:id', element: <UpdateGroupData/>},
          ]
        },
      ]
    },
    {
      path: 'asset', element: <DatasetAssetIndex/>, children: [
        {element: <DataList/>, index: true},
        {path: ':id', element: <DatasetAssetDetail/>,},
        {
          path: 'create', element: <CreateAssetIndex/>, children: [
            {path: '3d', element: <Create3D/>},
            {path: 'vector', element: <CreateAssetVector/>},
            {path: 'raster', element: <CreateAssetRaster/>},
          ]
        },
        {
          path: 'update', element: <UpdateAssetIndex/>, children: [
            {path: '3d/:id', element: <UpdateAsset3d/>},
            {path: 'vector/:id', element: <UpdateAssetVector/>},
            {path: 'raster/:id', element: <UpdateAssetRaster/>},
          ]
        },
      ]
    },
  ]
}