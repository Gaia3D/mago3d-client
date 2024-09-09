import {useClockTool} from "@/hooks/useMapTool/useClockTool.ts";
import {useRecoilState} from "recoil";
import {OptionsState} from "@/recoils/Tool.ts";
import {useTranslation} from "react-i18next";

export const ClockTool = () => {
    const {t} = useTranslation();
    const [options, setOptions] = useRecoilState(OptionsState);
    const { slowAnimation, fastAnimation, toggleAnimation, onChangeDate, onChangeSpeed } = useClockTool();

    // const closeClockTool= () => {
    //     setOptions((prevOptions) => ({
    //         ...prevOptions,
    //         isOpenClock: false,
    //     }))
    // }


    return options.isOpenClock && (
        <div className="pop-layer-sub">
            <div className="pop-layer-header">
                <h3 className="title">{t("clock-tool")}</h3>
                {/*<div onClick={closeClockTool} className="close-button"></div>*/}
            </div>
            <div className="pop-layer-content">
                <div className="date-picker-container">
                    <input type="date" name="date" value={options.date} onChange={onChangeDate}/>
                    <input type="time" name="time" value={options.time} onChange={onChangeDate}/>
                </div>
                <div className="range-container">
                    <label>{t("clock.multiplier")}</label>
                    <input type="range" list="tickmarks" value={options.speed} onChange={onChangeSpeed} min="1"
                           max="4096"/>
                    <span className="text">x {options.speed}</span>
                    <div className="ticks" id="ticks">
                            <span className="tick"></span>
                            <span className="tick"></span>
                            <span className="tick"></span>
                            <span className="tick"></span>
                            <span className="tick"></span>
                            <span className="tick"></span>
                            <span className="tick"></span>
                            <span className="tick"></span>
                            <span className="tick"></span>
                            <span className="tick"></span>
                        </div>
                </div>
                <div className="play-container">
                    <label>{t("clock.function")}</label>
                    <span onClick={slowAnimation} className="button-play rewind"></span>
                    <span onClick={toggleAnimation} className={`button-play play ${options.isAnimation ? 'selected' : ''}`}></span>
                    <span onClick={fastAnimation} className="button-play fast-forward"></span>
                </div>
            </div>
        </div>
    )
}
