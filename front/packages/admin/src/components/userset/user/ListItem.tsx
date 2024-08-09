import {dataFormatter} from "@mnd/shared";
import {useMutation} from "@tanstack/react-query";
import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {useNavigate} from "react-router-dom";
import {gql} from "graphql-tag";
import {FragmentType, useFragment} from "@src/generated/gql/userset";
import {UserListItemFragmentDoc} from "@src/generated/gql/userset/graphql";
import {useTranslation} from "react-i18next";

export const ListItem = (props: { key: string, user: FragmentType<typeof UserListItemFragmentDoc>, refetchFunc: () => void }) => {
  const {t} = useTranslation();
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
    if (!confirm(t("question.delete"))) return;

    deleteMutateAsync(id, {
      onSuccess: () => props.refetchFunc()
    });
  }

  return (
    <tr>
      <td>{username}</td>
      <td>{firstName ?? ''}</td>
      <td>{properties?.level?.length > 0 ? t(properties.division) : ''}</td>
      <td>{!properties ? t('division-blank') : `${t(properties.division?.length > 0 ? (properties.division[0]).toLowerCase() : 'division-blank')} ${properties.unit?.length > 0 ? properties.unit[0] : ''}`}</td>
      <td>{enabled ? t('using') : t('stop-using')}</td>
      <td>
          <button type="button" className="btn-s-edit" onClick={updateUser}>{t('edit')}</button>
      </td>
      <td>
          <button type="button" className="btn-s-edit" onClick={deleteUser}>{t('delete')}</button>
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