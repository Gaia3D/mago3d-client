import React, {ChangeEvent, useState} from 'react';
import FormatList from "@/components/modal/FormatList.tsx";
import {inputFormatOptions, outputFormatOptions} from "@/components/utils/optionsData.ts";
import FileUpload from "@/components/modal/FileUpload.tsx";

interface VectorContentProps {
    assetType: string;
    contentType: string;
}

const VectorContent:React.FC<VectorContentProps> = ({assetType, contentType}) => {

    const [options, setOptions] = useState({
        projectName: '',
        inputFormat: 'auto',
        outputFormat: 'auto',
        originEncoding: 'UTF-8',
        convertedEncoding: 'UTF-8',
        originProjection: '',
        convertedProjection: '',
    });

    const handleOptionChange = (key: string, value: string | boolean | number) => {
        setOptions(prevOptions => ({
            ...prevOptions,
            [key]: value,
        }));
    };

    const [fileArr, setFileArr] = useState<File[] | null>(null);
    const fileConvert = () => {
        console.log("assetType: vector");
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
                formats={inputFormatOptions['vector']}
            />
            <div className="title">Output format</div>
            <FormatList
                name="outputFormat"
                selected={options.outputFormat}
                onSelect={handleOptionChange}
                formats={outputFormatOptions['vector']}
            />
            <div className="title">Origin Encoding</div>
            <div className="value">
                <input
                    type="text"
                    className="width-140"
                    value={options.originEncoding}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('originEncoding', e.target.value)}
                />
            </div>
            <div className="title f-size-12">Converted Encoding</div>
            <div className="value">
                <input
                    type="text"
                    className="width-140"
                    value={options.convertedEncoding}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => handleOptionChange('convertedEncoding', e.target.value)}
                />
            </div>
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

export default VectorContent;