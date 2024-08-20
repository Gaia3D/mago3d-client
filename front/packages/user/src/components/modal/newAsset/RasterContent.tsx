import React, {ChangeEvent, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import {inputFormatOptions, outputFormatOptions} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";

const RasterContent = () => {

    const [projectName, setProjectName] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [inputFormat, setInputFormat] = useState<string>('auto');
    const [outputFormat, setOutputFormat] = useState<string>('auto');
    const [originProjection, setOriginProjection] = useState('');
    const [convertedProjection, setConvertedProjection] = useState('');

    const fileConvert = () => {
        console.log("assetType: raster");
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
                formats={inputFormatOptions['raster']}
            />
            <div className="title">Output format</div>
            <FormatList
                selected={outputFormat}
                onSelect={setOutputFormat}
                formats={outputFormatOptions['raster']}
            />
            <div className="title">Origin Projection</div>
            <div className="value">
                <input
                    type="text"
                    className="width-140"
                    value={originProjection}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setOriginProjection(e.target.value)}
                    placeholder="ex) 4326, 5186"
                />
            </div>
            <div className="title f-size-12">Converted Projection</div>
            <div className="value">
                <input
                    type="text"
                    className="width-140"
                    value={convertedProjection}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConvertedProjection(e.target.value)}
                    placeholder="ex) 4326, 5186"
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

export default RasterContent;