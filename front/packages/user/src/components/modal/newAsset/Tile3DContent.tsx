import React, {ChangeEvent, useRef, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import RadioGroup from "@/components/modal/RadioGroup.tsx";
import {inputFormatOptions, outputFormatOptions, projectionTypeOptions} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";
import ToggleSetting from "@/components/modal/ToggleSetting.tsx";

const Tile3DContent = () => {

    const [projectName, setProjectName] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [debugMode, setDebugMode] = useState<boolean>(false);
    // const [inputPath, setInputPath] = useState<string>('');
    // const [outputPath, setOutputPath] = useState<string>('');
    const [inputFormat, setInputFormat] = useState<string>('auto');
    const [outputFormat, setOutputFormat] = useState<string>('auto');
    const [projectionType, setProjectionType] = useState<string>('epsg');
    const [projectionValue, setProjectionValue] = useState<string>('');
    const [swapUpAxis, setSwapUpAxis] = useState<boolean>(false);
    const [flipUpAxis, setFlipUpAxis] = useState<boolean>(false);

    const [showDetail, setShowDetail] = useState(false);

    const detailTitleRef = useRef<HTMLDivElement>(null);
    const detailToggle = () => {
        if (!detailTitleRef.current) return;
        detailTitleRef.current.classList.toggle("on");
        setShowDetail(detailTitleRef.current.classList.contains("on"));
    }

    const fileConvert = () => {
        console.log("assetType: 3dtile");
        console.log("swapUpAxis: ", swapUpAxis);
        console.log("flipUpAxis: ", flipUpAxis);
        console.log("debugMode: ", debugMode);
    }
    // popLayer.current.classList.toggle('on');
    return (
        <>
            <div className="title">Project name</div>
            <div className="value">
                <input
                    type="text"
                    className="modal-full-width"
                    value={projectName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProjectName(e.target.value)}
                />
            </div>
            <div className="title">Input format</div>
            <FormatList
                selected={inputFormat}
                onSelect={setInputFormat}
                formats={inputFormatOptions['3dtile']}
            />
            <div className="title">Output format</div>
            <FormatList
                selected={outputFormat}
                onSelect={setOutputFormat}
                formats={outputFormatOptions['3dtile']}
            />
            <div className="title">Origin projection</div>
            <div className="value">
                <RadioGroup
                    name="projection"
                    value={projectionType}
                    onChange={setProjectionType}
                    options={projectionTypeOptions}
                />
                <input
                    type="text"
                    className="modal-full-width"
                    value={projectionValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProjectionValue(e.target.value)}
                    placeholder={projectionType==='epsg' ? "ex) 4326, 5186" : "ex) +proj=utm +zone=52 +datum=WGS84 +units=m +no_defs"}
                />
            </div>
            <div className="title detail-title" ref={detailTitleRef} onClick={detailToggle}>detail settings</div>
            <div className="value detail-show-value">
                {
                    showDetail ? (
                        <>
                            <ToggleSetting text="Swap Up Axis" id="swapUpAxis" checked={swapUpAxis} onChange={setSwapUpAxis} />
                            <ToggleSetting text="Flip Up Axis" id="flipUpAxis" checked={flipUpAxis} onChange={setFlipUpAxis} />
                            <ToggleSetting text="Debug Mode" id="debugMode" checked={debugMode} onChange={setDebugMode} />
                        </>
                    ) : (
                        <div className="detail-dot-value" onClick={detailToggle}>...</div>
                    )
                }
            </div>
            <div className="title">File upload</div>
            <div className="value">
                <FileUpload onFileSelect={setFile}/>
            </div>
            <div className="modal-bottom">
                <button onClick={fileConvert} type="button" className="button-full">Convert</button>
            </div>
        </>
    );
};

export default Tile3DContent;