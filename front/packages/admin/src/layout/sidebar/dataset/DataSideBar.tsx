import Sidebar from "../Sidebar";

function DataSidebar() {
    const sidebarPropsArray = [
        {path: '/dataset/group', className: 'datagroup', text: '그룹'},
        {path: '/dataset/asset', className: 'ddata', text: '데이터'},
        /*{path: '/map', className: 'datamap', text: '지도'},*/
    ]

    return <Sidebar divClassName="side-bar" navLinkPropsArray={sidebarPropsArray}/>
}

export default DataSidebar;