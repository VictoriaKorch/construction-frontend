import { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import type { AppDispatch, RootState } from "../store";
import { logoutSuccess, logoutFailure } from "../store/userSlice";
import { resetFilters, getConstructionsList } from "../store/constructionSlice";

export const ConstructionTabBar: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const isFeed = location.pathname.startsWith("/construction/feed");
  const isList = location.pathname === "/construction";
  const isAdd = location.pathname === "/construction/add";

  const handleLogout = async () => {
    try {
      // Прямой запрос деавторизации через axios
      await axios.post("/api/users/logout");
      
      // Вручную очищаем состояние в Redux
      dispatch(logoutSuccess());
      dispatch(resetFilters());          
      navigate("/construction"); 
      dispatch(getConstructionsList(true));  
      
    } catch (error) {
      console.error("Ошибка при выходе из системы:", error);
      dispatch(logoutFailure('Ошибка при выходе из системы'));
    }
  };

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
        className={`nav-item ${isAdd ? "active" : ""}`} 
        onClick={() => navigate("/construction/add")}
        disabled={isAuthenticated === 0}
      >
        Добавить
      </button>
      <button 
        type="button" 
        className={`nav-item ${isList ? "active" : ""}`} 
        onClick={() => navigate("/construction")}
      >
        Плитка
      </button>
      
      {isAuthenticated === 0 ? (
        <button 
          type="button" 
          className="nav-item" 
          onClick={() => navigate("/users/login")}
        >
          Вход
        </button>
      ) : (
        <button 
          type="button" 
          className="nav-item" 
          onClick={handleLogout}
        >
          Выход
        </button>
      )}
    </nav>
  );
};