import {useOutletContext} from "react-router-dom";
import {Suspense} from "react";
import {AppLoader} from "@mnd/shared";
import {SubmitHandler, useForm} from "react-hook-form";
import {useToPath} from "@src/hooks/common";
import {toast} from "react-toastify";
import {UpdateLayerGroupOutletContext} from "./GroupOutletContext";
import {useMutation} from "@apollo/client";
import {
  LayersetUpdateGroupDocument,
  UpdateGroupInput,
  LayerGroupBasicFragmentDoc,
  LayerGroupDocument,
} from "@src/generated/gql/layerset/graphql";
import {useFragment} from "@src/generated/gql/layerset";
import {useTranslation} from "react-i18next";


const UpdateBasic = () => {
  const { t } = useTranslation();
  const back = useToPath('/layerset/group');
  const {data} = useOutletContext<UpdateLayerGroupOutletContext>();
  const group = useFragment(LayerGroupBasicFragmentDoc, data.group);

  const [updateMutation] = useMutation(LayersetUpdateGroupDocument, {
    refetchQueries: [
      LayerGroupDocument,
    ],
    onCompleted() {
      toast(t("success.edit"));
    }
  });

  const {register, handleSubmit, formState: {errors}} = useForm<UpdateGroupInput>();

  const onSubmit: SubmitHandler<UpdateGroupInput> = (input) => {
    updateMutation({
      variables: {
        id: group.id,
        input
      }
    });
  }

  return (
      <Suspense fallback={<AppLoader/>}>
        <article>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label>{t("group-name")}</label>
            <input type="text" defaultValue={group.name} {...register("name", {
              validate: value => !!value.trim()
            })}/>
            {errors.name && <span className="error">{errors.name.message}</span>}
            <br/>

            <label>{t("description")}</label>
            <input type="text" defaultValue={group.description} {...register("description")}/>
            {errors.description && <span className="error">{errors.description.message}</span>}
          </form>
        </article>
        <div className="alg-right">
          <button type="button" className="btn-l-save" onClick={handleSubmit(onSubmit)}>{t("save")}</button>
          <button type="button" className="btn-l-cancel" onClick={back}>{t("cancel")}</button>
        </div>
      </Suspense>
  )
}

export default UpdateBasic;