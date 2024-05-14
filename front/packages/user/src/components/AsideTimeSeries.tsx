import React, { Fragment, useEffect, useRef, useState } from "react";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import { timeseriesSearchConditionState, drawedEntityIdState, timeSeriesState, productDetailState, checkedIdsState, batchFootprintState, batchImageState } from "@/recoils/TimeSeriesState";
import { useSidoAddress } from "@/hooks/useAddress";
import {produce} from "immer";
import { DefaultError, useQuery } from "@tanstack/react-query";
import { timeseriesGraphqlFetcher } from "@/api/queryClient";
import { GET_CATEGORIES, GET_PRODUCT, GET_PRODUCTS } from "@/graphql/timeseries/Query";
import { Category, PaginationInfo, Product, ProductFilterInput, Query } from "@mnd/shared/src/types/timeseries-gen-type";
import { AppLoader, download } from "@mnd/shared";
import { DrawEndFuncProps, DrawType, useAnalGeometryDraw } from "@/hooks/useAnalGeometryDraw";
import { useGlobeController } from "./providers/GlobeControllerProvider";
import * as Cesium from "cesium";
import { Geometry, Position, feature, featureCollection} from "@turf/turf";
import { parseFromWK } from "wkt-parser-helper";
import dayjs from "dayjs";
import ReactDOM from "react-dom";
import keycloak from "@/api/keycloak";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import Pagination from "./Pagination";

export const AsideTimeSeries = () => {
  const [state, setState] = useRecoilState(timeSeriesState);
  const resetSearchCondition = useResetRecoilState(timeseriesSearchConditionState);
  const {globeController:{timeseriesDataSource}} = useGlobeController();

  useEffect(() => {
    return () => {
      timeseriesDataSource.entities.removeAll();
      resetSearchCondition();
    }
  }, []);
  
  return (
    <aside className="gray-bg">
      <div className="aside-content marginTop-20">
        <MainTabMenu />
        {state.mainTabIndex === 0 ? <SearchFormTab /> : null}
        {state.mainTabIndex === 1 ? <SearchResultTab /> : null}
      </div>
    </aside>
  );
};

function MainTabMenu() {
  const [{ mainTabIndex: index }, setState] = useRecoilState(timeSeriesState);

  const onTabClick = (e: React.MouseEvent<HTMLLIElement>, value: number) => {
    e.preventDefault();
    setState(produce((draft) => {
      draft.mainTabIndex = value;
    }));
  };

  return (
    <ul className="timeSeries-search">
      <li className={index === 0 ? "on" : ""} onClick={(e) => onTabClick(e, 0)}>
        <a>검색</a>
      </li>
      <li className={index === 1 ? "on" : ""} onClick={(e) => onTabClick(e, 1)}>
        <a>검색결과</a>
      </li>
    </ul>
  );
}

function SearchFormTab() {
  const [{ searchMenuIndex: index }] = useRecoilState(timeSeriesState);
  const {globeController:{timeseriesDataSource}} = useGlobeController();

  useEffect(() => {
    timeseriesDataSource.entities.removeAll();
  }, []);

  return (
    <>
      <SearchFormTabMenu/>
      {index === 0 ? <영역그리기 /> : null}
      {index === 1 ? <행정구역 /> : null}
    </>
  );
}

function SearchFormTabMenu() {
  const [{ searchMenuIndex: index }, setState] = useRecoilState(timeSeriesState);

  const onClick = (e: React.MouseEvent<HTMLLIElement>, value: number) => {
    e.preventDefault();
    setState(produce((draft) => {
      draft.searchMenuIndex = value;
    }));
  };

  return (
      <ul className="tabMenu type03 width-88" style={{overflowX: 'hidden', overflowY: 'hidden'}}>
        <li className={index === 0 ? "on" : ""} onClick={(e) => onClick(e, 0)}>
          <a>영역그리기</a>
        </li>
        <li className={index === 1 ? "on" : ""} onClick={(e) => onClick(e, 1)}>
          <a>행정구역</a>
        </li>
      </ul>
  );
}

