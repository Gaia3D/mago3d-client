import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "@tanstack/react-query";
import {useNavigate} from "react-router-dom";
import {DeleteListItem} from "./index";

export const ListItem = ({group, refetch}: {
  group: GroupRepresentation,
  refetch: (options?: (RefetchOptions & RefetchQueryFilters) | undefined) => Promise<QueryObserverResult<GroupRepresentation[], unknown>>
}) => {
  const {name, id} = group;
  const navigate = useNavigate();
  const toUpdate = () => navigate(`/userset/group/update/basic/${id}`);

  return (
    <tr onClick={toUpdate}>
      <td className="group"><span className="folder-close"></span> {name}</td>
      {/*<td><button type="button" className="btn-s-edit" onClick={toUpdate}>수정</button></td>*/}
      { name === '시스템 관리자' ? <td></td> : <DeleteListItem id={id} refetch={refetch}/> }
    </tr>
  )
}
