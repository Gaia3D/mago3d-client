import downloadExcelFile, {XLSXWorkSheetProps} from "../../../api/Excel";
import {divisionToKor} from "@src/api/User";
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
import {useTranslation} from "react-i18next";

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
  const {t} = useTranslation();
  const searchVariables = useRecoilValue<UsersetUserListQueryVariables>(userSearchSelector);
  const updateEnabled = useUpdateUserEnabled();

  const [fetchUserId] = useLazyQuery(UsersetUserIdListDocument, {variables: searchVariables});
  const [fetchUserExcel] = useLazyQuery(UsersetUserExcelDocument, {variables: searchVariables});

  const enableUpdate = useCallback((enabled: boolean) => {
    if (!confirm(t('question.edit'))) return;
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
            [t("user-id")]: user.username,
            [t("user-name")]: user.firstName,
            [t("division-unit")]: division + "/" + unit,
            [t("user-status")]: user.enabled,
            [t("join-date")]: user.createdAt,
          };
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
      <button type="button" className="btn-basic" onClick={() => enableUpdate(true)}>{t('all')} {t('using')}</button>
      <button type="button" className="btn-basic" onClick={() => enableUpdate(false)}>{t('all')} {t('stop-using')}</button>
      <button type="button" className="btn-basic" onClick={download}>{t('excel')} {t('download')}</button>
    </div>
  )
}
