import axios from 'axios';
import { AssetService } from '../services/AssetService';

export const RestAssetService: AssetService = {
  async getAsset(href) {
    const res = await axios.get(`/api/remote?href=${encodeURIComponent(href)}`);
    return res.data;
  },
};
