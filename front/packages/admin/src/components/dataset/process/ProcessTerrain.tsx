import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import {
  getProcessStatusIconCssName,
  getProcessStatusMessage,
} from "@src/api/Data";
import {
  CreateProcessInput,
  DatasetAssetForDetailDocument,
  DatasetAssetForDetailQuery,
  DatasetCreateProcessDocument,
  DatasetProcessLogDocument,
  Process,
} from "@src/generated/gql/dataset/graphql";
import { toast } from "react-toastify";
import { useMutation } from "@apollo/client";
import {useTranslation} from "react-i18next";

const ProcessTerrain = (props: {
  data: DatasetAssetForDetailQuery;
  process: Process;
  resetProcess?: () => void;
}) => {
  const { t } = useTranslation();
  const [lineHeight, setLineHeight] = useState(0);
  const [process, setProcess] = useState(props.process);
  const { register, handleSubmit, setValue } = useForm<CreateProcessInput>();

  const { asset } = props.data;
  const { id } = asset;

  const [createMutation] = useMutation(DatasetCreateProcessDocument, {
    refetchQueries: [DatasetProcessLogDocument, DatasetAssetForDetailDocument],
    onCompleted(data) {
      toast(t("success.transform"));
    },
  });

  const convertBoxRef = useRef(null);

  useEffect(() => {
    setProcess(props.process);
    setValue("name", props.process?.name ?? "");
    setValue(
      "context.terrain.calculateNormals",
      props.process?.context?.payload?.calculateNormals ?? false
    );
    setValue(
      "context.terrain.interpolationType",
      props.process?.context?.payload?.interpolationType ?? "BILINEAR"
    );
    setValue(
      "context.terrain.minDepth",
      props.process?.context?.payload?.minDepth ?? ""
    );
    setValue(
      "context.terrain.maxDepth",
      props.process?.context?.payload?.maxDepth ?? ""
    );

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === convertBoxRef.current) {
          const convertBox = convertBoxRef.current as HTMLDivElement;
          const convertBoxHeight = convertBox.offsetHeight;
          const lineHeight = convertBoxHeight - 200;
          setLineHeight(lineHeight);
        }
      }
    });

    if (convertBoxRef.current) {
      // ResizeObserver를 div에 연결
      resizeObserver.observe(convertBoxRef.current);
    }

    return () => {
      // 컴포넌트가 언마운트 될 때 ResizeObserver를 해제
      resizeObserver.disconnect();
    };
  }, [props.process]);

  const onSubmit: SubmitHandler<CreateProcessInput> = (input) => {
    if (!confirm(t("question.transform"))) return;
    input.source = { assetId: [id] };
    createMutation({ variables: { input } });
  };

  const toInit = () => {
    props.resetProcess && props.resetProcess();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProcess({
      ...process,
      name: event.target.value,
    });
  };

  return (
    <article>
      <div className="data-work">
        <div className="data-process">
          <div className="process-01"></div>
          <div className="line" style={{ height: lineHeight }}></div>
          <div
            className={getProcessStatusIconCssName(asset.process?.status)}
          ></div>
        </div>
        <div className="data-convert" ref={convertBoxRef}>
          <div className="convert on">
            <h4 className="stitle-on">{t("data-transform")}
              <div className="data-button">
                <button type="button" className="btn-s-default" onClick={toInit}>{t("reset")}</button>
              </div>
            </h4>
            <div className="data-box">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="data-process-terrain-name" className={"required"}>
                  <span className="required-star">*</span>{t("transform-name")}
                </label>
                <input
                  type="text" placeholder={t("placeholder.transform-name")}
                  id="data-process-terrain-name"
                  {...register("name", {required: true, validate: (value) => !!value.trim(),})}
                  value={process?.name ?? ""} onChange={handleChange}
                />
                <label htmlFor="data-process-terrain-interpolation-type" className={"required"}>
                  <span className="required-star">*</span>{t("interpolation-type")}
                </label>
                <select
                  id="data-process-terrain-interpolation-type"
                  {...register("context.terrain.interpolationType", {
                    required: true,
                  })}
                  value={process?.context?.payload?.interpolationType ?? ""}
                  onChange={(e) => {
                    setProcess({
                      ...process,
                      context: {
                        ...process?.context,
                        payload: {
                          ...process?.context?.payload,
                          interpolationType: e.target.value,
                        },
                      },
                    });
                  }}
                >
                  <option value="BILINEAR">{t("bilinear")}</option>
                  <option value="NEAREST">{t("nearest")}</option>
                </select>
                <label htmlFor="data-process-terrain-min-depth">
                  <span className="required-star">*</span>{t("min-depth")}
                </label>
                <input
                  type="number"
                  placeholder={t("validation.depth-range")}
                  id="data-process-terrain-min-depth"
                  {...register("context.terrain.minDepth", {
                    required: true,
                    validate: (value) => {
                      const numVal = Number(value);
                      if (!Number.isInteger(numVal)) return false;
                      if (numVal < 0 || numVal > 22) return false;
                      return true;
                    },
                  })}
                  value={process?.context?.payload?.minDepth ?? ""}
                  onChange={(e) => {
                    setProcess({
                      ...process,
                      context: {
                        ...process?.context,
                        payload: {
                          ...process?.context?.payload,
                          minDepth: e.target.value,
                        },
                      },
                    });
                  }}
                />
                <label htmlFor="data-process-terrain-max-depth">
                  <span className="required-star">*</span>{t("max-depth")}
                </label>
                <input
                  type="number"
                  placeholder={t("validation.depth-range")}
                  id="data-process-terrain-max-depth"
                  {...register("context.terrain.maxDepth", {
                    required: true,
                    validate: (value) => {
                      const numVal = Number(value);
                      if (!Number.isInteger(numVal)) return false;
                      if (numVal < 0 || numVal > 22) return false;
                      return true;
                    },
                  })}
                  value={process?.context?.payload?.maxDepth ?? ""}
                  onChange={(e) => {
                    setProcess({
                      ...process,
                      context: {
                        ...process?.context,
                        payload: {
                          ...process?.context?.payload,
                          maxDepth: e.target.value,
                        },
                      },
                    });
                  }}
                />
                <label htmlFor="data-process-terrain-calculate-normals" style={{ cursor: "pointer" }}>
                  {t("calculate-normals")}
                </label>
                <label htmlFor="data-process-terrain-calculate-normals" className="switch">
                  <input
                    type={"checkbox"}
                    id="data-process-terrain-calculate-normals"
                    {...register("context.terrain.calculateNormals")}
                    checked={
                      process?.context?.payload?.calculateNormals ?? false
                    }
                    onChange={(e) => {
                      setProcess({
                        ...process,
                        context: {
                          ...process?.context,
                          payload: {
                            ...process?.context?.payload,
                            calculateNormals: e.target.checked,
                          },
                        },
                      });
                    }}
                  />
                  <span className="slider"></span>
                </label>
                <button type="submit" className="btn-convert">{t("data-transform")}</button>
              </form>
            </div>
          </div>
          <div className="sucess-box on">
            <p>{getProcessStatusMessage(asset.process?.status, t)}</p>
          </div>
        </div>
      </div>
    </article>
  );
};
export default ProcessTerrain;
