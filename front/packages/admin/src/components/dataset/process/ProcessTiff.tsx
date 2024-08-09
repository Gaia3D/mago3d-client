import {SubmitHandler, useForm} from "react-hook-form";
import {getProcessStatusIconCssName, getProcessStatusMessage} from "@src/api/Data";
import {
  CreateProcessInput,
  DatasetAssetForDetailDocument,
  DatasetAssetForDetailQuery,
  DatasetCreateProcessDocument,
  DatasetProcessLogDocument,
  Process
} from "@src/generated/gql/dataset/graphql";
import {toast} from "react-toastify";
import {useMutation} from "@apollo/client";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

const ProcessTiff = (props: {
  data: DatasetAssetForDetailQuery,
  process: Process,
  resetProcess?: () => void
}) => {
  const { t } = useTranslation();
  const [lineHeight, setLineHeight] = useState(0);
  const [process, setProcess] = useState(props.process);
  const {register, handleSubmit, setValue} = useForm<CreateProcessInput>();

  const {asset} = props.data;

  const [createMutation] = useMutation(DatasetCreateProcessDocument, {
    refetchQueries: [DatasetProcessLogDocument, DatasetAssetForDetailDocument],
    onCompleted(data) {
      toast(t("success.transform"));
    }
  });

  const convertBoxRef = useRef(null);

  useEffect(() => {
    setProcess(props.process);
    setValue('name', props.process?.name ?? '');
    setValue('context.warp.sourceSrs', props.process?.properties?.payload?.warp?.sourceSrs ?? '');
    setValue('context.warp.targetSrs', props.process?.properties?.payload?.warp?.targetSrs ?? '');
    setValue('context.warp.ot', props.process?.properties?.payload?.warp?.ot ?? '');

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
    input.source = {assetId: [asset.id]};

    if (!input.context.warp.sourceSrs) {
      delete input.context.warp.sourceSrs;
    }

    if (!input.context.warp.targetSrs) {
      delete input.context.warp.targetSrs;
    }

    if (!input.context.warp.ot) {
      delete input.context.warp.ot;
    }

    createMutation({variables: {input}});
  }

  const toInit = () => {
    props.resetProcess && props.resetProcess();
  }

  return (
    <article>
      <div className="data-work">
        <div className="data-process">
          <div className="process-01"></div>
          <div className="line" style={{height: lineHeight}}></div>
          <div className={getProcessStatusIconCssName(asset.process?.status)}></div>
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
                <label htmlFor="data-process-cog-name" className="required">
                  <span className="required-star">*</span>{t("transform-name")}
                </label>
                <input type="text" placeholder={t("placeholder.transform-name")}
                       id="data-process-cog-name"
                       {...register("name", {required: true, validate: value => !!value.trim()})}
                       value={process?.name ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           name: e.target.value
                         })
                       }}
                />
                <label htmlFor="data-process-warp-sourcesrs">{t("original-epsg")}</label>
                <input type="text" placeholder={t("placeholder.epsg")}
                       id="data-process-warp-sourcesrs"
                       {...register("context.warp.sourceSrs")}
                       value={process?.properties?.payload?.warp?.sourceSrs ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           properties: {
                             ...process?.properties,
                             payload: {
                               ...process?.properties?.payload,
                               warp: {
                                 ...process?.properties?.payload?.warp,
                                 sourceSrs: e.target.value
                               }
                             }
                           }
                         })
                       }}
                />
                <label htmlFor="data-process-warp-targetsrs">{t("transform-epsg")}</label>
                <input type="text" placeholder={t("placeholder.epsg")}
                       id="data-process-warp-targetsrs"
                       {...register("context.warp.targetSrs")}
                       value={process?.properties?.payload?.warp?.targetSrs ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           properties: {
                             ...process?.properties,
                             payload: {
                               ...process?.properties?.payload,
                               warp: {
                                 ...process?.properties?.payload?.warp,
                                 targetSrs: e.target.value
                               }
                             }
                           }
                         })
                       }}
                />
                <label htmlFor="data-process-warp-output-type">{t("output-type")}</label>
                <select id="data-process-warp-output-type"
                        {...register("context.warp.ot")}
                        value={process?.context?.payload?.warp.ot ?? ''}
                        onChange={(e) => {
                          setProcess({
                            ...process,
                            context: {
                              ...process?.context,
                              payload: {
                                ...process?.context?.payload.warp,
                                ot: e.target.value
                              }
                            }
                          })
                        }}
                >
                  <option value="">{t("auto")}</option>
                  <option value="Byte">Byte(-128 ~ 127)</option>
                  <option value="Int8">Int8(-32768 ~ 32767)</option>
                  <option value="UInt16">UInt16(0 ~ 65535)</option>
                  <option value="Int16">Int16(-32768 ~ 32767)</option>
                  <option value="UInt32">UInt32(0 ~ 4294967295)</option>
                  <option value="Int32">Int32(-2147483648 ~ 2147483647)</option>
                  <option value="UInt64">UInt64</option>
                  <option value="Int64">Int64</option>
                  <option value="Float32">Float32</option>
                  <option value="Float64">Float64</option>
                  <option value="CInt16">CInt16</option>
                  <option value="CInt32">CInt32</option>
                  <option value="CFloat32">CFloat32</option>
                  <option value="CFloat64">CFloat64</option>
                </select>
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
  )
}
export default ProcessTiff;