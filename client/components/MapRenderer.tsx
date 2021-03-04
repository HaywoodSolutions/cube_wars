import * as React from 'react';
import CubeRenderer from './CubeRenderer';
import TileManager from './TileManager';

export enum MapType {
  Cube = 1,
  TileManager = 2
}

export interface Props {
  currentLayer: number, 
  backgroundURL: string
};

interface State {
  mapType: MapType;
  level: number;
}

export default class App extends React.Component<Props, State> {
  private scale: number;
  private pan: {x: number, y: number};
  private cubeRenderer: null | React.Component;

  constructor(props) {
    super(props);
    this.state = {
      mapType: MapType.Cube,
      level: 0
    };
    this.scale = 1;
    this.pan = {
      x: 0,
      y: 0
    }
    this.cubeRenderer;
  }

  onZoom(scale) {
    this.scale = scale;

    if (this.cubeRenderer)
      this.cubeRenderer.onZoom(scale);

    let level;
    if (this.scale <= 2)
      level = 0;
    else
      level = 1;

    if (level != this.state.level) {
      this.setState({
        level
      });
    }
  }

  onPan(x, y) {
    if (this.cubeRenderer)
      this.cubeRenderer.onPan(x,y);
  }

  changeMapType(mapType: MapType) {
    this.setState({
      mapType
    })
  }

  render() {
    switch(this.state.mapType) {
      case MapType.Cube:
        return (
          <CubeRenderer 
            scale={this.scale}
            pan={this.pan}
            ref={(comp) => this.cubeRenderer = comp}
            backgroundURL={this.props.backgroundURL}
            changeMapType={() => this.changeMapType(MapType.TileManager)}
          />
        );
      default:
        return <TileManager />;
    }
  }
}