import * as React from 'react';
import './App.css';
import { GridView } from './components/gridView/gridView.component'
import { IGridData, IGridDataWithDistance } from './models/IGridData';
import { Input, Button } from '@material-ui/core';
import { IAppStore } from './models/IAppStore';
import { connect } from 'react-redux';
import { GridActions } from './actionsCreators/grid.actions';
import { cloneDeep } from 'lodash';
import { AppConstants } from './constants/AppConstans';

interface IAppState {
  colSize: number;
  rowSize: number;
  intervalId: number;
}

interface IAppProps {
  gridData: IGridData[][];
  roverPosition: IGridData;
  updateGridSpecs: (data: IGridData[][]) => void;
  updateRoverPosition: (data: IGridData) => void;
}

class App extends React.Component<IAppProps, IAppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      colSize: 10,
      rowSize: 10,
      intervalId: -1
    }
    this.updateGridSpecs = this.updateGridSpecs.bind(this);
    this.toggleObstacle = this.toggleObstacle.bind(this);
    this.startRover = this.startRover.bind(this);
    this.moveRoverToNextPosition = this.moveRoverToNextPosition.bind(this);
  }
  componentDidMount() {
    this.updateGridSpecs();
  }

  private generateGridData(numberOfRows: number, numberOfCols: number): IGridData[][] {
    const gridLayout: IGridData[][] = [];
    for (let row = 0; row < numberOfRows; row++) {
      gridLayout[row] = [];
      for (let col = 0; col < numberOfCols; col++) {
        gridLayout[row][col] = { rowIndex: row, colIndex: col, isObstacle: false };
      }
    }
    return gridLayout;
  }

  private updateGridSpecs(): void {
    const { colSize, rowSize } = this.state;
    const gridData = this.generateGridData(colSize, rowSize);
    this.props.updateGridSpecs(gridData);

  }

  private toggleObstacle(index: IGridData): void {
    const gridData = cloneDeep(this.props.gridData);
    gridData[index.rowIndex][index.colIndex].isObstacle = !gridData[index.rowIndex][index.colIndex].isObstacle;
    this.props.updateGridSpecs(gridData);
  }
  private startRover(): void {
    const intervalId = setInterval(() => { this.moveRoverToNextPosition() }, 2000)
    this.setState({ intervalId: intervalId as any });
  }

  private getDistanceFromEndPosition(nextPosition: IGridData, endPosition: IGridData, gridData: IGridData[][]): number {
    if (nextPosition.rowIndex < 0 || nextPosition.colIndex < 0) {
      return Infinity;
    } else if (nextPosition.rowIndex > (gridData.length - 1) || nextPosition.colIndex > (gridData[0].length - 1)) {
      return Infinity;
    } else if (gridData[nextPosition.rowIndex][nextPosition.colIndex].isObstacle) {
      return Infinity;
    } else if (gridData[nextPosition.rowIndex][nextPosition.colIndex].hasBeenCrossed) {
      return Infinity;
    } else {
      const xcells = endPosition.colIndex - nextPosition.colIndex;
      const ycells = endPosition.rowIndex - nextPosition.rowIndex;
      return xcells + ycells;
    }
  }

  private calculateNextPositionOfRover(endPosition: IGridData): IGridData {
    const { roverPosition } = this.props
    const adjacentCells: IGridDataWithDistance[] = [];
    Object.keys(AppConstants.CELL_OFFSETS).forEach((positionDirection: any) => {
      const offsets: any = AppConstants.CELL_OFFSETS[positionDirection];
      const colIndex = roverPosition.colIndex + offsets.colIndex;
      const rowIndex = roverPosition.rowIndex + offsets.rowIndex;
      const distance = this.getDistanceFromEndPosition({ colIndex, rowIndex, isObstacle: false }, endPosition, this.props.gridData);
      adjacentCells.push({
        colIndex,
        rowIndex,
        distance,
      })
    })
    adjacentCells.sort((a, b) => a.distance - b.distance);
    if (adjacentCells[0].distance === Infinity) {
      throw new Error('No path found to move');
    } else {
      const { rowIndex, colIndex } = adjacentCells[0];
      return ({ isObstacle: false, rowIndex, colIndex });
    }

  }

  private moveRoverToNextPosition(): void {
    const { roverPosition, gridData, updateRoverPosition } = this.props;
    const endPosition = {
      rowIndex: gridData.length - 1,
      colIndex: gridData[(gridData.length - 1)].length - 1,
      isObstacle: false
    };
    if ((roverPosition.rowIndex === endPosition.rowIndex) && roverPosition.colIndex === endPosition.colIndex) {
      clearTimeout(this.state.intervalId);
    } else {
      try {
        const nextPosition = this.calculateNextPositionOfRover(endPosition);
        updateRoverPosition(nextPosition);
      }
      catch (e) {
        clearInterval(this.state.intervalId);
        alert('No path found.');
      }
    }
  }
  render() {
    const { gridData, roverPosition } = this.props;
    return (
      <div className="App">
        <header>Path Finder</header>
        <div>
          <div className="inner-spacing inline">
            <label>Rows:</label>
            <Input type="number" autoFocus onChange={(e) => this.setState({ colSize: Number(e.target.value) })} defaultValue="10" placeholder="Enter Number of Rows" />
          </div>
          <div className="inner-spacing inline">
            <label>Cols:</label>
            <Input type="number" onChange={(e) => this.setState({ rowSize: Number(e.target.value) })} defaultValue="10" placeholder="Enter Number of Cols" />
          </div>
          <div className="inner-spacing inline">
            <Button onClick={this.updateGridSpecs} variant="contained" color="primary">Update Specifications</Button>
          </div>
        </div>
        <div className="inner-spacing">
          <GridView gridLayout={gridData} roverPosition={roverPosition} toggleObstacle={this.toggleObstacle}></GridView>
        </div>
        <div className="inner-spacing">
          <Button onClick={this.startRover} variant="contained" color="primary">Start Rover</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: { gridReducer: IAppStore }): any => {
  return {
    gridData: state.gridReducer.gridData,
    roverPosition: state.gridReducer.roverPosition
  }
}

const mapDispatchToProps = (dispatch: React.Dispatch<any>) => {
  return {
    updateGridSpecs: (data: IGridData[][]) => dispatch(GridActions.updateGrid(data)),
    updateRoverPosition: (data: IGridData) => dispatch(GridActions.updateRoverPosition(data))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(App as any);