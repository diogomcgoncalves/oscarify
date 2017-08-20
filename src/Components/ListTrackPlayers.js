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
export default class ListTrackPlayers extends Component {

    constructor(props){
        super();
        this.state = {
            tracks: props.tracks
        }
    }

    render(){
        let {tracks} = this.state;
        let playerList = []
        console.log('====================================');
        console.log(tracks);
        console.log('====================================');
        tracks.forEach( (t, i) => {
            playerList.push(
                <SongFrame key={i} trackId={t[0].id} />
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