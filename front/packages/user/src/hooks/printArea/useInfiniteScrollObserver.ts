import { MutableRefObject, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasNextRef: MutableRefObject<boolean>;
  isFetchingRef: MutableRefObject<boolean>;
  onLoadMore: () => void;
}

export const useInfiniteScrollObserver = ({
  hasNextRef,
  isFetchingRef,
  onLoadMore,
}: UseInfiniteScrollOptions) => {
  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextRef.current && !isFetchingRef.current) {
        onLoadMore();
      }
    });

    const node = lastItemRef.current;
    if (node) observerRef.current.observe(node);

    return () => observerRef.current?.disconnect();
  });

  return { lastItemRef };
};