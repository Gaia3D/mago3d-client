import React from "react";
import {PreviewColumnsQuery} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

interface Props {
  previewData: PreviewColumnsQuery;
  searchKey?: string;
  onChange: (key?: string) => void;
}

const FieldSelector = ({ previewData, searchKey, onChange }: Props) => {

  const fields = previewData.previewColumns?.map(p => p?.field);

  return (
    <select
      className="content-value"
      name="field-selector"
      value={searchKey ?? ""}
      onChange={(e) => onChange(e.target.value || undefined)}
    >
      <option value="" hidden>2. 검색 필드 선택</option>
      {fields?.map((field) => (
        <option key={field} value={field}>
          {field}
        </option>
      ))}
    </select>
  );
};

export default FieldSelector;
