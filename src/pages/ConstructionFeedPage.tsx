import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type ConstructionResponseDto, CONSTRUCTION_MOCK } from "../modules/construction_mock";

const defaultImage = "/default.jpg";

export const ConstructionFeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<ConstructionResponseDto | null>(null);

  const publishedList = CONSTRUCTION_MOCK.filter(item => item.status === 'published');

  useEffect(() => {
    if (!publishedList.length) return;

    if (!id) {
      setPageData(publishedList[0]);
      return;
    }

    const foundItem = publishedList.find(item => String(item.id) === id);
    if (foundItem) {
      setPageData(foundItem);
    } else {
      setPageData(publishedList[0]);
    }
  }, [id]);

  const handleNext = () => {
    if (!pageData) return;
    const currentIndex = publishedList.findIndex(item => item.id === pageData.id);
    const nextIndex = (currentIndex + 1) % publishedList.length;
    const nextItem = publishedList[nextIndex];
    
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