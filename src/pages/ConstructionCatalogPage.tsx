import { FC, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { type ConstructionResponseDto, CONSTRUCTION_MOCK } from "../modules/construction_mock";
import { ConstructionCard } from "../components/ConstructionCard";
import { type AppOutletContext } from "../AppLayout";

export const ConstructionCatalogPage: FC = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [items, setItems] = useState<ConstructionResponseDto[]>([]);
  const { setCards } = useOutletContext<AppOutletContext>();
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const results = CONSTRUCTION_MOCK.filter(item => 
      item.status === 'published' && 
      (item.price || 0) >= minPrice && 
      (item.price || 0) <= maxPrice
    );
    setItems(results);
    setCards(results);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tile-container">
      <h1 className="tile-title">Укрупненные показатели стоимости</h1>
      
      <form className="search-form slider-form" onSubmit={handleSearch}>
        <div className="slider-group">
          <div className="slider-header">
            <label>От: <b>{minPrice} руб/м²</b></label>
          </div>
          <div className="search-bar slider-bar">
            <span className="slider-bound">0</span>
            <input 
              type="range" 
              min="0" 
              max="100000" 
              step="1000"
              value={minPrice} 
              onChange={(e) => setMinPrice(Number(e.target.value))} 
              className="search-slider" 
            />
            <span className="slider-bound">100к</span>
          </div>
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <label>До: <b>{maxPrice} руб/м²</b></label>
          </div>
          <div className="search-bar slider-bar">
            <span className="slider-bound">0</span>
            <input 
              type="range" 
              min="0" 
              max="100000" 
              step="1000"
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))} 
              className="search-slider" 
            />
            <span className="slider-bound">100к</span>
          </div>
        </div>

        <button type="submit" className="search-btn full-width-btn">Найти</button>
      </form>

      <div className="services-grid">
        {items.map((item) => (
          <ConstructionCard 
            key={item.id} 
            {...item} 
            onClick={() => navigate(`/construction/feed/${item.id}`)} 
          />
        ))}
        {items.length === 0 && <p style={{ gridColumn: 'span 2', textAlign: 'center' }}>Нет услуг по фильтру</p>}
      </div>
    </div>
  );
};