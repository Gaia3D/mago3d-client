import { useKeycloak } from "@react-keycloak/web";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const { pathname } = useLocation();

  return (
    <header className={pathname === "/" ? "main" : "basic"}>
      <div className="bar-center">
        <Link to={"/"}>
          <h1 className="logo">국방 디지털트윈 플랫폼</h1>
        </Link>
      </div>
    </header>
  );
};

export default Header;
