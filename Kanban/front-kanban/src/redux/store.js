import { configureStore } from "@reduxjs/toolkit"
import boardReducer from "./features/boardSlice"
import favouriteReducer from "./features/favouriteSlice"

export const store = configureStore({
    reducer: {
        board: boardReducer,
        favourites: favouriteReducer
    }
}) 