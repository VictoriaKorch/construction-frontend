import { FC, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { getConstructionsList, setMinPrice, setMaxPrice, deleteConstructionAsync } from "../store/constructionSlice";
import { ConstructionCard } from "../components/ConstructionCard";
import { ConstructionFilter } from "../components/ConstructionFilter";

export const ConstructionCatalogPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { items, minPrice, maxPrice, sliderMin, sliderMax, loading } = useSelector((state: RootState) => state.constructions);
  
  // Достаем статус авторизации из Redux
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    dispatch(getConstructionsList(false));
  };

  useEffect(() => {
    // Если sliderMax равен 0, значит мы зашли первый раз. 
    // Если больше 0 — значит фильтры уже были настроены (вернулись из ленты), запрос делать не нужно.
    if (sliderMax === 0) {
      dispatch(getConstructionsList(true));
    }
  }, [dispatch, sliderMax]);

  return (
    <div className="tile-container">
      <h1 className="tile-title">Укрупненные показатели стоимости</h1>
      
      <ConstructionFilter 
        minPrice={minPrice}
        maxPrice={maxPrice}
        sliderMin={sliderMin}
        sliderMax={sliderMax}
        setMinPrice={(val) => dispatch(setMinPrice(val))}
        setMaxPrice={(val) => dispatch(setMaxPrice(val))}
        onSearch={handleSearch}
      />

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>Загрузка...</div>
      ) : (
        <div className="services-grid">
          {items.map((item) => (
            <ConstructionCard 
              key={item.id} 
              {...item} 
              // ПРИНУДИТЕЛЬНО скрываем кнопку удаления, если интерфейс в режиме Гостя (0)
              isCreator={isAuthenticated === 1 ? item.isCreator : 0} 
              onClick={() => navigate(`/construction/feed/${item.id}`)} 
              onDelete={(id) => dispatch(deleteConstructionAsync(id))}
            />
          ))}
          {items.length === 0 && <p style={{ gridColumn: 'span 2', textAlign: 'center' }}>Нет услуг по фильтру</p>}
        </div>
      )}
    </div>
  );
};