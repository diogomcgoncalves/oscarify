import React, { Component } from 'react';
import Avatar from 'material-ui/Avatar';
import AutoComplete from 'material-ui/AutoComplete';
import axios from 'axios';

export default class ArtistInput extends Component{

    constructor(props){
        super();
        this.state = {
            searchText: '',
            suggestions: []
        };        
    }

    handleUpdateInput = (searchText) => {
        this.setState({
            searchText: searchText,
        });
        this.getBands(searchText);
    };
    
    handleNewRequest = () => {
        this.setState({
            searchText: '',
            suggestions: []
        });
    };

    getBands = (searchText) => {
        let {accessToken} = this.props;
        if( searchText === '' ){
            this.setState({suggestions: []})
        }
        else{
            axios.get(encodeURI('https://api.spotify.com/v1/search?q='+searchText+'**&type=artist&limit=5'),{
                'headers': {'Authorization': 'Bearer '+accessToken }
            })
            .then((res) => {
                let auxList = [];
                let dataSourceConfig = {};
                console.log('====================================');
                res.data.artists.items.forEach( b => {
                    console.log(b.name);
                    auxList.push({text:b.name,value:b});
                })
                console.log('====================================');
                this.setState({suggestions: auxList});
            })
            .catch(err => {
                console.log('====================================');
                console.log(JSON.stringify(err));
                console.log('====================================');
                this.setState({suggestions: []})
            });
        }
    }

    render(){
        console.log('====================================');
        console.log(this.state.suggestions);
        console.log('====================================');
        return (
            <div className="artist-input">
            <AutoComplete
                hintText="Type 'r', case insensitive"
                searchText={this.state.searchText}
                onUpdateInput={this.handleUpdateInput}
                onNewRequest={this.handleNewRequest}
                dataSource={this.state.suggestions}
                filter={AutoComplete.noFilter}
                fullWidth={true}
                openOnFocus={true}
            />
            </div>
        );
    }
}