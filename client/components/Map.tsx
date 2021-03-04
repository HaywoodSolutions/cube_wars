import React, { Component } from 'react';
import {
  View,
  PanResponder
} from 'react-native';
import MapRenderer from './MapRenderer';
import { db, storage } from '../lib/Firebase';
import PinchZoomResponder from 'react-native-pinch-zoom-responder';

export interface Props {};

interface State {
  lastOffsetX: number,
  lastOffsetY: number,
  currentOffsetX: number,
  currentOffsetY: number,
  lastScale: number,
  currentScale: number,
  zooming: boolean,
  currentLayer: number,
  backgroundURL: string
}

export default class App extends Component<Props, State> {
  private _mapRenderer: any;
  private _panResponder: any;
  private pinchZoomResponder: any;
  private gameListerner: any;

  constructor(props) {
    super(props);
    
    this.state = {
      lastOffsetX: 0,
      lastOffsetY: 0,
      currentOffsetX: 0,
      currentOffsetY: 0,
      lastScale: 1,
      currentScale: 1,
      zooming: false,
      currentLayer: null,
      backgroundURL: null
    }; 
    this._mapRenderer = null;

    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: ( e, state ) => false,
      onStartShouldSetPanResponderCapture: ( e, state ) => false,
      onMoveShouldSetPanResponder: (evt, { dx, dy }) => dx !== 0 || dy !== 0,
      onMoveShouldSetPanResponderCapture: (evt, { dx, dy }) => dx !== 0 || dy !== 0,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.numberActiveTouches == 1) {
          let currentOffsetX = this.state.lastOffsetX + Math.round(gestureState.dx);
          let currentOffsetY = this.state.lastOffsetY + Math.round(gestureState.dy);
          if (this.state.currentOffsetX != currentOffsetX || this.state.currentOffsetY != currentOffsetY) {
            this.setState({
              currentOffsetX,
              currentOffsetY,
            });
            if (this._mapRenderer)
              this._mapRenderer.onPan(currentOffsetX, currentOffsetY);
          }
          if (this.state.zooming)
            this.setState({
              zooming: false
            });
        } else {
          if (!this.state.zooming)
            this.setState({
              zooming: true
            });
        }
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        let lastOffsetX = this.state.lastOffsetX + Math.floor(gestureState.dx);
        let lastOffsetY = this.state.lastOffsetY + Math.floor(gestureState.dy);
        if (this.state.lastOffsetX != lastOffsetY || this.state.lastOffsetY != lastOffsetY) {
          this.setState({
            lastOffsetX,
            lastOffsetY,
            currentOffsetX: lastOffsetX,
            currentOffsetY: lastOffsetY
          });
          
          if (this._mapRenderer)
            this._mapRenderer.onPan(lastOffsetX, lastOffsetY);
        }
      }
    });

    
    this.pinchZoomResponder = new PinchZoomResponder({
      onPinchZoomEnd: (e) => {
        let lastScale = this.state.currentScale;
        if (this.state.lastScale != lastScale) {
          this.setState({
            lastScale,
            zooming: false
          });
          if (this._mapRenderer)
            this._mapRenderer.onZoom(Math.sqrt(lastScale));
        }
      },

      onResponderMove: (e, gestureState) => {
        if (gestureState) {
          let currentScale = Math.max(1, Math.floor(this.state.lastScale * Math.min(5, Math.max(gestureState.scaleX, gestureState.scaleY)) * 100) / 100);
          if (currentScale != this.state.currentScale) {
            this.setState({
              currentScale
            });
          }
          if (this._mapRenderer)
            this._mapRenderer.onZoom(Math.sqrt(currentScale));
        }
      }
    })
  }

  componentWillUnmount() {
    this.gameListerner();
  }

  render() {
    return (
      <View
        style={{flex: 1}}
        {...(!this.state.zooming ? this._panResponder.panHandlers : this.pinchZoomResponder.handlers)}
      >
        <MapRenderer 
          ref={component => this._mapRenderer = component}
          currentLayer={this.state.currentLayer}
          backgroundURL={this.state.backgroundURL}
        />
      </View>
    )
  }
}