import {SubmitHandler, useForm} from "react-hook-form";
import {CreateGroupInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useMutation} from "@apollo/client";
import {
  LayerAccess,
  LayersetCreateGroupDocument, LayersetGroupListDocument,
  LayersetGroupListWithAssetDocument
} from "@src/generated/gql/layerset/graphql";
import React from "react";
import {useTranslation} from "react-i18next";

const CreatePopup = ({onClose}: {
  onClose: () => void,
}) => {
  const { t } = useTranslation();
  const {register, handleSubmit, formState: {errors}} = useForm<CreateGroupInput>();

  const [createMutation] = useMutation(LayersetCreateGroupDocument,{
    refetchQueries: [LayersetGroupListDocument, LayersetGroupListWithAssetDocument]
  });

  const onSubmit: SubmitHandler<CreateGroupInput> = (input) => {
    // const input = Object.assign({}, DefaultLayerGroupInput, data);
    createMutation({
      variables: {
        input: {
          name: input.name,
          description: input.description,
          access: LayerAccess.Public,
          enabled: true
        }
      }
    }).then(onClose);
  }

  return (
    <div className="popup-wrap">
      <div className="popup">
        <div className="popup-head">
          <h3>{t("create-layer-group")}</h3>
          <button type="button" className="button-close" onClick={onClose}></button>
        </div>
        <div className="popup-body">
          <div className="content-inner">
            <form onSubmit={handleSubmit(onSubmit)}>
              <label htmlFor="group-create-name">{t("group-name")}</label>
              <input type="text" id="group-create-name"
                     {...register("name", {
                       validate: value => !!value.trim(),
                       required: t("validation.group-name"),
                     })}
              />
              {errors.name && <span style={{color: 'red', marginTop: '-15px'}}>{errors.name.message}</span>}
              <label htmlFor="group-create-attributes.description">{t("description")}</label>
              <input type="text" id="group-create-attributes.description"
                     {...register("description")}
              />
              <button type="submit" className="btn-l-apply">{t("register")}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePopup;