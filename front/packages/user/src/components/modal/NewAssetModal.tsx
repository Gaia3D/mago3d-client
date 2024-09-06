import React, {useState, MouseEvent} from 'react';
import { useRecoilState } from "recoil";
import { IsNewAssetModalState } from "@/recoils/Modal.ts";
import {
    assetTypeOptions,
} from "@/components/utils/optionsData.ts";
import Tile3DContent from "@/components/modal/newAsset/Tile3DContent.tsx";
import TerrainContent from "@/components/modal/newAsset/TerrainContent.tsx";
import VectorContent from "@/components/modal/newAsset/VectorContent.tsx";
import RasterContent from "@/components/modal/newAsset/RasterContent.tsx";
import WeatherContent from "@/components/modal/newAsset/WeatherContent.tsx";
import ConversionGuard from "@/components/modal/newAsset/ConversionGuard.tsx";

const NewAssetModal: React.FC = () => {
    const [isNewAssetModal, setIsNewAssetModal] = useRecoilState(IsNewAssetModalState);
    const [assetType, setAssetType] = useState<string>('3dtile');
    const handleCloseModal = () => setIsNewAssetModal(false);
    const handleModalClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

    return (
        <div id="myModal" className={`modal ${isNewAssetModal? 'on':'off'}`} onClick={handleCloseModal}>
            <div className="modal-content new-asset" onClick={handleModalClick}>
                <div className="modal-popup-header">
                    <h2>New Assets</h2>
                    <button onClick={handleCloseModal} type="button" className="button-close"></button>
                </div>
                <div className="modal-popup-type">
                    {assetTypeOptions.map(option => (
                        <label key={option.value} className="radio-label">
                            <input
                                type="radio"
                                name="assetType"
                                value={option.value}
                                checked={assetType === option.value}
                                onChange={() => setAssetType(option.value)}
                            />
                            <span className={"radio-text-span"}>{option.text}</span>
                        </label>
                    ))}
                </div>
                <Tile3DContent assetType={assetType} contentType={"3dtile"} />
                <TerrainContent assetType={assetType} contentType={"terrain"} />
                <VectorContent assetType={assetType} contentType={"vector"} />
                <RasterContent assetType={assetType} contentType={"raster"} />
                {/*<WeatherContent assetType={assetType} contentType={"weather"} />*/}

                <ConversionGuard assetType={assetType} />
            </div>
        </div>
    );
};

export default NewAssetModal;
