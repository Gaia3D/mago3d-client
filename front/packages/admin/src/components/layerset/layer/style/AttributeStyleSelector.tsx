import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { selectedAssetState } from '@src/recoils/LayerStyle';
import { Maybe, PreviewColumnsQuery, RuleStyleInput, Scalars } from '@mnd/shared/src/types/layerset/gql/graphql';
import { useLazyQuery } from '@apollo/client';
import { ClassifyAttributeDocument } from '@src/generated/gql/layerset/graphql';

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

  const [fetchAttributes] = useLazyQuery(ClassifyAttributeDocument);

  useEffect(() => {
    if (style?.attribute?.attribute === selectedAttribute) {
      setRuleStyles(style.attribute.rules ?? []);
    } else if (assetName && selectedAttribute) {
      fetchAttributes({
        variables: { nativeName: assetName, attribute: selectedAttribute }
      }).then(result => {
        const { type, rules } = result.data.classifyAttribute;
        setComparisonType(type === 'STRING' ? 'eq' : 'ge_lt');

        if (!rules || rules.length === 0) {
          setRuleStyles([]);
          return;
        }

        const sortedRules = [...rules].sort((a, b) => parseFloat(a.min) - parseFloat(b.min));
        const newRules: RuleStyleInput[] = [];

        // -무한대 ~ 첫 번째 min
        newRules.push({
          rule: {
            ge: String(Number.NEGATIVE_INFINITY),
            gt: String(Number.NEGATIVE_INFINITY),
            le: sortedRules[0].min,
            lt: sortedRules[0].min
          },
          style: {
            line: { strokeColor: '#000000' },
            point: { fillColor: '#000000' },
            polygon: { fillColor: '#000000' }
          }
        });

        // 각 구간: min ~ next.min
        for (let i = 0; i < sortedRules.length - 1; i++) {
          const curr = sortedRules[i];
          const next = sortedRules[i + 1];
          newRules.push({
            rule: {
              eq: curr.eq,
              ge: curr.min,
              gt: curr.min,
              le: next.min,
              lt: next.min
            },
            style: {
              line: { strokeColor: curr.color },
              point: { fillColor: curr.color },
              polygon: { fillColor: curr.color }
            }
          });
        }

        // 마지막 min ~ 무한대
        const last = sortedRules[sortedRules.length - 1];
        newRules.push({
          rule: {
            eq: last.eq,
            ge: last.min,
            gt: last.min,
            le: String(Number.POSITIVE_INFINITY),
            lt: String(Number.POSITIVE_INFINITY)
          },
          style: {
            line: { strokeColor: last.color },
            point: { fillColor: last.color },
            polygon: { fillColor: last.color }
          }
        });

        setRuleStyles(newRules);
      });
    }
  }, [selectedAttribute, assetName]);

  useEffect(() => {
    console.log("ruleStyles", ruleStyles);
  }, [ruleStyles]);

  return (
    <div className="attribute-style-container" style={{display: 'flex', flexDirection: 'column'}}>
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
          <div>
            {ruleStyles.map((ruleStyle, index) => {
              const min = ruleStyle.rule.ge ?? ruleStyle.rule.gt ?? '';
              const max = ruleStyle.rule.le ?? ruleStyle.rule.lt ?? '';
              const color = ruleStyle.style.point.fillColor ?? '#000000';
              return (
                <div key={index} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                  <input
                    type="number"
                    value={min}
                    disabled={index === 0}
                    step={1}
                    onChange={(e) => {
                      const updated = [...ruleStyles];
                      updated[index].rule.ge = e.target.value;
                      updated[index].rule.gt = e.target.value;
                      updated[index - 1].rule.le = e.target.value;
                      updated[index - 1].rule.lt = e.target.value;
                      setRuleStyles(updated);
                    }}
                    style={{width: '80px'}}
                  />
                  ~
                  <input
                    type="number"
                    value={max}
                    disabled={index === ruleStyles.length - 1}
                    step={1}
                    onChange={(e) => {
                      const updated = [...ruleStyles];
                      updated[index].rule.lt = e.target.value;
                      updated[index].rule.le = e.target.value;
                      updated[index + 1].rule.ge = e.target.value;
                      updated[index + 1].rule.gt = e.target.value;
                      setRuleStyles(updated);
                    }}
                    style={{width: '80px'}}
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const updated = [...ruleStyles];
                      updated[index].style.point.fillColor = e.target.value;
                      updated[index].style.polygon.fillColor = e.target.value;
                      updated[index].style.line.strokeColor = e.target.value;
                      setRuleStyles(updated);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </>
      ) :
        <div>
          {ruleStyles.map((ruleStyle, index) => {
            if (index === 0) return null;
            const eq = ruleStyle.rule.eq ?? '';
            const color = ruleStyle.style.point.fillColor ?? '#000000';
            return (
              <div key={index} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
                <input
                  type="text"
                  value={eq}
                  disabled
                  onChange={(e) => {
                    const updated = [...ruleStyles];
                    updated[index].rule.eq = e.target.value;
                    setRuleStyles(updated);
                  }}
                  style={{width: '80px'}}
                />
                <input
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const updated = [...ruleStyles];
                    updated[index].style.point.fillColor = e.target.value;
                    updated[index].style.polygon.fillColor = e.target.value;
                    updated[index].style.line.strokeColor = e.target.value;
                    setRuleStyles(updated);
                  }}
                />
              </div>
            );
          })}
        </div>
      }


    </div>
  );
};

export default AttributeStyleSelector;
