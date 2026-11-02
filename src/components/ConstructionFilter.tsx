import { FC, FormEvent } from "react";

interface IFilterProps {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (val: number) => void;
  setMaxPrice: (val: number) => void;
  onSearch: (e?: FormEvent) => void;
}

export const ConstructionFilter: FC<IFilterProps> = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  onSearch
}) => {
  return (
    <form className="search-form slider-form" onSubmit={onSearch}>
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
  );
};