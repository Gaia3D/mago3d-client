import {CreateStyleInput, LayerBackground, PreviewColumn} from "@mnd/shared/src/types/layerset/gql/graphql";
import {UpdateStyleInput} from "@mnd/shared/src/types/layerset/gql/graphql";
import {ClassifyAttributeColumn} from "@src/generated/gql/layerset/graphql";

export interface LayerService {
  createStyle(input: CreateStyleInput): Promise<{ id: string }>;
  applyStyle(assetId: string, styleId: string): Promise<void>;
  deleteStyle(styleId: string): Promise<void>;
  updateStyle(styleId: string, input: UpdateStyleInput): Promise<{ id: string }>;

  getAttribute(assetId: string): Promise<PreviewColumn[]>;
  getClassifyAttribute(attribute: string, nativeName: string): Promise<ClassifyAttributeColumn>;
  getBackgrounds(): Promise<LayerBackground[]>;
}