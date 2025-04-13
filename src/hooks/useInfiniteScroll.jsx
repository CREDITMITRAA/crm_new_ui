import { useEffect, useRef } from "react";

const useInfiniteScroll = (loadMore) => {
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 } // Trigger when the target is fully visible
    );

    const currentRef = observerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore]);

  return observerRef;
};

export default useInfiniteScroll;