import { ClassifyAttributeQuery, ClassifyAttributeQueryVariables } from '@src/generated/gql/layerset/graphql';
import { RuleStyleInput, Scalars } from '@mnd/shared/src/types/layerset/gql/graphql';
import { ApolloClient } from "@apollo/client";
import { ClassifyAttributeDocument } from '@src/generated/gql/layerset/graphql';
import {AttributeType} from "@src/components/refactor-layer-style/mapStyleToCompleteStyleType";

export const fetchRulesFromServer = async (
  client: ApolloClient<object>,
  assetName: string,
  selectedAttribute: string,
  context: Scalars['JSON']['output'] | undefined,
  innerType: AttributeType
): Promise<{ rules: RuleStyleInput[], comparisonType: 'eq' | 'ge_lt' }> => {
  const result = await client.query<ClassifyAttributeQuery, ClassifyAttributeQueryVariables>({
    query: ClassifyAttributeDocument,
    variables: { nativeName: assetName, attribute: selectedAttribute },
    fetchPolicy: "no-cache",
  });

  if (!result.data?.classifyAttribute?.rules?.length) {
    return { rules: [], comparisonType: 'ge_lt' };
  }

  const { type, rules } = result.data.classifyAttribute;
  const comparisonType = type === 'STRING' ? 'eq' : 'ge_lt';

  const sorted = [...rules].sort((a, b) => parseFloat(a.min) - parseFloat(b.min));
  const newRules: RuleStyleInput[] = [];
  const attributeStyle = context.attribute.rules[1].style;

  const pointStyle = attributeStyle.point ?? context.point;
  const lineStyle = attributeStyle.line ?? context.line;
  const polygonStyle = attributeStyle.polygon ?? context.polygon;

  const createColorStyle = (color: string) => ({
    '@type': innerType,
    point: { ...pointStyle, fillColor: color },
    line: { ...lineStyle, strokeColor: color },
    polygon: { ...polygonStyle, fillColor: color },
  });

  newRules.push({
    rule: {
      ge: String(Number.NEGATIVE_INFINITY),
      gt: String(Number.NEGATIVE_INFINITY),
      le: sorted[0].min,
      lt: sorted[0].min
    },
    style: createColorStyle('#000000'),
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
      style: createColorStyle(curr.color),
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
    style: createColorStyle(sorted.at(-1)?.color ?? '#000000'),
  });

  return { rules: newRules, comparisonType };
};