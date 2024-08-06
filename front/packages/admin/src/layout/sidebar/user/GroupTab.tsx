import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import {useTranslation} from "react-i18next";

const GroupTab = () => {
    const { t } = useTranslation();
    const {id} = useParams();
    const sidebarPropsArray = [
        {path: `/userset/group/update/basic/${id}`, text: t("settings")},
        {path: `/userset/group/update/role/${id}`, text: t("authority")},
        {path: `/userset/group/update/user/${id}`, text: t("user")},
    ]

    return <Sidebar divClassName="tabmenu" navLinkPropsArray={sidebarPropsArray}/>
}
export default GroupTab;