import React, { Component } from 'react'
import { Text, View ,ActivityIndicator,FlatList,TouchableHighlight} from 'react-native'
import axios from 'axios';
import Video from 'react-native-video';
import Slider from 'react-native-slider'

export default class Player extends Component {
  constructor(props){
    super(props)
    this.state = {
      songs:null,
      currentPosition:0,
      totalLength:1,
      currentSong:null,
    }
  }

  setDuration(data) {
    this.setState({totalLength: Math.floor(data.duration)});
  }

  seek(time) {
    time = Math.round(time);
    this.refs.audioElement && this.refs.audioElement.seek(time);
    this.setState({
        currentPosition: time,
        paused: false,
        showLoader: true
    });
}

  setTime(data) {
    this.setState({showLoader: false});
    this.setState({currentPosition: Math.floor(data.currentTime)});
  }



  componentWillMount(){
    axios.get('http://storage.googleapis.com/automotive-media/music.json').then((response) =>{
      this.setState({
        songs:response.data.music,
      })
    });
  }

  _renderItem = ({item,index})=>(
    <TouchableHighlight 
      onPress={()=>this.setState({currentSong:item,currentPosition:0})} 
      style={{margin:10}} key={index}>
      <Text>{item.title}</Text>
    </TouchableHighlight>)

  render() {
    if(!this.state.songs){
      return (
        <View>
          <ActivityIndicator size="small"/>
        </View>
      )
    }else{

      const video = (
        <Video source={{
              uri:"http://storage.googleapis.com/automotive-media/"+this.state.currentSong.source,
              }} // Can be a URL or a local file.
             ref="audioElement"
             paused={this.state.paused}               // Pauses playback entirely.
             resizeMode="cover"           // Fill the whole screen at aspect ratio.
             repeat={false}
             onLoadStart={this.loadStart} // Callback when video starts to load
             onLoad={this.setDuration.bind(this)}    // Callback when video loads
             onEnd={this.onEnd}           // Callback when playback finishes
             onProgress={this.setTime.bind(this)}    // Callback every ~250ms with currentTime
             onError={this.videoError}    // Callback when video cannot be loaded
            //  style={styles.audioElement}
             />
        );


      return(
        <View style={{flex:1}}>
          
          <FlatList 
            keyExtractor={(item,index)=>{item.trackNumber}}
            renderItem={this._renderItem}
            data={[...this.state.songs]}/>
          {video}
          <Slider
            value={this.state.currentPosition}
            onValueChange={value => {this.seek(value);}}
            maximumValue={this.state.totalLength}
          />
        </View>
      )
    }
    
  }
}
