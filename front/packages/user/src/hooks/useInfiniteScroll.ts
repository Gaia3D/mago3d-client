import { useEffect, useRef } from 'react';

type UseInfiniteScrollOptions<T extends HTMLElement> = {
    root?: HTMLElement | null;
    rootMargin?: string;
    threshold?: number;
    fetchMore: () => void;
    isLoading: boolean;
};

export const useInfiniteScroll = <T extends HTMLElement>({
                                                             root = null,
                                                             rootMargin = '0px',
                                                             threshold = 1.0,
                                                             fetchMore,
                                                             isLoading,
                                                         }: UseInfiniteScrollOptions<T>) => {
    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<T | null>(null);

    useEffect(() => {
        if (observerRef.current) observerRef.current.disconnect();

        const callback = (entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && !isLoading) {
                fetchMore();
            }
        };

        observerRef.current = new IntersectionObserver(callback, {
            root,
            rootMargin,
            threshold,
        });

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
        };
    }, [fetchMore, isLoading, root, rootMargin, threshold]);

    return loadMoreRef;
};
