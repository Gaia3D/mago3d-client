import { Outlet, useParams } from "react-router-dom";
import GroupTab from "../../../layout/sidebar/user/GroupTab";
import { useNotFindId } from "@src/hooks/common";

export function UpdateGroupIndex() {
    const {id} = useParams();
    useNotFindId('/group/list');

    return (
        <div className="contents">
            <h2>사용자 그룹 상세</h2>
            <GroupTab />
            <Outlet context={id as string}/>
        </div>
    )
}

