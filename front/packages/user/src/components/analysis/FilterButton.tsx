import { FilterLayerProps, FilterLayerState } from "@/recoils/Analysis";
import { useSetRecoilState } from "recoil";
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const FilterButton = ({ fieldName, layerName, filter, setFilter }: {
  fieldName: string,
  layerName: string,
  filter: string | null,
  setFilter: React.Dispatch<React.SetStateAction<string | null>>
}) => {
  const setFilterLayer = useSetRecoilState<FilterLayerProps | null>(FilterLayerState);
  return (
    <div className="btn-div" onClick={(e)=>{
      e.stopPropagation();
      setFilterLayer({
        fieldName,
        layerName,
        defaultFilter: filter,
        setFilter
      });
    }}>
      <button className="drawBtn" type="button">
        <FilterAltIcon/>
      </button>
    </div>
  )
}

export default FilterButton;