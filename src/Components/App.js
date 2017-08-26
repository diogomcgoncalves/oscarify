import React, { Component } from 'react';
import '../Styles/App.css';
import spotifyConfig from '../spotify_config.json';
import ListTrackPlayers from './ListTrackPlayers';
import ListArtists from './ListArtists';
import ArtistInput from './ArtistInput';
import RaisedButton from 'material-ui/RaisedButton';
import queryString from 'query-string';
import axios from 'axios';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
 

class App extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props){
    super();
    let access_token = this.getAccessToken(props);
    this.state = {
      accessToken: access_token,
      artists: {},
      tracks: {},
      searchErrors: []
    };
    console.log(this.state);
  }

  componentWillMount(){
   
  }

  getAccessToken = (props) => {
    const { cookies } = props;
    let accessToken = cookies.get('accessToken', {doNotParse:true});
    console.log('====================================');
    console.log( cookies.get('accessToken',{doNotParse:true}));
    console.log('====================================');
    if( accessToken ){
      console.log('Has Token');
    }
    else{
      accessToken = this.getHashValue('access_token');
      if( accessToken != null ){
        let expiresIn = this.getHashValue('expires_in');
        cookies.set('accessToken', accessToken, {
          path: '/',
          maxAge: expiresIn 
        });
      }
      else{
        console.log('No token');
      }
    }
    return accessToken;
  }

  logout = () => {
    const { cookies } = this.props;
    cookies.remove('accessToken');
    window.location = window.location.origin;
  }

  getHashValue = (key) => {
    var matches = window.location.hash.match(new RegExp(key+'=([^&]*)'));
    return matches ? matches[1] : null;
  }

  getTracks = (event) => {
    console.log('====================================');
    console.log('Fetch Tracks.');
    console.log('====================================');
    let {accessToken, artists} = this.state;
    this.setState({
      tracks: []
    });

    if( accessToken !== ''){
      if( Object.keys(artists).length > 0 ){
        this.fetchArtistsTracks(Object.keys(artists));
      }
    }
  }

  fetchArtistsTracks = (ids) => {
    console.log('====================================');
    console.log(ids);
    console.log('====================================');
    let axiosTracks = []
    ids.forEach( (key) => {
        axiosTracks.push(
          axios.get('https://api.spotify.com/v1/artists/'+key+'/top-tracks?country=PT',{
            'headers': {'Authorization': 'Bearer '+this.state.accessToken }
          })
        );
    });

    axios.all(axiosTracks)
    .then( axios.spread( (...args) => {
      console.log('====================================');
      console.log(args);
      console.log('====================================');
      let trackData = [...this.state.tracks];
      args.forEach( (t) => {
        trackData.push(t.data.tracks);
      });
      this.setState({tracks: trackData});
    }))
    .catch( err => {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
      if(err.status === 401){
        const { cookies } = this.props;
        cookies.remove('accessToken', {path: '/'});
        window.location = window.location.origin
      }
    })

  }

  getArtistsByName = (bandNames) => {
    let {accessToken} = this.state;
    let artists = {},tracks = [];
    let axiosList = [];
    
    bandNames.forEach( (band) => {
      if( band !== '' ){
        axiosList.push(
          axios.get('https://api.spotify.com/v1/search?q='+band+'&type=artist&limit=1',{
            'headers': {'Authorization': 'Bearer '+accessToken }
          })
        );
      }
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
          if( artists[key] !== 0 ){
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

  addArtistToList = (artist) => {
    console.log('====================================');
    console.log(artist);
    console.log('====================================');
    let auxArtists = this.state.artists;
    if( artist ){
      auxArtists[artist.value.id] = artist.value;
      this.setState( {
        artists : auxArtists
      })
    }
  }

  deleteArtistFromState = (id) => {
    let {artists} = this.state;
    delete artists[id];
    console.log('====================================');
    console.log(artists[id]);
    console.log('====================================');
    this.setState({
      artists: artists
    });
  }

  render() {
    let {accessToken, tracks, searchErrors} = this.state;
    let spotifyLoginUrl = 'https://accounts.spotify.com/authorize?client_id='+spotifyConfig.clientId+'&redirect_uri='+encodeURI(window.location.origin)+'/&response_type=token&state=14';

    return (
      <div className="App">
        <div className="header">
          <h1>Oscarify</h1>
          <h5>Type the bands, get the tracks</h5>
        </div>
        { ( accessToken != null && accessToken !== '' ) ? (
          <div className="app-body">
            <div className="input-bands">
              <ArtistInput 
                onSelect={this.addArtistToList} 
                accessToken={this.state.accessToken} 
              />
              <ListArtists 
                artists={this.state.artists} 
                onDelete={this.deleteArtistFromState}
                displayChips={true}
              />
              <RaisedButton 
                label="Get Tracks"
                labelColor="#ffffff"
                backgroundColor="#2ebd59"
                onClick={this.getTracks}
                style={{margin: '12px'}}
              />
              <RaisedButton 
                label="Logout" 
                labelColor="#ffffff"
                backgroundColor="#444444"
                onClick={this.logout}
                style={{margin: '12px',float:'right'}}
              />
            </div>
            <div className="track-list">
              { ( tracks.length > 0 || searchErrors.length > 0 ) ? <ListTrackPlayers tracks={tracks} searchErrors={searchErrors} /> : null }
            </div>
          </div>
        ) : (
          <div className="app-body">
            <div className="spotify-login">
              { (accessToken == null ) ? <a href={spotifyLoginUrl}><div className="login-button">Login with Spotify</div></a> : null }
            </div>
          </div>
        ) }
        
      </div>
    );
  }
}

export default withCookies(App);
