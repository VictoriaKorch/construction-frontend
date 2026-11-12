import { FC } from "react";

interface Props {
  id: number;
  title: string;
  price: number | null;
  imageUrl: string | null;
  likesCount: number;
  isCreator: number;
  onClick: () => void;
  onDelete: (id: number) => void;
}

const defaultImage = "/default.jpg";

export const ConstructionCard: FC<Props> = ({ id, title, price, imageUrl, likesCount, isCreator, onClick, onDelete }) => (
  <div className="service-card-wrapper">
    <div className="service-card" onClick={onClick}>
      <img 
        src={imageUrl ? `/construction-assets/${imageUrl}` : defaultImage} 
        className="card-image" 
        alt={title} 
        loading="lazy"
      />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-price">{price ? `${price} руб/м²` : "Не указана"}</div>
      </div>
    </div>
    
    <div className="card-footer">
      <div className="card-likes">❤️ {likesCount}</div>
      {isCreator === 1 && (
        <button 
          className="tile-delete-btn" 
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          Удалить
        </button>
      )}
    </div>
  </div>
);