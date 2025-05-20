import React, {Dispatch, SetStateAction} from 'react';
import { RuleStyleInput } from "@mnd/shared/src/types/layerset/gql/graphql";

interface RuleTableProps {
  ruleStyles: RuleStyleInput[];
  comparisonType: 'eq' | 'ge_lt' | 'gt_le';
  setRuleStyles: Dispatch<SetStateAction<RuleStyleInput[]>>;
  handleDeleteRule: (index: number) => void;
}

const RuleTable = ({
                     ruleStyles,
                     comparisonType,
                     setRuleStyles,
                     handleDeleteRule
                   }: RuleTableProps) => {

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

  const handleAliasChange = (index: number, alias: string) => {
    const updated = [...ruleStyles];
    updated[index].alias = alias;
  }

  const renderRangeRuleRow = (ruleStyle: RuleStyleInput, index: number) => {
    const min = ruleStyle.rule.ge ?? ruleStyle.rule.gt ?? '';
    const max = ruleStyle.rule.le ?? ruleStyle.rule.lt ?? '';
    const color = ruleStyle.style.point.fillColor ?? '#000000';
    const alias = ruleStyle.alias ?? '';

    return (
      <tr key={index}>
        <td>
          <input
            type="number"
            value={min}
            disabled={index === 0}
            step={1}
            onChange={(e) => handleMinChange(index, e.target.value)}
          />
        </td>
        <td>
          <input
            type="number"
            value={max}
            disabled={index === ruleStyles.length - 1}
            step={1}
            onChange={(e) => handleMaxChange(index, e.target.value)}
          />
        </td>
        <td>
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(index, e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={alias}
            onChange={(e) => handleAliasChange(index, e.target.value)}
          />
        </td>
        <td>
          {index !== 0 && index !== ruleStyles.length - 1 && (
            <button onClick={() => handleDeleteRule(index)}>삭제</button>
          )}
        </td>
      </tr>
    );
  };

  const renderEqualRuleRow = (ruleStyle: RuleStyleInput, index: number) => {
    const eq = ruleStyle.rule.eq ?? '';
    const color = ruleStyle.style.point.fillColor ?? '#000000';
    const alias = ruleStyle.alias ?? '';

    if (index === 0) return null;
    return (
      <tr key={index}>
        <td>
          <input type="text" value={eq} disabled />
        </td>
        <td>
          <input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(index, e.target.value)}
          />
        </td>
        <td>
          <input
            type="text"
            value={alias}
            onChange={(e) => handleAliasChange(index, e.target.value)}
          />
        </td>
      </tr>
    );
  };

  return (
    <div className="table-wrapper">
      <table className="rule-table">
        <thead>
        <tr>
          {comparisonType === 'eq' ? (
            <>
              <th>값</th>
              <th>색상</th>
              <th>Alias</th>
            </>
          ) : (
            <>
              <th>최소</th>
              <th>최대</th>
              <th>색상</th>
              <th>Alias</th>
              <th>삭제</th>
            </>
          )}
        </tr>
        </thead>
        <tbody>
        {ruleStyles.map(comparisonType === 'eq' ? renderEqualRuleRow : renderRangeRuleRow)}
        </tbody>
      </table>
    </div>
  );
};

export default RuleTable;
