import {dataFormatter, timestampFormatter} from "@mnd/shared";
import {useMutation} from "@tanstack/react-query";
import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {divisionToKor} from "@src/api/User";
import {useNavigate} from "react-router-dom";
import {gql} from "graphql-tag";
import {FragmentType, useFragment} from "@src/generated/gql/userset";
import {UserListItemFragmentDoc} from "@src/generated/gql/userset/graphql";

export const ListItem = (props
                    : { user: FragmentType<typeof UserListItemFragmentDoc>, refetchFunc: () => void }
) => {
  const user = useFragment(UserListItemFragmentDoc, props.user);

  const navigate = useNavigate();
  const kcAdminClient = useKcAdminClient();
  const {id, username, firstName, enabled, createdAt, properties} = user;

  const {mutateAsync: deleteMutateAsync} = useMutation({
    mutationFn: (id: string) => kcAdminClient.users.del({id})
  });

  const updateUser = () => {
    if (!id) return;
    navigate(`/userset/user/update/${id}`);
  }
  const deleteUser = () => {
    if (!id) return;
    if (!confirm('삭제하시겠습니까?')) return;

    deleteMutateAsync(id, {
      onSuccess: () => props.refetchFunc()
    });
  }
  return (
    <tr>
      <td>{username}</td>
      <td>{firstName ?? ''}</td>
      <td>{properties?.level?.length > 0 ? properties.level[0] : ''}</td>
      <td>{!properties ? '소속미입력' : `${divisionToKor(properties.division?.length > 0 ? properties.division[0] : '소속미입력')} ${properties.unit?.length > 0 ? properties.unit[0] : ''}`}</td>
      <td>{enabled ? '사용중' : '사용불가'}</td>
      <td>
        <button type="button" className="btn-s-edit" onClick={updateUser}>수정</button>
      </td>
      <td>
        <button type="button" className="btn-s-edit" onClick={deleteUser}>삭제</button>
      </td>
      <td>{dataFormatter(createdAt ?? Date.now(), 'YYYY-MM-DD')}</td>
    </tr>
  )
}

ListItem.fragments = {
    entry: gql`
        fragment UserListItem on User {
            id
            enabled
            username
            firstName
            createdAt
            properties
        }
    `
}