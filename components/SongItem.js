import React, { Component } from 'react'
import { Text, View ,StyleSheet ,Image} from 'react-native'
import  { ParallaxImage } from 'react-native-snap-carousel';


export default class SongItem extends Component {
    constructor(props){
        super(props)
        this.state = {
            item : this.props.item
        }
    }
    shouldComponentUpdate(){
        return false
    }
  render() {
    return (
        <View style={styles.item}>
              <ParallaxImage
                source={{ uri:"http://storage.googleapis.com/automotive-media/"+this.props.item.image}}
                containerStyle={styles.imageContainer}
                style={styles.image}
                parallaxFactor={0.4}
                showSpinner={true}
                {...this.props.parallaxProps}
            />
            {/* <View style={styles.imageContainer}>
                <Image 
                    style={styles.image}
                    source={{ uri:"http://storage.googleapis.com/automotive-media/"+this.props.item.image}}
                        />
                    
            </View> */}
              <Text style={styles.title} numberOfLines={2}>
                 { this.props.item.title }
              </Text>
            </View>
    )
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
        fontSize:16,
        fontWeight:'bold'
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