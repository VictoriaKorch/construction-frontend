import { FC, useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { type ConstructionResponseDto, CONSTRUCTION_MOCK } from "../modules/construction_mock";
import { type AppOutletContext } from "../AppLayout";

const defaultImage = "/default.jpg";

export const ConstructionFeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cards } = useOutletContext<AppOutletContext>();
  const [pageData, setPageData] = useState<ConstructionResponseDto>();

  useEffect(() => {
    let currentId = id;
    if (!currentId && cards.length > 0) {
      currentId = String(cards[0].id);
    }

    if (currentId) {
      const fromMock = CONSTRUCTION_MOCK.find(item => String(item.id) === currentId);
      setPageData(fromMock || CONSTRUCTION_MOCK[0]);
    } else {
      setPageData(CONSTRUCTION_MOCK[0]);
    }
  }, [id, cards]);

  const handleNext = () => {
    if (!pageData || cards.length === 0) return;
    const currentIndex = cards.findIndex(item => item.id === pageData.id);
    // Цикличное перелистывание по массиву отфильтрованных карточек
    const nextIndex = (currentIndex + 1) % cards.length;
    const nextItem = cards[nextIndex];
    if (nextItem) {
      navigate(`/construction/feed/${nextItem.id}`);
    }
  };

  if (!pageData) return <div style={{display:'flex', height:'100%', justifyContent:'center', alignItems:'center'}}>Загрузка...</div>;

  return (
    <div className="feed-container">
      <div className="video-wrapper">
        {pageData.videoUrl ? (
          <video 
            src={`/${pageData.videoUrl}`} 
            className="feed-video" 
            autoPlay 
            muted 
            loop 
            playsInline 
          />
        ) : (
          <img 
            src={pageData.imageUrl ? `/${pageData.imageUrl}` : defaultImage} 
            className="feed-video" 
            alt={pageData.title} 
          />
        )}

        <div className="video-overlay">
          <div className="feed-content">
            <div className="title-row">
              <h2 className="service-title">{pageData.title}</h2>
              
              <div className="service-details">
                <div className="feed-sidebar">
                  <div className="sidebar-item">
                    <div className="sidebar-icon">❤️</div>
                    <span className="sidebar-text">{pageData.likesCount}</span>
                  </div>
                  <button onClick={handleNext} className="sidebar-item">
                    <div className="sidebar-icon">↓</div>
                    <span className="sidebar-text">Далее</span>
                  </button>
                </div>

                <span className="detail-item">{pageData.price ? pageData.price : 0}<br/>руб/м²</span>
                <span className="detail-item">{pageData.area ? pageData.area : 0}<br/>м²</span>
              </div>
            </div>
            
            <div className="description-wrapper">
              <input type="checkbox" id="desc-toggle" className="desc-checkbox" />
              <div className="service-description">{pageData.description}</div>
              <label htmlFor="desc-toggle" className="toggle-description" data-more="Еще" data-less="Скрыть"></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};