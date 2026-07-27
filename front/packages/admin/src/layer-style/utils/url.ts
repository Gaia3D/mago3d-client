export const extractPath = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
  } catch {
    // 이미 상대 경로인 경우 그대로 반환
    return url;
  }
};

export const buildRemoteHref = (originalHref: string): string => {
  if (import.meta.env.MODE !== "production") return originalHref;
  const path = extractPath(originalHref);
  return `${window.location.origin}${path}`;
};
