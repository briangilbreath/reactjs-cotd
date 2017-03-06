import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes.js';

class App extends React.Component{

  constructor(){
    super();//super to use 'this'

    //bind  methods to components
    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);

    //initial state "getInitialState"
    this.state = {
      fishes: {},
      order: {}
    }

  }

  addFish(fish){
    //get copy our state (for performance)
    const fishes = {...this.state.fishes };
    //add in our new fish
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    //set state
    this.setState({fishes: fishes});
  }

  loadSamples(){
    this.setState({fishes: sampleFishes })
  }

  render(){
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
        </div>

        <Order />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />
      </div>
    )
  }
}

export default App;
