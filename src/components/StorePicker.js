import React from 'react';
import {getFunName} from '../helpers'

class StorePicker extends React.Component{

  // constructor(){
  //   super();
  //   this.goToStore = this.goToStore.bind(this);
  // }

  goToStore(event){
    event.preventDefault();
    console.log('you changed the url');
    // first grab the text from the box
    const storeId = this.storeInput.value;
    console.log(`Going to ${storeId}`);
    // second, we're going to transition from / to /store/:storeId
    this.context.router.transitionTo(`/store/${storeId}`);
  }

  render(){
    return (
      <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
        <h2>Please enter a store</h2>
        <input type="text" required placeholder="Store Name" defaultValue={getFunName()} ref={(input) => {this.storeInput = input}} />
        <button type="submit">Visit Store -></button>
      </form>
    )
  }
}


//add Router contexts to StorePicker
StorePicker.contextTypes = {
  router: React.PropTypes.object
}

export default StorePicker;
