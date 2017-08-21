import React, { Component } from 'react';

const SongFrame = (trackId, name = 'song') => {
    return (
    <iframe
    src={ encodeURI('https://open.spotify.com/embed?uri=spotify:track:'+trackId.trackId) }
    className="spotify-player-frame"
    width="300" 
    height="80" 
    frameBorder="0" 
    allowTransparency="true">
    </iframe>
    );
};

const ErrorFrame = (searchValue) => (
    <div className="error-frame">
        <h5>{searchValue.searchValue}?</h5>
    </div>
)
export default class ListTrackPlayers extends Component {

    render(){
        let {tracks, searchErrors} = this.props;
        let playerList = [];
        let keyVal = 0;
        console.log('====================================');
        console.log(tracks);
        console.log('====================================');
        tracks.forEach( (t) => {
            if( typeof(t) !== 'string' ){
                playerList.push(
                    <SongFrame key={keyVal++} trackId={t[0].id} />
                );
            }
        });
        searchErrors.forEach( (v) => {
            playerList.push(
                <ErrorFrame key={keyVal++} searchValue={v} />                
            );
        });
        return(
            <div className="spotify-player-list">
                <h3>Songs:</h3>
                {playerList}
            </div>
        );
    }

}