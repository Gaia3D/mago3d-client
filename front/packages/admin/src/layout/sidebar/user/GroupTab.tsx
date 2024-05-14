import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar";

const GroupTab = () => {
    const {id} = useParams();
    const sidebarPropsArray = [
        {path: `/userset/group/update/basic/${id}`, text: '설정'},
        {path: `/userset/group/update/role/${id}`, text: '권한'},
        {path: `/userset/group/update/user/${id}`, text: '사용자'},
    ]

    return <Sidebar divClassName="tabmenu" navLinkPropsArray={sidebarPropsArray}/>
}
export default GroupTab;