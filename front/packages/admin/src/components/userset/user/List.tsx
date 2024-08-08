import {useRecoilValue, useSetRecoilState} from "recoil";
import {Suspense, useCallback} from "react";
import {AppLoader, Pagination} from "@mnd/shared";
import {useNavigate} from "react-router-dom";
import {userSearchSelector, userSearchState} from "@src/recoils/User";
import {EnabledAndExcel, ListItem, SearchCondition} from "./index";
import {useSuspenseQuery} from "@apollo/client";
import {UsersetUserListDocument, UsersetUserListQueryVariables, UserSort} from "@src/generated/gql/userset/graphql";
import gql from "graphql-tag";
import {produce} from "immer";
import {includes} from "lodash";
import {useTranslation} from "react-i18next";

gql`
    query UsersetUserList($filter: UserFilter, $pageable: UserPageable) @api(name: userset) {
        users(filter: $filter, pageable: $pageable) {
            items {
                id
                ...UserListItem
            }
            pageInfo {
                page
                size
                totalPages
                totalItems
            }
        }
    }
`

export const List = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();

  const setSearchState = useSetRecoilState(userSearchState);
  const variables = useRecoilValue<UsersetUserListQueryVariables>(userSearchSelector);

  const {data : {
    users: {
      items,
      pageInfo
    }
  }, refetch} = useSuspenseQuery(UsersetUserListDocument, {variables});

  const setPage = useCallback((pageNum: number) => {
    setSearchState(produce(draft => {
      draft.pageNum = pageNum;
    }));
  }, [setSearchState]);

  const create = () => navigate('/userset/user/create');

  const sortBy = (key: string) => {
    setSearchState(produce(draft => {
      switch (key) {
        case 'username':
          draft.pageSort = includes(draft.pageSort, UserSort.UsernameAsc) ? [UserSort.UsernameDesc] : [UserSort.UsernameAsc];
          break;
        case 'firstName':
          draft.pageSort = includes(draft.pageSort, UserSort.FirstNameAsc) ? [UserSort.FirstNameDesc] : [UserSort.FirstNameAsc];
          break;
        case 'createdAt':
          draft.pageSort = includes(draft.pageSort, UserSort.CreatedAtAsc) ? [UserSort.CreatedAtDesc] : [UserSort.CreatedAtAsc];
          break;
      }
    }));
  }

  return (
    <Suspense fallback={<AppLoader />}>
      <div className="contents">
        <h2>{t("user-management")}</h2>
        <SearchCondition />
        <div className="alg-left">
          <span className="result-list">
            {t("search-result")} : {t("total")}{" "}
            <span className="skyblue">{pageInfo.totalItems}</span>
            {t("cases")}
          </span>
          ,
          <span className="result-page">
            <span className="skyblue">{pageInfo.page + 1}</span>/
            {pageInfo.totalPages} {t("page")}
          </span>
        </div>
        <EnabledAndExcel fetchFunc={refetch} />
        <div className="list09">
          <table>
            <caption>{t("user-management")}</caption>
            <thead>
              <tr>
                <th onClick={() => sortBy("username")}>
                  {t("user-id")} <a className="sort"></a>
                </th>
                <th onClick={() => sortBy("firstName")}>
                  {t("user-name")} <a className="sort"></a>
                </th>
                <th>{t("rank")}</th>
                <th>{t("division-unit")}</th>
                <th>{t("state")}</th>
                <th>{t("edit")}</th>
                <th>{t("delete")}</th>
                <th onClick={() => sortBy("createdAt")}>
                  {t("join-date")} <a className="sort"></a>
                </th>
              </tr>
            </thead>
            <tbody>
              {items && items.length > 0 ? (
                items.map((user) => (
                  <ListItem key={user.id} user={user} refetchFunc={refetch} />
                ))
              ) : (
                <tr>
                  <td colSpan={8}>{t("not-found.user")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={create}>
            {t("add-user")}
          </button>
        </div>
        {pageInfo.totalPages > 0 ? (
          <Pagination
            page={pageInfo.page}
            totalPages={pageInfo.totalPages}
            pagePerCount={pageInfo.size}
            handler={setPage}
          />
        ) : null}
      </div>
    </Suspense>
  );
}