export interface IGridData {
    rowIndex: number;
    colIndex: number;
    isObstacle: boolean;
    hasBeenCrossed?: boolean;
}


export interface IGridDataWithDistance {
    rowIndex: number;
    colIndex: number;
    distance: number;
}