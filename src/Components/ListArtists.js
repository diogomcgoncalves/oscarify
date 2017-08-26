import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Chip from 'material-ui/Chip';
import Headset from 'material-ui/svg-icons/hardware/headset';

const styles = {
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
};


export default class ListArtists extends Component{
    openArtistPage = (url) => {
        window.open(encodeURI(url));
    }

    render(){
        let {artists} = this.props;
        let itemsList = [];
        let chipList = [];
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

            chipList.push(
                <Chip 
                    key={i}
                    style={styles.chip} 
                    onRequestDelete={ () => this.props.onDelete(a.id)}
                    onClick={ () => { this.openArtistPage(a.external_urls.spotify)} }
                >
                    <Avatar src={a.images[0].url} />
                    {a.name}
                </Chip>
            ); 
        }, this)
        if( this.props.displayChips )
            return(
                <div className="band-chips" style={styles.wrapper}>
                    {chipList}
                </div>
            );
        else
            return(
                <div className="band-list" style={{'maxWidth': '450px'}}>
                    <List children={itemsList} />
                </div>
            );
        }
}