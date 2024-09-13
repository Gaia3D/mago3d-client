import React from 'react';

interface WeatherContentProps {
    assetType: string;
    contentType: string;
}

const WeatherContent:React.FC<WeatherContentProps> = ({assetType, contentType}) => {
    return (
        <div className={`modal-popup-body ${assetType === contentType ? "on" : "off"}`}>
            WeatherContent
        </div>
    );
};

export default WeatherContent;