import { useAnalResult } from "@/hooks/useAnalResult";
import EditIcon from '@/assets/edit_icon.png';
import { Fragment, useEffect, useState } from "react";
import { ChromePicker } from "react-color";
import { produce } from "immer";
import { ResultStepType, SelectedCategoryState, SelectedColorLampState, StyleTypeState } from "@/recoils/Analysis";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { choroplethColorList } from "@/api/util";

const AnalResultList = () => {
  const {resultLayers, openResult, setOpenResult, getVisible, toggleVisible, deleteResult, deleteAllResult} = useAnalResult();
  const [selectedResultLayerName, setSelectedResultLayerName] = useState<string | null>(null); // [TODO] type: [string, null
  const setStyleType = useSetRecoilState(StyleTypeState);
  const setSelectedCategory = useSetRecoilState(SelectedCategoryState);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    if (!openResult) {
      setSelectedResultLayerName(null);
      setStyleType('simple');
      setSelectedCategory('');
    } 
  }, [openResult]);

  if (!openResult) return null;

  const List = () => {
    return (
      <div className="dialog-registerPoint darkMode" style={{width:'450px'}}>
        <div className="dialog-title">
          <h3>분석 결과 목록</h3>
          <button className="close floatRight" onClick={()=>{setOpenResult(false)}}></button>
        </div>
        <div className="height-95 yScroll">
          <ul style={{textAlign: 'left', padding: 10, border: '1px solid white', margin: '10px 20px', maxHeight: 200, minHeight: 25, overflow: 'auto'}}>
            {
              Object.keys(resultLayers).map((key, idx) => {
                const {changable,} = resultLayers[key];
                const visible = getVisible(key);
                return (
                  <li key={idx} style={{minHeight: 25, color: 'white', margin: '10px 0px'}}>
                    <p 
                      style={{color: `${visible ? '#fff' : '#919191'}`,float: 'left', margin: 0, cursor: 'pointer'}}
                      onClick={()=> {
                        toggleVisible(key);
                        setRevision(revision + 1);
                      }}
                    >
                      {key}
                    </p>
                    <button type="button" className="btn-small-icon delete" style={{float: 'right', backgroundColor: '#fff'}}
                      onClick={()=>deleteResult(key)}
                    ></button>
                    {
                      changable && 
                      <button type="button" className="btn-small-icon" style={{float: 'right', marginRight: 5, backgroundColor: '#fff', padding: 3, lineHeight: 1}}
                        onClick={()=>{setSelectedResultLayerName(key)}}
                      >
                        <img src={EditIcon}/>
                      </button>
                    }
                  </li>
                )
              })
            }
          </ul>
        </div>
        <div className="darkMode-btn">
          <button type="button" className="register" onClick={deleteAllResult}>전체 삭제</button>
          <button type="button" className="cancel" onClick={()=>{setOpenResult(false)}}><a>닫기</a></button>
        </div>
      </div>
    )
  }

  const Detail = ({selected}:{selected:string}) => {
    const [styleType, setStyleType] = useRecoilState(StyleTypeState);
    const {resultLayers} = useAnalResult();
    const selectedResultLayer = resultLayers[selected];
    const { stepResult } = selectedResultLayer;

    return (
      <div className="dialog-registerPoint darkMode" style={{width:'450px'}}>
        <div className="dialog-title">
          <h3>{selected} 스타일 변경</h3>
          <button className="close floatRight" onClick={()=>{setSelectedResultLayerName(null);setOpenResult(false);}}></button>
        </div>
        <div className="height-95 yScroll">
          <div className="analysisContent width-88" style={{background:'none'}}>
            <label style={{width: "110px", color: "rgb(255, 255, 255)"}}>스타일 유형</label>
            <select style={{marginBottom: "10px"}} value={styleType} onChange={(e)=>{
              const {value} = e.target;
              
              const categorizedConditionCheck = value === 'categorized' && (!stepResult || !stepResult.classify || Object.keys(stepResult.classify).length === 0);
              const graduatideConditionCheck = value === 'graduatide' 
                && (!stepResult || !stepResult.stage 
                  || Object.keys(stepResult.stage).length === 0
                  || Object.keys(stepResult.stage).every((key)=>stepResult.stage[key].length < 5)
                );
              if (categorizedConditionCheck || graduatideConditionCheck) {
                alert('선택하신 스타일을 적용할 수 없습니다.');
                return;
              } 
              setStyleType(value);
            }}>
              <option value="simple">단순 스타일</option>
              <option value="categorized">분류값 스타일</option>
              <option value="graduatide">단계구분 스타일</option>
            </select>
            <HandleStyle selected={selected}/>
          </div>
        </div>
        <div className="darkMode-btn">
          <button type="button" className="register" style={{float:'left'}} onClick={()=>setSelectedResultLayerName(null)}><a>뒤로가기</a></button>
          <button type="button" className="cancel" onClick={()=>{setOpenResult(false)}}><a>닫기</a></button>
        </div>
      </div>
    )
  }

  return selectedResultLayerName === null ? <List /> : <Detail selected={selectedResultLayerName}/>
}

