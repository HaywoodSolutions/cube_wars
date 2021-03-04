import React, { Component } from 'react';
import DefaultTile from './DefaultTile';
import { Image, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

type Props = {};
type State = {
  scale: number
}

export default class MainMap extends Component<Props, State> {

  constructor(props) {
    super(props);
    this.state = {
      scale: 1
    };

    this.updateScale = this.updateScale.bind(this);
  }
  
  updateScale(scale: number) {
    if (scale < 1)
      scale = 1;
    scale = scale * 1.5
    scale = Math.floor(scale);
    if (this.state.scale != scale) {
      this.setState({
        scale
      });
    }
  }

  renderCubes(zoomLevel: number, width: number, overallSize: number) {
    let items = [];
    for (let x=0; x<width; x++)
      for (let y=0; y<width; y++)
        items.push(<DefaultTile key={y*width+x} name={`${zoomLevel}[${x},${y}]`} position={[x,y]} size={overallSize/width} />);
    return items;
  }

  render() {
    const size: number = 4096 * 25;
    const minSize: number = Math.min(Dimensions.get('window').width, Dimensions.get('window').height)
    const newSize: number = minSize;

    return (
      <ImageZoom cropWidth={Dimensions.get('window').width}
                 cropHeight={Dimensions.get('window').height}
                 imageWidth={newSize}
                 imageHeight={newSize}
                 onMove={v => this.updateScale(v.scale)}
                 maxScale={Math.pow(2, 4)}
      >
        {
          this.state.scale < 5 ? this.renderCubes(0, 1, newSize) : this.renderCubes(1, 3, newSize)
        }
      </ImageZoom>
    )
  }
}