import React, {ChangeEvent, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import {inputFormatOptions, outputFormatOptions} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";

interface RasterContentProps {
    assetType: string;
    contentType: string;
}

const RasterContent:React.FC<RasterContentProps> = ({assetType, contentType}) => {

    const [options, setOptions] = useState({
        projectName: '',
        inputFormat: 'auto',
        outputFormat: 'auto',
        originProjection: '',
        convertedProjection: '',
    });

    const handleOptionChange = (key: string, value: string | boolean) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [key]: value,
        }));
    };

    const [fileArr, setFileArr] = useState<File[] | null>(null);
    const fileConvert = () => {
        console.log("assetType: raster");
    }

    return (
        <div className={`modal-popup-body ${assetType === contentType ? "on" : "off"}`}>
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
                formats={inputFormatOptions['raster']}
            />
            <div className="title">Output format</div>
            <FormatList
                name="outputFormat"
                selected={options.outputFormat}
                onSelect={handleOptionChange}
                formats={outputFormatOptions['raster']}
            />
            <div className="title">Origin Projection</div>
            <div className="value">
                <input
                    type="text"
                    className="width-140"
                    value={options.originProjection}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('originProjection', e.target.value)}
                    placeholder="ex) 4326, 5186"
                />
            </div>
            <div className="title f-size-12">Converted Projection</div>
            <div className="value">
                <input
                    type="text"
                    className="width-140"
                    value={options.convertedProjection}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('convertedProjection', e.target.value)}
                    placeholder="ex) 4326, 5186"
                />
            </div>

            <div className="title">File upload</div>
            <div className="value">
                {/*<FileUpload onFileAdd={setFileArr} fileItem={fileArr}/>*/}
            </div>
            <div className="modal-bottom">
                <button onClick={fileConvert} type="button" className="button-full">Convert</button>
            </div>
        </div>
    );
};

export default RasterContent;