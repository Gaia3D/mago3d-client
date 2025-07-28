import React from "react";
import {PreviewColumnsQuery} from "@mnd/shared/src/types/layerset/gql/graphql.ts";

interface Props {
  previewData: PreviewColumnsQuery;
  searchKey?: string;
  onChange: (key: string, isString: boolean) => void;
}

const FieldSelector = ({ previewData, searchKey, onChange }: Props) => {

  const fields = previewData.previewColumns?.map(p => ({ field: p?.field, isString: p?.isString }));

  return (
    <div className="content-row">
      <div className="content-title">검색 필드</div>
      <select
        className="content-value"
        name="field-selector"
        value={searchKey ?? ""}
        onChange={(e) => {
          const selectedField = e.target.value;
          const selected = fields?.find((f) => f.field === selectedField);
          if (selected?.field) {
            onChange(selected.field, selected.isString ?? false);
          }
        }}
      >
        <option value="" hidden>검색 필드 선택</option>
        {fields?.map(({ field }) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FieldSelector;
