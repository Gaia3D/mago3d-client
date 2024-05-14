import {SearchCategoryType, searchCategoryState, searchKeywordState} from "@/recoils/SearchState";
import {SearchForm} from "@/components/SearchForm";
import {useRecoilState} from "recoil";
import React, {useState} from "react";
import {produce} from "immer";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useGlobeController } from "./providers/GlobeControllerProvider";

export const AsideSearch = () => {
    console.log("Render AsideSearch");
    // 검색항목 상태
    const [keyword, setKeyword] = useRecoilState(searchKeywordState);
    
    return (
        <aside className="basic">
            <div className="aside-search width-88 marginTop-20">
                <SearchForm value={keyword} onSearch={setKeyword}/>
            </div>
            
            <SearchCategory/>
            <div className="search-result-wrapper">
                <PoiResult/>
                <AddressResult/>
                <UnsptResult/>
                <TriptResult/>
                <BmkptResult/>
            </div>
        </aside>
    );
};

/**
 * 검색 항목 표출
 */
function SearchCategory() {
    const [categories, setCategories] = useRecoilState(searchCategoryState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        setCategories(produce((draft) => {
            const category = draft.find((item) => item.value === value);
            if (category) {
                category.checked = !category.checked;
            }
        }));
    };

    return (
        <>
            <div className="itemSelect width-88 marginTop-16">검색항목 선택</div>
            <div className="itemSelect-content width-88 padding-10">
                {categories.map((item) => (
                    <label key={item.value}>
                        <input type="checkbox" value={item.value} checked={item.checked} onChange={handleChange}/>
                        {item.label}
                    </label>
                ))}
            </div>
        </>
    );
}

/**
 * 장소 검색 결과
 */
function PoiResult() {
    const {data, isFetching, error, checked } = useSearchQuery(SearchCategoryType.Place);
    console.info(data);

    const {globeController} = useGlobeController();
    const {flyToDegree} = globeController;
    const [visible, setVisible] = useState(false);
    if (!checked) return null;
    return (
        <>
            <div className={`${visible ? 'itemUnselect-select':'itemUnselect'} width-88 marginTop-5`} onClick={()=>{setVisible(!visible)}}>
                장소
                <div className="number">
                    {data?.poiSearch?.items.length}
                </div>
                {
                    visible &&
                    <div className={"itemUnselect-box"}>
                    {
                        data?.poiSearch?.items.map((item) => (
                            <div className="item-box" key={item.id} style={{height:"auto"}}>
                                <div className="address" title={item.name}>
                                    {item.name}
                                    {
                                      item.addressRoad && <div className="address" title={item.addressRoad}>도로명 : {item.addressRoad}</div>
                                    }
                                    {
                                      item.addressParcel && <div className="address" title={item.addressParcel}>지번 : {item.addressParcel}</div>
                                    }
                                </div>

                                <button type="button" className="go-map" onClick={(e)=>{
                                    e.stopPropagation();
                                    if (item.lon && item.lat) flyToDegree.call(globeController, item.lon, item.lat)
                                }}></button>
                            </div>
                        ))
                    }
                    </div>
                }
            </div>
        </>
    );
}

/**
 * 새주소 검색 결과
 */
function AddressResult() {
    const {data, isFetching, error, checked } = useSearchQuery(SearchCategoryType.Address);
    
    const {globeController} = useGlobeController();
    const {flyToDegree} = globeController;
    const [visible, setVisible] = useState(false);
    if (!checked) return null;
    return (
        <>
            <div className={`${visible ? 'itemUnselect-select':'itemUnselect'} width-88 marginTop-5`} onClick={()=>{setVisible(!visible)}}>
                새주소 
                <div className="number">
                    {data?.addressSearch?.items.length}
                </div>
                {
                    visible && 
                    <div className={"itemUnselect-box"}>
                    {   
                        data?.addressSearch?.items.map((item) => (
                            <div className="item-box" key={item.id}>
                                <div className="address" title={item.roadAddr}>{item.roadAddr}</div>
                                <button type="button" className="go-map" onClick={(e)=>{
                                    e.stopPropagation();
                                    if (item.lon && item.lat) flyToDegree.call(globeController, item.lon, item.lat)
                                }}></button>
                            </div>	
                        ))
                    }   
                    </div>
                }
            </div>
        </>
    );
}

