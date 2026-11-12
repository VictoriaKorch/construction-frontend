import { FC, useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { getConstructionsList, resetFilters } from '../store/constructionSlice';
import { api } from '../api';
import type { ConstructionResponseDto } from '../modules/construction_mock';

export const ConstructionAddPage: FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const [draft, setDraft] = useState<ConstructionResponseDto | null>(null);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [area, setArea] = useState('');

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);

    const [errors, setErrors] = useState({
        title: false, 
        description: false, 
        price: false, 
        area: false
    });

    useEffect(() => {
        const checkDraft = async () => {
            try {
                const response = await api.api.constructionControllerGetDraft();
                if (response.data) {
                    const d = response.data as ConstructionResponseDto;
                    setDraft(d);
                    
                    setTitle(d.title ?? '');
                    setDescription(d.description ?? '');
                    setPrice(d.price != null ? String(d.price) : '');
                    setArea(d.area != null ? String(d.area) : '');
                    
                    if (d.imageUrl) setImagePreview(`/construction-assets/${d.imageUrl}`);
                    if (d.videoUrl) setVideoPreview(`/construction-assets/${d.videoUrl}`);
                }
            } catch (error) {
                console.error("Ошибка при проверке черновика:", error);
            }
        };
        checkDraft();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file)); 
        }
    };

    const fetchDefaultFile = async (url: string, filename: string, type: string) => {
        const res = await fetch(url);
        const blob = await res.blob();
        return new File([blob], filename, { type });
    };

    const handleCreateDraft = async (e: FormEvent) => {
        e.preventDefault();
        
        const hasError = !title.trim();
        setErrors(prev => ({ ...prev, title: hasError }));
        if (hasError) return;

        setLoading(true);
        try {
            let finalImageFile = imageFile;
            let finalVideoFile = videoFile;

            if (!finalImageFile) {
                finalImageFile = await fetchDefaultFile('/default.jpg', 'default.jpg', 'image/jpeg');
            }
            if (!finalVideoFile) {
                finalVideoFile = await fetchDefaultFile('/default-video.mp4', 'default-video.mp4', 'video/mp4');
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('image', finalImageFile);
            formData.append('video', finalVideoFile);

            const response = await api.instance.post('/api/construction', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const d = response.data as ConstructionResponseDto;
            setDraft(d);
            
            // === ИСПРАВЛЕНИЕ ===
            // Очищаем файлы из памяти, чтобы на Шаге 2 код не думал, что мы выбрали новые!
            setImageFile(null);
            setVideoFile(null);
            
            if (d.imageUrl) setImagePreview(`/construction-assets/${d.imageUrl}`);
            if (d.videoUrl) setVideoPreview(`/construction-assets/${d.videoUrl}`);
        } catch (error) {
            console.error("Ошибка при создании черновика:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (e: FormEvent) => {
        e.preventDefault();
        
        const newErrors = {
            title: !title.trim(),
            description: !description.trim(),
            price: !price.trim(),
            area: !area.trim()
        };
        setErrors(newErrors);

        if (Object.values(newErrors).some(v => v)) {
            return; 
        }

        setLoading(true);
        try {
            let currentDraftId = draft!.id;

            if (imageFile || videoFile) {
                let finalImg = imageFile;
                if (!finalImg) {
                     finalImg = await fetchDefaultFile(`/construction-assets/${draft!.imageUrl}`, draft!.imageUrl || 'image.jpg', 'image/jpeg');
                }
                
                let finalVid = videoFile;
                if (!finalVid) {
                     finalVid = await fetchDefaultFile(`/construction-assets/${draft!.videoUrl}`, draft!.videoUrl || 'video.mp4', 'video/mp4');
                }
                
                const formData = new FormData();
                formData.append('title', title);
                formData.append('image', finalImg);
                formData.append('video', finalVid);
                
                const response = await api.instance.post('/api/construction', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                currentDraftId = response.data.id;

                try {
                    await api.api.constructionControllerDeleteService(draft!.id);
                } catch (delError) {
                    console.error("Не удалось удалить старый черновик", delError);
                }
            }

            await api.api.constructionControllerPublishService(currentDraftId, {
                title,
                description,
                price: Number(price),
                area: Number(area),
            });
            
            dispatch(resetFilters());
            dispatch(getConstructionsList(true));

            navigate('/construction');
        } catch (error) {
            console.error("Ошибка при публикации:", error);
        } finally {
            setLoading(false);
        }
    };

    const getInputStyle = (hasError: boolean) => ({
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: hasError ? 'red' : '#e8e9ec',
        backgroundColor: hasError ? 'rgba(255, 0, 0, 0.05)' : 'white',
        fontSize: '14px',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box' as const,
        fontFamily: 'inherit'
    });

    return (
        <div className="tile-container">
            <h1 className="tile-title" style={{ marginTop: '20px' }}>
                {draft ? 'Публикация проекта' : 'Новый проект'}
            </h1>
            
            <form onSubmit={draft ? handlePublish : handleCreateDraft} className="slider-form" noValidate>
                <div className="slider-group" style={{ marginBottom: '20px' }}>
                    <label className="slider-header" style={{ marginBottom: '8px' }}>
                        Файл изображения (jpg, png)
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ marginBottom: '12px', display: 'block' }}
                    />
                    {imagePreview && (
                        <div className="media-card">
                            <img src={imagePreview} alt="Превью" style={{ width: '100%', borderRadius: '8px', maxHeight: '300px', objectFit: 'cover' }} />
                        </div>
                    )}
                </div>

                <div className="slider-group" style={{ marginBottom: '20px' }}>
                    <label className="slider-header" style={{ marginBottom: '8px' }}>
                        Файл видео (mp4)
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoChange}
                        style={{ marginBottom: '12px', display: 'block' }}
                    />
                    {videoPreview && (
                        <div className="media-card">
                            <video src={videoPreview} controls style={{ width: '100%', borderRadius: '8px', backgroundColor: '#000', maxHeight: '300px' }} />
                        </div>
                    )}
                </div>

                <div className="slider-group" style={{ marginBottom: '15px' }}>
                    <label className="slider-header" style={{ marginBottom: '8px' }}>
                        Название проекта <span style={{color: 'red'}}>*</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Например, Жилой дом монолитный"
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value);
                            if (e.target.value.trim()) setErrors(prev => ({ ...prev, title: false }));
                        }}
                        style={getInputStyle(errors.title)}
                    />
                </div>
                
                {draft && (
                    <>
                        <div className="slider-group" style={{ marginBottom: '15px' }}>
                            <label className="slider-header" style={{ marginBottom: '8px' }}>
                                Описание <span style={{color: 'red'}}>*</span>
                            </label>
                            <textarea
                                placeholder="Подробное описание услуги..."
                                value={description}
                                onChange={e => {
                                    setDescription(e.target.value);
                                    if (e.target.value.trim()) setErrors(prev => ({ ...prev, description: false }));
                                }}
                                style={{ ...getInputStyle(errors.description), minHeight: '100px' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                            <div className="slider-group" style={{ flex: 1 }}>
                                <label className="slider-header" style={{ marginBottom: '8px' }}>
                                    Цена (руб/м²) <span style={{color: 'red'}}>*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="150000"
                                    value={price}
                                    onChange={e => {
                                        setPrice(e.target.value);
                                        if (e.target.value.trim()) setErrors(prev => ({ ...prev, price: false }));
                                    }}
                                    style={getInputStyle(errors.price)}
                                    min="0"
                                />
                            </div>
                            <div className="slider-group" style={{ flex: 1 }}>
                                <label className="slider-header" style={{ marginBottom: '8px' }}>
                                    Площадь (м²) <span style={{color: 'red'}}>*</span>
                                </label>
                                <input
                                    type="number"
                                    placeholder="120"
                                    value={area}
                                    onChange={e => {
                                        setArea(e.target.value);
                                        if (e.target.value.trim()) setErrors(prev => ({ ...prev, area: false }));
                                    }}
                                    style={getInputStyle(errors.area)}
                                    min="0"
                                />
                            </div>
                        </div>
                    </>
                )}
                
                <button 
                    type="submit" 
                    className="full-width-btn" 
                    disabled={loading} 
                    style={{ marginTop: '10px', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Сохранение...' : (draft ? 'Опубликовать' : 'Далее')}
                </button>
            </form>
        </div>
    );
};