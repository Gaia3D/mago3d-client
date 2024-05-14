import Sidebar from "../Sidebar";

function LayerSidebar() {
    const sidebarPropsArray = [
        {path: '/layerset/group', className: 'lgroup', text: '그룹'},
        {path: '/layerset/layer', className: 'layer', text: '레이어'},
        {path: '/layerset/map', className: 'datamap', text: '지도'},
    ]

    return <Sidebar divClassName="side-bar" navLinkPropsArray={sidebarPropsArray}/>
}

export default LayerSidebar;