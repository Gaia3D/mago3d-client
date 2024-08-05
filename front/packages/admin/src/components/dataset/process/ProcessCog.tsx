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

const ProcessCog = (props: {
  data: DatasetAssetForDetailQuery,
  process: Process,
  resetProcess?: () => void
}) => {
  const {t} = useTranslation();
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
    setValue('context.cog.tiled', props.process?.properties?.payload?.cog?.tiled ?? true);
    setValue('context.cog.overviews', props.process?.properties?.payload?.cog?.overviews ?? true);

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
                <label htmlFor="data-process-cog-tiled" style={{cursor: "pointer"}}>{t("setting.tile-status")}</label>
                <label htmlFor="data-process-cog-tiled" className="switch">
                  <input type={"checkbox"}
                         id="data-process-cog-tiled"
                         {...register("context.cog.tiled")}
                         checked={process?.properties?.payload?.cog?.tiled ?? true}
                         onChange={(e) => {
                           setProcess({
                             ...process,
                             properties: {
                               ...process.properties,
                               payload: {
                                 ...process.properties?.payload,
                                 cog: {
                                   ...process.properties?.payload?.cog,
                                   tiled: e.target.checked
                                 }
                               }
                             }
                           });
                         }}
                  />
                  <span className="slider"></span>
                </label>
                <label htmlFor="data-process-cog-overviews" style={{cursor: "pointer"}}>{t("setting.over-view")}</label>
                <label htmlFor="data-process-cog-overviews" className="switch">
                  <input type={"checkbox"}
                         id="data-process-cog-overviews"
                         {...register("context.cog.overviews")}
                         checked={process?.properties?.payload?.cog?.overviews ?? true}
                         onChange={(e) => {
                           setProcess({
                             ...process,
                             properties: {
                               ...process.properties,
                               payload: {
                                 ...process.properties?.payload,
                                 cog: {
                                   ...process.properties?.payload?.cog,
                                   overviews: e.target.checked
                                 }
                               }
                             }
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
  )
}
export default ProcessCog;