function 영역그리기() {
  const getDrawType = (drawIndex:number) => {
    switch(drawIndex) {
      case 0:
        return DrawType.Circle;
      case 1:
        return DrawType.Box;
      case 2:
        return DrawType.Polygon;
      default:
        return DrawType.Circle;
    }
  }
  const [{ drawIndex: index }, setState] = useRecoilState(timeSeriesState);
  const setDrawedEntityId = useSetRecoilState(drawedEntityIdState);
  const setTimeseriesSearchCondition = useSetRecoilState(timeseriesSearchConditionState);

  const onClick = (e: React.MouseEvent<HTMLLIElement>, value: number) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, drawIndex: value }));
    toggleDrawType(getDrawType(value));
  };
  useEffect(() => {
    setTimeseriesSearchCondition(produce((draft) => {
      draft.code = undefined;
    }));
    toggleDrawType(getDrawType(index));
    return () => {
      setDrawedEntityId(undefined);
    }
  }, []);

  const drawEnd = (props:DrawEndFuncProps) => {
    const {cartesians, resultEntity, wkt} = props;
    if (!cartesians) return;
    setDrawedEntityId(resultEntity.id);
    setTimeseriesSearchCondition(produce((draft) => {
      draft.wkt = wkt;
    }));
  };
    
  const {clearCropShape, toggleDrawType} = useAnalGeometryDraw({drawEnd, restrictArea: false});

  return (
    <>
      <ul className="register coordinate-03 width-88">
        <li
          className={`area-circle ${index === 0 ? "on" : ""}`}
          onClick={(e) => onClick(e, 0)}
        >
          <a>원형</a>
        </li>
        <li
          className={`area-rectangle ${index === 1 ? "on" : ""}`}
          onClick={(e) => onClick(e, 1)}
        >
          <a>사각형</a>
        </li>
        <li
          className={`area-polygon ${index === 2 ? "on" : ""}`}
          onClick={(e) => onClick(e, 2)}
        >
          <a>다각형</a>
        </li>
      </ul>
      {index === 0 ? <원형 clearFunc={clearCropShape} toggleDrawType={toggleDrawType}/> : null}
      {index === 1 ? <사각형 clearFunc={clearCropShape} toggleDrawType={toggleDrawType}/> : null}
      {index === 2 ? <다각형 clearFunc={clearCropShape} toggleDrawType={toggleDrawType}/> : null}
    </>
  );
}

function 원형({clearFunc, toggleDrawType}: {clearFunc:()=>void, toggleDrawType: (drawType:DrawType)=>void}) {
  const [, setDrawedEntityId] = useRecoilState(drawedEntityIdState);
  const setState = useSetRecoilState(timeSeriesState);

  const [timeseriesSearchCondition, setTimeseriesSearchCondition] = useRecoilState(timeseriesSearchConditionState);

  const longitudeRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const majorAxisRef = useRef<HTMLInputElement>(null);
  const minorAxisRef = useRef<HTMLInputElement>(null);

  const search = () => {
    if (!timeseriesSearchCondition.wkt) {
      alert("영역을 그려주세요.");
      return;
    }

    setTimeseriesSearchCondition(produce((draft) => {
      draft.producting = true;
    }));
    setState(produce((draft) => {
      draft.mainTabIndex = 1;
    }));
  }

  const reset = () => {
    if (longitudeRef.current) longitudeRef.current.value = "";
    if (latitudeRef.current) latitudeRef.current.value = "";
    if (majorAxisRef.current) majorAxisRef.current.value = "";
    if (minorAxisRef.current) minorAxisRef.current.value = "";

    clearFunc();
    setDrawedEntityId(undefined);
    toggleDrawType(DrawType.Circle);
    setTimeseriesSearchCondition(produce((draft) => {
      draft.wkt = undefined;
    }));
  }
  return (
    <div className="timeSeriesContent width-88">
      <div className="btn">
        <button type="button" className="btn-small white" onClick={reset}>
          초기화
        </button>
      </div>
      <위성선택 />
      <날짜 />
      <div className="btn-large">
        <button type="button" className="btn-apply" onClick={search}>
          검색
        </button>
      </div>
    </div>
  );
}

