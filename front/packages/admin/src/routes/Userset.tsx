import {Navigate} from "react-router-dom";
import {UserCreate, UserIndex, UserList, UserUpdate} from "../pages/userset/user";
import {
  GroupIndex,
  GroupList,
  GroupUpdateBasic,
  GroupUpdateRole,
  GroupUpdateUser,
  UpdateGroupIndex
} from "../pages/userset/group";

export default {
  path: '/userset', children: [
    {element: <Navigate to="user" replace/>, index: true},
    {
      path: 'group', element: <GroupIndex/>, children: [
        {element: <GroupList/>, index: true},
        {
          path: 'update/*', element: <UpdateGroupIndex/>, children: [
            {path: 'basic/:id', element: <GroupUpdateBasic/>},
            {path: 'role/:id', element: <GroupUpdateRole/>},
            {path: 'user/:id', element: <GroupUpdateUser/>},
          ]
        },
      ]
    },
    {
      path: 'user', element: <UserIndex/>, children: [
        {element: <UserList/>, index: true},
        {path: 'create', element: <UserCreate/>},
        {path: 'update/:id', element: <UserUpdate/>},
      ]
    },
  ]
}