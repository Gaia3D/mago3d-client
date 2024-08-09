import Sidebar from "../Sidebar";

function UserSidebar() {
    const sidebarPropsArray = [
        {path: '/userset/group', className: 'group', text: 'group'},
        {path: '/userset/user', className: 'user', text: 'user'},
        /*{path: '/access', className: 'access', text: '권한'},*/
    ]

    return <Sidebar divClassName="side-bar" navLinkPropsArray={sidebarPropsArray}/>
}

export default UserSidebar;