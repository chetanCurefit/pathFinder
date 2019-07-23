import * as React from 'react';
import { IGridData } from '../../models/IGridData';
import './gridView.style.css';

interface IGridViewProps {
  roverPosition: IGridData;
  gridLayout: IGridData[][];
  toggleObstacle: (index: IGridData) => void;
}

interface IGridViewState {
}


export class GridView extends React.Component<IGridViewProps, IGridViewState> {
  constructor(props: IGridViewProps) {
    super(props);
    this.state = {
    };
  }
  render() {
    const { roverPosition, gridLayout, toggleObstacle } = this.props;

    return (<div>
      <table className="middle-align">
        <tbody>
          {
            gridLayout.map((row, rowIndex) => {
              return (<tr key={rowIndex}>
                {
                  row.map((col, colIndex) => {
                    return (<td key={Math.random()} className={col.isObstacle ? "grid-cell obstacle" : "grid-cell"}
                      onClick={() => toggleObstacle({ rowIndex, colIndex, isObstacle: true })}>
                      {
                        (col.colIndex === roverPosition.colIndex && col.rowIndex === roverPosition.rowIndex) &&
                        <div>
                          <img src="car.jpg" alt="car icon" height="35" />
                        </div>
                      }
                    </td>)
                  })
                }
              </tr>)
            })
          }
        </tbody>
      </table>

    </div>)
  }
}