import React from 'react';

interface WeatherContentProps {
    display: boolean;
}

const WeatherContent:React.FC<WeatherContentProps> = ({display}) => {
    return (
        <div className={`modal-popup-body ${display ? "on" : "off"}`}>
            WeatherContent
        </div>
    );
};

export default WeatherContent;