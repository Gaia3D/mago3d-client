import Sidebar from "../Sidebar";

function LayerSidebar() {
    const sidebarPropsArray = [
        {path: '/layerset/group', className: 'lgroup', text: 'group'},
        {path: '/layerset/layer', className: 'layer', text: 'layer'},
        {path: '/layerset/map', className: 'datamap', text: 'map'},
    ]

    return <Sidebar divClassName="side-bar" navLinkPropsArray={sidebarPropsArray}/>
}

export default LayerSidebar;