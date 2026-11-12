import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api';
import { CONSTRUCTION_MOCK, type ConstructionResponseDto } from '../modules/construction_mock';

interface ConstructionState {
  items: ConstructionResponseDto[];
  minPrice: number;
  maxPrice: number;
  sliderMin: number; 
  sliderMax: number; 
  loading: boolean;
}

const initialState: ConstructionState = {
  items: [],
  minPrice: 0,
  maxPrice: 0,
  sliderMin: 0,
  sliderMax: 0,
  loading: false,
};


export const getConstructionsList = createAsyncThunk(
  'constructions/getList',
  async (isInitial: boolean | void, { getState, rejectWithValue }) => {
    const { constructions }: any = getState();
    try {
      // Если загрузка первичная - запрашиваем ВСЕ данные (без фильтров), чтобы узнать реальные границы
      const params = isInitial ? {} : { 
        minPrice: constructions.minPrice, 
        maxPrice: constructions.maxPrice 
      };
      
      const response = await api.api.constructionControllerGetList(params);
      return { data: response.data, isInitial };
    } catch (error) {
      return rejectWithValue('Ошибка при загрузке данных с сервера');
    }
  }
);

export const toggleLikeAsync = createAsyncThunk(
  'constructions/toggleLike',
  async ({ id, currentLike }: { id: number, currentLike: number }, { rejectWithValue }) => {
    try {
      const action = currentLike === 1 ? 0 : 1;
      await api.api.constructionControllerHandleLike(id, { action });
      return { id, isLiked: action };
    } catch (error) {
      return rejectWithValue('Ошибка при постановке лайка');
    }
  }
);

export const deleteConstructionAsync = createAsyncThunk(
  'constructions/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.api.constructionControllerDeleteService(id);
      return id;
    } catch (error) {
      return rejectWithValue('Ошибка при удалении');
    }
  }
);

const constructionSlice = createSlice({
  name: 'constructions',
  initialState,
  reducers: {
    setMinPrice(state, action) { 
      state.minPrice = action.payload; 
    },
    setMaxPrice(state, action) { 
      state.maxPrice = action.payload; 
    },
    resetFilters(state) {
      // Сбрасываем ползунки в их реальные максимальные размахи
      state.minPrice = state.sliderMin;
      state.maxPrice = state.sliderMax;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConstructionsList.pending, (state) => {
        state.loading = true;
      })
      .addCase(getConstructionsList.fulfilled, (state, action) => {
        state.loading = false;
        const { data, isInitial } = action.payload;
        
        state.items = data as ConstructionResponseDto[];

        // Если это первый запрос, вычисляем реальные минимумы и максимумы
        if (isInitial) {
          const prices = state.items
            .map(item => item.price)
            .filter(p => p !== null) as number[];
          
          if (prices.length > 0) {
            const actualMin = Math.min(...prices);
            const actualMax = Math.max(...prices);
            state.sliderMin = actualMin;
            state.sliderMax = actualMax;
            state.minPrice = actualMin;
            state.maxPrice = actualMax;
          }
        }
      })
      .addCase(getConstructionsList.rejected, (state, action) => {
        state.loading = false;
        const isInitial = action.meta.arg; // Достаем параметр thunk'а
        const allMockData = CONSTRUCTION_MOCK.filter(item => item.status === 'published');

        if (isInitial) {
          const prices = allMockData
            .map(item => item.price)
            .filter(p => p !== null) as number[];
            
          if (prices.length > 0) {
            const actualMin = Math.min(...prices);
            const actualMax = Math.max(...prices);
            state.sliderMin = actualMin;
            state.sliderMax = actualMax;
            state.minPrice = actualMin;
            state.maxPrice = actualMax;
          }
          state.items = allMockData;
        } else {
          state.items = allMockData.filter(item => 
            (item.price || 0) >= state.minPrice && 
            (item.price || 0) <= state.maxPrice
          );
        }
      })
      .addCase(toggleLikeAsync.fulfilled, (state, action) => {
        const item = state.items.find(i => i.id === action.payload.id);
        if (item) {
          item.isLiked = action.payload.isLiked;
          item.likesCount += action.payload.isLiked === 1 ? 1 : -1;
        }
      })
      .addCase(deleteConstructionAsync.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      });
  },
});

export const { setMinPrice, setMaxPrice, resetFilters } = constructionSlice.actions;
export default constructionSlice.reducer;