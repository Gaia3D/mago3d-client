import React from 'react';
import {
  AttributeType,
  ComparisonType,
  EditableContextModel,
  EditableRuleStyle,
} from '@src/layer-style/models/EditableContextModel';
import { PreviewColumn } from '@mnd/shared/src/types/layerset/gql/graphql';
import StyleTypeSelector from '@src/layer-style/components/vector/style-form/StyleTypeSelector';
import PointFormField from '@src/layer-style/components/fields/PointFormField';
import LineFormField from '@src/layer-style/components/fields/LineFormField';
import PolygonFormField from '@src/layer-style/components/fields/PolygonFormField';
import { FieldRow } from '@src/layer-style/components/fields/FieldRow';
import { useRecoilValue } from 'recoil';
import { remoteAssetDataState } from '@src/layer-style/recoils/layerStyle';
import { toast } from 'react-toastify';
import { ApiProvider } from '@src/layer-style/api/ApiProvider';
import { AttributeType as GqlAttributeType } from '@src/generated/gql/layerset/graphql';
import RuleTable from "@src/layer-style/components/fields/rule/RuleTable";

interface AttributeFormFieldProps {
  context: EditableContextModel;
  onChange: <K extends keyof EditableContextModel>(
    field: K,
    value: EditableContextModel[K]
  ) => void;
  attributes?: PreviewColumn[];
}

const ATTRIBUTE_TYPES: AttributeType[] = [
  AttributeType.POINT,
  AttributeType.LINE,
  AttributeType.POLYGON,
];

const AttributeFormField = ({
    context,
    onChange,
    attributes,
  }: AttributeFormFieldProps) => {
  const remoteAsset = useRecoilValue(remoteAssetDataState);

  const classify = async () => {
    if (!context.attribute) { toast.warning('속성을 선택해주세요.'); return; }

    const assetName = remoteAsset?.featureType?.nativeName;
    if (!assetName) { toast.warning('해당 에셋은 분류할 수 없습니다.'); return; }

    try {
      const classifyAttribute = await ApiProvider.layer.getClassifyAttribute(
        context.attribute,
        assetName
      );

      if (classifyAttribute.type === GqlAttributeType.String) {
        onChange('comparisonType', ComparisonType.EQ);
      } else if (classifyAttribute.type === GqlAttributeType.Number) {
        onChange('comparisonType', ComparisonType.GE_LT);
      } else {
        toast.error('지원되지 않는 속성 타입입니다.');
        return;
      }

      const newRules: EditableRuleStyle[] = classifyAttribute.rules.map(rule => ({
        alias: "",
        eq: rule.eq,
        ge: rule.min,
        gt: rule.min,
        le: rule.max,
        lt: rule.max,
        attributeColor: rule.color,
        attributeOpacity: 1,
      }));
      onChange('rules', newRules);
    } catch (err) {
      console.error(err);
      toast.error('지원되지 않는 속성 타입입니다.');
    }
  };

  return (
    <>
      <StyleTypeSelector
        selectedType={context.attributeType}
        onSelectType={type => onChange('attributeType', type)}
        types={ATTRIBUTE_TYPES}
      />

      {context.attributeType === AttributeType.POINT && (
        <PointFormField context={context} onChange={onChange} attributes={attributes}/>
      )}
      {context.attributeType === AttributeType.LINE && (
        <LineFormField context={context} onChange={onChange} attributes={attributes}/>
      )}
      {context.attributeType === AttributeType.POLYGON && (
        <PolygonFormField context={context} onChange={onChange} attributes={attributes}/>
      )}
      <div className="attribute-classify-row">
        <FieldRow
          id="attribute"
          label="속성"
          type="select"
          value={context.attribute}
          onChange={value => onChange('attribute', value)}
          options={attributes?.map(attr => ({value: attr.field, label: attr.field}))}
        />
        <button
          className="classify-button"
          onClick={classify}
          disabled={!context.attribute}
          title={!context.attribute ? "속성을 선택해야 분류할 수 있습니다." : undefined}
        >
          분류
        </button>
      </div>
      {context.rules.length > 0 && (
        <div className="inner-body">
          <RuleTable
            context={context}
            onChange={onChange}
          />
        </div>
      )}
    </>
  );
};

export default AttributeFormField;