/**
 * 통합기준점 검색 결과
 */
function UnsptResult() {
    const {data, isFetching, error, checked } = useSearchQuery(SearchCategoryType.Unsp);
    const {globeController} = useGlobeController();
    const {flyToDegree} = globeController;
    const [visible, setVisible] = useState(false);
    if (!checked) return null;
    return (
        <>
            <div className={`${visible ? 'itemUnselect-select':'itemUnselect'} width-88 marginTop-5`} onClick={()=>{setVisible(!visible)}}>
                통합기준점 
                <div className="number">
                    {data?.unsptSearch?.items.length}
                </div>
                {
                    visible && 
                    <div className={"itemUnselect-box"}>
                    {   
                        data?.unsptSearch?.items.map((item) => (
                            <div className="item-box" key={item.id}>
                                <div className="address" title={item.name}>{item.name}</div>
                                <button type="button" className="go-map" onClick={(e)=>{
                                    e.stopPropagation();
                                    if (item.lon && item.lat) flyToDegree.call(globeController, item.lon, item.lat)
                                }}></button>
                            </div>	
                        ))
                    }   
                    </div>
                }
            </div>
        </>
    );
}

/**
 * 삼각점 검색 결과
 */

function TriptResult() {
    const {data, isFetching, error, checked } = useSearchQuery(SearchCategoryType.Tript);
    const {globeController} = useGlobeController();
    const {flyToDegree} = globeController;
    const [visible, setVisible] = useState(false);
    if (!checked) return null;
    return (
        <>
            <div className={`${visible ? 'itemUnselect-select':'itemUnselect'} width-88 marginTop-5`} onClick={()=>{setVisible(!visible)}}>
                삼각점
                <div className="number">
                    {data?.triptSearch?.items.length}
                </div>
                {
                    visible && 
                    <div className={"itemUnselect-box"}>
                    {   
                        data?.triptSearch?.items.map((item) => (
                            <div className="item-box" key={item.id}>
                                <div className="address" title={item.name}>{item.name}</div>
                                <button type="button" className="go-map" onClick={(e)=>{
                                    e.stopPropagation();
                                    if (item.lon && item.lat) flyToDegree.call(globeController, item.lon, item.lat)
                                }}></button>
                            </div>	
                        ))
                    }   
                    </div>
                }
            </div>
        </>
    );
}

/**
 * 수준점 검색 결과
 */
function BmkptResult() {
    const {data, isFetching, error, checked } = useSearchQuery(SearchCategoryType.Bmkpt);
    const {globeController} = useGlobeController();
    const {flyToDegree} = globeController;
    const [visible, setVisible] = useState(false);
    if (!checked) return null;
    return (
        <>
            <div className={`${visible ? 'itemUnselect-select':'itemUnselect'} width-88 marginTop-5`} onClick={()=>{setVisible(!visible)}}>
                수준점
                <div className="number">
                    {data?.bmkptSearch?.items.length}
                </div>
                {
                    visible && 
                    <div className={"itemUnselect-box"}>
                    {   
                        data?.bmkptSearch?.items.map((item) => (
                            <div className="item-box" key={item.id}>
                                <div className="address" title={item.name}>{item.name}</div>
                                <button type="button" className="go-map" onClick={(e)=>{
                                    e.stopPropagation();
                                    if (item.lon && item.lat) flyToDegree.call(globeController, item.lon, item.lat)
                                }}></button>
                            </div>	
                        ))
                    }   
                    </div>
                }
            </div>
        </>
    );
}
