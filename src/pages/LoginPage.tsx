import { FC, useState, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import type { AppDispatch, RootState } from '../store';
import { loginSuccess, loginFailure } from '../store/userSlice';
import { getConstructionsList } from '../store/constructionSlice'; // Импортируем экшен загрузки списка

export const LoginPage: FC = () => {
    const dispatch = useDispatch<AppDispatch>(); // Возвращаем типизацию для Thunk
    const navigate = useNavigate();
    
    const error = useSelector((state: RootState) => state.user.error);
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (formData.username && formData.password) {
            try {
                // Выполняем запрос через чистый axios (без кодогенерации)
                await axios.post('/api/users/login', formData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                
                // Вручную передаем успешное состояние в Redux
                dispatch(loginSuccess({ username: formData.username }));
                
                // ЗАСТАВЛЯЕМ REDUX СКАЧАТЬ СПИСОК ЗАНОВО!
                // Теперь сервер увидит, что мы авторизованы, и вернет isCreator: 1 для ваших постов
                dispatch(getConstructionsList(true)); 
                
                navigate('/construction'); 
                
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || 'Ошибка авторизации. Проверьте логин и пароль.';
                dispatch(loginFailure(errorMessage));
            }
        }
    };

    return (
        <div className="tile-container">
            <h1 className="tile-title" style={{ textAlign: 'center', marginTop: '40px' }}>Вход в систему</h1>
            
            {error && (
                <div style={{ color: '#d9534f', background: '#f9f2f2', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' }}>
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="slider-form">
                <div className="slider-group">
                    <input
                        type="text"
                        placeholder="Имя пользователя"
                        value={formData.username}
                        onChange={e => setFormData({...formData, username: e.target.value})}
                        style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e8e9ec', fontSize: '14px', outline: 'none' }}
                        required
                    />
                </div>
                <div className="slider-group">
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        style={{ padding: '14px', borderRadius: '12px', border: '1px solid #e8e9ec', fontSize: '14px', outline: 'none' }}
                        required
                    />
                </div>
                <button type="submit" className="full-width-btn" style={{ marginTop: '16px' }}>
                    Войти
                </button>
            </form>
        </div>
    );
};