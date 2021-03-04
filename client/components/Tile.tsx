import React, { Component } from 'react';
import { Animated } from 'react-native';
import TileSVG from '../lib/TileSVG';
import { SvgXml } from 'react-native-svg';

interface Props {
  hash: string,
  size: number|"100%"
};

export default class Tile extends Component<Props> {
  private tileSVG: TileSVG

  constructor(props){
    super(props);
    this.tileSVG = new TileSVG(props.hash);
  }

  render() {
    return (
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: 'white',
          width: this.props.size,
          height: this.props.size
        }}
      >
        <SvgXml xml={this.tileSVG.toString()} width="100%" height="100%" />
      </Animated.View>
    );
  }
}