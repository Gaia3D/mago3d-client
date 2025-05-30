import React from 'react';
import { EditableContextModel, EditableRuleStyle } from '@src/layer-style/models/EditableContextModel';
import { FieldCell } from '@src/layer-style/components/fields/rule/FieldCell';

interface Props {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
}

const EQRuleTable = ({ context, onChange }: Props) => {
  return (
    <table className="rule-table">
      <thead>
      <tr>
        <th>속성 값</th>
        <th>색상</th>
        <th>투명도</th>
        <th>속성 명</th>
      </tr>
      </thead>
      <tbody>
      {context.rules.map((rule, idx) => {
        const updateRule = (updated: Partial<EditableRuleStyle>) => {
          const updatedRules = [...context.rules];
          updatedRules[idx] = { ...updatedRules[idx], ...updated };
          onChange('rules', updatedRules);
        };

        return (
          <tr key={idx}>
            <td>
              <FieldCell
                id={`rule-${idx}-eq`}
                type="text"
                value={rule.eq}
                onChange={value => updateRule({ eq: value })}
                placeholder="속성 값"
              />
            </td>
            <td>
              <FieldCell
                id={`rule-${idx}-color`}
                type="color"
                value={rule.attributeColor}
                onChange={value => updateRule({ attributeColor: value })}
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
                onChange={value => updateRule({ attributeOpacity: value })}
              />
            </td>
            <td>
              <FieldCell
                id={`rule-${idx}-alias`}
                type="text"
                value={rule.alias}
                onChange={value => updateRule({ alias: value })}
                placeholder="속성 명"
              />
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};

export default EQRuleTable;
