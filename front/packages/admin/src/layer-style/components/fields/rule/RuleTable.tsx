import React from 'react';
import { ComparisonType, EditableContextModel } from '@src/layer-style/models/EditableContextModel';
import { FieldRow } from '@src/layer-style/components/fields/FieldRow';
import EQRuleTable from './EQRuleTable';
import RangeRuleTable from './RangeRuleTable';

interface RuleTableProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(field: K, value: EditableContextModel[K]) => void;
}

const RuleTable = ({ context, onChange }: RuleTableProps) => {
  return (
    <div className="rule-table-wrapper">
      {(context.comparisonType === ComparisonType.GE_LT ||
        context.comparisonType === ComparisonType.GT_LE) && (
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
            { value: 'GE_LT', label: '최소값 포함' },
            { value: 'GT_LE', label: '최대값 포함' },
          ]}
        />
      )}

      {context.comparisonType === ComparisonType.EQ ? (
        <EQRuleTable context={context} onChange={onChange} />
      ) : (
        <RangeRuleTable context={context} onChange={onChange} />
      )}
    </div>
  );
};

export default RuleTable;
