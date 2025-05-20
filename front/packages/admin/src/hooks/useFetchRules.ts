import {useEffect} from "react";
import {Maybe, RuleStyleInput, Scalars} from '@mnd/shared/src/types/layerset/gql/graphql';
import {useLazyQuery} from "@apollo/client";
import {
  ClassifyAttributeDocument,
  ClassifyAttributeQuery,
  ClassifyAttributeQueryVariables
} from '@src/generated/gql/layerset/graphql';

export const useFetchRules = (
  assetName: string | undefined,
  selectedAttribute: string | undefined,
  style: Maybe<Scalars['JSON']['output']>,
  setComparisonType: (type: 'eq' | 'ge_lt' | 'gt_le') => void,
  setRuleStyles: (rules: RuleStyleInput[]) => void,
) => {

  const [fetchAttributes] = useLazyQuery<ClassifyAttributeQuery, ClassifyAttributeQueryVariables>(
    ClassifyAttributeDocument
  );

  useEffect(() => {
    if (!assetName || !selectedAttribute) return;
    if (style?.attribute?.attribute === selectedAttribute) {
      setRuleStyles(style.attribute.rules ?? []);
      return;
    }

    fetchAttributes({
      variables: { nativeName: assetName, attribute: selectedAttribute }
    }).then(result => {

      if (!result?.data?.classifyAttribute?.rules?.length) {
        setRuleStyles([]);
        return;
      }

      const { type, rules } = result.data.classifyAttribute;
      setComparisonType(type === 'STRING' ? 'eq' : 'ge_lt');

      const sorted = [...rules].sort((a, b) => parseFloat(a.min) - parseFloat(b.min));
      const newRules: RuleStyleInput[] = [];

      // -∞ ~ 첫 min
      newRules.push({
        rule: {
          ge: String(Number.NEGATIVE_INFINITY),
          gt: String(Number.NEGATIVE_INFINITY),
          le: sorted[0].min,
          lt: sorted[0].min
        },
        style: createColorStyle('#000000')
      });

      for (let i = 0; i < sorted.length - 1; i++) {
        const curr = sorted[i], next = sorted[i + 1];
        newRules.push({
          rule: {
            eq: curr.eq,
            ge: curr.min,
            gt: curr.min,
            le: next.min,
            lt: next.min
          },
          style: createColorStyle(curr.color)
        });
      }

      newRules.push({
        rule: {
          eq: sorted.at(-1)?.eq,
          ge: sorted.at(-1)?.min,
          gt: sorted.at(-1)?.min,
          le: String(Number.POSITIVE_INFINITY),
          lt: String(Number.POSITIVE_INFINITY)
        },
        style: createColorStyle(sorted.at(-1)?.color ?? '#000000')
      });

      setRuleStyles(newRules);
    })
    .catch((e) => {
      console.error('fetchAttributes error:', e);
      setRuleStyles([]); // 실패 시 비워줌
    });
  }, [assetName, selectedAttribute]);
};

const createColorStyle = (color: string) => ({
  point: { fillColor: color },
  // polygon: { fillColor: color },
  // line: { strokeColor: color }
});
