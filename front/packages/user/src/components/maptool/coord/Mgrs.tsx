import { Coordinate } from "@/api/Coordinate";
import { useFlytoAndAddCoordEntity } from "@/hooks/useFlytoAndAddCoordEntity";
import { useEffect, useState } from "react"

export const Mgrs = () => {
  const {flyTo, clearEntity} = useFlytoAndAddCoordEntity("MGRS");
  const [mgrs, setMgrs] = useState<string>("");
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);

  useEffect(() => {
    if (Coordinate.validMgrs(mgrs)) {
      const mgrsCoordinate = Coordinate.fromMGRS(mgrs);
      setCoordinate(mgrsCoordinate ? mgrsCoordinate : null);
    }
  }, [mgrs]);

  return (
    <>
    <div className="cordinate-value marginTop-10">
      <input type="text" value={mgrs} placeholder="52SCF4468641052" onChange={(e)=>{setMgrs(e.target.value)}}/>
    </div>
    <div className="darkMode-btn darkMode-btn-right">
      <button type="button" className="register" onClick={()=>{flyTo(coordinate)}}><a>이동</a></button>
      <button type="button" className="cancel" onClick={
        ()=>{
          setMgrs("");
          clearEntity();
        }
      }><a>초기화</a></button>
    </div>
    </>
  )
}