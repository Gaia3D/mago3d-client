import {classifyAssetTypeClassName} from "@src/api/Data";
import {SubmitHandler, useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {
  CreateAssetInput,
  LayerAccess,
  LayerAssetType,
  LayersetCreateAssetDocument, LayersetGroupListQuery
} from "@src/generated/gql/layerset/graphql";
import {useMutation} from "@apollo/client";
import {DatasetAssetForLayerQuery} from "@src/generated/gql/dataset/graphql";
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";

const LayerPublishCoverage = ({dataAsset, groupsQuery}: {
  dataAsset: DatasetAssetForLayerQuery,
  groupsQuery: LayersetGroupListQuery
}) => {
  const {t} = useTranslation();
  const {register, handleSubmit, formState: {errors}, setValue} = useForm<CreateAssetInput>();
  const navigate = useNavigate();

  const [createMutation] = useMutation(LayersetCreateAssetDocument, {
    update(cache, {data}) {
      cache.evict({
        fieldName: 'groups'
      });
    }
  });

  const toBack = () => {
    navigate(-1);
  }
  const onSubmit: SubmitHandler<CreateAssetInput> = (data) => {
    if (!confirm(t("question.create"))) return;

    //data.access = data.access ? LayerAccess.Private : LayerAccess.Public;
    data.type = LayerAssetType.Raster;
    data.context = {
      coverage: {
        dataAssetId: dataAsset.asset.id
      },
    }

    createMutation({variables: {input: data}})
      .then(() => {
        toast(t("success.create"));
        navigate('/layerset/layer');
        // getQueryClient().invalidateQueries({queryKey: ['assets', searchProps]})
        // navigate(-1);
      })
      .catch(e => {
          console.error(e);
        toast(t("error.admin"));
      });

  }

  const {groups} = groupsQuery;

  return (
    <div className="contents">
      <h2>
        {dataAsset.asset.name}
        <span className={classifyAssetTypeClassName(dataAsset.asset.assetType)}>{dataAsset.asset.assetType}</span>
      </h2>
      <article>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="layer-publish-coverage-groups">{t("layer-group")}</label>
          <select
              id="layer-publish-coverage-groups"
              {...register("groupIds", {
                required: {
                  value: true,
                  message: t("required.groups")
                },
              })}
          >
            {
              groups.map((group, idx) => {
                return (
                    <option key={idx} value={group.id}>{group.name}</option>
                )
              })
            }
          </select>
          <label htmlFor="layer-publish-coverage-name">{t("layer-name")}</label>
          <input type="text"
                 id="layer-publish-coverage-name"
                 {...register("name", {
                   required: {
                     value: true,
                     message: t("required.layer-name")
                   },
                 })}
          />
          {errors?.name?.message && <span className="error">{errors.name.message}</span>}
          {/*
          <label>권한</label>
          <label className="switch mt8">
            <input type="checkbox"
                   defaultChecked={false}
                   id="layer-publish-coverage-access"
                   {...register("access")}
            />
            <span className="slider"></span>
          </label>
          */}
          <label>{t("use-status")}</label>
          <label className="switch mt8">
            <input type="checkbox"
                   defaultChecked={true}
                   id="layer-publish-coverage-enabled"
                   {...register("enabled")}
            />
            <span className="slider"></span>
          </label>
          <label>{t("turn-on")}</label>
          <label className="switch mt8">
            <input type="checkbox"
                   defaultChecked={true}
                   id="layer-publish-coverage-visible"
                   {...register("visible")}
            />
            <span className="slider"></span>
          </label>
          <div className="alg-right">
            <button type="submit" className="btn-l-save">{t("publish")}</button>
            <button type="button" className="btn-l-cancel" onClick={toBack}>{t("cancel")}</button>
          </div>
        </form>
      </article>
    </div>
  )
}

export default LayerPublishCoverage;