import {CreateStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";

export interface LayerService {
  createStyle(input: CreateStyleInput): Promise<{ id: string }>;
  applyStyle(assetId: string, styleId: string): Promise<void>;
  deleteStyle(styleId: string): Promise<void>;
}