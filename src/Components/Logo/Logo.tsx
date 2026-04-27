import { Link } from "react-router";
import logo from "./assets/logo.svg";
import "./assets/style.css";

function Logo() {
  return (
    <Link to="/"><img src={logo} alt="домой" className="logo"></img></Link>
  );
}

export default Logo