function 사각형({clearFunc, toggleDrawType}: {clearFunc:()=>void, toggleDrawType: (drawType:DrawType)=>void}) {
  const [, setDrawedEntityId] = useRecoilState(drawedEntityIdState);
  const setState = useSetRecoilState(timeSeriesState);

  const [timeseriesSearchCondition, setTimeseriesSearchCondition] = useRecoilState(timeseriesSearchConditionState);

  const westRef = useRef<HTMLInputElement>(null);
  const southRef = useRef<HTMLInputElement>(null);
  const eastRef = useRef<HTMLInputElement>(null);
  const northRef = useRef<HTMLInputElement>(null);

  const search = () => {
    if (!timeseriesSearchCondition.wkt) {
      alert("영역을 그려주세요.");
      return;
    }

    setTimeseriesSearchCondition(produce((draft) => {
      draft.producting = true;
    }));
    setState(produce((draft) => {
      draft.mainTabIndex = 1;
    }));
  }

  const reset = () => {
    if (westRef.current) westRef.current.value = "";
    if (southRef.current) southRef.current.value = "";
    if (eastRef.current) eastRef.current.value = "";
    if (northRef.current) northRef.current.value = "";

    clearFunc();
    setDrawedEntityId(undefined);
    toggleDrawType(DrawType.Box);
    setTimeseriesSearchCondition(produce((draft) => {
      draft.wkt = undefined;
    }));
  }
  return (
    <div className="timeSeriesContent width-88">
      <div className="btn">
        <button type="button" className="btn-small white" onClick={reset}>
          초기화
        </button>
      </div>
      <위성선택 />
      <날짜 />
      <div className="btn-large">
        <button type="button" className="btn-apply" onClick={search}>
          검색
        </button>
      </div>
    </div>
  );
}

function 다각형({clearFunc, toggleDrawType}: {clearFunc:()=>void, toggleDrawType: (drawType:DrawType)=>void}) {
  const [, setDrawedEntityId] = useRecoilState(drawedEntityIdState);
  const setState = useSetRecoilState(timeSeriesState);
  const [timeseriesSearchCondition, setTimeseriesSearchCondition] = useRecoilState(timeseriesSearchConditionState);

  const search = () => {
    if (!timeseriesSearchCondition.wkt) {
      alert("영역을 그려주세요.");
      return;
    }

    setTimeseriesSearchCondition(produce((draft) => {
      draft.producting = true;
    }));
    setState(produce((draft) => {
      draft.mainTabIndex = 1;
    }));
  }

  const reset = () => {
    clearFunc();
    setDrawedEntityId(undefined);
    toggleDrawType(DrawType.Polygon);
    setTimeseriesSearchCondition(produce((draft) => {
      draft.wkt = undefined;
    }));
  }
  return (
    <div className="timeSeriesContent width-88">
      <div className="btn">
        <button type="button" className="btn-small white" onClick={reset}>
          초기화
        </button>
      </div>
      <위성선택 />
      <날짜 />
      <div className="btn-large">
        <button type="button" className="btn-apply" onClick={search}>
          검색
        </button>
      </div>
    </div>
  );
}

function 행정구역() {
  const { data: addresses } = useSidoAddress();
  const setState = useSetRecoilState(timeSeriesState);
  const [timeseriesSearchCondition, setTimeseriesSearchCondition] = useRecoilState(timeseriesSearchConditionState);

  useEffect(() => {
    setTimeseriesSearchCondition(produce((draft) => {
      draft.wkt = undefined;
    }));
  }, []);
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      setTimeseriesSearchCondition(produce((draft) => {
        draft.code = addresses[0].code;
      }));
    }
  }, [addresses]);

  const search = () => {
    if (!timeseriesSearchCondition.code) {
      alert("행정구역을 선택해주세요.");
      return;
    }

    setTimeseriesSearchCondition(produce((draft) => {
      draft.producting = true;
    }));
    setState(produce((draft) => {
      draft.mainTabIndex = 1;
    }));
  }

  const changeSido = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeseriesSearchCondition(produce((draft) => {
      draft.code = e.target.value;
    }));
  }
  return (
    <div className="height-98 yScroll">
      <div className="timeSeriesContent width-88">
        <label>시도</label>
        <select value={undefined} onChange={(e)=>{changeSido(e)}}>
          {
          addresses && addresses.map((item) => (
            <option key={item.id} value={item.code}>
              {item.name}
            </option>
          ))
          }
        </select>
        <위성선택 />
        <날짜 />
        <div className="btn-large">
          <button type="button" className=" btn-apply" onClick={search}>
            검색
          </button>
        </div>
      </div>
    </div>
  );
}

