import { NavLink } from "react-router-dom";
import { NavLinkListProps } from "../types/Common";

export function NavLinkList({path, className, activeClassName='on', text}:NavLinkListProps) {
    return (
        <NavLink to={path} >
        {
            ({isActive}: { isActive: boolean}) => 
                <li className={`${className ?? className} ${isActive ? activeClassName:''}`}>{text}</li>
        }
        </NavLink>
    )
}
