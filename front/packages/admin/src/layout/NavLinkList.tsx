import { NavLink } from "react-router-dom";
import { NavLinkListProps } from "../types/Common";
import {useTranslation} from "react-i18next";

export function NavLinkList({path, className, activeClassName='on', text}: NavLinkListProps) {
    const {t} = useTranslation();
    return (
        <NavLink to={path} >
        {
            ({isActive}: { isActive: boolean}) => 
                <li className={`${className ?? className} ${isActive ? activeClassName:''}`}>{t(text)}</li>
        }
        </NavLink>
    )
}
