import React from "react";
import {AsideDisplayProps} from "@/components/AsidePanel.tsx";
import {DatasetAssetListDocument} from "@mnd/shared/src/types/dataset/gql/graphql.ts";
import {
    LayersetGroupListWithAssetDocument,
    LayersetLocateAssetDocument,
    LayersetLocateGroupDocument,
    LayersetUpdateAssetDocument,
    LayersetUpdateGroupDocument
} from "@mnd/shared/src/types/layerset/gql/graphql";
import {useMutation, useSuspenseQuery} from "@apollo/client";

export const AsideLayers: React.FC<AsideDisplayProps>  = ({display}) => {

    const mutationOptions = {
        refetchQueries: [LayersetGroupListWithAssetDocument]
    };

    const [updateGroupMutation] = useMutation(LayersetUpdateGroupDocument, mutationOptions);
    const [updateAssetMutation] = useMutation(LayersetUpdateAssetDocument, mutationOptions);
    const [locateGroupMutation] = useMutation(LayersetLocateGroupDocument, mutationOptions);
    const [locateAssetMutation] = useMutation(LayersetLocateAssetDocument, mutationOptions);

    const {data} = useSuspenseQuery(LayersetGroupListWithAssetDocument)
    console.log(data);

  return (
      <div className={`side-bar-wrapper ${display ? "on" : "off"}`}>
          <input type="checkbox" id="toggleButton"/>
          <div className="side-bar">
              <div className="side-bar-header">
                  <label htmlFor="toggleButton">
                      <button type="button" className="button side">
                          <div className="description--content">
                              <div className="title">Close sidebar</div>
                          </div>
                      </button>
                  </label>
                  <button type="button" className="button search"></button>
              </div>
              <div className="content--wrapper">
                  <ul className="layer">
                      <li className="selected"><a href="#">Terrain</a></li>
                  </ul>
                  <ul className="layer-list">
                      <li>
                          <span className="type type-terrain"></span>
                          <span className="name">Ellipsoid Terrain (Default)</span>
                      </li>
                  </ul>
                  <ul className="layer">
                      <li className="selected"><a href="#">Tileset</a></li>
                      <li><a href="#">Primitives</a></li>
                      <li><a href="#">Entities</a></li>
                      <li className="button-area">
                          <div className="layer-button">
                              <button type="button" className="layer-funtion-button not-visible"></button>
                              <button type="button" className="layer-funtion-button map-view"></button>
                              <button type="button" className="layer-funtion-button delete"></button>
                          </div>
                      </li>
                  </ul>
                  <div className="layer-scroll">
                      <ul className="layer-list">
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTFDKZA-JXTFDKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button not-visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                          <li>
                              <span className="type type-3d"></span>
                              <span className="name">3DS-ICQF-QEYS-DKZA-JXTF</span>
                              <div className="layer-button">
                                  <button type="button" className="layer-funtion-button visible"></button>
                                  <button type="button" className="layer-funtion-button map-view"></button>
                                  <button type="button" className="layer-funtion-button delete"></button>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
  );
};
