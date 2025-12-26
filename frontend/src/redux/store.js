import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlices.js'

const store = configureStore({
    reducer : {
        auth : authSlice,
    
    }
})

export default store;