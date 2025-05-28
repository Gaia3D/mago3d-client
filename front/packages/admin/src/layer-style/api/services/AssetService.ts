export interface AssetService {
  getAsset(href: string): Promise<any>;
  updateAsset(id: string, data: any): Promise<any>;
}
