import {SearchCondition} from "@/types/PrintArea.ts";
import DebouncedInput from "@/components/common/DebouncedInput.tsx";
import React, {Dispatch, SetStateAction} from "react";

interface Props {
  searchCondition: SearchCondition;
  setSearchCondition: Dispatch<SetStateAction<SearchCondition>>;
}

const SearchInputCondition = ({ searchCondition, setSearchCondition }: Props) => {
  return (
    <div className="content-row">
      <div className="content-title">검색어</div>
      <select
        className="criteria-select"
        value={searchCondition.criteria}
        onChange={(e) => setSearchCondition( prev => ({
          ...prev,
          criteria: e.target.value as "eq" | "contains",
        }))}
      >
        <option value="eq">일치</option>
        {searchCondition.isString && <option value="contains">포함</option>}
      </select>
      <DebouncedInput
        value={searchCondition.keyword}
        onDebounce={(v) => setSearchCondition( prev => ({
          ...prev,
          keyword: v
        }))}
        placeholder="검색어 입력"
        className="keyword-input"
      />
    </div>
  );
};

export default SearchInputCondition;