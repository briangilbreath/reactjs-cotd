import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends React.Component{

  constructor(){
    super();//super to use 'this'

    //bind  methods to components
    this.addFish = this.addFish.bind(this);
    this.loadSamples = this.loadSamples.bind(this);
    this.addToOrder = this.addToOrder.bind(this);

    //initial state "getInitialState"
    this.state = {
      fishes: {},
      order: {}
    }

  }

  componentWillMount(){
    //this runs right before the app is rendered.
    this.ref = base.syncState(`${this.props.params.storeId}/fishes`,{
      context: this,
      state: 'fishes'
    });

    //check if there is any order in localstorage.
    const localStorageref = localStorage.getItem(`order-${this.props.params.storeId}`);

    if(localStorageref){
      //update our app component order state
      this.setState({
        order: JSON.parse(localStorageref)//turn string in local store back into object
      })
    }
  }

  componentWillUnmount(){
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps,nextState){
    localStorage.setItem(`order-${this.props.params.storeId}`, JSON.stringify(nextState.order));//string order object for localstore
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
    this.setState({fishes: sampleFishes });
  }

  addToOrder(key){
    //take a copy of our state
    const order = {...this.state.order};
    //update or add the new number of fish ordered
    order[key] = order[key] + 1 || 1;
    //update our state
    this.setState({order:order});
  }

  render(){
    return(
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            {
              Object
              .keys(this.state.fishes)
              .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
            }
          </ul>
        </div>

        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.params}
          />
        <Inventory
          fishes={this.state.fishes}
          addFish={this.addFish}
          loadSamples={this.loadSamples} />
      </div>
    )
  }
}

export default App;
