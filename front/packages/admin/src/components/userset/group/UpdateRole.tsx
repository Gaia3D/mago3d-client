import {useQuery} from "@tanstack/react-query";
import RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {useOutletContext} from "react-router-dom";
import {useCallback, useState} from "react";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {useTranslation} from "react-i18next";

export const UpdateRole = () => {
  const { t } = useTranslation();
  const groupId = useOutletContext<string>();
  const kcAdminClient = useKcAdminClient();

  const {data: group, isLoading: groupLoading} = useQuery({
    queryKey: ['groups', groupId],
    queryFn: () => kcAdminClient.groups.findOne({id: groupId}),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
    gcTime: 0,
  });

  const {data: roleMappings, isLoading: mappingLoading, refetch} = useQuery({
    queryKey: ['roleMappings', groupId],
    queryFn: () => kcAdminClient.groups.listRealmRoleMappings({id: groupId}),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
    gcTime: 0,
  });

  const {data: roles, isLoading: rolesLoading} = useQuery({
    queryKey: ['roles'],
    queryFn: () => kcAdminClient.roles.find()
      .then(roles => roles.filter(role => !role.name.startsWith('uma_')
        && !role.name.startsWith('offline')
        && !role.name.startsWith('default-')
      )),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 0,
    gcTime: 0,
  });

  const onChange = useCallback((role: RoleRepresentation, checked: boolean) => {
    const payload = {
      id: groupId,
      roles: [{
        id: role.id,
        name: role.name
      }]
    };

    if (checked) {
      kcAdminClient.groups.addRealmRoleMappings(payload).finally(refetch);
    } else {
      kcAdminClient.groups.delRealmRoleMappings(payload).finally(refetch);
    }
  }, [kcAdminClient, refetch, groupId]);

  if(groupLoading || mappingLoading || rolesLoading) {
    return <div>loading...</div>
  }

  return (
    <>
      <div className="list03 type02">
        <table>
          <caption>{t("user-group-management")}</caption>
          <thead>
          <tr>
            <th><input type="checkbox"/></th>
            <th>{t("authorities.name")}</th>
            <th>{t("description")}</th>
          </tr>
          </thead>
          <tbody>
          {roles && roles.length > 0 && roles.map(role => <RoleItem
            key={role.id}
            group={group}
            onChange={onChange}
            roleMappings={roleMappings}
            role={role}/>)}
          </tbody>
        </table>
      </div>
    </>
  )
}


const RoleItem = ({group, roleMappings, role, onChange}: {
  onChange: (role: RoleRepresentation, checked: boolean) => void,
  group: GroupRepresentation,
  roleMappings: RoleRepresentation[],
  role: RoleRepresentation
}) => {
  const { t } = useTranslation();
  const [isChecked, setChecked] = useState<boolean>(() => {
    return roleMappings?.some(roleMapping => roleMapping.id === role.id) ?? false;
  });

  const roleNaming = (name: string) => {
    switch (name) {
      case 'admin':
        return t("authorities.admin");
      case 'user':
        return t("authorities.user");
      case 'analyze':
        return t("authorities.analyze");
      case 'download':
        return t("authorities.download");
      default:
        return name;
    }
  }

  const disabled = group.name === t("authorities.system");

  const name = roleNaming(role.name);

  const onChangeHandler = () => {
    onChange(role, !isChecked);
    setChecked(!isChecked);
  }

  return (
    <tr>
      <td><input type="checkbox" checked={isChecked} onChange={onChangeHandler} disabled={disabled}/></td>
      <td className="tleft">{name}</td>
      <td className="tleft">{role.description}</td>
    </tr>
  )
}

