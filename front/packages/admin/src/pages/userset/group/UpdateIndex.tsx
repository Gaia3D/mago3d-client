import { Outlet, useParams } from "react-router-dom";
import GroupTab from "../../../layout/sidebar/user/GroupTab";
import { useNotFindId } from "@src/hooks/common";
import {useTranslation} from "react-i18next";

export function UpdateGroupIndex() {
    const { t } = useTranslation();
    const {id} = useParams();
    useNotFindId('/group/list');

    return (
        <div className="contents">
            <h2>{t("user-group-detail")}</h2>
            <GroupTab />
            <Outlet context={id as string}/>
        </div>
    )
}

