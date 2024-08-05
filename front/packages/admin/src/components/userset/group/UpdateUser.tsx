import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useOutletContext} from "react-router-dom";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {dateFormat} from "@mnd/shared";
import {first} from "lodash";
import {format} from "ol/coordinate";
import {useTranslation} from "react-i18next";

export const UpdateUser = () => {
    const groupId = useOutletContext<string>();
    const kcAdminClient = useKcAdminClient();
    const {data} = useSuspenseQuery({
        queryKey: ['members'],
        queryFn: () => kcAdminClient.groups.listMembers({id: groupId}),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 0,
        gcTime: 0,
    });

    return (
        <>
            <div className="list08 title-inner">
                <table>
                    <caption>사용자 그룹 수정</caption>
                    <thead>
                        <tr>
                            <th>번호</th>
                            <th>아이디</th>
                            <th>이름</th>
                            <th>소속부대</th>
                            <th>상태</th>
                            {/*<th>수정</th>*/}
                            <th>마지막 로그인</th>
                            <th>등록일</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div className="list08 inner">
                <table>
                    <tbody>
                    {
                        data.map((user, index) => <UserItem key={user.id} user={user} index={index}/>)
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}


const UserItem = ({user, index}: {user:UserRepresentation, index:number}) => {
    const {t} = useTranslation();
  const division = user.attributes.division?.[0] && t(user.attributes.division?.[0]) || '소속미입력';
  const unit = user.attributes.unit?.[0];
    return (
        <tr>
            <td>{index+1}</td>
            <td>{user.username}</td>
            <td>{user.firstName}</td>
            <td>{division} {unit}</td>
            <td>{user.enabled ? '사용중' : '사용불가'}</td>
            {/*<td>*/}
            {/*    <button type="button" className="btn-s-edit">수정</button>*/}
            {/*</td>*/}
            <td><UserSession user={user}/></td>
            <td>{dateFormat(user.createdTimestamp)}</td>
        </tr>
    )
}

const UserSession = ({user}: { user: UserRepresentation }) => {
  const kcAdminClient = useKcAdminClient();
  const {data} = useSuspenseQuery({
    queryKey: ['userSessions', user.id],
    queryFn: () => kcAdminClient.users.listSessions({id: user.id}),
  });

  const lastAccess = first(data)?.lastAccess;
  if(lastAccess) {
    return <>{dateFormat(lastAccess, 'YYYY-MM-DD HH:mm:ss')}</>
  }
  return <>-</>
}