type RefinedCategory = Pick<Category, 'code' | 'description'>;
const refine = (parentName='', category: Category, result:RefinedCategory[] = []):RefinedCategory[] => {
  if (category.children && category.children.length > 0) {			
    category.children.forEach((child) => {
      result.push(...refine(`${parentName} ${category.description}` as string, child));
      return;
    });
  } else {
    result.push({code: category.code, description: `${parentName} ${category.description}`});
  }
  return result;
}
function 위성선택() {
  const [timeseriesSearchCondition, setTimeseriesSearchCondition] = useRecoilState(timeseriesSearchConditionState);
 
	const { data:categories, isFetching } = useQuery<Query, DefaultError, Category[]>({
		queryKey: ['timeseriesCategories'],
		queryFn: () => timeseriesGraphqlFetcher(GET_CATEGORIES),
		select: (data) => data.categories,
  });

	if (isFetching) return <AppLoader />;
	const refinedCategories:RefinedCategory[] = [];
	categories?.forEach((category) => refine('', category, refinedCategories));
	
  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {checked, value} = e.currentTarget;
    if (checked) {
      setTimeseriesSearchCondition(produce((draft) => {
        draft.checkedTimeSeriesType = [...draft.checkedTimeSeriesType, value];
      }));
    } else {
      setTimeseriesSearchCondition(produce((draft) => {
        draft.checkedTimeSeriesType = draft.checkedTimeSeriesType.filter((item) => item !== value);
      }));
    }
  }

	return (
		<>
		<h2>데이터 선택</h2>
		<ul className="basic-list">
			{
				refinedCategories.map((item, idx) => (
					<li key={idx}>
						<input type="checkbox" 
              checked={timeseriesSearchCondition.checkedTimeSeriesType.indexOf(item.code) > -1 ? true :false} 
              value={item.code} onChange={handleType}/> {item.description}
					</li>
				))
			}
		</ul>
		</>
	)
}

function 날짜() {
  const [openMonth, isOpenMonth] = useState(false);
  const [timeseriesSearchCondition, setTimeseriesSearchCondition] = useRecoilState(timeseriesSearchConditionState);

  const changeMonth = (month: number) => {
    setTimeseriesSearchCondition(produce(draft => {
        // draft.selectedMonth가 정의되지 않았을 경우, 초기값을 설정합니다.
        if (!draft.selectedMonth) {
          draft.selectedMonth = [];
        }
        // 선택된 월이 배열에 있다면 제거하고, 그렇지 않다면 추가합니다.
        const index = draft.selectedMonth.indexOf(month);
        if (index !== -1) {
          draft.selectedMonth.splice(index, 1);
        } else {
          draft.selectedMonth.push(month);
        }
      })
    );
  }

  return (
    <>
      <h2>날짜 선택</h2>
        <label htmlFor="timeseries-date-start" style={{width:'40px'}}>시작일</label> 
        <input type="date" id="timeseries-date-start" value={timeseriesSearchCondition.startDate} onChange={(e)=>{
          setTimeseriesSearchCondition(produce((draft) => {
            draft.startDate = e.target.value;
          }));
        }}/>
        <label htmlFor="timeseries-date-end" style={{width:'40px'}}>종료일</label> 
        <input type="date" id="timeseries-date-end" value={timeseriesSearchCondition.endDate} onChange={(e)=>{
          setTimeseriesSearchCondition(produce((draft) => {
            draft.endDate = e.target.value;
          }));
        }}/>
        <div className="select-month" onClick={()=>isOpenMonth(!openMonth)}>{timeseriesSearchCondition.selectedMonth ? `${timeseriesSearchCondition.selectedMonth}월` : '선택'}</div>
        {
          openMonth &&
          <div className="dialog-month-select">
            {
              Array.from({length:6}, (v,index) => index).map((item) => {
                return (
                  <Fragment key={item}>
                  <label>
                    <input type="checkbox" name="timeseries-month" onChange={()=>{changeMonth(item+1)}} checked={timeseriesSearchCondition.selectedMonth?.includes(item + 1) ?? false} value={item + 1} /> {item + 1}월
                  </label>
                  <label>
                    <input type="checkbox" name="timeseries-month" onChange={()=>{changeMonth(item+7)}} checked={timeseriesSearchCondition.selectedMonth?.includes(item + 7) ?? false} value={item + 7} /> {item + 7}월
                  </label>
                  </Fragment>
                )
              })
            }
          </div>
        }
    </>
  )
}

