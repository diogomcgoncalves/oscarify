import React, { Component } from 'react';
import './App.css';
import spotifyConfig from './spotify_config.json';
import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {
      bandList: ''
    };
  }

  componentDidMount(){
    /*
    axios.post('/user', {
      firstName: 'Fred',
      lastName: 'Flintstone'
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });*/
  }

  fetchArtistsTracks(){
    console.log('====================================');
    console.log('Fetch Tracks.');
    console.log('====================================');

    //TODO Fetch artists Ids
    //TODO Fetch Top Tracks

  }

  render() {
    let {bandList} = this.state;
    return (
      <div className="App">
        <h3>OSCARIFY</h3>
        <textarea
          id="band-list"
          value={bandList}
          onChange={(e) => { this.setState({bandList: e.target.value})} } 
        />
        <input 
          type="button"
          onClick={this.fetchArtistsTracks}
          value="Get Tracks"
        />
      </div>
    );
  }
}

export default App;
