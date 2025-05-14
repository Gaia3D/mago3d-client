import {Suspense, useEffect, useState} from "react";
import { classifyAssetTypeClassNameByLayerAssetType } from "@src/api/Data";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation, useSuspenseQuery } from "@apollo/client";
import { useFragment } from "@src/generated/gql/layerset";
import { alertToast } from "@mnd/shared/src/utils/toast";
import { useTranslation } from "react-i18next";
import LayerLogTable from "@src/components/layerset/layer/LayerLogTable";
import LayerForm from "@src/components/layerset/layer/LayerForm";
import LayerAttribute from "@src/components/layerset/layer/LayerAttribute";
import {
  LayersetAssetBasicFragmentDoc,
  LayersetAssetDocument,
  LayersetDeleteAssetDocument,
  LayersetGroupListWithAssetDocument,
  LayersetUpdateAssetDocument,
  UpdateAssetInput,
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useRecoilState, useSetRecoilState} from "recoil";
import {layerStylesState, selectedAssetState} from "@src/recoils/LayerStyle";
import LayerStyle from "@src/components/layerset/layer/LayerStyle";

interface LayerDetailIndexProps {
  id: string;
}

type TabType = "default" | "style" | "log" | "attribute";

const LayerDetailIndex = ({ id }: LayerDetailIndexProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const form = useForm<UpdateAssetInput>();
  const { data } = useSuspenseQuery(LayersetAssetDocument, { variables: { id } });

  const asset = useFragment(LayersetAssetBasicFragmentDoc, data.asset);
  const { logs, groups } = data.asset;

  const [activeTab, setActiveTab] = useState<TabType>("default");
  const [globalAsset, setGlobalAsset] = useRecoilState(selectedAssetState);
  const setLayerStyles = useSetRecoilState(layerStylesState);

  useEffect(() => {
    setGlobalAsset(asset);
    setLayerStyles(asset.styles);
  }, [asset, setGlobalAsset]);

  const [updateAsset] = useMutation(LayersetUpdateAssetDocument, {
    refetchQueries: [LayersetAssetDocument],
    onCompleted: () => alert(t("success.edit")),
    onError: (e) => {
      console.error(e);
      alert(t("error.admin"));
    },
  });

  const [deleteAsset] = useMutation(LayersetDeleteAssetDocument, {
    refetchQueries: [LayersetGroupListWithAssetDocument],
  });

  const onSubmit: SubmitHandler<UpdateAssetInput> = (formData) => {
    if (!confirm(t("question.edit"))) return;
    updateAsset({ variables: { id: asset.id, input: { ...formData } } });
  };

  const handleDelete = () => {
    if (!confirm(`${t("layer")} ${asset.name} ${t("question.blank-delete")}`)) return;
    deleteAsset({ variables: { ids: id } }).then(() => {
      alertToast(t("success.delete"));
      navigate(-1);
    });
  };

  const groupOptions = groups.map((group) => ({
    id: group.id,
    name: group.name ?? "",
  }));

  if (!globalAsset) return;

  return (
    <Suspense>
      <div className="contents">
        <h2>
          {asset.name}
          <span className={classifyAssetTypeClassNameByLayerAssetType(asset.type)}>{asset.type}</span>
        </h2>
        <div className="tabmenu">
          <ul>
            <li className={activeTab === "default" ? "on" : ""} onClick={() => setActiveTab("default")}>기본 설정</li>
            <li className={activeTab === "style" ? "on" : ""} onClick={() => setActiveTab("style")}>스타일 설정</li>
            <li className={activeTab === "attribute" ? "on" : ""} onClick={() => setActiveTab("attribute")}>속성 설정</li>
            <li className={activeTab === "log" ? "on" : ""} onClick={() => setActiveTab("log")}>로그</li>
          </ul>
        </div>
        <article>
          <div className={activeTab === "default" ? "block" : "none"}>
            <LayerForm
              groups={groupOptions}
              form={form}
              onSubmit={onSubmit}
              onDelete={handleDelete}
              onCancel={() => navigate(-1)}
            />
          </div>
          <div className={activeTab === "style" ? "block" : "none"}>
            <LayerStyle />
          </div>
          <div className={activeTab === "attribute" ? "block" : "none"}>
            <LayerAttribute />
          </div>
          <div className={activeTab === "log" ? "block" : "none"}>
            <LayerLogTable logs={logs}/>
          </div>
        </article>
      </div>
    </Suspense>
  );
};

export default LayerDetailIndex;
