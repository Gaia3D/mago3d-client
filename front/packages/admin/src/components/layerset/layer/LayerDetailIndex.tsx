import {Suspense, useEffect, useState} from "react";
import {classifyAssetTypeClassNameByLayerAssetType} from "@src/api/Data";
import {SubmitHandler, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {
  LayersetAssetBasicFragmentDoc,
  LayersetAssetDocument,
  LayersetDeleteAssetDocument,
  LayersetGroupListWithAssetDocument, LayersetUpdateAssetDocument,
  UpdateAssetInput
} from "@src/generated/gql/layerset/graphql";
import {useMutation, useSuspenseQuery} from "@apollo/client";
import {useFragment} from "@src/generated/gql/layerset";
import {alertToast} from "@mnd/shared/src/utils/toast";
import {useTranslation} from "react-i18next";
import LayerLogTable from "@src/components/layerset/layer/LayerLogTable";
import LayerForm from "@src/components/layerset/layer/LayerForm";
import LayerAttribute from "@src/components/layerset/layer/LayerAttribute";
import LayerStyle from "@src/components/layerset/layer/LayerStyle";

interface LayerDetailIndexProps {
  id: string;
}

type CategoryType = "default" | "style" | "log" | "attribute";

const LayerDetailIndex = ({ id }: LayerDetailIndexProps) => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const form = useForm<UpdateAssetInput>();
  const { data } = useSuspenseQuery(LayersetAssetDocument, { variables: { id } });
  const asset = useFragment(LayersetAssetBasicFragmentDoc, data.asset);
  const { logs, groups } = data.asset;
  const [category, setCategory] = useState<CategoryType>("default");

  const [ updateMutation ] = useMutation(LayersetUpdateAssetDocument, {
    refetchQueries: [LayersetAssetDocument],
    onCompleted: () => alert(t("success.edit")),
    onError: (e) => {
      console.error(e);
      alert(t("error.admin"));
    }
  });

  const [deleteAssetMutation] = useMutation(LayersetDeleteAssetDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument]
  });

  const onSubmit: SubmitHandler<UpdateAssetInput> = (formData) => {
    if (!confirm(t("question.edit"))) return;
    updateMutation({ variables: { id: asset.id, input: { ...formData } } });
  };

  const toDelete = () => {
    if (!confirm(`${t("layer")} ${asset.name} ${t("question.blank-delete")}`)) return;
    deleteAssetMutation({ variables: { ids: id } }).then(() => {
      alertToast(t("success.delete"));
      navigate(-1);
    });
  }

  const safeGroups = groups.map(group => ({
    id: group.id,
    name: group.name ?? ""
  }));

  return (
    <Suspense>
      <div className="contents">
        <h2>
          {asset.name}
          <span className={classifyAssetTypeClassNameByLayerAssetType(asset.type)}>{asset.type}</span>
        </h2>
        <div className="category-button-section">
          <button onClick={() => setCategory("default")}>기본 설정</button>
          <button onClick={() => setCategory("style")}>스타일 설정</button>
          <button onClick={() => setCategory("attribute")}>속성 설정</button>
          <button onClick={() => setCategory("log")}>로그</button>
        </div>
        <article>
          <div className={category === "default" ? "block" : "none"}>
            <LayerForm
              asset={asset}
              groups={safeGroups}
              form={form}
              onSubmit={onSubmit}
              onDelete={toDelete}
              onCancel={() => navigate(-1)}
            />
          </div>
          <div className={category === "style" ? "block" : "none"}>
            <LayerStyle asset={asset}/>
          </div>
          <div className={category === "log" ? "block" : "none"}>
            <LayerLogTable logs={logs}/>
          </div>
          <div className={category === "attribute" ? "block" : "none"}>
            <LayerAttribute/>
          </div>
        </article>
      </div>
    </Suspense>
  );
};

export default LayerDetailIndex;
