import {useRecoilState, useSetRecoilState} from "recoil";
import {
    dataAssetTypeState,
    dataCreateDateFromState,
    dataCreateDateToState, dataCurrentPageState,
    dataItemSizeState,
    dataProcessStatusState,
    dataSearchQueryOptionState,
    dataSearchTargetState,
    dataSearchTextState
} from "@src/recoils/Data";
import {DataItemSize, DataSearchQueryOption, DataSearchTarget} from "@src/types/Data";
import {useRef} from "react";
import {AssetType, ProcessTaskStatus} from "@src/generated/gql/dataset/graphql";

const SearchForm = () => {
    const setPage = useSetRecoilState<number>(dataCurrentPageState);
    const [dataItemSize, setDataItemSize] = useRecoilState<DataItemSize>(dataItemSizeState);
    const [createDateFrom, setCreateDateFrom] = useRecoilState<string | undefined>(dataCreateDateFromState);
    const [createDateTo, setCreateDateTo] = useRecoilState<string | undefined>(dataCreateDateToState);
    const [currentSearchText, setCurrentSearchText] = useRecoilState<string | undefined>(dataSearchTextState);
    const [currentSearchTarget, setCurrentSearchTarget] = useRecoilState<DataSearchTarget>(dataSearchTargetState);
    const [currentSearchQueryOption, setCurrentSearchQueryOption] = useRecoilState<DataSearchQueryOption>(dataSearchQueryOptionState);
    const [processStatus, setProcessStatus] = useRecoilState<ProcessTaskStatus | undefined>(dataProcessStatusState);
    const [dataAssetType, setDataAssetType] = useRecoilState<AssetType | undefined>(dataAssetTypeState);

    const searchTargetRef = useRef<HTMLSelectElement>(null);
    const searchQueryOptionRef = useRef<HTMLSelectElement>(null);
    const processStatusRef = useRef<HTMLSelectElement>(null);
    const dataItemSizeRef = useRef<HTMLSelectElement>(null);
    const searchTextRef = useRef<HTMLInputElement>(null);
    const createDateFromRef = useRef<HTMLInputElement>(null);
    const createDateToRef = useRef<HTMLInputElement>(null);
    const dataAssetTypeRef = useRef<HTMLSelectElement>(null);

    const setSearchParam = () => {
        if (searchTargetRef.current.value) setCurrentSearchTarget(searchTargetRef.current.value as DataSearchTarget);
        if (searchQueryOptionRef.current.value) setCurrentSearchQueryOption(searchQueryOptionRef.current.value as DataSearchQueryOption);
        if (dataItemSizeRef.current.value) setDataItemSize(parseInt(dataItemSizeRef.current.value, 10) as DataItemSize);
        setProcessStatus(processStatusRef.current.value as ProcessTaskStatus);
        if (searchTextRef.current.value) setCurrentSearchText(searchTextRef.current.value);
        if (createDateFromRef.current.value) setCreateDateFrom(createDateFromRef.current.value);
        if (createDateToRef.current.value) setCreateDateTo(createDateToRef.current.value);
        setDataAssetType(dataAssetTypeRef.current.value as AssetType);
        setPage(0);
    }

    const resetSearchParam = () => {
        setCurrentSearchTarget('data');
        setCurrentSearchQueryOption('eq');
        setDataItemSize(10);
        setProcessStatus(undefined);
        setCurrentSearchText(undefined);
        setCreateDateFrom(undefined);
        setCreateDateTo(undefined);
        setDataAssetType(undefined);

        if (searchTargetRef.current) searchTargetRef.current.value = 'data';
        if (searchQueryOptionRef.current) searchQueryOptionRef.current.value = 'eq';
        if (dataItemSizeRef.current) dataItemSizeRef.current.value = '10';
        if (processStatusRef.current) processStatusRef.current.value = '';
        if (searchTextRef.current) searchTextRef.current.value = '';
        if (createDateFromRef.current) createDateFromRef.current.value = '';
        if (createDateToRef.current) createDateToRef.current.value = '';
        if (dataAssetTypeRef.current) dataAssetTypeRef.current.value = '';
    }

    return (
        <div className="search-bx">
            <div className="search-bx-01">
                <label htmlFor="data-list-search-text">검색어</label>
                <select defaultValue={currentSearchTarget} ref={searchTargetRef}>
                    <option value="data">데이터명</option>
                    <option value="group">데이터그룹</option>
                </select>
                <select defaultValue={currentSearchQueryOption} ref={searchQueryOptionRef}>
                    <option value="eq">일치</option>
                    <option value="contains">포함</option>
                </select>
                <input id="data-list-search-text" type="text" className="" defaultValue={currentSearchText} ref={searchTextRef}/>
            </div>
            <div className="search-bx-02">
                <label>타입</label>
                <select defaultValue={dataAssetType} ref={dataAssetTypeRef}>
                    <option value="">전체</option>
                    {
                        Object.keys(AssetType).map((key) => {
                            return <option key={key} value={AssetType[key]}>{AssetType[key]}</option>
                        })
                    }
                </select>
            </div>
            <div className="search-bx-01">
                <label htmlFor="data-list-create-date-from">등록일</label>
                <input type="date" id="data-list-create-date-from" defaultValue={createDateFrom} ref={createDateFromRef}/>
                <span className="txt">~</span>
                <label htmlFor="data-list-create-date-to"></label>
                <input type="date" id="data-list-create-date-to" defaultValue={createDateTo} ref={createDateToRef}/>
            </div>
            <div className="search-bx-02">
                <label htmlFor="data-list-process-status">상태</label>
                <select id="data-list-process-status" defaultValue={processStatus} ref={processStatusRef}>
                    <option value="">전체</option>
                    <option value="None">없음</option>
                    <option value="Ready">준비</option>
                    <option value="Running">진행중</option>
                    <option value="Terminating">종료중</option>
                    <option value="Terminated">종료</option>
                    <option value="Done">완료</option>
                    <option value="Error">에러</option>
                </select>
            </div>
            <div className="search-bx-01">
                <label>표시개수</label>
                <select defaultValue={dataItemSize} ref={dataItemSizeRef}>
                    <option value={10}>10개씩</option>
                    <option value={50}>50개씩</option>
                    <option value={100}>100개씩</option>
                </select>
            </div>
            <div style={{float: "right"}}>
                <button type="button" className="btn-search-init" onClick={resetSearchParam}>초기화</button>
                <button type="button" className="btn-search" onClick={setSearchParam}>검색</button>
            </div>
        </div>
    )
}

export default SearchForm;