import React, {ChangeEvent, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import {
    inputFormatOptions,
    InterpolationTypeOptions,
    outputFormatOptions,
} from "@/components/utils/optionsData.ts";
import ToggleSetting from "@/components/modal/ToggleSetting.tsx";
import RadioGroup from "@/components/modal/RadioGroup.tsx";

const TerrainContent = () => {

    const [options, setOptions] = useState({
        projectName: '',
        inputFormat: 'auto',
        outputFormat: 'auto',
        interpolationType: 'linear',
        debugMode: false,
        tileDepthMin: 0,
        tileDepthMax: 12,
    });

    const handleOptionChange = (key: string, value: string | boolean | number) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [key]: value,
        }));
    };

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
                    value={options.projectName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('projectName', e.target.value)}
                />
            </div>
            <div className="title">Input format</div>
            <FormatList
                name="inputFormat"
                selected={options.inputFormat}
                onSelect={handleOptionChange}
                formats={inputFormatOptions['terrain']}
            />
            <div className="title">Output format</div>
            <FormatList
                name="outputFormat"
                selected={options.outputFormat}
                onSelect={handleOptionChange}
                formats={outputFormatOptions['terrain']}
            />
            <div className="title">Min Tile Depth</div>
            <div className="value">
                <input
                    type="number"
                    className="width-140"
                    value={options.tileDepthMin}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('tileDepthMin', Number(e.target.value))}
                />
            </div>
            <div className="title">Max Tile Depth</div>
            <div className="value">
                <input
                    type="number"
                    className="width-140"
                    value={options.tileDepthMax}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('tileDepthMax', Number(e.target.value))}
                />
            </div>
            <div className="title">Interpolation Type</div>
            <div className="value">
                <RadioGroup
                    name="interpolationType"
                    value={options.interpolationType}
                    onChange={handleOptionChange}
                    options={InterpolationTypeOptions}
                />
            </div>
            <div className="title">Debug Mode</div>
            <ToggleSetting
                id="debugMode"
                checked={options.debugMode}
                onChange={handleOptionChange}
            />

            <div className="title">File upload</div>
            <div className="value">
                {/*<FileUpload onFileAdd={setFileArr} fileItem={fileArr}/>*/}
            </div>
            <div className="modal-bottom">
                <button onClick={fileConvert} type="button" className="button-full">Convert</button>
            </div>
        </>
    );
};

export default TerrainContent;