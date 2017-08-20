import React, { Component } from 'react';
import '../Styles/App.css';
import spotifyConfig from '../spotify_config.json';
import ListArtists from './ListArtists';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

class App extends Component {
  constructor(){
    super();
    this.state = {
      bandList: '',
      accessToken: this.getHashValue('access_token'),
      artists: [],
      tracks: {}
    };
    console.log(this.state);
  }

  componentWillMount(){
  }

  getHashValue = (key) => {
    var matches = window.location.hash.match(new RegExp(key+'=([^&]*)'));
    return matches ? matches[1] : null;
  }

  fetchArtistsTracks = (event) => {
    console.log('====================================');
    console.log('Fetch Tracks.');
    console.log('====================================');
    let {accessToken, bandList} = this.state;
    let bandNames = [];
    let artists = [];

    //TODO Fetch artists Ids
    if( accessToken !== ''){
      let bandNames = bandList.split('\n');

      this.getArtistsByName(bandNames);
    }

    //TODO Fetch Top Tracks
  }

  getArtistsByName = (bandNames) => {
    let {accessToken,artists} = this.state;
    let axiosList = [];
    
    bandNames.forEach( (band) => {
      axiosList.push(
        axios.get('https://api.spotify.com/v1/search?q='+band+'&type=artist&limit=1',{
          'headers': {'Authorization': 'Bearer '+accessToken }
        })
      );
    });

    axios.all(axiosList)
    .then(axios.spread( (...args) => {
      for(var i = 0 ; i < args.length; i++){
        artists.push(args[i].data.artists.items[0]);
      }
      console.log('====================================');
      console.log(...artists);
      console.log('====================================');
      this.setState({ artists: artists });

    }))

  }

  showArtists = () => {
    let {artists} = this.state;
    let components = [];
    artists.forEach( (a) => {
      components.push(<p>{a.name}</p>);
    });

    return components;

  }

  render() {
    let {bandList, accessToken, artists} = this.state;
    let spotifyLoginUrl = 'https://accounts.spotify.com/authorize?client_id='+spotifyConfig.clientId+'&redirect_uri='+encodeURI(window.location.origin)+'/&response_type=token&state=14';

    return (
      <div className="App">
        <h3>OSCARIFY</h3>
        { (accessToken == null ) ? <a href={spotifyLoginUrl}>Login</a> : null }
        <TextField
          id="band-list"
          value={bandList}
          onChange={(e) => { this.setState({bandList: e.target.value})} } 
          hintText="Uma por parágrafo"
          floatingLabelText="Lista de bandas"
          multiLine={true}
          rows={2}
        /><br />
        <RaisedButton 
          label="Get Tracks" 
          primary={true} 
          onClick={this.fetchArtistsTracks} 
          style={{margin: '12px'}}
        />
        <div className="artist-list">
          {(artists.length > 0) ? <ListArtists artists={artists} /> : null }
        </div>
      </div>
    );
  }
}

export default App;
