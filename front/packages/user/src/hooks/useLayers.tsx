import { useEffect, useMemo, useReducer, useState } from "react";
import { useQuery } from '@tanstack/react-query'
import request, {gql} from "graphql-request";
import {GroupsDocument} from "@/types/layerset/gql/graphql.ts";
import {Group} from "ol/layer";

export interface BaseLayer {
  id: string;
  name: string;
  description?: string;

  setVisible(visible: boolean): void;
  isVisible(): boolean;
}

export class SimpleLayer implements BaseLayer {
  constructor(public id: string, public name: string, public visible: boolean, public description?: string) {}

  isVisible(): boolean {
    return this.visible;
  }

  setVisible(visible: boolean) {
    this.visible = visible;
  }
}

export class GroupLayer implements BaseLayer {
  children: BaseLayer[] = [];

  constructor(public id: string, public name: string, public description?: string) {}

  addChild(child: BaseLayer | GroupLayer) {
    this.children.push(child);
  }

  setVisible(visible: boolean) {
    this.children.forEach((child) => child.setVisible(visible));
  }

  isVisible(): boolean {
    return this.children.find((child) => child.isVisible() === true) ? true : false;
  }
}

export const useLayers = () => {
  // const [layers, dispatch] = useReducer(layerReducer, []);

  // 데이터 조회
  /* const {data, isFetching, error} = useQuery({
    queryKey: ['layers'],
    queryFn: () => request('https://mdtp.gaia3d.com/app/api/layerset/graphql', GroupsDocument),
  }); */

  // useEffect(() => {
  //   if (!fetching) {
  //     // const layers = data?.groups.map(toGroupLayer);
  //     // dispatch({ type: "add", layers: layers });
  //     // setLayers(layers || []);
  //   }
  // }, [data, fetching, error]);

  // const doFetch = async () => {
  //   // const response = await fetch("/api/layers");
  //   // const data = (await response.json()) as Layer[];
  //   // setLayers(data);
  // };

  //return {data, isFetching, error};
};

// // LayerGroup -> GroupLayer 변환
// function toGroupLayer(group: LayerGroup) {
//   const children = group.children.map(toGroupLayer);
//   const assets = group.assets.map(toSimpleLayer);
//
//   const result = new GroupLayer(group.id, group.name || "Unnamed");
//   result.children = [...children, ...assets];
//   return result;
// }
//
// // LayerAsset -> SimpleLayer 변환
// function toSimpleLayer(asset: LayerAsset) {
//   return new SimpleLayer(asset.id, asset.name || "Unnamed", false);
// }
//
// function layerReducer(state: BaseLayer[], action: any) {
//   console.log("layerReducer", state, action);
//   switch (action.type) {
//     case "add":
//       // return [...state, action.layers];
//       return action.layers;
//     case "toggle": {
//       const { visible } = action.payload;
//       if (visible === undefined) {
//         state.forEach((layer) => layer.setVisible(!layer.isVisible()));
//       } else {
//         state.forEach((layer) => layer.setVisible(visible));
//       }
//
//       return [...state];
//     }
//     case "visible": {
//       const { id, visible } = action.payload;
//
//       // const findById = (arr: any, id: string) => {
//       //   return arr.find((a) => {
//       //     if (a.children && a.children.length > 0) {
//       //       return a.id === id ? true : findById(a.children, id);
//       //     } else {
//       //       return a.id === id;
//       //     }
//       //   });
//       //   return a;
//       // };
//
//       // findById(state, id)?.setVisible(visible);
//
//       state.forEach((layer) => layer.setVisible(!layer.isVisible()));
//       //state.find((layer) => layer.id === id)?.setVisible(visible);
//       return [...state];
//     }
//     default:
//       throw new Error();
//   }
// }
