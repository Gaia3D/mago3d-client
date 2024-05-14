import { debounceKeywordState } from "@/recoils/SearchState";
import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useDebounce } from "use-debounce";

interface SearchFormProps {
  value?: string;
  onSearch: (keyword: string) => void;
}

export const SearchForm = ({ value, onSearch }: SearchFormProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedValue] = useDebounce(searchKeyword, 500);
  const setDebounceKeyword = useSetRecoilState(debounceKeywordState);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);
  };

  useEffect(() => {
    setDebounceKeyword(debouncedValue);
  }, [debouncedValue]);
  return (
      <input type="text" className="aside-searh-type boxShadow-basic" placeholder="검색어를 입력하세요." defaultValue={value??''} onChange={handleChange}/>
  );
};
