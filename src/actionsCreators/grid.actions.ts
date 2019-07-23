import { IGridData } from '../models/IGridData';
import { ActionNames } from '../constants/ActionNames';

export class GridActions {
    static updateGrid(data: IGridData[][]) {
        return {
            type: ActionNames.UPDATE_GRID,
            data
        }
    }
    static updateRoverPosition(data: IGridData) {
        return {
            type: ActionNames.UPDATE_ROVER_POSITION,
            data
        }
    }
}