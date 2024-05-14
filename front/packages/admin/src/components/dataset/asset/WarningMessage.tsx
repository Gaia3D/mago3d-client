import React from 'react';
import './WarningMessage.css';

const WarningMessage = (props: {
  message: string
}) => {
  const {message} = props;
  return (
    <div className="warning-message">
      <div className="alert--icon warning2"></div>
      {message}
    </div>
  )
}

export default WarningMessage;
