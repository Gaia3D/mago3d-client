import {atom} from "recoil";

export type DistanceUnitType = "m" | "km" | "nmi" | "in" | "ft" | "yd" | "mi";
export type AreaUnitType = "m²" | "km²" | "yd²" | "mi²" | "acre" | "ha";

export const DistanceUnitState = atom<DistanceUnitType>({
    key: "DistanceUnitState",
    default: "m"
})

export const AreaUnitState = atom<AreaUnitType>({
    key: "AreaUnitState",
    default: "m²"
})