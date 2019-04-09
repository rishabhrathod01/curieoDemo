import React from 'react'
import {View,Text} from 'react-native'
import Svg,{Circle,Rect} from 'react-native-svg'
const RecoderIcon = () => {
  return (
    <View style={{height:50,width:50}}>
        <Svg
            height="100"
            width="100"
        >
            <Circle
                cx="50"
                cy="50"
                r="50"
                fill="black"
            />
             <Rect
                x="25"
                y="25"
                width="50"
                height="50"
                fill="red"
            />

        </Svg>
    </View>
  )
}

export default RecoderIcon;