function SearchResultTab() {
  const {globeController:{timeseriesDataSource}} = useGlobeController();
  const [timeseriesSearchCondition, setTimeseriesSearchCondition] = useRecoilState(timeseriesSearchConditionState);
  const [checkedIds, setCheckedIds] = useRecoilState(checkedIdsState);
  const [batchFootprint, setBatchFootprint] = useRecoilState(batchFootprintState);
  const [batchImage, setBatchImage] = useRecoilState(batchImageState);
  const [products, setProducts] = useState<Product[]>([]);
  const [pageInfo, setPageInfo] = useState<Partial<PaginationInfo>>({
    totalItems: 0,
    totalPages: 0,
    page: 0,
    size: 0,
  });

  const totalDownload = () => {
    if (checkedIds.length === 0) {
      alert("다운로드할 항목을 선택해주세요.");
      return;
    }

    const {token} = keycloak;
    if (!token) return;

    const config: AxiosRequestConfig = {
      method: 'post',
      url: `${import.meta.env.VITE_API_URL}/app/api/timeseries/product/download`,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*', // 여기에 Accept 헤더를 추가합니다.
      },
      responseType: 'blob',
      data: checkedIds
    }

    axios(config)
    .then((response) => {
      download(response.data, `image-${dayjs().format("YYYYMMDDHHmmss")}.zip`);
    })
    .catch((err) => {
      console.error(err);
      alert('다운로드에 실패했습니다.');
    });
  }
  
  useEffect(() => {
    setCheckedIds(produce((draft) => {
      draft.length = 0;  
    }));
    return () => {
      setTimeseriesSearchCondition(produce((draft) => {
        draft.wkt = undefined;
        draft.code = undefined;
        draft.page = 0;
      }))
    }
  }, []);

  const changePage = (pageNum:number) => {
    setTimeseriesSearchCondition(produce((draft) => {
      draft.page = pageNum;
      draft.producting = true;
    }));
    timeseriesDataSource.entities.removeAll();
  }
  
  useEffect(() => {
    const {producting, wkt, code} = timeseriesSearchCondition;
    if (!producting || (!wkt && !code)) return;

    const filter:ProductFilterInput = wkt ? 
    {
      searchArea: featureCollection([feature(parseFromWK(wkt))]) ,
    }
    :
    {
      boundaryCode: code,
    };
    
    retProduct(filter);
  }, [timeseriesSearchCondition]);

  const retProduct = (filter: ProductFilterInput) => {
    const {checkedTimeSeriesType, selectedMonth, endDate, startDate, page} = timeseriesSearchCondition;
    const convertISODate = (date: string) => {
      return dayjs(date).toISOString();
    }

    if (checkedTimeSeriesType.length > 0) {
      filter.or = checkedTimeSeriesType.map((item => {
        return {
          type: {contains: item}
        }
      }));
    }

    if (selectedMonth.length > 0) {
      filter.month = {
        in: selectedMonth,
      }
    }

    if ((endDate && endDate !== "") && (startDate && startDate !== "")) {
      filter.and = [
        {
          date: {
            ge: convertISODate(startDate),
          }
        },
        {
          date: {
            le: convertISODate(endDate),
          }
        }
      ]
    } else if (startDate && startDate !== "") {
      filter.date = {
        ge: convertISODate(startDate),
      }
    } else if (endDate && endDate !== "") {
      filter.date = {
        le: convertISODate(endDate),
      }
    }   

    timeseriesGraphqlFetcher(GET_PRODUCTS, {filter, page})
    .then((data) => {
      const {products} = data as Query;
      const {items, pageInfo} = products;
      setProducts(produce((draft) => {
        draft.length = 0;
        draft.push(...items);
      }));

      setPageInfo(produce((draft) => {
        draft.totalItems = pageInfo.totalItems;
        draft.totalPages = pageInfo.totalPages;
        draft.page = pageInfo.page;
        draft.size = pageInfo.size;
      }));

      setBatchFootprint(produce((draft) => {
        draft.length = 0;
        draft.push(...items.map((item) => item.id));
      }));

      timeseriesDataSource.entities.removeAll();
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setTimeseriesSearchCondition(produce((draft) => {
        draft.producting = false;
      }))
    });
  }
  
  return (
    <div className="height-98">
      <div className="timeSeries-result">
        <div className="result-total">
          <div className="total-left">
            <span className="fontColorOrange">{pageInfo.totalItems}</span>
            <span className="fontColorGray">건</span>
          </div>
          <div className="total-right">
            <span className="title">{(pageInfo.page ?? 0) + 1}</span>
            <span className="dash">/</span>
            <span className="value">{pageInfo.totalPages}</span>
          </div>
        </div>
        <div className="button-result-total">
          <input type="checkbox" className="total-check" checked={products.length === checkedIds.length} onChange={(e)=>{
            e.target.checked
            ? setCheckedIds(produce((draft) => {draft.length = 0;draft.push(...products.map((item) => item.id));}))
            : setCheckedIds(produce((draft) => {draft.length = 0;}))
          }} />
          <button type="button" onClick={(e)=>{
            if (checkedIds.length === 0) {
              alert("선택된 영상이 없습니다.");
              return;
            }
            setBatchFootprint(produce((draft) => {
              checkedIds.forEach((id) => {
                draft.includes(id) ? draft.splice(draft.indexOf(id), 1) : draft.push(id);
              });
              return draft;
            }));
          }}><span className="total-footprint"></span>footprint</button>
          <button type="button" onClick={(e)=>{
            if (checkedIds.length === 0) {
              alert("선택된 영상이 없습니다.");
              return;
            }
            setBatchImage(produce((draft) => {
              checkedIds.forEach((id) => {
                draft.includes(id) ? draft.splice(draft.indexOf(id), 1) : draft.push(id);
              });
              return draft;
            }));
          }}><span className="total-shoot"></span>영상</button>
          <button type="button" onClick={totalDownload}><span className="total-down"></span>다운로드</button>
        </div>
        {
          products && products.length > 0 ?
          products.map((product, idx) => {
            return (
              <SearchResultItem product={product} key={idx}/>
            )
          }) : <div className="list" style={{float:'none', textAlign:'center', marginTop: '20px'}}>검색 결과가 없습니다.</div>
        }
      </div>
      {
        pageInfo.totalItems && pageInfo.totalItems > 0 && <Pagination page={pageInfo.page ?? 0} totalPages={pageInfo.totalPages ?? 0} 
        pagePerCount={pageInfo.size} handler={changePage} 
        styleProps={{
            marginLeft:'50px',
        }}/>
      }
    </div>
  );
}

