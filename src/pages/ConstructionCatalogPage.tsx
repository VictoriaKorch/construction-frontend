import { FC, useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { type ConstructionResponseDto, CONSTRUCTION_MOCK } from "../modules/construction_mock";
import { ConstructionCard } from "../components/ConstructionCard";
import { ConstructionFilter } from "../components/ConstructionFilter";

export const ConstructionCatalogPage: FC = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [items, setItems] = useState<ConstructionResponseDto[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    
    let currentMin = minPrice;
    let currentMax = maxPrice;

    // Защита от перехлеста ползунков
    if (currentMin > currentMax) {
      currentMin = maxPrice;
      currentMax = minPrice;
      setMinPrice(currentMin);
      setMaxPrice(currentMax);
    }

    const results = CONSTRUCTION_MOCK.filter(item => 
      item.status === 'published' && 
      (item.price || 0) >= currentMin && 
      (item.price || 0) <= currentMax
    );
    setItems(results);
  };

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="tile-container">
      <h1 className="tile-title">Укрупненные показатели стоимости</h1>
      
      <ConstructionFilter 
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        onSearch={handleSearch}
      />

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