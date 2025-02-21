import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {useGlobeController} from "./providers/GlobeControllerProvider.js";
import * as Cesium from "cesium";

export const SearchPlaceList = () => {
    const {initialized, globeController} = useGlobeController();

    const [query, setQuery] = useState('');
    const [places, setPlaces] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [showResults, setShowResults] = useState(false);  // 검색 결과를 숨기거나 보여주는 상태 (false로 초기값 설정)
    const observer = useRef<IntersectionObserver | null>(null);

    // 초기화 함수: 데이터 로딩 전 상태 설정
    const resetState = () => {
        setPage(1);
        setHasMore(true);
        setErrorMessage(null);
        setShowResults(true);  // 검색 결과를 다시 보여줌
    };

    const fetchPlaces = async (currentPage) => {
        if (loading || !hasMore) return;
        setLoading(true);
        setErrorMessage(null);

        try {
            const API_KEY = import.meta.env.VITE_VWORLD_TOKEN;
            const bbox = '124.0,33.0,132.0,43.0';
            const size = 100; // 페이지당 결과 수

            const response = await axios.get(`/user/vworld/search`, {
                params: {
                    service: 'search',
                    request: 'search',
                    version: '2.0',
                    crs: 'EPSG:4326',
                    bbox: bbox,
                    size: size,
                    page: currentPage,
                    query: query.trim(),
                    type: 'place',
                    format: 'json',
                    key: API_KEY,
                },
            });

            const responseData = response.data;
            const responseMap = responseData.response;
            const resultMap = responseMap.result;
            const items = resultMap.items || [];
            const addressSet = new Set(); // 주소 중복 체크를 위한 Set

            if (items.length === 0) {
                if (currentPage === 1) {
                    setErrorMessage('검색결과가 없습니다.');
                }
                setHasMore(false);
            } else {
                const extractedPlaces = items
                    .filter((item) => {
                        const roadAddress = item?.address?.road;
                        if (!roadAddress || addressSet.has(roadAddress)) {
                            return false; // 중복 주소는 제외
                        }
                        addressSet.add(roadAddress);
                        return true;
                    })
                    .map((item) => ({
                        title: item.title ?? '제목 없음',
                        address: item.address?.road?.trim() !== '' ? item.address.road : '주소 없음',
                        x: item.point?.x,
                        y: item.point?.y,
                    }));

                setPlaces((prevPlaces) => currentPage === 1 ? extractedPlaces : [...prevPlaces, ...extractedPlaces]);
                setPage(currentPage + 1);
                setHasMore(items.length === size);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage('검색결과가 없습니다.');
            } else {
                setErrorMessage('검색결과가 없습니다.');
            }
            setPlaces([]);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        if (query.trim() !== '') {
            resetState();
            fetchPlaces(1);
        }
    }, [query]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const trimmedQuery = query.trim();
            if (trimmedQuery === '') {
                setPlaces([]);
                setErrorMessage(null);
            } else {
                setQuery(trimmedQuery);
                setShowResults(true);  // 검색 결과를 다시 보여줌
            }
        }
    };

    const handleSearchClick = () => {
        const trimmedQuery = query.trim();
        if (trimmedQuery === '') {
            setPlaces([]);
            setErrorMessage(null);
        } else {
            setQuery(trimmedQuery);
            setShowResults(true);  // 검색 결과를 다시 보여줌
        }
    };

    // 리스트 항목 클릭 핸들러: x, y 좌표 출력 및 검색창에 타이틀 입력
    const handlePlaceClick = (x, y, title) => {
        setQuery(title);  // 입력창에 제목 설정
        // 검색 결과를 숨김
        let viewer = globeController?.viewer;
        viewer?.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(parseFloat(x), parseFloat(y), 700.0)
        });

        // 카메라 이동 완료 후 상태 업데이트
        const handler = viewer?.camera.changed.addEventListener(() => {
            setShowResults(false);
            handler(); // 이벤트 핸들러 제거
        });

    };

    // Input 클릭 시 검색 결과를 다시 보여줌
    const handleInputClick = () => {
        setShowResults(true);  // 검색 결과를 다시 보여줌
    };

    const lastItemRef = useRef();
    useEffect(() => {
        const observerCallback: IntersectionObserverCallback = (entries) => {
            if (entries[0].isIntersecting && !loading && hasMore) {
                fetchPlaces(page);
            }
        };

        if (lastItemRef.current) {
            observer.current = new IntersectionObserver(observerCallback);
            observer.current.observe(lastItemRef.current);
        }

        return () => {
            if (observer.current && lastItemRef.current) {
                observer.current.unobserve(lastItemRef.current);
            }
        };
    }, [lastItemRef, loading, page, hasMore]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const searchContainer = document.querySelector('.location-search');
            if (searchContainer && !searchContainer.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="location-search">
            <input
                className="search-place-input"
                type="text"
                id="searchInput"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onClick={handleInputClick}  // Input 클릭 시 검색 결과 다시 보여줌
                autoComplete="off"
                placeholder="입력해주세요"
            />
            <button type="button" className="button common-search" onClick={handleSearchClick}></button>
            {/*<button type="button" className="button detail-search"></button>*/}
            {/*<button type="button" className="button bookmarks"></button>*/}

            {/* 검색 결과가 표시될 때만 UL 출력 */}
            {showResults && (
                <div className="location-search-result">
                    <ul className="location-search-result-list">
                        {places.length > 0 ? (
                            places.map((place, index) => (
                                <li
                                    key={index}
                                    ref={index === places.length - 1 ? lastItemRef : null}
                                    onClick={() => handlePlaceClick(place.x, place.y, place.title)}
                                >
                                    <div className={"result"}>
                                        <div className="title">
                                            <span className={"icon-gis"}></span>
                                            <span className="keyword">{place.title}</span>
                                        </div>
                                        <span className="address">{place.address}</span>
                                    </div>
                                </li>
                            ))
                        ) : (
                            errorMessage && <li>
                                <div className="result selected">
                                    <span className="title">{errorMessage}</span>
                                </div>
                            </li>
                        )}
                        {loading && <li>로딩 중...</li>}
                    </ul>
                </div>
            )}
        </div>
    );
};
