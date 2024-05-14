import { useParams } from "react-router-dom";
import Sidebar from "../Sidebar";

function DataUpdateTab() {
    const {id} = useParams();
    if (!id) return;

    const propsArray = [
        {path: `/dataset/asset/update/3d/${id}`, className: '', text: '3D'},
        {path: `/dataset/asset/update/vector/${id}`, className: '', text: 'Vector'},
        {path: `/dataset/asset/update/raster/${id}`, className: '', text: 'Raster'},
    ]

    return <Sidebar divClassName="tabmenu" navLinkPropsArray={propsArray}/>
}

export default DataUpdateTab;