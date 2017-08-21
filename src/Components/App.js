import React, { Component } from 'react';
import '../Styles/App.css';
import spotifyConfig from '../spotify_config.json';
import ListTrackPlayers from './ListTrackPlayers';
import ListArtists from './ListArtists';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import queryString from 'query-string';
import axios from 'axios';


/*<div className="artist-list">
  {(Object.keys(artists).length > 0) ? <ListArtists artists={artists} /> : null }
</div>*/

class App extends Component {
  constructor(){
    super();
    this.state = {
      bandList: '',
      accessToken: this.getHashValue('access_token'),
      artists: {},
      tracks: {},
      searchErrors: []
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
    this.setState({ 
      artists: {},
      tracks: []
    });

    //TODO Fetch artists Ids
    if( accessToken !== ''){
      let bandNames = bandList.split('\n');

      this.getArtistsByName(bandNames);
    }

    //TODO Fetch Top Tracks
  }

  getArtistsByName = (bandNames) => {
    let {accessToken} = this.state;
    let artists = {},tracks = [];
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
        let searchErrors = []
        for(var i = 0 ; i < args.length; i++){
          if( args[i].data.artists.total > 0 ){
            let artistObj = args[i].data.artists.items[0]
            artists[artistObj.id] = artistObj;
          }
          else{
            let queryStr = args[i].data.artists.href.split('?')[1];
            let queryObj = queryString.parse(queryStr);
            searchErrors.push(queryObj.query);
          }
        }

        this.setState({searchErrors: searchErrors});
        this.setState({ artists: artists });

        let axiosTracks = []
        Object.keys(artists).forEach( (key) => {
          if( artists[key] != 0 ){
            axiosTracks.push(
              axios.get('https://api.spotify.com/v1/artists/'+key+'/top-tracks?country=PT',{
                'headers': {'Authorization': 'Bearer '+accessToken }
              })
            );
          }
          else{

          }
        });

        return axios.all(axiosTracks)
      }))
      .then( axios.spread( (...args) => {
        console.log('====================================');
        console.log(args);
        console.log('====================================');
        let trackData = [...tracks];
        args.forEach( (t) => {
          trackData.push(t.data.tracks);
        });
        this.setState({tracks: trackData});
      }))
      .catch( err => {
        console.log('====================================');
        console.log(err);
        console.log('====================================');
      })
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
    let {bandList, accessToken, artists, tracks, searchErrors} = this.state;
    let spotifyLoginUrl = 'https://accounts.spotify.com/authorize?client_id='+spotifyConfig.clientId+'&redirect_uri='+encodeURI(window.location.origin)+'/&response_type=token&state=14';

    return (
      <div className="App">
        <div className="header">
          <h1>Oscarify</h1>
          <h5>Type the bands, get the tracks</h5>
        </div>
        { ( accessToken != null && accessToken !== '') ? (
          <div className="app-body">
            <div className="input-bands">
              <TextField
                id="band-list"
                value={bandList}
                onChange={(e) => { this.setState({bandList: e.target.value})} } 
                hintText="One per paragraph"
                fullWidth={true}
                floatingLabelText="Band List"
                multiLine={true}
                rows={2}
                rowsMax={5}
              />
              <RaisedButton 
                label="Get Tracks" 
                primary={true} 
                onClick={this.fetchArtistsTracks} 
                style={{margin: '12px'}}
              />
            </div>
            <div className="track-list">
              { ( tracks.length > 0 ) ? <ListTrackPlayers tracks={tracks} searchErrors={searchErrors} /> : null }
            </div>
          </div>
        ) : (
          <div className="app-body">
            <div className="spotify-login">
              { (accessToken == null ) ? <a href={spotifyLoginUrl}>Login with Spotify</a> : null }
            </div>
          </div>
        ) }
        
      </div>
    );
  }
}

export default App;
