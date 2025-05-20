import React, {useEffect, useState} from 'react';
import {Maybe, PreviewColumnsQuery, RuleStyleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useRecoilValue} from "recoil";
import {remoteAssetDataState} from "@src/recoils/LayerStyle";
import {useFetchRules} from "@src/hooks/useFetchRules";
import RuleTable from "@src/components/layer-style/style-form/RuleTable";
import {StyleContextType} from "@src/types/StyleContext";

interface AttributeFormProps {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: <K extends keyof StyleContextType>(key: K, value: StyleContextType[K]) => void;
  attributeData: PreviewColumnsQuery;
}

const AttributeSelector = ({ctx, handleChangeContext, attributeData}: AttributeFormProps) => {
  const remoteAsset = useRecoilValue(remoteAssetDataState);
  const assetName = remoteAsset?.featureType?.nativeName;
  const previewColumns = attributeData?.previewColumns;
  const options = previewColumns?.map(col => ({ label: col.field, value: col.field })) ?? [];
  const [selectedAttribute, setSelectedAttribute] = useState(ctx.attribute ?? '');
  const [ruleStyles, setRuleStyles] = useState<RuleStyleInput[]>([]);
  const [comparisonType, setComparisonType] = useState<'eq' | 'ge_lt' | 'gt_le'>('ge_lt');

  useFetchRules(assetName, selectedAttribute, ctx, setComparisonType, setRuleStyles);

  const handleDeleteRule = (index: number) => {
    const updated = [...ruleStyles];
    updated.splice(index, 1);
    if (index > 0 && index < updated.length) {
      const prev = updated[index - 1];
      const next = updated[index];
      const connect = prev.rule.le ?? prev.rule.lt;
      next.rule.ge = connect;
      next.rule.gt = connect;
    }
    setRuleStyles(updated);
  };

  const handleAddRule = () => {
    if (ruleStyles.length < 2) return;
    const last = ruleStyles.at(-1)!;
    const newRule: RuleStyleInput = {
      rule: {
        ge: last.rule.ge,
        gt: last.rule.gt,
        le: last.rule.ge,
        lt: last.rule.gt
      },
      style: {
        point: { fillColor: '#000000' },
        polygon: { fillColor: '#000000' },
        line: { strokeColor: '#000000' },
      }
    };
    const updated = [...ruleStyles];
    updated.splice(updated.length - 1, 0, newRule);
    setRuleStyles(updated);
  };

  useEffect(() => {
    console.log("selectedAttribute", selectedAttribute);
    handleChangeContext("attribute", selectedAttribute);
    // handleChangeContext("attributeName", selectedAttribute);
  }, [selectedAttribute]);

  // useEffect(() => {
  //   console.log("comparisonType", comparisonType);
  //   handleChangeContext("attributeType", comparisonType === "eq" ? "String" : "Number");
  // }, [comparisonType]);

  useEffect(() => {
    console.log("ruleStyles", ruleStyles);
    // TODO 최신브라우저 아니면 에러발생하니 추후 수정
    handleChangeContext("rules", structuredClone(ruleStyles));
  }, [ruleStyles]);

  if (attributeData?.previewColumns?.length <= 0) return;

  return (
    <div className="attribute-style-container">
      <select value={selectedAttribute} onChange={(e) => setSelectedAttribute(e.target.value)}>
        <option value={''} hidden>속성 선택</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <RuleTable
        ruleStyles={ruleStyles}
        comparisonType={comparisonType}
        setRuleStyles={setRuleStyles}
        handleDeleteRule={handleDeleteRule}
      />
      <div className="add-rule-button">
        <button onClick={handleAddRule}>+ Rule 추가</button>
      </div>
    </div>
  );
};

export default AttributeSelector;