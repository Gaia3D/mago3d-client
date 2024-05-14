import { Coordinate, isNumber } from "@/api/Coordinate";
import { useFlytoAndAddCoordEntity } from "@/hooks/useFlytoAndAddCoordEntity";
import { useEffect, useState } from "react"

const defaultUtm = {
  zoneNum: "",
  zoneLetter: "N",
  easting: "",
  northing: "",
}
export const Utm = () => {
  const {flyTo, clearEntity} = useFlytoAndAddCoordEntity("UTM");
  const [utm, setUtm] = useState({
    ...defaultUtm
  })
  const [coordinate, setCoordinate] = useState<Coordinate | null>(null);

  useEffect(() => {
    const utmString = `${utm.zoneNum}${utm.zoneLetter}${utm.easting}mE${utm.northing}mN`;
    console.info(utmString);
    if (Coordinate.validUtm(utmString)) {
      const utmCoordinate = Coordinate.fromUTM({
        zoneNum: Number(utm.zoneNum),
        zoneLetter: utm.zoneLetter as "N" | "S",
        easting: Number(utm.easting),
        northing: Number(utm.northing),
      });
      setCoordinate(utmCoordinate ? utmCoordinate : null);
    }
  }, [utm]);

  useEffect(() => {
    console.info(coordinate);
  }, [coordinate]);

  return (
    <>
    <div className="cordinate-value utm marginTop-10">
      <input type="text" value={utm.zoneNum} className="zone-num" placeholder="52" onChange={(e)=>{setUtm({...utm, ...{zoneNum:e.target.value}})}}/>
      <select value={utm.zoneLetter} onChange={(e)=>{setUtm({...utm, ...{zoneLetter:e.target.value}})}}>
        <option value="N">N</option>
        <option value="S">S</option>
      </select>
      <input type="text" value={utm.easting} className="zone-easting" placeholder="344686" onChange={(e)=>{setUtm({...utm, ...{easting:e.target.value}})}}/><span style={{color:'white', marginLeft:'3px', fontSize:'12px'}}>mE</span>
      <input type="text" value={utm.northing} className="zone-northing" placeholder="4041052" onChange={(e)=>{setUtm({...utm, ...{northing:e.target.value}})}}/><span style={{color:'white',  marginLeft:'3px', fontSize:'12px'}}>mN</span>
    </div>
    <div className="darkMode-btn darkMode-btn-right">
      <button type="button" className="register" onClick={()=>{flyTo(coordinate)}}><a>이동</a></button>
      <button type="button" className="cancel" onClick={
        ()=>{
          setUtm({...defaultUtm});
          clearEntity();
        }
      }><a>초기화</a></button>
    </div>
    </>
  )
}