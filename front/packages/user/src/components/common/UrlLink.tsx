import React from "react";

interface Props {
  url: string;
}

export const UrlLink = ({ url }: Props) => {

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <a href={url} className="properties-url-link" onClick={handleClick}>
      {url}
    </a>
  );
};