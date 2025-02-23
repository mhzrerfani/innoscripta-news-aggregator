"use client";

import type React from "react";

import { useEffect, useRef } from "react";

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  children?: React.ReactNode;
}

export function InfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  children,
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading]);

  return (
    <>
      {children}
      <div ref={observerTarget} className="h-10" />
    </>
  );
}
