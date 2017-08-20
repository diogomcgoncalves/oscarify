import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Headset from 'material-ui/svg-icons/hardware/headset';

export default class ListArtists extends Component{
    constructor(props){
        super();
        this.state = {
            artists : props.artists
        };
    }

    openArtistPage = (url) => {
        window.open(encodeURI(url));
    }
    

    render(){
        let {artists} = this.state;
        let itemsList = []
        console.log('====================================');
        console.log(artists);
        console.log('====================================');
        artists.forEach(function(element,i) {
            itemsList.push(
                <ListItem
                key={i}
                primaryText={element.name}
                leftAvatar={<Avatar src={element.images[0].url} />}
                rightIcon={<Headset />}
                onClick={ () => { this.openArtistPage(element.external_urls.spotify)} }
                />
            );
            
        }, this)
        return(
            <div style={{'maxWidth': '450px'}}>
                <List children={itemsList} />
            </div>
        );
    }
}