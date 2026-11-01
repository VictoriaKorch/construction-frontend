import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ConstructionTabBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isFeed = location.pathname.startsWith("/construction/feed");
  const isList = location.pathname === "/construction/catalog";

  return (
    <nav className="bottom-nav">
      <button 
        type="button" 
        className={`nav-item ${isFeed ? "active" : ""}`} 
        onClick={() => navigate("/construction/feed")}
      >
        Лента
      </button>
      <button 
        type="button" 
        className="nav-item" 
        disabled
      >
        Добавить
      </button>
      <button 
        type="button" 
        className={`nav-item ${isList ? "active" : ""}`} 
        onClick={() => navigate("/construction/catalog")}
      >
        Плитка
      </button>
      <button 
        type="button" 
        className="nav-item" 
        disabled
      >
        Вход
      </button>
    </nav>
  );
};