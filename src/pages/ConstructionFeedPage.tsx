import { FC, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store";
import { toggleLikeAsync } from "../store/constructionSlice";
import { api } from "../api";
import { CONSTRUCTION_MOCK, type ConstructionResponseDto } from "../modules/construction_mock";
import axios from "axios";

const defaultImage = "/default.jpg";

export const ConstructionFeedPage: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [pageData, setPageData] = useState<ConstructionResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  
  const lastFetchedId = useRef<string | null>(null);
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  // Функция для работы с мок-данными, когда бэкенд выключен (502, 404 или ошибка сети)
  const getMockFeed = (targetId?: string, isNext: boolean = false) => {
    const publishedMocks = CONSTRUCTION_MOCK.filter(item => item.status === 'published');
    if (publishedMocks.length === 0) return null;

    if (!targetId || !isNext) {
      // Если ID нет или это первый вход — возвращаем самую первую карточку
      return publishedMocks[0];
    }

    // Ищем текущий индекс
    const currentIndex = publishedMocks.findIndex(item => String(item.id) === String(targetId));
    
    if (currentIndex === -1 || currentIndex >= publishedMocks.length - 1) {
      // Если дошли до конца или карточка не найдена — циклично возвращаем первую
      return publishedMocks[0];
    } else {
      // Возвращаем следующую карточку
      return publishedMocks[currentIndex + 1];
    }
  };

  const fetchFeed = async (targetId?: string, isNext: boolean = false) => {
    setLoading(true);
    try {
      const queryParams: Record<string, string> = {};
      if (targetId) queryParams.id = targetId;
      if (isNext) queryParams.next = 'true';

      const response = await api.instance.get('/api/construction/feed', {
        params: queryParams
      });

      const item = response.data.ConstructionService || response.data;

      if (item && item.id) {
        setPageData(item);
        lastFetchedId.current = String(item.id);
        
        if (isNext || !targetId) {
          navigate(`/construction/feed/${item.id}`, { replace: true });
        }
      } else {
        // Если структура ответа странная — падаем на моки
        const mockItem = getMockFeed(targetId, isNext);
        if (mockItem) {
          setPageData(mockItem);
          navigate(`/construction/feed/${mockItem.id}`, { replace: true });
        }
      }
    } catch (error: unknown) {
      // ЕСЛИ БЭКЕНД ВЫКЛЮЧЕН (502, 404, Network Error) — ИСПОЛЬЗУЕМ МОКИ ДЛЯ ГОСТЯ
      if (axios.isAxiosError(error)) {
        const mockItem = getMockFeed(targetId, isNext);
        if (mockItem) {
          setPageData(mockItem);
          lastFetchedId.current = String(mockItem.id);
          navigate(`/construction/feed/${mockItem.id}`, { replace: true });
        }
      } else {
        console.error("Ошибка загрузки ленты:", error);
        setPageData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      fetchFeed(undefined, true);
    } else if (lastFetchedId.current !== id) {
      fetchFeed(id, false);
    }
  }, [id]);

  const handleNext = () => {
    if (pageData) {
      fetchFeed(String(pageData.id), true);
    }
  };

  const handleLikeClick = () => {
    if (pageData && isAuthenticated === 1) {
      dispatch(toggleLikeAsync({ id: pageData.id, currentLike: pageData.isLiked }));

      const newIsLiked = pageData.isLiked === 1 ? 0 : 1;
      const newCount = newIsLiked === 1 ? pageData.likesCount + 1 : pageData.likesCount - 1;

      setPageData({
        ...pageData,
        isLiked: newIsLiked,
        likesCount: newCount
      });
    }
  };

  if (loading) return <div style={{display:'flex', height:'100%', justifyContent:'center', alignItems:'center'}}>Загрузка...</div>;
  if (!pageData) return <div style={{display:'flex', height:'100%', justifyContent:'center', alignItems:'center'}}>Нет данных для отображения</div>;

  const isLikeActive = isAuthenticated === 1 && pageData.isLiked === 1;

  return (
    <div className="feed-container">
      <div className="video-wrapper">
        {pageData.videoUrl ? (
          <video 
            src={`/construction-assets/${pageData.videoUrl}`} 
            className="feed-video" 
            autoPlay 
            muted 
            loop 
            playsInline 
          />
        ) : (
          <img 
            src={pageData.imageUrl ? `/construction-assets/${pageData.imageUrl}` : defaultImage} 
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
                  <button 
                    onClick={handleLikeClick} 
                    className="sidebar-item" 
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      cursor: isAuthenticated === 1 ? 'pointer' : 'default' 
                    }}
                  >
                    <div 
                      className="sidebar-icon" 
                      style={{ 
                        color: isLikeActive ? '#ff4040' : '#ffffff',
                        borderColor: isLikeActive ? '#ff4040' : 'rgba(255,255,255,0.15)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      ❤️
                    </div>
                    <span className="sidebar-text">{pageData.likesCount}</span>
                  </button>
                  <button onClick={handleNext} className="sidebar-item" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
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