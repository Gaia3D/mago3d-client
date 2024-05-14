import Sidebar from "../Sidebar";

function UserSidebar() {
    const sidebarPropsArray = [
        {path: '/userset/user', className: 'user', text: '사용자'},
        {path: '/userset/group', className: 'group', text: '그룹'},
        /*{path: '/access', className: 'access', text: '권한'},*/
    ]

    return <Sidebar divClassName="side-bar" navLinkPropsArray={sidebarPropsArray}/>
}

export default UserSidebar;