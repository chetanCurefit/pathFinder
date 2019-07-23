import { IGridData } from './IGridData'

export interface IAppStore {
    gridData: IGridData[][];
    roverPosition: IGridData;
}