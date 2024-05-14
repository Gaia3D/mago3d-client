import { Coordinate } from "@/api/Coordinate";
import { useFlytoAndAddCoordEntity } from "@/hooks/useFlytoAndAddCoordEntity";
import { useEffect, useState } from "react"

export const Gars = () => {
  const {flyTo, clearEntity} = useFlytoAndAddCoordEntity("GARS");
  const [gars, setGars] = useState<string>("");
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);

  useEffect(() => {
    if (Coordinate.validGars(gars)) {
      const garsCoordinate = Coordinate.fromGars(gars);
      setCoordinate(garsCoordinate ? garsCoordinate : null);
    }
  }, [gars]);

  return (
    <>
    <div className="cordinate-value marginTop-10">
      <input type="text" placeholder="615LP47" value={gars} onChange={(e)=>{setGars(e.target.value)}}/>
    </div>
    <div className="darkMode-btn darkMode-btn-right">
      <button type="button" className="register" onClick={()=>{flyTo(coordinate)}}><a>이동</a></button>
      <button type="button" className="cancel" onClick={
        ()=>{
          setGars("");
          clearEntity();
        }
      }><a>초기화</a></button>
    </div>
    </>
  )
}