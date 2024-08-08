import {useRecoilState} from "recoil";
import {userSearchState} from "@src/recoils/User";
import {produce} from "immer";
import {UserSearchConditionDivision, UserSearchConditionTarget} from "@src/types/User";
import {SubmitHandler, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

export const SearchCondition = () => {
  const {t} = useTranslation();
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
          <label>{t("search-word")}</label>
          <select {...register("target")}>
            <option value="">{t("select")}</option>
            <option value="username">{t("user-id")}</option>
            <option value="name">{t("user-name")}</option>
            <option value="unit">{t("division-unit")}</option>
          </select>
          {
            watchTarget === 'unit'
              ?
              <select {...register("division")}>
                <option value="army">{t("army")}</option>
                <option value="navy">{t("navy")}</option>
                <option value="airforce">{t("airforce")}</option>
                <option value="marines">{t("marines")}</option>
                <option value="personnel">{t("personnel")}</option>
              </select>
              :
              <>
                <select {...register("exact")}>
                  <option value="true">{t("equals")}</option>
                  <option value="false">{t("contains")}</option>
                </select>
              </>
          }
          <input type="text" className="" {...register("keyword")}/>
        </div>
        <div className="search-bx-02">
          <label>{t("state")}</label>
          <select {...register("enabled")}>
            <option value="">{t("all")}</option>
            <option value="true">{t("using")}</option>
            <option value="false">{t("stop-using")}</option>
          </select>
        </div>
        {/* <div className="search-bx-01">
                <label className="cboth">가입일</label> 
                <input type="date" /><span className="txt">~</span><input type="date" />
            </div> */}
        <div className="search-bx-02">
          <label>{t("display-count")}</label>
          <select {...register("pageSize")}>
            <option value={10}>{t("10-each")}</option>
            <option value={50}>{t("50-each")}</option>
            <option value={100}>{t("100-each")}</option>
          </select>
        </div>
        <button type="submit" className="btn-search">{t("search")}</button>
      </form>
    </div>
  )
}
