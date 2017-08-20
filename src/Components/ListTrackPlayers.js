import React, { Component } from 'react';

const SongFrame = (trackId, name = 'song') => {
    return (
    <div>
        <iframe
        src={ encodeURI('https://open.spotify.com/embed?uri=spotify:track:'+trackId.trackId) }
        width="300" 
        height="80" 
        frameBorder="0" 
        allowTransparency="true">
        </iframe>
    </div>
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
        tracks[0].forEach( (t, i) => {
            console.log('====================================');
            console.log(t.id);
            console.log('====================================');
            playerList.push(
                <SongFrame key={i} trackId={t.id} />
            );
        });
        return(
            <div>
                {playerList}
            </div>
        );
    }

}