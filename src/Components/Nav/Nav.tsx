import { Link } from "react-router";
import "./assets/style.css";

function Nav() {
  return (
    <div className="menu-background">
      <div className="header-content">
        <ul className="menu">
          <li className="menu-items">
            <Link to={{pathname: '/', hash: '#about-us'}} className="menu-link">О нас</Link>
          </li>
          <li className="menu-items">
            <Link to={{pathname: '/', hash: '#how-it-works'}} className="menu-link">Как это работает</Link>
          </li>
          <li className="menu-items">
            <Link to={{pathname: '/', hash: '#reviews'}} className="menu-link">Отзывы</Link>
          </li>
          <li className="menu-items">
            <Link to={{pathname: '/', hash: '#contacts'}} className="menu-link">Контакты</Link>
          </li>
        </ul>
    </div>
    </div>
    
  )
}

export default Nav
