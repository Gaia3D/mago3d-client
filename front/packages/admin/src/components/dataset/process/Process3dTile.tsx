import {SubmitHandler, useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";
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
import {useTranslation} from "react-i18next";

const Process3dTile = (props: {
  data: DatasetAssetForDetailQuery,
  process: Process,
  resetProcess?: () => void
}) => {
  const {t} = useTranslation();
  const [isFolded, setIsFolded] = useState(true);
  const [lineHeight, setLineHeight] = useState(0);
  const [process, setProcess] = useState(props.process);
  const {register, handleSubmit, setValue} = useForm<CreateProcessInput>();

  const {asset} = props.data;
  const {id} = asset;

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
    setValue('context.t3d.inputType', props.process?.context?.payload?.inputType ?? 'FBX');
    setValue('context.t3d.crs', props.process?.context?.payload?.crs ?? '');
    setValue('context.t3d.proj', props.process?.context?.payload?.proj ?? '');
    setValue('context.t3d.reverseTexCoord', props.process?.context?.payload?.reverseTexCoord ?? false);
    setValue('context.t3d.pngTexture', props.process?.context?.payload?.pngTexture ?? false);
    setValue('context.t3d.yUpAxis', props.process?.context?.payload?.yUpAxis ?? false);
    setValue('context.t3d.refineAdd', props.process?.context?.payload?.refineAdd ?? false);
    setValue('context.t3d.maxCount', props.process?.context?.payload?.maxCount ?? 1024);
    setValue('context.t3d.maxLod', props.process?.context?.payload?.maxLod ?? 3);
    setValue('context.t3d.minLod', props.process?.context?.payload?.minLod ?? 0);
    setValue('context.t3d.maxPoints', props.process?.context?.payload?.maxPoints ?? 20000);
    setValue('context.t3d.flipCoordinate', props.process?.context?.payload?.flipCoordinate ?? false);
    setValue('context.t3d.autoUpAxis', props.process?.context?.payload?.autoUpAxis ?? false);

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
    input.source = {assetId: [id]};
    createMutation({variables: {input}});
  }

  const toInit = () => {
    props.resetProcess && props.resetProcess();
  }

  const toUnfold = () => {
    setIsFolded(prevState => !prevState);
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
                <button type="button" className="btn-s-detail" onClick={toUnfold}>{t("detail-setting")}</button>
              </div>
            </h4>
            <div className="data-box">
              <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="data-process-t3d-name" className={'required'}>
                  <span className="required-star">*</span>{t("transform-name")}
                </label>
                <input type="text" placeholder={t("placeholder.transform-name")} id="data-process-t3d-name"
                       {...register("name", {required: true, validate: value => !!value.trim(),})}
                       value={process?.name ?? ''}
                       onChange={handleChange}
                />
                <label htmlFor="data-process-t3d-input-type" className={'required'}>
                  <span className="required-star">*</span>{t("input-data-type")}
                </label>
                <select id="data-process-t3d-input-type"
                        {...register("context.t3d.inputType", {required: true,})}
                        value={process?.context?.payload?.inputType ?? ''}
                        onChange={(e) => {
                          setProcess({
                            ...process,
                            context: {
                              ...process?.context,
                              payload: {
                                ...process?.context?.payload,
                                inputType: e.target.value
                              }
                            }
                          })
                        }}
                >
                  <option value="FBX">FBX (*.fbx)</option>
                  <option value="GLTF">GLTF (*.gltf)</option>
                  <option value="GLB">GLB (*.glb)</option>
                  <option value="KML">KML (*.kml)</option>
                  <option value="COLLADA">COLLADA (*.dae)</option>
                  <option value="MAX_3DS">MAX_3DS (*.3ds)</option>
                  <option value="MAX_ASE">MAX_ASE (*.ase)</option>
                  <option value="OBJ">OBJ (*.obj)</option>
                  <option value="IFC">IFC (*.ifc)</option>
                  <option value="CITY_GML">CITY_GML (*.gml)</option>
                  <option value="INDOOR_GML">INDOOR_GML (*.gml)</option>
                  <option value="LAS">LAS (*.las)</option>
                  <option value="LAZ">LAZ (*.laz)</option>
                  <option value="MODO">MODO (*.lxo)</option>
                  <option value="LWO">LWO (*.lwo)</option>
                  <option value="LWS">LWS (*.lws)</option>
                  <option value="DirectX">DirectX (*.x)</option>
                </select>
                <label htmlFor="data-process-t3d-crs">{t("epsg")}</label>
                <input type="text" placeholder={t("placeholder.epsg")}
                       id="data-process-t3d-crs" {...register("context.t3d.crs")}
                       value={process?.context?.payload?.crs ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           context: {
                             ...process?.context,
                             payload: {
                               ...process?.context?.payload,
                               crs: e.target.value
                             }
                           }
                         })
                       }}
                />
                <label htmlFor="data-process-t3d-proj">{t("proj")}</label>
                <input type="text" placeholder={t("placeholder.proj")}
                       id="data-process-t3d-proj"
                       {...register("context.t3d.proj")}
                       value={process?.context?.payload?.proj ?? ''}
                       onChange={(e) => {
                         setProcess({
                           ...process,
                           context: {
                             ...process?.context,
                             payload: {
                               ...process?.context?.payload,
                               proj: e.target.value
                             }
                           }
                         })
                       }}
                />
                {
                  !isFolded &&
                    <>
                      <label htmlFor="data-process-t3d-reverseTexCoord" style={{cursor: "pointer"}}>{t("convert-texture")}</label>
                      <label htmlFor="data-process-t3d-reverseTexCoord" className="switch">
                        <input type={"checkbox"}
                               id="data-process-t3d-reverseTexCoord"
                               {...register("context.t3d.reverseTexCoord")}
                               checked={process?.context?.payload?.reverseTexCoord ?? false}
                               onChange={(e) => {
                                 setProcess({
                                   ...process,
                                   context: {
                                     ...process?.context,
                                     payload: {
                                       ...process?.context?.payload,
                                       reverseTexCoord: e.target.checked
                                     }
                                   }
                                 })
                               }}
                        />
                        <span className="slider"></span>
                      </label>
                      <label htmlFor="data-process-t3d-pngTexture" style={{cursor: "pointer"}}>{t("setting.png-texture-mod")}</label>
                      <label htmlFor="data-process-t3d-pngTexture" className="switch">
                        <input type={"checkbox"}
                               id="data-process-t3d-pngTexture"
                               {...register("context.t3d.pngTexture")}
                               checked={process?.context?.payload?.pngTexture ?? false}
                               onChange={(e) => {
                                 setProcess({
                                   ...process,
                                   context: {
                                     ...process?.context,
                                     payload: {
                                       ...process?.context?.payload,
                                       pngTexture: e.target.checked
                                     }
                                   }
                                 })
                               }}
                        />
                        <span className="slider"></span>
                      </label>
                      <label htmlFor="data-process-t3d-yUpAxis" style={{cursor: "pointer"}}>{t("setting.y-axis")}</label>
                      <label htmlFor="data-process-t3d-yUpAxis" className="switch">
                        <input type={"checkbox"}
                               id="data-process-t3d-yUpAxis"
                               {...register("context.t3d.yUpAxis")}
                               checked={process?.context?.payload?.yUpAxis ?? false}
                               onChange={(e) => {
                                 setProcess({
                                   ...process,
                                   context: {
                                     ...process?.context,
                                     payload: {
                                       ...process?.context?.payload,
                                       yUpAxis: e.target.checked
                                     }
                                   }
                                 })
                               }}
                        />
                        <span className="slider"></span>
                      </label>
                      <label htmlFor="data-process-t3d-refineAdd" style={{cursor: "pointer"}}>{t("setting.refine-mod")}</label>
                      <label htmlFor="data-process-t3d-refineAdd" className="switch">
                        <input type={"checkbox"}
                               id="data-process-t3d-refineAdd"
                               {...register("context.t3d.refineAdd")}
                               checked={process?.context?.payload?.refineAdd ?? false}
                               onChange={(e) => {
                                 setProcess({
                                   ...process,
                                   context: {
                                     ...process?.context,
                                     payload: {
                                       ...process?.context?.payload,
                                       refineAdd: e.target.checked
                                     }
                                   }
                                 })
                               }}
                        />
                        <span className="slider"></span>
                      </label>
                      <label htmlFor="data-process-t3d-maxCount">{t("setting.node-max")}</label>
                      <input type="number" placeholder={t("placeholder.node-max")}
                             id="data-process-t3d-maxCount"
                             {...register("context.t3d.maxCount")}
                             value={process?.context?.payload?.maxCount ?? 1024}
                             onChange={(e) => {
                               setProcess({
                                 ...process,
                                 context: {
                                      ...process?.context,
                                      payload: {
                                         ...process?.context?.payload,
                                         maxCount: e.target.value
                                      }
                                    }
                                 })
                             }}
                      />
                      <label htmlFor="data-process-t3d-maxLod">{t("setting.lod-max")}</label>
                      <input type="number" placeholder={t("placeholder.lod-max")}
                             id="data-process-t3d-maxLod"
                             {...register("context.t3d.maxLod")}
                             value={process?.context?.payload?.maxLod ?? 3}
                             onChange={(e) => {
                               setProcess({
                                 ...process,
                                 context: {
                                   ...process?.context,
                                   payload: {
                                     ...process?.context?.payload,
                                     maxLod: e.target.value
                                   }
                                 }
                               })
                             }}
                      />
                      <label htmlFor="data-process-t3d-minLod">{t("setting.lod-min")}</label>
                      <input type="number" placeholder={t("placeholder.lod-min")}
                             id="data-process-t3d-minLod"
                             {...register("context.t3d.minLod")}
                             value={process?.context?.payload?.minLod ?? 0}
                             onChange={(e) => {
                               setProcess({
                                 ...process,
                                 context: {
                                   ...process?.context,
                                   payload: {
                                     ...process?.context?.payload,
                                     minLod: e.target.value
                                   }
                                 }
                               })
                             }}
                      />
                      <label htmlFor="data-process-t3d-maxPoints">{t("setting.pointer-max")}</label>
                      <input type="number" placeholder={t("placeholder.pointer-max")}
                             id="data-process-t3d-maxPoints"
                             {...register("context.t3d.maxPoints")}
                             value={process?.context?.payload?.maxPoints ?? 20000}
                             onChange={(e) => {
                               setProcess({
                                 ...process,
                                 context: {
                                   ...process?.context,
                                   payload: {
                                     ...process?.context?.payload,
                                     maxPoints: e.target.value
                                   }
                                 }
                               })
                             }}
                      />
                      <label htmlFor="data-process-t3d-flipCoordinate" style={{cursor: "pointer"}}>{t("setting.convert-x-y")}</label>
                      <label htmlFor="data-process-t3d-flipCoordinate" className="switch">
                        <input type={"checkbox"}
                               id="data-process-t3d-flipCoordinate"
                               {...register("context.t3d.flipCoordinate")}
                               checked={process?.context?.payload?.flipCoordinate ?? false}
                               onChange={(e) => {
                                 setProcess({
                                   ...process,
                                   context: {
                                     ...process?.context,
                                     payload: {
                                       ...process?.context?.payload,
                                       flipCoordinate: e.target.checked
                                     }
                                   }
                                 })
                               }}
                        />
                        <span className="slider"></span>
                      </label>
                      <label htmlFor="data-process-t3d-autoUpAxis" style={{cursor: "pointer"}}>{t("setting.auto-axis")}</label>
                      <label htmlFor="data-process-t3d-autoUpAxis" className="switch">
                        <input type={"checkbox"}
                               id="data-process-t3d-autoUpAxis"
                               {...register("context.t3d.autoUpAxis")}
                               checked={process?.context?.payload?.autoUpAxis ?? false}
                               onChange={(e) => {
                                 setProcess({
                                   ...process,
                                   context: {
                                     ...process?.context,
                                     payload: {
                                       ...process?.context?.payload,
                                       autoUpAxis: e.target.checked
                                     }
                                   }
                                 })
                               }}
                        />
                        <span className="slider"></span>
                      </label>
                    </>
                }
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
export default Process3dTile;