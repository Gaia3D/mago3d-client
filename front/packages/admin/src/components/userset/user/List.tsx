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
  console.info(items);

  return (
    <Suspense fallback={<AppLoader/>}>
      <div className="contents">
        <h2>사용자 관리</h2>
        <SearchCondition/>
        <div className="alg-left">
          <span className="result-list">검색결과 : 총 <span className="skyblue">{pageInfo.totalItems}</span>건</span>,
          <span className="result-page"><span
            className="skyblue">{pageInfo.page + 1}</span>/{pageInfo.totalPages} 페이지</span>
        </div>
        <EnabledAndExcel fetchFunc={refetch}/>
        <div className="list09">
          <table>
            <caption>사용자 관리</caption>
            <thead>
            <tr>
              <th onClick={() => sortBy('username')}>아이디 <a className="sort"></a></th>
              <th onClick={() => sortBy('firstName')}>이름 <a className="sort"></a></th>
              <th>계급</th>
              <th>소속부대</th>
              <th>상태</th>
              <th>수정</th>
              <th>삭제</th>
              <th  onClick={() => sortBy('createdAt')}>가입일 <a className="sort"></a></th>
            </tr>
            </thead>
            <tbody>
            {
              items && items.length > 0 ? items.map(user =>
                <ListItem key={user.id} user={user} refetchFunc={refetch}/>) : <tr><td colSpan={8}>데이터가 없습니다.</td></tr>
            }
            </tbody>
          </table>
        </div>
        <div className="alg-right">
          <button type="button" className="btn-plus" onClick={create}>사용자 추가</button>
        </div>
        {
          pageInfo.totalPages > 0 ?
            <Pagination page={pageInfo.page} totalPages={pageInfo.totalPages} pagePerCount={pageInfo.size}
                        handler={setPage}/>
            : null
        }
      </div>
    </Suspense>
  )
}