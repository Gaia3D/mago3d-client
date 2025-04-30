import React, {useEffect} from 'react';
import {LayerAsset} from "@mnd/shared/src/types/layerset/gql/graphql";
import StyleRow from "@src/components/layerset/layer/style/StyleRow";

interface LayerVectorStyleProps {
  asset: LayerAsset,
}

const LayerVectorStyle = ({asset}: LayerVectorStyleProps) => {

  useEffect(() => {
    console.log("asset", asset)
  }, [asset]);

  const styleToggle = (styleId: string) => {
    console.log("toggle", styleId);
  }

  const styleUpdate = (styleId: string) => {
    console.log("update", styleId);
  }

  const styleDelete = (styleId: string) => {
    console.log("delete", styleId);
  }


  return (
    <div className="style-container">
      <div className="left-section">
        <div className="section-header">
          <div>스타일 목록</div>
          <div>
            <button>추가</button>
          </div>
        </div>
        <div className="section-body">
          {asset.styles.map((style => {
            return (
              <StyleRow
                key={style.id}
                style={style}
                onToggle={styleToggle}
                onUpdate={styleUpdate}
                onDelete={styleDelete}
              />
            )
          }))}
        </div>
      </div>
      <div className="right-section"></div>
    </div>
  );
};

export default LayerVectorStyle;