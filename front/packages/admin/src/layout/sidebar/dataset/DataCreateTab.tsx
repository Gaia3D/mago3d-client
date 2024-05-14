import Sidebar from "../Sidebar";

function DataCreateTab() {
    const propsArray = [
        {path: '/dataset/asset/create/3d', className: '', text: '3D'},
        {path: '/dataset/asset/create/vector', className: '', text: 'Vector'},
        {path: '/dataset/asset/create/raster', className: '', text: 'Raster'},
    ]

    return <Sidebar divClassName="tabmenu" navLinkPropsArray={propsArray}/>
}

export default DataCreateTab;