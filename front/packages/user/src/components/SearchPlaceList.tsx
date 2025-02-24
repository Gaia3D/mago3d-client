import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import { useGlobeController } from './providers/GlobeControllerProvider';
import * as Cesium from 'cesium';
import {useDebounce} from "use-debounce";

interface Place {
    title: string;
    address: string;
    x: number | undefined;
    y: number | undefined;
}

interface ResponsePlace {
    title: string;
    address: {
        road: string;
    };
    point: {
        x: number;
        y: number;
    };
}

interface ErrorResponse {
    response: {
        data: any;
    };
}

export const SearchPlaceList = () => {
    const {globeController} = useGlobeController();

    const [visibleQuery, setVisibleQuery] = useState('');
    const [places, setPlaces] = useState<Place[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showResults, setShowResults] = useState<boolean>(false);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastItemRef = useRef<HTMLLIElement | null>(null);

    const [debouncedValue] = useDebounce(visibleQuery, 500);

    // 초기화 함수: 데이터 로딩 전 상태 설정
    const resetState = () => {
        setPage(1);
        setHasMore(true);
        setErrorMessage(null);
    };

    const fetchPlaces = async (currentPage: number) => {
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
                    query: debouncedValue.trim(),
                    type: 'place',
                    format: 'json',
                    key: API_KEY,
                },
            });

            const responseData = response?.data;
            const responseMap = responseData?.response;
            const resultMap = responseMap?.result;
            const items = resultMap?.items || [];
            const addressSet = new Set<string>(); // 주소 중복 체크를 위한 Set

            if (items.length === 0) {
                if (currentPage === 1) {
                    setErrorMessage('검색결과가 없습니다.');
                }
                setHasMore(false);
            } else {
                const extractedPlaces: Place[] = items
                    .filter((item: ResponsePlace) => {
                        const roadAddress = item?.address?.road;
                        if (!roadAddress || addressSet.has(roadAddress)) {
                            return false; // 중복 주소는 제외
                        }
                        addressSet.add(roadAddress);
                        return true;
                    })
                    .map((item: ResponsePlace) => ({
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
            if ((error as ErrorResponse).response?.data) {
                setErrorMessage('검색결과가 없습니다.');
            } else {
                setErrorMessage('검색결과가 없습니다.');
                //setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred');
            }
            setPlaces([]);
            console.error('Error fetching data:', error);
        } finally {
            console.log('fetchPlaces done');
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debouncedValue === '') {
            setPlaces([]);
            setErrorMessage(null);
            return;
        }
        fetchPlaces(1);
    }, [debouncedValue]);

    const searchPlace = () => {
        resetState();
        if (debouncedValue === '') {
            setPlaces([]);
            setErrorMessage(null);
            return;
        }
        fetchPlaces(1);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        resetState();
        setVisibleQuery(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            searchPlace();
        }
    };

    // 리스트 항목 클릭 핸들러: x, y 좌표 출력 및 검색창에 타이틀 입력
    const handlePlaceClick = (x: number, y: number, title: string) => {
        setVisibleQuery(title);  // 입력창에 제목 설정
        // 검색 결과를 숨김
        let viewer = globeController?.viewer;
        viewer?.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(parseFloat(x.toString()), parseFloat(y.toString()), 700.0)
        });

        // 카메라 이동 완료 후 상태 업데이트
        const handler = viewer?.camera.changed.addEventListener(() => {
            setShowResults(false);
        });

        // Remove event listener once it's done
        if (handler) {
            viewer?.camera.changed.removeEventListener(handler);
        }
    };

    // Input 클릭 시 검색 결과를 다시 보여줌
    const handleInputClick = () => {
        setShowResults(true);  // 검색 결과를 다시 보여줌
    };

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
        const handleClickOutside = (event: MouseEvent) => {
            const searchContainer = document.querySelector('.location-search');
            if (searchContainer && !searchContainer.contains(event.target as Node)) {
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
                type="text"
                id="location-searchInput"
                value={visibleQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onClick={handleInputClick}  // Input 클릭 시 검색 결과 다시 보여줌
                autoComplete="off"
                placeholder="입력해주세요"
            />
            <button type="button" className="button common-search" onClick={searchPlace}></button>
            {/*<button type="button" className="button detail-search"></button>*/}
            {/*<button type="button" className="button bookmarks"></button>*/}

            {/* 검색 결과가 표시될 때만 UL 출력 */}
            {showResults && (
                <div className="location-search-result">
                    <ul className="location-search-result-list">
                        {places.length > 0 ? (
                            places.map((place: Place, index: number | undefined) => (
                                <li
                                    key={index}
                                    ref={index === places.length - 1 ? lastItemRef : null}
                                    onClick={() => {
                                        if (place.x !== undefined && place.y !== undefined) {
                                            handlePlaceClick(place.x, place.y, place.title)
                                        } else {
                                            console.error('No x, y coordinates found for this place:', place);
                                        }
                                    }}
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
