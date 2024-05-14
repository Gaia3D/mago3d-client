import {useRecoilState} from "recoil";
import {userSearchState} from "@src/recoils/User";
import {produce} from "immer";
import {UserSearchConditionDivision, UserSearchConditionTarget} from "@src/types/User";
import {SubmitHandler, useForm} from "react-hook-form";

export const SearchCondition = () => {
  const [searchState, setSearchState] = useRecoilState(userSearchState);
  type FormType = {
    target: UserSearchConditionTarget;
    keyword: string;
    division: UserSearchConditionDivision;
    enabled: string;
    pageSize: number;
    exact: string;
  }

  const {register, handleSubmit, watch} = useForm<FormType>({
    defaultValues: {
      ...searchState,
      enabled: '',
      exact: 'true',
    },
  });

  const watchTarget = watch("target");

  const onSubmit: SubmitHandler<FormType> = (data) => {
    setSearchState(produce((draft) => {
      draft.pageNum = 0;
      draft.pageSize = data.pageSize;
      draft.target = data.target as UserSearchConditionTarget;
      draft.keyword = data.keyword;
      draft.division = data.division as UserSearchConditionDivision;
      draft.enabled = data.enabled === '' ? undefined : data.enabled === 'true';
      draft.exact = data.exact === 'true';
      console.log('draft', draft);
    }));
  };

  return (
    <div className="search-bx">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="search-bx-01">
          <label>검색어</label>
          <select {...register("target")}>
            <option value="">선택</option>
            <option value="username">아이디</option>
            <option value="name">사용자명</option>
            <option value="unit">소속부대</option>
          </select>
          {
            watchTarget === 'unit'
              ?
              <select {...register("division")}>
                <option value="army">육군</option>
                <option value="navy">해군</option>
                <option value="airforce">공군</option>
                <option value="marines">해병</option>
                <option value="personnel">국직</option>
              </select>
              :
              <>
                <select {...register("exact")}>
                  <option value="true">일치</option>
                  <option value="false">포함</option>
                </select>
              </>
          }
          <input type="text" className="" {...register("keyword")}/>
        </div>
        <div className="search-bx-02">
          <label>상태</label>
          <select {...register("enabled")}>
            <option value="">전체</option>
            <option value="true">사용중</option>
            <option value="false">사용중지</option>
          </select>
        </div>
        {/* <div className="search-bx-01">
                <label className="cboth">가입일</label> 
                <input type="date" /><span className="txt">~</span><input type="date" />
            </div> */}
        <div className="search-bx-02">
          <label>표시개수</label>
          <select {...register("pageSize")}>
            <option value={10}>10개씩</option>
            <option value={50}>50개씩</option>
            <option value={100}>100개씩</option>
          </select>
        </div>
        <button type="submit" className="btn-search">검색</button>
      </form>
    </div>
  )
}
