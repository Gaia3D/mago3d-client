import React, { Dispatch, SetStateAction } from 'react';
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
                     handleDeleteRule,
                   }: RuleTableProps) => {
  const handleMinChange = (index: number, value: string) => {
    const updated = ruleStyles.map((rule, i) => {
      if (i === index) {
        return {
          ...rule,
          rule: {
            ...rule.rule,
            ge: value,
            gt: value,
          },
        };
      }
      if (i === index - 1) {
        return {
          ...rule,
          rule: {
            ...rule.rule,
            le: value,
            lt: value,
          },
        };
      }
      return rule;
    });

    setRuleStyles(updated);
  };

  const handleMaxChange = (index: number, value: string) => {
    const updated = ruleStyles.map((rule, i) => {
      if (i === index) {
        return {
          ...rule,
          rule: {
            ...rule.rule,
            le: value,
            lt: value,
          },
        };
      }
      if (i === index + 1) {
        return {
          ...rule,
          rule: {
            ...rule.rule,
            ge: value,
            gt: value,
          },
        };
      }
      return rule;
    });

    setRuleStyles(updated);
  };

  const handleColorChange = (index: number, color: string) => {
    const updated = ruleStyles.map((rule, i) => {
      if (i === index) {
        return {
          ...rule,
          style: {
            ...rule.style,
            point: {
              ...rule.style.point,
              fillColor: color,
            },
            polygon: {
              ...rule.style.polygon,
              fillColor: color,
            },
            line: {
              ...rule.style.line,
              strokeColor: color,
            },
          },
        };
      }
      return rule;
    });

    setRuleStyles(updated);
  };

  const handleAliasChange = (index: number, alias: string) => {
    const updated = ruleStyles.map((rule, i) =>
      i === index ? { ...rule, alias } : rule
    );

    setRuleStyles(updated);
  };

  const renderRangeRuleRow = (ruleStyle: RuleStyleInput, index: number) => {
    const min = ruleStyle.rule.ge ?? ruleStyle.rule.gt ?? '';
    const max = ruleStyle.rule.le ?? ruleStyle.rule.lt ?? '';
    const color = ruleStyle.style.point?.fillColor ?? '#000000';
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
    if (index === 0) return null;
    const eq = ruleStyle.rule.eq ?? '';
    const color = ruleStyle.style.point?.fillColor ?? '#000000';
    const alias = ruleStyle.alias ?? '';

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
