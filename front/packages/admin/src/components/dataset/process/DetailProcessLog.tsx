import React from "react";

const DetailProcessLog = (props: {
  error: string,
  stacktrace: string,
  onClose: () => void,
}) => {
  const {error, stacktrace, onClose} = props;
  return (
    <div className="popup-wrap">
      <div className="popup" style={{maxWidth: "1200px", maxHeight: "700px"}}>
        <div className="popup-head">
          <h3>상세 메세지</h3>
          <button type="button" className="button-close" onClick={onClose}></button>
        </div>
        <div className="popup-body">
          <div className="content-inner" style={{height: "500px", overflow: "auto"}}>
            <p style={{whiteSpace: "pre"}}>{error}</p>
            <p style={{whiteSpace: "pre"}}>{stacktrace}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailProcessLog;