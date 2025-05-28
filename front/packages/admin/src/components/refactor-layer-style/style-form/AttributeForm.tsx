import React, {useEffect, useState} from 'react';
import {useRecoilState, useRecoilValue} from "recoil";
import {editingStyleState, remoteAssetDataState} from "@src/recoils/LayerStyle";
import {
  PreviewColumnsQuery,
  AttributeStyleInput, RuleStyleInput
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleSelectRow} from "@src/components/layerset/layer/style/StyleSelectRow";
import {fetchRulesFromServer} from "@src/utils/layer/fetchRulesFromServer";
import {useApolloClient} from "@apollo/client";
import RuleTable from "@src/components/layer-style/style-form/RuleTable";
import {toast} from "react-toastify";
import {AttributeType} from "@src/components/refactor-layer-style/mapStyleToCompleteStyleType";
import AttributePointForm from "@src/components/refactor-layer-style/style-form/attribute/AttributePointForm";
import AttributeLineForm from "@src/components/refactor-layer-style/style-form/attribute/AttributeLineForm";
import AttributePolygonForm from "@src/components/refactor-layer-style/style-form/attribute/AttributePolygonForm";

interface AttributeFormProps {
  attributes: PreviewColumnsQuery;
}

const AttributeForm = ({attributes}: AttributeFormProps) => {
  const remoteAsset = useRecoilValue(remoteAssetDataState);
  const assetName = remoteAsset?.featureType?.nativeName;
  const client = useApolloClient();
  const [editingStyle, setEditingStyle] = useRecoilState(editingStyleState);
  const attributeRules = editingStyle?.context?.attribute?.rules ?? [];
  const initAttributeInnerType = attributeRules?.[1]?.style?.["@type"];
  const initComparisonType = attributeRules?.[1]?.rule?.eq ? "eq" : attributeRules?.[1]?.rule.gt ? "gt_le" : "ge_lt";
  const [innerType, setInnerType] = useState<AttributeType>(initAttributeInnerType ?? AttributeType.PointStyle);
  const [ruleStyles, setRuleStyles] = useState<RuleStyleInput[]>(attributeRules);
  const [comparisonType, setComparisonType] = useState<'eq' | 'ge_lt' | 'gt_le'>(initComparisonType);

  const attribute = editingStyle?.context?.attribute;

  useEffect(() => {
    const updatedRules = editingStyle.context.attribute.rules?.map(rule => ({
      ...rule,
      '@type': innerType,
    }));
    console.log("updatedRules", updatedRules)
    if (updatedRules) {
      handleAttributeChange("rules", updatedRules);
    }
  }, [innerType]);

  useEffect(() => {
    handleAttributeChange("rules", ruleStyles);
  }, [ruleStyles]);

  const handleAttributeChange = <K extends keyof AttributeStyleInput>(key: K, value: AttributeStyleInput[K]) => {
    const updated = {
      ...editingStyle,
      context: {
        ...editingStyle.context,
        attribute: {
          ...editingStyle.context.attribute,
          [key]: value,
        },
      },
    };
    setEditingStyle(updated);
  }

  const split = async () => {
    if (!assetName || !attribute?.attribute) return;
    try {
      const { rules, comparisonType } = await fetchRulesFromServer(client, assetName, attribute.attribute, editingStyle.context, innerType);

      setComparisonType(comparisonType);
      setRuleStyles(rules);
    } catch (e) {
      toast.error(`${e}`);
      setRuleStyles([]);
    }
  };

  const handleDeleteRule = (index: number) => {
    const updated = ruleStyles.map(rule => ({
      ...rule,
      rule: { ...rule.rule } // 깊은 복사
    }));

    updated.splice(index, 1);

    if (index > 0 && index < updated.length) {
      const prev = updated[index - 1];
      const next = updated[index];
      const connect = prev.rule.le ?? prev.rule.lt;

      // 깊은 복사된 객체이므로 수정 가능
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

  return (
    <div>

      <div className="style-type-button-group">
        <button
          className={innerType === AttributeType.PointStyle ? 'selected' : ''}
          onClick={() => setInnerType(AttributeType.PointStyle)}
        >
          Point
        </button>
        <button
          className={innerType === AttributeType.LineStyle ? 'selected' : ''}
          onClick={() => setInnerType(AttributeType.LineStyle)}
        >
          Line
        </button>
        <button
          className={innerType === AttributeType.PolygonStyle ? 'selected' : ''}
          onClick={() => setInnerType(AttributeType.PolygonStyle)}
        >
          Polygon
        </button>
      </div>
      <div className={innerType === AttributeType.PointStyle ? "" : "none"}>
        <AttributePointForm
          ruleStyles={ruleStyles}
          setRuleStyles={setRuleStyles}
          attributes={attributes}
        />
      </div>
      <div className={innerType === AttributeType.LineStyle ? "" : "none"}>
        <AttributeLineForm
          ruleStyles={ruleStyles}
          setRuleStyles={setRuleStyles}
          attributes={attributes}
        />
      </div>
      <div className={innerType === AttributeType.PolygonStyle ? "" : "none"}>
        <AttributePolygonForm
          ruleStyles={ruleStyles}
          setRuleStyles={setRuleStyles}
          attributes={attributes}
        />
      </div>
      <StyleSelectRow
        title="속성"
        value={attribute.attribute}
        onChange={val => handleAttributeChange("attribute", val)}
        options={attributes.previewColumns.map((data) => {
          return {label: data.field, value: data.field}
        })}
      />
      {attribute.attribute && (
        <>
          <button onClick={split}>분리</button>
          {
            ruleStyles.length > 0 && (
              <>
                <RuleTable
                  ruleStyles={ruleStyles}
                  comparisonType={comparisonType}
                  setRuleStyles={setRuleStyles}
                  handleDeleteRule={handleDeleteRule}
                />
                <div className="add-rule-button">
                  <button onClick={handleAddRule}>+ Rule 추가</button>
                </div>
              </>
            )
          }

        </>
      )}
    </div>
  );
};

export default AttributeForm;