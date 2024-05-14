import { NavLinkListProps } from "../../types/Common";
import {NavLinkList} from "../NavLinkList";

function Sidebar({divClassName, navLinkPropsArray}: {divClassName: string, navLinkPropsArray: NavLinkListProps[]}) {
    return (
        <div className={divClassName}>
            <ul>
                {
                    navLinkPropsArray.map((navLinkProps, index)=><NavLinkList key={index} {...navLinkProps}/>)
                }
            </ul>
        </div>
    )
}

export default Sidebar;