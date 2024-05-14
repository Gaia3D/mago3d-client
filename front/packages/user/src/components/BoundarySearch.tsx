import { useSggAddress, useSidoAddress, useUmdAddress } from "@/hooks/useAddress";
import { selectedSggState, selectedSidoState, selectedUmdState } from "@/recoils/Boundary";
import { BoundarySearchItem } from "@mnd/shared/src/types/search-gen-type";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import * as Cesium from "cesium";
import { useGlobeController } from "./providers/GlobeControllerProvider";

export const BoundarySearchWrapper = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <div className="button-location"
     onMouseOver={()=>{setOpen(true)}}
     onMouseOut={()=>{setOpen(false)}}
    >
      {open ? <BoundarySearch /> : null}
    </div>
  )
}

const BoundarySearch = () => {
  const [selectedSido, setSelectedSido] = useRecoilState<BoundarySearchItem | undefined>(selectedSidoState);
  const [selectedSgg, setSelectedSgg] = useRecoilState<BoundarySearchItem | undefined>(selectedSggState);
  const [selectedUmd, setSelectedUmd] = useRecoilState<BoundarySearchItem | undefined>(selectedUmdState);
  const {globeController:{viewer}} = useGlobeController();

  useEffect(()=>{
    setSelectedSido(undefined);
    setSelectedSgg(undefined);
    setSelectedUmd(undefined);
  }, []);
  const flyTo = () => {
    if (!viewer) return;

    const selected = selectedUmd || selectedSgg || selectedSido;
    
    if (!selected) {
      alert('선택된 위치가 없습니다.');
      return;
    }

    const {centerLon, centerLat} = selected;
    const cartesian = Cesium.Cartesian3.fromDegrees(centerLon ?? 0, centerLat ?? 0, 5000);
    
    viewer.camera.flyTo({
      destination: cartesian,
      duration: 1,
    });
  }
  return (
    <div className="dialog--wrapper">
      <div className="dialog-search">
        <BoundarySido />
        <BoundarySGG />
        <BoundaryUMD />
        <div className="dialog-btn">
          <button type="button" className="register" onClick={flyTo}><a>이동</a></button>
          <button type="button" className="cancel"><a>취소</a></button>
        </div>
      </div>	
    </div>
  )
}

const BoundarySido = () => {
  const { data: addresses } = useSidoAddress();
  const [selectedSido, setSelectedSido] = useRecoilState<BoundarySearchItem | undefined>(selectedSidoState);
  const setSelectedSgg = useSetRecoilState(selectedSggState);
  const setSelectedUmd = useSetRecoilState(selectedUmdState);

  useEffect(()=>{
    setSelectedSgg(undefined);
    setSelectedUmd(undefined);
  }, [selectedSido]);
  return (
    <ul className="sido">
      {
        addresses && addresses.map((item) => (
          <li key={item.id} 
            className={selectedSido === item ? 'on':''}
            onClick={()=>{
              setSelectedSido((prev)=>{
                if(prev && prev.code === item.code){
                  return undefined;
                }
                return item;
              }); 
            }}  
          >
              {item.name}
          </li>
        ))
      }
    </ul>
  )
}

const BoundarySGG = () => {
  const { data: addresses } = useSggAddress();
  const [selectedSgg, setSelectedSgg] = useRecoilState<BoundarySearchItem | undefined>(selectedSggState);
  const setSelectedUmd = useSetRecoilState(selectedUmdState);

  useEffect(()=>{
    setSelectedUmd(undefined);
  }, [selectedSgg]);

  return (
    <ul className="gun-gu">
      {
        addresses ? addresses.map((item) => (
          <li key={item.id}
            className={selectedSgg === item ? 'on':''}  
            onClick={()=>{
              setSelectedSgg((prev)=>{
                if(prev && prev.code === item.code){
                  return undefined;
                }
                return item;
              }); 
            }} 
          >
            {item.name}
          </li>
        )) : <li style={{fontSize:'12px'}}>선택된 시도가 없습니다.</li>
      }
    </ul>
  )
}

const BoundaryUMD = () => {
  const { data: addresses } = useUmdAddress();
  const [selectedUmd, setSelectedUmd] = useRecoilState<BoundarySearchItem | undefined>(selectedUmdState);
  return (
    <ul className="dong">
      {
        addresses ? addresses.map((item) => (
          <li key={item.id}
            className={selectedUmd === item ? 'on':''}  
            onClick={()=>{
              setSelectedUmd((prev)=>{
                if(prev && prev.code === item.code){
                  return undefined;
                }
                return item;
              }); 
            }} 
          >
            {item.name}
          </li>
        )) : <li style={{fontSize:'11px'}}>선택된 시군구가 없습니다.</li>
      }
    </ul>
  )
}