import React from 'react';
import {FieldRow} from "@src/layer-style/components/fields/FieldRow";
import {ComparisonType, EditableContextModel, EditableRuleStyle} from "@src/layer-style/models/EditableContextModel";
import {FieldCell} from "@src/layer-style/components/fields/FieldCell";

interface RuleTableProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(
    field: K,
    value: EditableContextModel[K]
  ) => void;
}

const RuleTable = ({context, onChange}: RuleTableProps) => {
  return (
    <div className="rule-table-wrapper">
      {(context.comparisonType === ComparisonType.GE_LT ||
        context.comparisonType === ComparisonType.GT_LE) &&
        <FieldRow
          id="comparisonType"
          label="분류 형식"
          type="select"
          value={context.comparisonType}
          onChange={value =>
            onChange(
              'comparisonType',
              value === 'GE_LT' ? ComparisonType.GE_LT : ComparisonType.GT_LE
            )
          }
          options={[
            {value: 'GE_LT', label: '최소값 포함'},
            {value: 'GT_LE', label: '최대값 포함'},
          ]}
        />
      }

      <table className="rule-table">
        <thead>
        <tr>
          {context.comparisonType === ComparisonType.EQ ? (
            <>
              <th>속성 값</th>
              <th>색상</th>
              <th>투명도</th>
              <th>속성 명</th>
            </>
          ) : (
            <>
              <th>최소 {context.comparisonType === ComparisonType.GE_LT && "(포함)"}</th>
              <th>최대 {context.comparisonType === ComparisonType.GT_LE && "(포함)"}</th>
              <th>색상</th>
              <th>투명도</th>
              <th>속성 명</th>
            </>
          )}
        </tr>
        </thead>
        <tbody>
        {context.rules.map((rule, idx) => {
          const updateRule = (updated: Partial<EditableRuleStyle>) => {
            const updatedRules = [...context.rules];
            updatedRules[idx] = {...updatedRules[idx], ...updated};
            onChange('rules', updatedRules);
          };

          const updateRuleMulti = (updates: Partial<EditableRuleStyle>) => {
            const updatedRules = [...context.rules];
            updatedRules[idx] = { ...updatedRules[idx], ...updates };
            onChange('rules', updatedRules);
          };

          return (
            <tr key={idx}>
              {context.comparisonType === ComparisonType.EQ ? (
                <>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-eq`}
                      type="text"
                      value={rule.eq}
                      onChange={value => updateRule({eq: value})}
                      placeholder="속성 값"
                    />
                  </td>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-color`}
                      type="color"
                      value={rule.attributeColor}
                      onChange={value => updateRule({attributeColor: value})}
                    />
                  </td>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-opacity`}
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={rule.attributeOpacity}
                      onChange={value => updateRule({attributeOpacity: value})}
                    />
                  </td>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-alias`}
                      type="text"
                      value={rule.alias}
                      onChange={value => updateRule({alias: value})}
                      placeholder="속성 명"
                    />
                  </td>
                </>
              ) : (
                <>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-min`}
                      type="text"
                      value={rule.ge}
                      onChange={value => {
                        updateRuleMulti({ ge: value, gt: value });
                      }}
                    />
                  </td>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-max`}
                      type="text"
                      value={rule.le}
                      onChange={value => {
                        updateRuleMulti({ le: value, lt: value });
                      }}
                    />
                  </td>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-color`}
                      type="color"
                      value={rule.attributeColor}
                      onChange={value => updateRule({attributeColor: value})}
                    />
                  </td>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-opacity`}
                      type="number"
                      min={0}
                      max={1}
                      step={0.01}
                      value={rule.attributeOpacity}
                      onChange={value => updateRule({attributeOpacity: value})}
                    />
                  </td>
                  <td>
                    <FieldCell
                      id={`rule-${idx}-alias`}
                      type="text"
                      value={rule.alias}
                      onChange={value => updateRule({alias: value})}
                      placeholder="속성 명"
                    />
                  </td>
                </>
              )}
            </tr>
          );
        })}
        </tbody>
      </table>
    </div>
  );
};

export default RuleTable;