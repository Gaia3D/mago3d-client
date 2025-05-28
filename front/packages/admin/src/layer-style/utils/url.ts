export const extractPath = (url: string): string => {
  const parsedUrl = new URL(url);
  return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
};

export const buildRemoteHref = (originalHref: string): string => {
  if (import.meta.env.MODE !== "production") return originalHref;
  const path = extractPath(originalHref);
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? `:${port}` : ""}${path}`;
};
