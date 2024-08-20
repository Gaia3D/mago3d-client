import React, {ChangeEvent, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import RadioGroup from "@/components/modal/RadioGroup.tsx";
import {inputFormatOptions, outputFormatOptions, projectionTypeOptions} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";

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
    const [swapUpAxis, setSwapUpAxis] = useState<number>(0);
    const [flipUpAxis, setFlipUpAxis] = useState<number>(0);

    const fileConvert = () => {
        console.log("assetType: 3dtile");
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
                    name="originProjection"
                    value={projectionType}
                    onChange={setProjectionType}
                    options={projectionTypeOptions}
                />
                <input
                    type="text"
                    className="width-140"
                    value={projectionValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProjectionValue(e.target.value)}
                />
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