function SearchResultItem({product}:{product:Product}) {
  const {globeController:{timeseriesDataSource, viewer}} = useGlobeController();
  const [onFootprint, setOnFootprint] = useState(true);
  const [onImage, setOnImage] = useState(true);
  const { date, download, downloadThumbnail, downloadThumbnailTransparent, footprint, bbox, id, filename} = product;
  const [footPrintEntityId, setFootPrintEntityId] = useState<string | undefined>(undefined);
  const [imageEntityId, setImageEntityId] = useState<string | undefined>(undefined);
  const setProductDetail = useSetRecoilState(productDetailState);
  const [checkedIds, setCheckedIds] = useRecoilState(checkedIdsState);
  const [batchFootprint, setBatchFootprint] = useRecoilState(batchFootprintState);
  const [batchImage, setBatchImage] = useRecoilState(batchImageState);
  
  useEffect(() => {
    setOnFootprint(batchFootprint.includes(id));
  }, [batchFootprint]);

  useEffect(() => {
    setOnImage(batchImage.includes(id));
  }, [batchImage]);

  const toFly = (e:React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!viewer) return;

    if (!footPrintEntityId) return;
    const entity = timeseriesDataSource.entities.getById(footPrintEntityId);
    if (!entity) return;

    viewer.flyTo(entity, {
      duration: 1,
    })
  }

  const downloadFile = () => {
    if (!download) return;

    const {token} = keycloak;
    if (!token) return;

    const config: AxiosRequestConfig = {
      method: 'get',
      url: download,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: '*/*', // 여기에 Accept 헤더를 추가합니다.
      },
      responseType: 'blob',
    }

    axios(config)
    .then((response: AxiosResponse) => {
      const data = response.data;
      const blob = new Blob([data], { type: response.headers['content-type'] || 'application/octet-stream' }); // 서버에서 제공하는 MIME type에 따라 Blob을 생성합니다.

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename ?? 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    })
  }

  const viewDetail = () => {
    timeseriesGraphqlFetcher(GET_PRODUCT, {id})
    .then((data) => {
      const {product} = data as Query;
      setProductDetail(product);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      //
    });
  }
  useEffect(() => {
    const footprintJson:Geometry = JSON.parse(footprint);
    const { coordinates } = footprintJson;

    const cartesians = (coordinates[0] as Position[]).map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
    const footPrintEntity = timeseriesDataSource.entities.add({
      polygon: {
        hierarchy: cartesians,
        material: Cesium.Color.BLACK.withAlpha(0.4),
        outline: true,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        show: onFootprint
      }
    });

    // 센티넬 위성영상의 경우 bbox를 썸네일 bbox로 사용
    const bboxJson:Geometry = JSON.parse(bbox);
    const cartesiansBbox = (bboxJson.coordinates[0] as Position[]).map(([lon, lat]) => Cesium.Cartesian3.fromDegrees(lon, lat));
    const imageEntity = timeseriesDataSource.entities.add({
      polygon: {
        hierarchy: cartesiansBbox, // cartesians, cartesiansBbox,
        material: new Cesium.ImageMaterialProperty({
          image: new Cesium.ConstantProperty(downloadThumbnailTransparent), //downloadThumbnailTransparent
        }),
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        show: onImage
      }
    });
    setFootPrintEntityId(footPrintEntity.id);
    setImageEntityId(imageEntity.id);

  }, [product]);

  useEffect(() => {
    if (!footPrintEntityId) return;
    const entity = timeseriesDataSource.entities.getById(footPrintEntityId);
    if (!entity) return;
    entity.show = onFootprint;
  }, [onFootprint]);

  useEffect(() => {
    if (!imageEntityId) return;
    const entity = timeseriesDataSource.entities.getById(imageEntityId);
    if (!entity) return;
    entity.show = onImage;
  }, [onImage]);
  
  return (
    <>
    <ProductDetailPopup />    
    <div className="list" onClick={toFly} style={{cursor:'pointer'}}>
      <input type="checkbox" checked={checkedIds.includes(id)} onClick={(e)=>{e.stopPropagation();}}
      onChange={(e)=>{
        e.stopPropagation();
        e.target.checked 
        ? setCheckedIds(produce((draft) => {draft.push(id);}))
        : setCheckedIds(produce((draft) => draft.filter((item) => item !== id))) 
      }
      }/>
      <picture>
        <img style={{maxHeight:"72px", maxWidth:"72px"}} src={downloadThumbnail ?? ''} />
      </picture>
      <div className="list-item">
        <span className="title">ID</span>
        <span className="value">{id}</span>
      </div>
      <div className="list-item">
        <span className="title">영상취득일</span>
        <span className="date">{dayjs(date).format('YYYY/MM/DD')}</span>
      </div>
      <div className="btn-wrapper">
        <button type="button" 
          className={`footprint${onFootprint?' on':''}`}
          onClick={(e)=>{
            e.stopPropagation();
            setOnFootprint(!onFootprint)
          }} title="footprint"
        >
        </button>
        <button type="button" 
          className={`shoot${onImage?' on':''}`}
          onClick={(e)=>{
            e.stopPropagation();
            setOnImage(!onImage)
          }} title="미리보기"
        >
        </button>
        <button type="button" className="info" 
          onClick={(e)=>{
            e.stopPropagation();
            viewDetail()
          }} title={"상세보기"}
        >
        </button>
        <button type="button" className="down" 
          onClick={(e) => {
            e.stopPropagation();
            downloadFile()
          }} title={"다운로드"}
        >
        </button>
      </div>
    </div>
    </>
  )
}


