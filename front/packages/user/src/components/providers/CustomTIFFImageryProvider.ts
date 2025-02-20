import * as Cesium from "cesium";
import TIFFImageryProvider, { TIFFImageryProviderOptions } from "tiff-imagery-provider";

export class CustomTIFFImageryProvider extends TIFFImageryProvider {
    tileDiscardPolicy: Cesium.TileDiscardPolicy = new Cesium.NeverTileDiscardPolicy();
    getTileCredits(x: number, y: number, level: number): Cesium.Credit[] {
        return [];
    }
    proxy = new Cesium.Proxy();

    constructor(options: TIFFImageryProviderOptions & { url: string | File | Blob }) {
        super(options);
    }
}
