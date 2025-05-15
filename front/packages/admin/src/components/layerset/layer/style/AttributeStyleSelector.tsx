import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedAssetState } from '@src/recoils/LayerStyle';
import { Maybe, PreviewColumnsQuery, RuleStyleInput, Scalars } from '@mnd/shared/src/types/layerset/gql/graphql';
import {useFetchRules} from "@src/hooks/useFetchRules";

interface AttributeStyleSelectorProps {
  attributeData?: PreviewColumnsQuery;
  style: Maybe<Scalars['JSON']['output']>;
  handleChangeContext: (key: string, value: string | number | boolean) => void;
}

const AttributeStyleSelector = ({ attributeData, style }: AttributeStyleSelectorProps) => {
  const assetName = useRecoilValue(selectedAssetState)?.properties?.layer?.name;
  const options = attributeData?.previewColumns?.map(col => ({ label: col.field, value: col.field })) ?? [];

  const defaultAttribute = style?.attribute?.attribute ?? options[0]?.value;
  const [selectedAttribute, setSelectedAttribute] = useState(defaultAttribute);
  const [ruleStyles, setRuleStyles] = useState<RuleStyleInput[]>([]);
  const [comparisonType, setComparisonType] = useState<'eq' | 'ge_lt' | 'gt_le'>('ge_lt');

  useFetchRules(assetName, selectedAttribute, style, setComparisonType, setRuleStyles);

  const handleMinChange = (index: number, value: string) => {
    const updated = [...ruleStyles];
    updated[index].rule.ge = value;
    updated[index].rule.gt = value;
    if (index > 0) {
      updated[index - 1].rule.le = value;
      updated[index - 1].rule.lt = value;
    }
    setRuleStyles(updated);
  };

  const handleMaxChange = (index: number, value: string) => {
    const updated = [...ruleStyles];
    updated[index].rule.le = value;
    updated[index].rule.lt = value;
    if (index + 1 < updated.length) {
      updated[index + 1].rule.ge = value;
      updated[index + 1].rule.gt = value;
    }
    setRuleStyles(updated);
  };

  const handleColorChange = (index: number, color: string) => {
    const updated = [...ruleStyles];
    updated[index].style.point.fillColor = color;
    updated[index].style.polygon.fillColor = color;
    updated[index].style.line.strokeColor = color;
    setRuleStyles(updated);
  };

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
        point: { fillColor: '#000' },
        polygon: { fillColor: '#000' },
        line: { strokeColor: '#000' },
      }
    };
    const updated = [...ruleStyles];
    updated.splice(updated.length - 1, 0, newRule);
    setRuleStyles(updated);
  };

  const renderRangeRuleRow = (ruleStyle: RuleStyleInput, index: number) => {
    const min = ruleStyle.rule.ge ?? ruleStyle.rule.gt ?? '';
    const max = ruleStyle.rule.le ?? ruleStyle.rule.lt ?? '';
    const color = ruleStyle.style.point.fillColor ?? '#000000';

    return (
      <div className="rule-row" key={index}>
        <input type="number" value={min} disabled={index === 0} step={1}
               onChange={(e) => handleMinChange(index, e.target.value)}/>
        ~
        <input type="number" value={max} disabled={index === ruleStyles.length - 1} step={1}
               onChange={(e) => handleMaxChange(index, e.target.value)}/>
        <input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)}/>
        {index !== 0 && index !== ruleStyles.length - 1 && (
          <button onClick={() => handleDeleteRule(index)}>삭제</button>
        )}
      </div>
    );
  };

  const renderEqualRuleRow = (ruleStyle: RuleStyleInput, index: number) => {
    const eq = ruleStyle.rule.eq ?? '';
    const color = ruleStyle.style.point.fillColor ?? '#000000';
    if (index === 0) return null;
    return (
      <div className="rule-row" key={index}>
        <input type="text" value={eq} disabled/>
        <input type="color" value={color} onChange={(e) => handleColorChange(index, e.target.value)}/>
      </div>
    );
  };

  return (
    <div className="attribute-style-container" >
      <select value={selectedAttribute} onChange={(e) => setSelectedAttribute(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {comparisonType !== 'eq' ? (
        <>
          <select value={comparisonType} onChange={(e) => setComparisonType(e.target.value as any)}>
            <option value="ge_lt">최소값 포함</option>
            <option value="gt_le">최대값 포함</option>
          </select>

          <div className="add-rule-button">
            <button onClick={handleAddRule}>+ Rule 추가</button>
          </div>

          {ruleStyles.map(renderRangeRuleRow)}
        </>
      ) : (
        <>
        {ruleStyles.map(renderEqualRuleRow)}
        </>
      )}
    </div>
  );
};

export default AttributeStyleSelector;