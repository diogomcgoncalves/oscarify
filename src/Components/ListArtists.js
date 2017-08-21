import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Headset from 'material-ui/svg-icons/hardware/headset';

export default class ListArtists extends Component{
    openArtistPage = (url) => {
        window.open(encodeURI(url));
    }
    
    render(){
        let {artists} = this.props;
        let itemsList = []
        console.log('====================================');
        console.log(artists);
        console.log('====================================');
        Object.keys(artists).forEach(function(key,i) {
            let a = artists[key];
            itemsList.push(
                <ListItem
                key={i}
                primaryText={a.name}
                leftAvatar={<Avatar src={a.images[0].url} />}
                rightIcon={<Headset />}
                onClick={ () => { this.openArtistPage(a.external_urls.spotify)} }
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