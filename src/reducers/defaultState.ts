import { IAppStore } from "../models/IAppStore";

export const defaultState: IAppStore = {
    gridData: [],
    roverPosition: { isObstacle: false, rowIndex: 0, colIndex: 0 }
}