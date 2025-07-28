import {Dispatch, SetStateAction} from "react";
import {PreviewColumnsQuery} from "@mnd/shared/src/types/layerset/gql/graphql.ts";
import {SearchCondition} from "@/types/PrintArea.ts";

interface Props {
  previewData: PreviewColumnsQuery;
  searchKey?: string;
  setSearchCondition: Dispatch<SetStateAction<SearchCondition>>;
}

const FieldSelector = ({ previewData, searchKey, setSearchCondition }: Props) => {

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
            setSearchCondition( prev => ({
              ...prev,
              key: selectedField,
              isString: selected.isString ?? false
            }));
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
