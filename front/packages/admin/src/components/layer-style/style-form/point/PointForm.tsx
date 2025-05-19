import React from 'react';
import {useRecoilValue} from "recoil";
import {selectedAssetState} from "@src/recoils/LayerStyle";
import {useQuery} from "@apollo/client";
import {Maybe, PreviewColumnsDocument, RuleStyleInput, Scalars} from "@mnd/shared/src/types/layerset/gql/graphql";
import {StyleSelectRow} from "@src/components/layerset/layer/style/StyleSelectRow";
import IconTypeForm from "@src/components/layer-style/style-form/point/IconTypeForm";
import PointTypeForm from "@src/components/layer-style/style-form/point/PointTypeForm";
import {ToggleRow} from "@src/components/layerset/layer/style/ToggleRow";
import LabelForm from "@src/components/layer-style/style-form/LabelForm";

interface PointFormProps {
  ctx: Maybe<Scalars['JSON']['output']>,
  handleChangeContext: (key: string, value: string | number | boolean | RuleStyleInput[]) => void;
}

const PointForm = ({ctx, handleChangeContext}: PointFormProps) => {
  const asset = useRecoilValue(selectedAssetState);
  const { data: attributeData } = useQuery(PreviewColumnsDocument,{
    variables: {
      assetID: asset.id
    }
  });

  return (
    <>
      <StyleSelectRow
        title="점 모양"
        value={ctx.pointType ?? "point"}
        onChange={val => handleChangeContext("pointType", val)}
        options={[{label: "점", value: "point"}, {label: "아이콘", value: "icon"}]}
      />
      {
        ctx.pointType === "icon" ?
          <IconTypeForm ctx={ctx} handleChangeContext={handleChangeContext} /> :
          <PointTypeForm ctx={ctx} handleChangeContext={handleChangeContext} />
      }
      <ToggleRow
        title="라벨 사용"
        enabled={ctx.isLabelEnabled ?? false}
        onToggle={(val: boolean) => handleChangeContext("isLabelEnabled", val)}
      />
      {
        ctx.isLabelEnabled &&
        <LabelForm ctx={ctx} handleChangeContext={handleChangeContext} />
      }
    </>
  );
};

export default PointForm;
