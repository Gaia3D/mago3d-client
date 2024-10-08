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
import {useMutation} from "@apollo/client";
import {toast} from "react-toastify";
import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

const ProcessShp = (props: {
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
    setValue('context.ogr2ogr.sourceCharset', props.process?.properties?.payload?.ogr2ogr?.sourceCharset ?? '');
    setValue('context.ogr2ogr.targetCharset', props.process?.properties?.payload?.ogr2ogr?.targetCharset ?? '');
    setValue('context.ogr2ogr.sourceSrs', props.process?.properties?.payload?.ogr2ogr?.sourceSrs ?? '');
    setValue('context.ogr2ogr.targetSrs', props.process?.properties?.payload?.ogr2ogr?.targetSrs ?? '');


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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProcess({
      ...process,
      name: event.target.value
    })
  };

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
                <label htmlFor="data-process-shp-name" className="required">
                  <span className="required-star">*</span>{t("transform-name")}
                </label>
                <input type="text" placeholder={t("placeholder.transform-name")}
                       id="data-process-shp-name"
                       {...register("name", {required: true, validate: value => !!value.trim()})}
                       value={process?.name ?? ''} onChange={handleChange}
                />
                <label htmlFor="data-process-shp-sourcecharset">{t("original-encoding")}</label>
                <input type="text" placeholder="UTF-8"
                       id="data-process-shp-sourcecharset"
                       {...register("context.ogr2ogr.sourceCharset")}
                       value={process?.properties?.payload?.ogr2ogr?.sourceCharset ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           properties: {
                             ...process?.properties,
                             payload: {
                               ...process?.properties?.payload,
                               ogr2ogr: {
                                 ...process?.properties?.payload?.ogr2ogr,
                                 sourceCharset: e.target.value
                               }
                             }
                           }
                         })
                       }}
                />
                <label htmlFor="data-process-shp-targetcharset">{t("transform-encoding")}</label>
                <input type="text" placeholder="UTF-8"
                       id="data-process-shp-targetcharset"
                       {...register("context.ogr2ogr.targetCharset")}
                       value={process?.properties?.payload?.ogr2ogr?.targetCharset ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           properties: {
                             ...process?.properties,
                             payload: {
                               ...process?.properties?.payload,
                               ogr2ogr: {
                                 ...process?.properties?.payload?.ogr2ogr,
                                 targetCharset: e.target.value
                               }
                             }
                           }
                         })
                       }}
                />
                <label htmlFor="data-process-shp-sourcesrs">{t("original-epsg")}</label>
                <input type="text" placeholder={t("placeholder.epsg")}
                       id="data-process-shp-sourcesrs"
                       {...register("context.ogr2ogr.sourceSrs")}
                       value={process?.properties?.payload?.ogr2ogr?.sourceSrs ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           properties: {
                             ...process?.properties,
                             payload: {
                               ...process?.properties?.payload,
                               ogr2ogr: {
                                 ...process?.properties?.payload?.ogr2ogr,
                                 sourceSrs: e.target.value
                               }
                             }
                           }
                         })
                       }}
                />
                <label htmlFor="data-process-shp-targetsrs">{t("transform-epsg")}</label>
                <input type="text" placeholder={t("placeholder.epsg")}
                       id="data-process-shp-targetsrs"
                       {...register("context.ogr2ogr.targetSrs")}
                       value={process?.properties?.payload?.ogr2ogr?.targetSrs ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           properties: {
                             ...process?.properties,
                             payload: {
                               ...process?.properties?.payload,
                               ogr2ogr: {
                                 ...process?.properties?.payload?.ogr2ogr,
                                 targetSrs: e.target.value
                               }
                             }
                           }
                         })
                       }}
                />
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
export default ProcessShp;