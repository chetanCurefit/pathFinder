import { combineReducers } from "redux";
import { gridReducer } from './grid.reducer';

export const appReducer = combineReducers({ gridReducer: gridReducer as any });