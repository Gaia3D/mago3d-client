import { useRef, useState } from "react";
import { IframeBoxPropsType } from "../../../types/statistics";

function IframeBox({ id, width, height, src }: IframeBoxPropsType) {
  const iframeRef = useRef<HTMLIFrameElement>();

  const [iframeKey, setIframeKey] = useState(1);

  const onClickReload = () => {
    setIframeKey(iframeKey + 1);
  };

  return (
    <>
      <div
        style={{
          clear: "both",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <button className="map-check" onClick={onClickReload}>
          새로 고침
        </button>
        <iframe
          key={iframeKey}
          ref={iframeRef}
          id={id}
          width={width}
          height={height}
          src={src}
        ></iframe>
      </div>
    </>
  );
}

export default IframeBox;
