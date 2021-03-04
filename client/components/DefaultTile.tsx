import React, { Component } from 'react';
import {
  View, Text
} from 'react-native';

export default class DefaultTile extends Component<{name: string, size: number, position: [number, number]}> {
  render() {
    let left = this.props.position[0] * this.props.size;
    let top = this.props.position[1] * this.props.size;
    
    console.log([left, top]);

    return (
      <View
        style={{position: 'absolute', backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center', left, top, width: this.props.size || '100%', height: this.props.size || '100%', borderColor: 'black', borderWidth: 2}}
      >
        <Text style={{fontSize: this.props.size/3, color: 'white'}}>{this.props.name}</Text>
      </View>
    )
  }
}