const HandleStyle = ({selected}:{selected:string}) => {
  const styleType = useRecoilValue(StyleTypeState);
  const [selectedCategory, setSelectedCategory] = useRecoilState(SelectedCategoryState);
  const [selectedColorLamp, setSelectedColorLamp] = useRecoilState(SelectedColorLampState);
  const {resultLayers, setResultLayers, changeSimpleEntityStyle, changeCategorizedEntityStyle, changeGraduatideEntityStyle} = useAnalResult();
  const selectedResultLayer = resultLayers[selected];
  const { layerName, stepResult} = selectedResultLayer;
  const [fColor, setFillColor] = useState<string | undefined>('');
  const [fOpacity, setFillOpacity] = useState<number | undefined>(0);
  const [lColor, setLineColor] = useState<string | undefined>('');
  const [lOpacity, setLineOpacity] = useState<number | undefined>(0);
  const [lWidth, setLineWidth] = useState<number | undefined>(0);

  const [openFill, setOpenFill] = useState(false);
  const [openStageFill, setOpenStageFill] = useState<number | undefined>(undefined);
  const [openLine, setOpenLine] = useState(false);

  const [classify, setClassify] = useState<ResultStepType['classify'] | undefined>(undefined);
  const [stage, setStage] = useState<ResultStepType['stage'] | undefined>(undefined);

  useEffect(() => {
    const { fillColor, fillOpacity, lineColor, lineOpacity, lineWidth, stepResult} = selectedResultLayer;
    setFillColor(fillColor);
    setFillOpacity(fillOpacity);
    setLineColor(lineColor);
    setLineOpacity(lineOpacity);
    setLineWidth(lineWidth);
    setClassify(stepResult?.classify);
    setStage(stepResult?.stage);
  }, [selectedResultLayer]);

  useEffect(() => {
    document.addEventListener('click', closeColorPopup);
    return () => {
      document.removeEventListener('click', closeColorPopup);
    }
  });

  /* useEffect(() => {
    console.info(styleType);
    //setSelectedCategory('');
  }, [styleType]) */

  const apply = () => {
    if (styleType !== 'simple' && !selectedCategory) {
      alert('필드를 선택해주세요.');
      return;
    }

    setResultLayers(produce((draft)=>{
      draft[layerName] = {
        ...selectedResultLayer,
        fillColor: fColor,
        fillOpacity: fOpacity,
        lineColor: lColor,
        lineOpacity: lOpacity,
        lineWidth: lWidth,
      }
      
      draft[layerName].stepResult = {
        classify: classify ? classify : (stepResult?.classify ? stepResult.classify : {}),
        stage: stage ? stage : (stepResult?.stage ? stepResult.stage : {})
      }
    }));

    if (styleType === 'simple') {
      changeSimpleEntityStyle({
        layerName: layerName,
        fillColor: fColor,
        fillOpacity: fOpacity,
        lineColor: lColor,
        lineOpacity: lOpacity,
        lineWidth: lWidth
      })
    } else if (styleType === 'categorized' && classify && selectedCategory) {
      changeCategorizedEntityStyle({
        layerName: layerName,
        key: selectedCategory,
        valueAndColors: classify[selectedCategory],
        fillOpacity: fOpacity,
        lineColor: lColor,
        lineOpacity: lOpacity,
        lineWidth: lWidth
      });
    } else if (styleType === 'graduatide' && stage && selectedCategory && selectedColorLamp) {
      // [TODO] changeGraduatideEntityStyle
      changeGraduatideEntityStyle({
        layerName: layerName,
        key: selectedCategory,
        colorKey: selectedColorLamp,
        fillOpacity: fOpacity,
        lineColor: lColor,
        lineOpacity: lOpacity,
        lineWidth: lWidth
      })
    }
  }

  const closeColorPopup = () => {
    setOpenFill(false);
    setOpenStageFill(undefined);
    setOpenLine(false);
  }

  const changeCategory = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const {value} = e.target;
    setSelectedCategory(value);
  }
  
  return (
    <Fragment>
      {
        styleType === 'simple' && 
        <>
          <label style={{width: "110px", color: "rgb(255, 255, 255)"}}>면색</label>
          <button className="layer-color-button" onClick={(e) => {
            e.stopPropagation();
            setOpenFill(true);
            }}>
            <div style={{width: '80%', height: '15px', margin: 'auto', borderRadius: '2px', backgroundColor: fColor}}>
              {
                openFill && <div style={{position:'absolute', left: '40%'}}>
                <ChromePicker
                  color={fColor}
                  onChangeComplete={(e) => setFillColor(e.hex)} 
                />
              </div>}
            </div>
          </button>
        </>
      }

      {
        styleType === 'categorized' && stepResult && stepResult.classify && Object.keys(stepResult.classify).length > 0 &&
        <>
          <label style={{width: "110px", color: "rgb(255, 255, 255)"}}>필드</label>
          <select value={selectedCategory} onChange={changeCategory}>
            <option value={''}>필드를 선택해주세요.</option>
            {
              Object.keys(stepResult.classify).map((key, idx) => {
                return <option key={idx} value={key}>{key}</option>
              })
            }
          </select>
        </>
      }
      {
        styleType === 'categorized' && selectedCategory !== '' &&
        <div style={{display: 'inline-block', border: '1px solid #999', marginLeft: 111, padding: 10, overflow: 'auto', maxHeight: 150}}>
          {
            stepResult && classify && Object.keys(classify[selectedCategory]).map((key, idx) => {
              const color = classify[selectedCategory][key];
              return (
                <Fragment key={idx}>
                  <label style={{width: "65px", color: "rgb(255, 255, 255)", marginRight:'3px',display: 'inline-block',verticalAlign: 'middle'}}>
                    {key}
                  </label>
                  <button className="layer-color-button" style={{width:'55%', verticalAlign: 'middle'}} onClick={(e) => {
                    e.stopPropagation();
                    setOpenStageFill(idx);
                  }}>
                    <div style={{width: '80%', height: '15px', margin: 'auto', borderRadius: '2px', backgroundColor: color}}>
                      {
                        openStageFill === idx && <div style={{position:'absolute', left: '40%'}}>
                        <ChromePicker
                          color={color}
                          onChangeComplete={(e) => setClassify(produce(classify, (draft) => {
                            draft[selectedCategory][key] = e.hex;
                          }))} 
                        />
                      </div>}
                    </div>
                  </button>
                </Fragment>
              )
            })
          }
        </div>
      }

      {
        styleType === 'graduatide' && stepResult && stepResult.stage && Object.keys(stepResult.stage).length > 0 &&
        <>
          <label style={{width: "110px", color: "rgb(255, 255, 255)"}}>필드</label>
          <select value={selectedCategory} onChange={changeCategory}>
            <option value={''}>필드를 선택해주세요.</option>
            {
              Object.keys(stepResult.stage).map((key, idx) => {
                return <option key={idx} value={key}>{key}</option>
              })
            }
          </select>
          <label style={{width: "110px", color: "rgb(255, 255, 255)"}}>필드</label>
          <select value={selectedColorLamp} onChange={(e) => {
            setSelectedColorLamp(e.target.value);
          }}>
            {
            choroplethColorList.map((item,idx) => {
              return(
                <option key={idx} value={item.title}>{item.title}</option>
              )
            })
            }
          </select>
        </>
      }
      
      <label style={{width: 110, color:'#fff'}}>면 투명도</label>
      <input type="range" 
        min={0} max={1} step={0.1} 
        style={{width:'40%'}}
        value={fOpacity}
        onChange={(e) => setFillOpacity(Number(e.target.value))}
        />
      <input type="number" 
        min={0} max={1} step={0.1} 
        style={{width: '15%', marginLeft: 5, backgroundColor: 'rgba(255,255,255,0)', borderRadius: 3, border: '1px solid #585858', color: '#fff'}}
        value={fOpacity}
        onChange={(e) => setFillOpacity(Number(e.target.value))}
        />
      <label style={{width: "110px", color: "rgb(255, 255, 255)"}}>선색</label>
      <button className="layer-color-button" onClick={(e) => {
        e.stopPropagation();
        setOpenLine(true);
        }}>
        <div style={{width: '80%', height: '15px', margin: 'auto', borderRadius: '2px', backgroundColor: lColor}}>
          {openLine && <div style={{position:'absolute', left: '40%'}}>
            <ChromePicker
              color={lColor}
              onChangeComplete={(e) => setLineColor(e.hex)} 
            />
          </div>}
        </div>
      </button>
      <label style={{width: 110, color:'#fff'}}>선 투명도</label>
      <input type="range" 
        min={0} max={1} step={0.1} 
        style={{width:'40%'}}
        value={lOpacity}
        onChange={(e) => setLineOpacity(Number(e.target.value))}
        />
      <input type="number" 
        min={0} max={1} step={0.1} 
        style={{width: '15%', marginLeft: 5, backgroundColor: 'rgba(255,255,255,0)', borderRadius: 3, border: '1px solid #585858', color: '#fff'}}
        value={lOpacity}
        onChange={(e) => setLineOpacity(Number(e.target.value))}
        />
      <label style={{ width: 110, color: '#fff' }}>선 굵기</label>
      <input type="number"
        style={{ textAlign: 'right', backgroundColor: 'rgba(255,255,255,0)', width: '59%', borderRadius: 3, border: '1px solid #585858', color: '#fff' }}
        value={lWidth === undefined ? 1 : lWidth}
        onChange={(e) => setLineWidth(Number(e.target.value))}
      />
      <div className="darkMode-btn">
				<button type="button" className="cancel" onClick={() => apply()} style={{ float: 'left' }}><a>적용</a></button>
			</div>
    </Fragment>
  )
}

export default AnalResultList;