import {SearchCondition} from "@/types/PrintArea.ts";
import DebouncedInput from "@/components/common/DebouncedInput.tsx";
import React from "react";

interface Props {
  isString: boolean;
  criteria: "eq" | "contains";
  keyword: string;
  onChange: (patch: Partial<SearchCondition>) => void;
}

const SearchInputCondition = ({ isString, criteria, keyword, onChange }: Props) => {
  return (
    <div className="content-row">
      <div className="content-title">검색어</div>
      <select
        className="criteria-select"
        value={criteria}
        onChange={(e) => onChange({criteria: e.target.value as "eq" | "contains"})}
      >
        <option value="eq">일치</option>
        {isString && <option value="contains">포함</option>}
      </select>
      <DebouncedInput
        value={keyword}
        onDebounce={(v) => onChange({keyword: v})}
        placeholder="검색어 입력"
        className="keyword-input"
      />
    </div>
  );
};

export default SearchInputCondition;