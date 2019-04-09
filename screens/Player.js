import React, { Component } from 'react'
import { Text, View ,ActivityIndicator,StyleSheet,TouchableHighlight,Dimensions,Image} from 'react-native'
import axios from 'axios';
import Video from 'react-native-video';
import Slider from 'react-native-slider'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';
import SongItem from '../components/SongItem';

const horizontalMargin = 15;
// const slideWidth = 280;

const sliderWidth = Dimensions.get("window").width;
const itemWidth = sliderWidth - horizontalMargin * 3;
const itemHeight = 100;


export default class Player extends Component {
  constructor(props){
    super(props)
    this.state = {
      songs:null,
      currentPosition:0,
      totalLength:1,
      currentSong:{ "title" : "Jazz in Paris",
                    "album" : "Jazz & Blues",
                    "artist" : "Media Right Productions",
                    "genre" : "Jazz & Blues",
                    "source" : "Jazz_In_Paris.mp3",
                    "image" : "album_art.jpg",
                    "trackNumber" : 1,
                    "totalTrackCount" : 6,
                    "duration" : 103,
                    "site" : "https://www.youtube.com/audiolibrary/music"
                  },
    }
  }

  _renderItem ({item, index}, parallaxProps) {
    return (
    <SongItem
      item={item}
      parallaxProps={parallaxProps}/>
  );
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

  componentWillUnmount(){
    
  }

  _onSnapToItem(index){
    console.log(index+"onSnapTOItem");
    this.setState({
      currentSong:this.state.songs[index],
    })
  }

  _onScroll(){
    console.log("OnScroll")
    this.setState({
      currentSong:this.state.songs[this._carousel.currentIndex]
    })
  }

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
        <View style={{flex:1}} >
          <View style={styles.header}> 

          </View>
          <View style={{alignItems:'center',justifyContent:'center'}}>
            <Carousel
                ref={(c) => { this._carousel = c; }}
                data={[...this.state.songs]}
                renderItem={this._renderItem}
                hasParallaxImages={true}
                onBeforeSnapToItem={(index)=>this._onSnapToItem(index)}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                activeSlideOffset={10}
                inactiveSlideScale={0.94}
                inactiveSlideOpacity={0.7}
                removeClippedSubviews={true}
              />
            {video}
          </View>
          <View style={{margin:10}}>
            <Slider
              value={this.state.currentPosition}
              onValueChange={value => {this.seek(value);}}
              maximumValue={this.state.totalLength}
            />
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text>{this.state.currentPosition}</Text>
              <Text>{this.state.totalLength}</Text>
            </View>
          </View>
          
        </View>
      )
    }
    
  }
}


const styles = StyleSheet.create({
  item:{
    justifyContent:'center',
    alignItems:'center'
  },
  image:{
    
  },
  title:{

  },
  imageContainer:{
    height:300,
    width:300,
    borderRadius:5
  },
  header:{
    height:50
  }

})