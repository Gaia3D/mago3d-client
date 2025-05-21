import React, {useState} from 'react';
import {
  Maybe,
  PreviewColumnsQuery,
  Scalars,
  StyleType
} from "@mnd/shared/src/types/layerset/gql/graphql";
import PointForm from "@src/components/layer-style/style-form/point/PointForm";
import {useRecoilState} from "recoil";
import {selectedLayerStyleState} from "@src/recoils/LayerStyle";
import LineForm from "@src/components/layer-style/style-form/line/LineForm";
import PolygonForm from "@src/components/layer-style/style-form/polygon/PolygonForm";
import AttributeSelector from "@src/components/layer-style/style-form/attribute/AttributeSelector";
import {StyleContextType} from "@src/types/StyleContext";

interface AttributeFormProps {
  ctx: Maybe<Scalars['JSON']['output']>;
  handleChangeContext: <K extends keyof StyleContextType>(key: K, value: StyleContextType[K]) => void;
  attributeData: PreviewColumnsQuery;
}

const getInitialStyleType = (ctx: Maybe<Scalars['JSON']['output']>): StyleType => {
  const styleType = ctx?.rules?.[0]?.style?.["@type"];

  switch (styleType) {
    case "PointStyle":
      return StyleType.Point;
    case "LineStyle":
      return StyleType.Line;
    case "PolygonStyle":
      return StyleType.Polygon;
    default:
      return StyleType.Point; // fallback
  }
};

const AttributeForm = ({ ctx, handleChangeContext, attributeData }: AttributeFormProps) => {
  const [innerType, setInnerType] = useState<StyleType>(() => getInitialStyleType(ctx.type ?? StyleType.Point));

  // useEffect(() => {
  //   handleChangeContext("innerType", innerType);
  // }, [innerType]);

  return (
    <div>
      <button onClick={() => setInnerType(StyleType.Point)}>Point</button>
      <button onClick={() => setInnerType(StyleType.Line)}>Line</button>
      <button onClick={() => setInnerType(StyleType.Polygon)}>Polygon</button>
      {innerType === StyleType.Point &&
        <PointForm
          ctx={ctx}
            handleChangeContext={handleChangeContext}
            attributeData={attributeData}
        />}
      {innerType === StyleType.Line &&
        <LineForm
          ctx={ctx}
          handleChangeContext={handleChangeContext}
        />}
      {innerType === StyleType.Polygon &&
        <PolygonForm
          ctx={ctx}
          handleChangeContext={handleChangeContext}
        />}
      <AttributeSelector ctx={ctx} handleChangeContext={handleChangeContext} attributeData={attributeData} />
    </div>
  );
};

export default AttributeForm;
