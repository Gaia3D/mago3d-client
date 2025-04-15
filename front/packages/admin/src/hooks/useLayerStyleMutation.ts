import {
  ApplyLayerStyleDocument,
  CreateLayerStyleDocument,
  DeleteLayerStyleDocument,
  UpdateLayerStyleDocument,
} from "@src/generated/gql/layerset/graphql";
import { DocumentNode, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

type RefetchQueryMap = {
  applyStyle?: DocumentNode[];
  createStyle?: DocumentNode[];
  updateStyle?: DocumentNode[];
  deleteStyle?: DocumentNode[];
};

export const useLayerStyleMutations = (
  assetId: string,
  refetchMap: RefetchQueryMap = {}
) => {
  const { t } = useTranslation();

  const [applyStyle] = useMutation(ApplyLayerStyleDocument, {
    refetchQueries: refetchMap.applyStyle ?? [],
    onCompleted: (data) => {
      console.info(data);
      alert(t("success.style"));
    },
    onError: (error) => {
      console.error(error);
      alert(t("error.admin"));
    }
  });

  const [createStyle] = useMutation(CreateLayerStyleDocument, {
    refetchQueries: refetchMap.createStyle ?? [],
    onCompleted: (data) => {
      console.info(data);
      applyStyle({ variables: { id: assetId, styleId: data.createStyle.id } });
    },
    onError: (error) => {
      console.error(error);
      alert(t("error.admin"));
    }
  });

  const [updateStyle] = useMutation(UpdateLayerStyleDocument, {
    refetchQueries: refetchMap.updateStyle ?? [],
    onCompleted: (data) => {
      console.info(data);
      alert(t("success.style"));
    },
    onError: (error) => {
      console.error(error);
      alert(t("error.admin"));
    }
  });

  const [deleteStyle] = useMutation(DeleteLayerStyleDocument, {
    refetchQueries: refetchMap.deleteStyle ?? [],
    onCompleted: (data) => {
      console.info(data);
      alert(t("success.style-delete"));
    },
    onError: (error) => {
      console.error(error);
      alert(t("error.admin"));
    }
  });

  return {
    applyStyle,
    createStyle,
    updateStyle,
    deleteStyle,
  };
};
