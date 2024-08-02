import Sidebar from "../Sidebar";

function DataSidebar() {
    const sidebarPropsArray = [
        {path: '/dataset/group', className: 'datagroup', text: 'group'},
        {path: '/dataset/asset', className: 'ddata', text: 'data'},
        /*{path: '/map', className: 'datamap', text: '지도'},*/
    ]

    return <Sidebar divClassName="side-bar" navLinkPropsArray={sidebarPropsArray}/>
}

export default DataSidebar;