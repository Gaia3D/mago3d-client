import UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import {useKcAdminClient} from "../../../provider/KeycloakAdminClientProvider";
import downloadExcelFile, {XLSXWorkSheetProps} from "../../../api/Excel";
import {timestampFormatter} from "@mnd/shared";
import {divisionToKor} from "../../../api/User";
import {useLazyQuery} from "@apollo/client";
import {
  UsersetUserExcelDocument,
  UsersetUserIdListDocument,
  UsersetUserListQueryVariables
} from "@src/generated/gql/userset/graphql";
import {useRecoilValue} from "recoil";
import {userSearchSelector} from "@src/recoils/User";
import {gql} from "graphql-tag";
import {useCallback} from "react";
import {useUpdateUserEnabled} from "@src/hooks/UserInfo";

const refineUser = ({username, firstName, enabled, createdTimestamp, attributes}: UserRepresentation) => ({
  "아이디": username,
  "이름": firstName,
  "부대": divisionToKor(`${attributes?.division}`) + ` ${attributes?.unit}`,
  "상태": enabled ? '사용' : '사용중지',
  "가입일자": timestampFormatter(createdTimestamp ?? 0, 'YYYY-MM-DD HH:mm:ss')
})

gql`
    query UsersetUserIdList($filter: UserFilter) @api(name: userset) {
        users(filter: $filter) {
            items {
                id
            }
        }
    }

    query UsersetUserExcel($filter: UserFilter) @api(name: userset) {
        users(filter: $filter) {
            items {
                id
                username
                firstName
                enabled
                createdAt
                properties
            }
        }
    }
`

export const EnabledAndExcel = ({fetchFunc}:
                                  {
                                    // data: UserRepresentation[] | undefined,
                                    // query: UserQueryWithAdditionalPageInfo,
                                    fetchFunc: () => void
                                  }) => {
  const searchVariables = useRecoilValue<UsersetUserListQueryVariables>(userSearchSelector);
  const updateEnabled = useUpdateUserEnabled();

  const [fetchUserId] = useLazyQuery(UsersetUserIdListDocument, {variables: searchVariables});
  const [fetchUserExcel] = useLazyQuery(UsersetUserExcelDocument, {variables: searchVariables});

  const enableUpdate = useCallback((enabled: boolean) => {
    if (!confirm('수정하시겠습니까?')) return;
    fetchUserId()
      .then(({data}) => updateEnabled(data.users.items.map(({id}) => id), enabled))
      .then(fetchFunc);
  }, [fetchUserId, updateEnabled, fetchFunc]);

  const download = () => {
    fetchUserExcel()
      .then(({data}) => {
        return data.users.items.map(user => {
          const division = divisionToKor(user.properties?.division?.[0]);
          const unit =user.properties?.unit?.[0];
          return {
            "아이디": user.username,
            "이름": user.firstName,
            "소속부대": division + '/' + unit,
            "사용여부": user.enabled,
            "생성일자": user.createdAt
          }
        });
      })
      .then((users) => {
        const sheet = {
          data: users,
          sheetName: '사용자 목록',
        } as XLSXWorkSheetProps;
        downloadExcelFile([sheet], '사용자목록.xlsx');
      });

    // timestampFormatter(user.createdAt, 'YYYY-MM-DD HH:mm:ss');

    // kcAdminClient.users.find(cloneQuery)
    //   .then((users) => users.map(refineUser).filter(user => !user.아이디.startsWith('service-account-')))
    //   .then((users) => {
    //     const sheet = {
    //       header: ['아이디', '이름', '부대', '사용여부', '생성일자'],
    //       data: users,
    //       sheetName: '사용자 목록'
    //     } as XLSXWorkSheetProps;
    //     downloadExcelFile([sheet], '사용자목록.xlsx');
    //   })
  }

  return (
    <div className="alg-right mar-b10">
      <button type="button" className="btn-basic" onClick={() => enableUpdate(true)}>전체 사용중</button>
      <button type="button" className="btn-basic" onClick={() => enableUpdate(false)}>전체 사용중지</button>
      <button type="button" className="btn-basic" onClick={download}>엑셀 다운로드</button>
    </div>
  )
}
