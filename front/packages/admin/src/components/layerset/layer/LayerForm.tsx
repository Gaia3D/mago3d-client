import React, {useEffect} from "react";
import { UseFormReturn } from "react-hook-form";
import { UpdateAssetInput } from "@src/generated/gql/layerset/graphql";
import { getPublishStatusName } from "@src/api/Data";
import { useTranslation } from "react-i18next";
import {useRecoilValue} from "recoil";
import {selectedAssetState} from "@src/layer-style/recoils/layerStyle";

interface LayerFormProps {
  groups: { id: string; name: string }[];
  form: UseFormReturn<UpdateAssetInput>;
  onSubmit: (data: UpdateAssetInput) => void;
  onDelete: () => void;
  onCancel: () => void;
}

const LayerForm = ({ groups, form, onSubmit, onDelete, onCancel }: LayerFormProps) => {
  const asset = useRecoilValue(selectedAssetState);
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = form;

  if (!asset) return;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>{t("layer-group")}</label>
      {groups?.length > 0 && (
        <select disabled>
          {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
        </select>
      )}

      <label>{t("layer-name")}</label>
      <input
        defaultValue={asset.name}
        {...register("name", {
          required: {value: true, message: t("required.layer-name")}
        })}
      />
      {errors?.name?.message && <span className="error">{errors.name.message}</span>}

      <label>{t("state")}</label>
      <span>{getPublishStatusName(asset.status, t)}</span>

      <label>{t("use-status")}</label>
      <label className="switch mt8">
        <input type="checkbox" defaultChecked={asset.enabled} {...register("enabled")} />
        <span className="slider"></span>
      </label>

      <label>{t("turn-on")}</label>
      <label className="switch mt8">
        <input type="checkbox" defaultChecked={asset.visible} {...register("visible")} />
        <span className="slider"></span>
      </label>

      <label>{t("printable")}</label>
      <label className="switch mt8">
        <input type="checkbox" defaultChecked={asset.printable} {...register("printable" as keyof UpdateAssetInput)} />
        <span className="slider"></span>
      </label>

      <div className="alg-right">
        <button type="submit" className="btn-l-save">{t("edit")}</button>
        <button type="button" className="btn-l-delete" onClick={onDelete}>{t("delete")}</button>
        <button type="button" className="btn-l-cancel" onClick={onCancel}>{t("cancel")}</button>
      </div>
    </form>
  );
};

export default LayerForm;
