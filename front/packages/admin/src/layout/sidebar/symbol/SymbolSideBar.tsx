import Sidebar from "../Sidebar";

function SymbolSideBar() {
  const sidebarPropsArray = [
    {path: '/symbol/group', className: 'symbol-group', text: '심볼 그룹 관리'},
    {path: '/symbol/list', className: 'symbol-list', text: '심볼 목록'},
    {path: '/symbol/register', className: 'symbol-register', text: '심볼 등록'},
  ]
  return <Sidebar divClassName="side-bar" navLinkPropsArray={sidebarPropsArray}/>
}

export default SymbolSideBar;