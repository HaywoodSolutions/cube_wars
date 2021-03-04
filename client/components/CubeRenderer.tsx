import React, { Component } from 'react';
import {
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Animated
} from 'react-native';
import CubeSide, { Side } from './CubeSide';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export interface Props {
  changeMapType: () => any,
  scale: number,
  pan: {x: number, y: number},
  backgroundURL: string
};

interface State {
  offset: Animated.ValueXY,
  size: Animated.Value,
  moveable: boolean
}

export default class CubeRenderer extends Component<Props, State> {
  private closest: Side;
  private _offset: { x: number, y: number } = { x: 0, y: 0 };

  constructor(props) {
    super(props);
    this.state = {
      offset: new Animated.ValueXY({ x: 0, y: 0 }),
      size: new Animated.Value(Math.min(WIDTH, HEIGHT) * 0.6),
      moveable: true
    };
    this.handleSelectSide = this.handleSelectSide.bind(this);

    this.state.offset.addListener((obj) => this._offset = obj);
  }

  onPan(degX: number, degY: number) {
    if (this.state.moveable) {
      degX = (degX / 3) % 360;
      degY = (degY / 3) % 360;
      if (degX != this._offset.x || degY != this._offset.y) {
        this.state.offset.setValue({
          x: degX,
          y: degY
        });

        let closest = this.findClosest(degX, degY);
        if (this.closest != closest)
          this.closest = closest;
      }
    }
  }

  onZoom(scale: number) {}

  handleSelectSide() {
    let toX = Math.floor((Math.abs(this._offset.x) + 45) / 90) * 90;
    let toY = Math.floor((Math.abs(this._offset.y) + 45) / 90) * 90;

    this.setState({
      moveable: false
    });
    Animated.parallel([
      Animated.spring(this.state.size, {
        toValue: Math.max(WIDTH, HEIGHT),
        speed: 10,
        bounciness: 0
      }),
      Animated.spring(this.state.offset, {
        toValue: {x: toX, y: toY},
        speed: 10,
        bounciness: 0,
      })
    ]).start(() => {
      this.props.changeMapType();
    });
  }
  
  findClosest = (x: number, y: number): Side => {
    x = Math.floor((Math.abs(x) + 45) / 90);
    y = Math.floor((Math.abs(y) + 45) / 90);

    switch (y) {
      case 0:
        switch (x) {
          case 0: 
            return Side.Frount;
          case 1:
            return Side.Left;
          case 2:
            return Side.Back;
          case 3:
            return Side.Right;
        }
      case 1:
        return Side.Bottom;
      case 2:
        switch (x) {
          case 0: 
            return Side.Back;
          case 1:
            return Side.Right;
          case 2:
            return Side.Frount;
          case 3:
            return Side.Left;
        }
      case 3:
        return Side.Top;
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={this.handleSelectSide}
      >        
        <View
          style={{flex: 1, alignContent: 'center', alignItems: 'center', justifyContent: 'center'}}
        >        
          <Animated.View
            style={{
              width: this.state.size,
              height: this.state.size,
              backgroundColor: "transparent"
            }}
          >
            <CubeSide offset={this.state.offset} size={this.state.size} color={"red"} side={Side.Top} moveable={this.state.moveable} backgroundURL={this.props.backgroundURL} />
            <CubeSide offset={this.state.offset} size={this.state.size} color={"green"} side={Side.Bottom} moveable={this.state.moveable} backgroundURL={this.props.backgroundURL} />
            <CubeSide offset={this.state.offset} size={this.state.size} color={"blue"} side={Side.Left} moveable={this.state.moveable} backgroundURL={this.props.backgroundURL} />
            <CubeSide offset={this.state.offset} size={this.state.size} color={"orange"} side={Side.Right} moveable={this.state.moveable} backgroundURL={this.props.backgroundURL} />
            <CubeSide offset={this.state.offset} size={this.state.size} color={"white"} side={Side.Frount} moveable={this.state.moveable} backgroundURL={this.props.backgroundURL} />
            <CubeSide offset={this.state.offset} size={this.state.size} color={"grey"} side={Side.Back} moveable={this.state.moveable} backgroundURL={this.props.backgroundURL} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}