import {useKcAdminClient} from "@src/provider/KeycloakAdminClientProvider";
import {Suspense, useState} from "react";
import {AppLoader} from "@mnd/shared";
import {CreatePopup, ListItem} from "./index";
import {useSuspenseQuery} from "@tanstack/react-query";

export const List = () => {
  const [onCreate, setOnCreate] = useState<boolean>(false);
  const kcAdminClient = useKcAdminClient();
  const changeOnCreate = () => setOnCreate(!onCreate);

  const {data, refetch} = useSuspenseQuery({
    queryKey: ['groups'],
    queryFn: () => kcAdminClient.groups.find(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 0,
    gcTime: 0,
  });

  return (
    <Suspense fallback={<AppLoader/>}>
      <div className="contents">
        <h2>사용자 그룹 관리</h2>
        <div className="list type-04 blue-title-inner">
          <table>
            <caption>사용자 그룹 관리</caption>
            <thead>
            <tr>
              <th>그룹명</th>
              {/*<th>수정</th>*/}
              <th>삭제</th>
            </tr>
            </thead>
          </table>
        </div>
        <div className="list type-04 inner">
          <table>
            <tbody>
            {
              data && data.length > 0
                  ? data.map(group => <ListItem key={group.id} group={group} refetch={refetch}/>)
                  :
                  (
                      <tr>
                        <td className="group" style={{textAlign: 'center'}} colSpan={3}>그룹이 없습니다.</td>
                      </tr>
                  )
            }
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={changeOnCreate}>그룹 추가</button>
        </div>
      </div>
      {
        onCreate && <CreatePopup popupToggle={setOnCreate} refetch={refetch}/>
      }
    </Suspense>
  )
}
