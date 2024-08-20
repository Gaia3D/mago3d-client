import React, {ChangeEvent, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import {
    inputFormatOptions,
    InterpolationTypeOptions,
    outputFormatOptions,
} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";
import ToggleSetting from "@/components/modal/ToggleSetting.tsx";
import RadioGroup from "@/components/modal/RadioGroup.tsx";

const TerrainContent = () => {

    const [projectName, setProjectName] = useState<string>('');
    const [inputFormat, setInputFormat] = useState<string>('auto');
    const [outputFormat, setOutputFormat] = useState<string>('auto');
    const [interpolationType, setInterpolationType] = useState<string>('linear');
    const [debugMode, setDebugMode] = useState<boolean>(false);
    const [tileDepthMin, setTileDepthMin] = useState<number>(0);
    const [tileDepthMax, setTileDepthMax] = useState<number>(12);

    const [fileArr, setFileArr] = useState<File[] | null>(null);
    const fileConvert = () => {
        console.log("assetType: terrain");
    }

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
                formats={inputFormatOptions['terrain']}
            />
            <div className="title">Output format</div>
            <FormatList
                selected={outputFormat}
                onSelect={setOutputFormat}
                formats={outputFormatOptions['terrain']}
            />
            <div className="title">Min Tile Depth</div>
            <div className="value">
                <input
                    type="number"
                    className="width-140"
                    value={tileDepthMin}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTileDepthMin(Number(e.target.value))}
                />
            </div>
            <div className="title">Max Tile Depth</div>
            <div className="value">
                <input
                    type="number"
                    className="width-140"
                    value={tileDepthMax}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setTileDepthMax(Number(e.target.value))}
                />
            </div>
            <div className="title">Interpolation Type</div>
            <div className="value">
                <RadioGroup
                    name="interpolationType"
                    value={interpolationType}
                    onChange={setInterpolationType}
                    options={InterpolationTypeOptions}
                />
            </div>
            <div className="title">Debug Mode</div>
            <ToggleSetting
                id="debugMode"
                checked={debugMode}
                onChange={setDebugMode}
            />

            <div className="title">File upload</div>
            <div className="value">
                <FileUpload onFileAdd={setFileArr} fileItem={fileArr}/>
            </div>
            <div className="modal-bottom">
                <button onClick={fileConvert} type="button" className="button-full">Convert</button>
            </div>
        </>
    );
};

export default TerrainContent;