import {useQuery} from "@tanstack/react-query";
import RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {useOutletContext} from "react-router-dom";
import {useCallback, useState} from "react";
import GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";

export const UpdateRole = () => {
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
          <caption>사용자 그룹 관리</caption>
          <thead>
          <tr>
            <th><input type="checkbox"/></th>
            <th>권한명</th>
            <th>설명</th>
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
  const [isChecked, setChecked] = useState<boolean>(() => {
    return roleMappings?.some(roleMapping => roleMapping.id === role.id) ?? false;
  });

  const roleNaming = (name: string) => {
    switch (name) {
      case 'admin':
        return '관리 권한';
      case 'user':
        return '접속 권한';
      case 'analyze':
        return '분석 권한';
      case 'download':
        return '다운로드 권한';
      default:
        return name;
    }
  }

  const disabled = group.name === '시스템 관리자';

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

