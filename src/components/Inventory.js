import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component{
  constructor(){
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.logout = this.logout.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);

    this.state = {
      uid: null,
      ownder: null
    }
  }

  componentDidMount(){
    base.onAuth((user) => {
      if(user){
        this.authHandler(null,{user})
      }
    });
  }

  handleChange(e, key){
    const fish = this.props.fishes[key];

    //take a copy of fish and update it with the new data
    const updatedFish = {...fish, [e.target.name]: e.target.value}
    this.props.updateFish(key,updatedFish);

    console.log(updatedFish);
  }

  authenticate(provider){
    console.log(`trying to log in with ${provider}`);
    base.authWithOAuthPopup(provider, this.authHandler); //returns err and auth data
  }

  logout(){
    base.unauth();
    this.setState({
      uid: null
    })
  }

  authHandler(err, authData){
    console.log(authData);
    if(err){
      console.error(err);
      return;
    }

    //grab store info
    const storeRef = base.database().ref(this.props.storeId);

    //query the firebase once for the store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};

      //claim store as our own if no owner already
      if(!data.owner){
        storeRef.set({
          owner: authData.user.uid
        })
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      });


    });
  }

  renderLogin(){
    return(
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory.</p>
        <button className="github" onClick={() => this.authenticate('github')}>Login in with Github</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Login in with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>Login in with Twitter</button>
      </nav>
    )
  }

  renderInventory(key){
    const fish = this.props.fishes[key];
    return(
      <div className="fish-edit" key={key}>
        <input type="text" name="name" defaultValue={fish.name} onChange={ (e) => this.handleChange(e,key) } placeholder="Fish Name" />
        <input type="text" name="price" defaultValue={fish.price} onChange={ (e) => this.handleChange(e,key) }placeholder="Fish Price" />
          <select name="status" defaultValue={fish.status} onChange={ (e) => this.handleChange(e,key) } >
            <option value="available">Fresh!</option>
            <option value="unavailable">Sold Out!</option>
          </select>
        <textarea type="text" name="desc" defaultValue={fish.desc} onChange={ (e) => this.handleChange(e,key) } placeholder="Fish Desc"></textarea>
        <input type="text" name="image" defaultValue={fish.image} onChange={ (e) => this.handleChange(e,key) } placeholder="Fish Image" />
        <button onClick={()=>this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }
  render(){

    const logout = <button onClick={() => this.logout() }>Logout</button>

    //check if user is not logged in
    if(!this.state.uid){
      return <div>{this.renderLogin()}</div>
    }

    //check if user is owner of store
    if(this.state.uid !== this.state.owner){
      return <div><p>Sorry, you aren't the owner of the store.</p>{logout}</div>
    }

    return(
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish}/>
        <button onClick={this.props.loadSamples}>Add Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  loadSamples: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired
}

export default Inventory;
