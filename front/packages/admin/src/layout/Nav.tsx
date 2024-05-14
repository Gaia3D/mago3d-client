import { NavLink } from "react-router-dom";
import { IUserInfo } from "@mnd/shared";
import SignInfo from "../components/nav/SignInfo";
import { useState } from "react";
import { useChangeUserProfileEvent } from "../hooks/UserInfo";

export function Nav() {
    const [isAdmin, setIsAdmin] = useState(false);
    useChangeUserProfileEvent((contents:IUserInfo) => {
        setIsAdmin(contents.isAdmin ?? false);
    });
 
    return (
      <nav>
        <h1>
          디지털트윈 플랫폼
          <br />
          관리자화면
        </h1>
        {isAdmin && (
          <ul>
            <NavLink to="userset">
              {({ isActive }: { isActive: boolean }) => (
                <li className={`user ${isActive ? "on" : ""}`}>사용자</li>
              )}
            </NavLink>
            <NavLink to="dataset">
              {({ isActive }: { isActive: boolean }) => (
                <li className={`data ${isActive ? "on" : ""}`}>데이터</li>
              )}
            </NavLink>
            <NavLink to="layerset">
              {({ isActive }: { isActive: boolean }) => (
                <li className={`layer ${isActive ? "on" : ""}`}>레이어</li>
              )}
            </NavLink>
          </ul>
        )}
        <SignInfo />
      </nav>
    );
}
