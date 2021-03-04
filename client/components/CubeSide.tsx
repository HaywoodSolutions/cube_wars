import React, { Component } from 'react';
import {
  Dimensions,
  Animated,
  View,
  Image
} from 'react-native';
import { transformOrigin, rotateXY, rotateXZ } from '../lib/MatrixMath';
import Tiles from '../lib/Tiles';
import DefaultTile from './DefaultTile';

export enum Side {
  Top = 0,
  Bottom = 1,
  Left = 2,
  Right = 3,
  Frount = 4,
  Back = 5
};

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const styles = {
  rectangle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Math.min(WIDTH, HEIGHT) * 0.6,
    height: Math.min(WIDTH, HEIGHT) * 0.6,
    zIndex: 10
  }
};

export interface Props {
  offset: Animated.ValueXY,
  size: Animated.Value,
  color: string,
  side: Side,
  moveable: boolean,
  backgroundURL: string
};

interface State {
  sinOffset: Animated.ValueXY,
  cosOffset: Animated.ValueXY,
  offset: { x: number, y: number }
}

export default class MainMap extends Component<Props, State> {
  private _size: number = Math.min(WIDTH, HEIGHT) * 0.6;

  constructor(props) {
    super(props);

    this.state = {
      sinOffset: new Animated.ValueXY({x: 0, y: 0}),
      cosOffset: new Animated.ValueXY({x: 0, y: 0}),
      offset: {x: 0, y: 0}
    };

    this.props.size.addListener(({value}) => this._size = value);
    this.props.offset.addListener((obj) => {
      this.setState({
        offset: obj
      });
    });
  }

  componentDidMount() {
    Tiles.getTile(this.props.side, 0, 0, 0).then(data => {
      console.log(data);
    });
  }

  getMatrixStart() {
    let dx = this.state.offset.x;
    let dy = this.state.offset.y;

    switch(this.props.side) {
      case Side.Top:
        return rotateXZ(dx, dy - 90);
      case Side.Bottom:
        return rotateXZ(-dx, dy + 90);
      case Side.Frount:
        return rotateXY(dx, dy);
      case Side.Back:
        return rotateXY(dx + 180, dy);
      case Side.Left:
        return rotateXY(dx - 90, dy);
      case Side.Right:
        return rotateXY(dx + 90, dy);
    }
  }

  getMatrix() {
    const matrix = this.getMatrixStart();
    const origin = { x: 0, y: 0, z: -this._size / 2 };

    transformOrigin(matrix, origin);
    
    return matrix;
  }
 
  render() {
    return (
      <Animated.View
        style={[styles.rectangle, {width: Animated.add(this.props.size, 0.5), height: Animated.add(this.props.size, 0.5), transform: [{perspective: 1000}, {matrix: this.getMatrix()}]}]}
      >
        {
          this.props.backgroundURL != null ? (
            <View style={{flex: 1, backgroundColor: this.props.color}} />
          ) : (
            <DefaultTile name={"S"} position={[0,0]} size={null} />
          )
        }
      </Animated.View>
    );
  }
};