import { Reducer } from "react";
import { IAppStore } from "../models/IAppStore";
import { defaultState } from './defaultState';
import { ActionNames } from '../constants/ActionNames'
export interface IActionType {
    type: string;
    data: any
}
export const gridReducer: Reducer<IAppStore, IActionType> = (prevState: IAppStore = defaultState, action: IActionType) => {
    switch (action.type) {
        case ActionNames.UPDATE_GRID: return Object.assign({}, prevState, { gridData: action.data });
        case ActionNames.UPDATE_ROVER_POSITION: {
            const newState = Object.assign({}, prevState, { roverPosition: action.data });
            newState.gridData[newState.roverPosition.rowIndex][newState.roverPosition.colIndex].hasBeenCrossed = true;
            return newState;
        }
        default: return prevState;
    }
}