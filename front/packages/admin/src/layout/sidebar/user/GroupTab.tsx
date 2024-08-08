import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar";

const GroupTab = () => {
    const {id} = useParams();
    const sidebarPropsArray = [
        {path: `/userset/group/update/basic/${id}`, text: 'settings'},
        {path: `/userset/group/update/role/${id}`, text: 'authority'},
        {path: `/userset/group/update/user/${id}`, text: 'user'},
    ]

    return <Sidebar divClassName="tabmenu" navLinkPropsArray={sidebarPropsArray}/>
}
export default GroupTab;