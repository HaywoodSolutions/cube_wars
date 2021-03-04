import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Mining from '../lib/Mining';

export interface Props {};

interface State {
  amount: number;
}

export default class AmountBar extends Component<Props, State>  {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0
    }
  }

  componentDidMount() {
    Mining.mountAmountListerner((amount: number) => {
      this.setState({
        amount
      });
    });
  }

  componentWillUnmount(): void {
    Mining.unmountAmountListerner();
  }

  render() {
    const { amount } = this.state;
    return (
      <View style={{position: 'absolute', bottom: 0, left: 0}}>
        <Text style={{color: 'white'}}>{amount}</Text>
      </View>
    )
  }
}