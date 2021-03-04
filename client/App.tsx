import React, { Component } from 'react';
import {
  View,
  Dimensions
} from 'react-native';
import { db } from './lib/Firebase';
import deviceId from './lib/Device';
import AmountBar from './components/AmountBar';
import Map from './components/Map';
//import { Audio } from 'expo-av';

// import {
//   AdMobBanner,
//   AdMobInterstitial,
//   PublisherBanner,
//   AdMobRewarded
// } from 'expo-ads-admob';

export default class App extends Component {
  private userSnapshot: any;

  constructor(props) {
    super(props);
    this.state = {
      money: 0
    }
    //this.soundObject = new Audio.Sound();
  }

  componentDidMount() {
    const userRef = db.collection("users").doc(deviceId);
    this.userSnapshot = userRef.onSnapshot((snap) => {
      if (!snap.exists)
        return userRef.set({
          money: 0,
          stats: {}
        });
      const data = snap.data();
      return this.setState({
        money: data.money || 0
      });
    }, () => {
      console.log("Failed to fetch user");
    })
    
    // this.soundObject = new Audio.Sound();
    // this.loadSound()
  }

  // async loadSound() {
  //   try {
  //     await this.soundObject.loadAsync(require('../assets/audio/space.mp3'));
  //     await this.soundObject.setIsLoopingAsync(true);
  //     await this.soundObject.setVolumeAsync(0.05)
  //     await this.soundObject.playAsync();
  //   } catch (error) {}
  // }

  // componentWillUnmount() {
  //   this.soundObject.stopAsync();
  // }

  render() {
    let deviceWidth = Dimensions.get('window').width;
    return (
      <View style={{
        flex: 1,
        backgroundColor: 'black'
      }}>
        <View style={{flex: 1,
          backgroundColor: '#C2FFA0', marginTop: 20, overflow: 'hidden'}}>
          <Map />
          <AmountBar />
        </View>
        {/* <AdMobBanner
          bannerSize="fullBanner"
          adUnitID="ca-app-pub-3940256099942544/6300978111" // Test ID, Replace with your-admob-unit-id
          testDeviceID="EMULATOR"
          servePersonalizedAds={true}
          onDidFailToReceiveAdWithError={this.bannerError} /> */}
      </View>
    )
  }
};