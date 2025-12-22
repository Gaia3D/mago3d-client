import React from "react";
import { toast } from "react-toastify";

interface Props {
  url: string;
}

export const UrlLink = ({ url }: Props) => {

  const copyTextToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL이 클립보드에 복사되었습니다.');
    } catch (err) {
      toast.error('복사에 실패했습니다. 직접 복사해 주세요.');
    }
  };

  const handleLinkClick = async () => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');

    // 팝업 차단 여부 확인 (Mixed Content나 브라우저 설정에 의해 null 반환 가능)
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {

      // 차단되었다면 사용자에게 알리고 복사 시도
      toast.info(
        <div onClick={copyTextToClipboard} style={{ cursor: 'pointer' }}>
          팝업이 차단되었습니다. 여기를 클릭해 URL을 복사하세요.
        </div>,{ autoClose: 5000 }
      )
    }
  };

  return (
    <span
      className="properties-url-link"
      onClick={handleLinkClick}
      style={{ cursor: 'pointer', textDecoration: 'underline' }}
    >
      {url}
    </span>
  );
};