const ProductDetailPopup = () => {
  const [productDetail, setProductDetail] = useRecoilState(productDetailState);
  if (!productDetail) return null;

  const { id, name, satellite, doyeop} = productDetail;
  const el = document.querySelector("#map");
  const children = (
    <div className="dialog-infomation darkMode">
      <div className="dialog-title">
        <h3>상세정보</h3>
        <button className="close floatRight" onClick={()=>{setProductDetail(null)}}></button>						
      </div>
      <div className="dialog-content">
        <label> ID</label>
        <input type="text" placeholder="K3A_20221228084920_56632_05291200_L0F" readOnly
               value={id ?? ''}
               title={id ?? ''}
        />
        {
          !satellite && !doyeop &&
          <>
            <label> 영상명</label>
            <input type="text" placeholder="K3A_20221228084920_56632_05291200_L0F" readOnly
                   value={name ?? ''}
                   title={name ?? ''}
            />
            <label> 영상 획득일</label>
            <input type="text" value={dayjs(productDetail.date ?? '').format('YYYY/MM/DD')} readOnly/>
            <label> 영상 제작일</label>
            <input type="text" value={dayjs(productDetail.date ?? '').format('YYYY/MM/DD')} readOnly/>
            <label> 탑제체/센서</label>
            <input type="text" value={''} readOnly/>
          </>
        }
        {
          satellite &&
          <>
            <label> 영상명</label>
            <input type="text" placeholder="K3A_20221228084920_56632_05291200_L0F" readOnly
                   value={name ?? ''}
                   title={name ?? ''}
            />
            <label> 영상 획득일</label>
            <input type="text" value={dayjs(satellite.acquisitionDate ?? '').format('YYYY/MM/DD')} readOnly/>
            <label> 영상 제작일</label>
            <input type="text" value={dayjs(productDetail.date ?? '').format('YYYY/MM/DD')} readOnly/>
            <label> 탑제체/센서</label>
            <input type="text" value={satellite.sensor ?? ''} readOnly/>
          </>
        }
        {
          doyeop &&
          <>
            <label> 도엽 명</label>
            <input type="text" value={doyeop.areaName ?? '' + doyeop.doyeopName} readOnly/>
            <label> 도엽 번호</label>
            <input type="text" value={doyeop.doyeopNum ?? ''} readOnly/>
            <label> 도엽 생성일</label>
            <input type="text" value={dayjs(doyeop.printDate ?? '').format('YYYY/MM/DD')} readOnly/>
          </>
        }

      </div>
      <div className="darkMode-btn">
        <button type="button" className="cancel" onClick={() => setProductDetail(null)}><a>닫기</a></button>
      </div>
    </div>
  )

  return el && productDetail ? ReactDOM.createPortal(children, el) : null;
};
