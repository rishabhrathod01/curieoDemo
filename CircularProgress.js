import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Svg, {Path, Circle}  from 'react-native-svg';
import { Constants } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

function generateArc(percentage, radius){
    if (percentage === 100) percentage = 99.999
    const a = percentage*2*Math.PI/100 // angle (in radian) depends on percentage
    const r = radius // radius of the circle
    var rx = r,
        ry = r,
        xAxisRotation = 0,
        largeArcFlag = 1,
        sweepFlag = 1,
        x = r + r*Math.sin(a),
        y = r - r*Math.cos(a)
    if (percentage <= 50){
        largeArcFlag = 0;
    }else{
        largeArcFlag = 1
    }

    return `A${rx} ${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x} ${y}`
}

export default class App extends React.Component {
 state={
   percentage:0,
   isOn:false,
 }

  startTimer() {
      this.setState({
        isOn: true,
      })
      this.timer = setInterval(() => this.setState({
        percentage : this.state.percentage + 1 
      }), 250);
    }
    stopTimer() {
        this.setState({isOn: false,percentage:0})
        clearInterval(this.timer)
        this.startTimer()
      }
 
 componentWillMount(){
   if(!this.state.isOn){
     this.startTimer();
   }
 }

  
  render() {
    if(this.state.percentage>59){
      this.stopTimer();
    }
    const CircularProgress = ({
        percentage = (this.state.percentage/0.6),
        blankColor = "#eaeaea",
        donutColor = "#43cdcf",
        fillColor = "white",
        progressWidth = 35,
        size = 100,
        children
    }) => {
        let half = size / 2;
        return <View style={{width: size, height: size}}>
            <Svg width={size} height={size}>
                <Circle cx={half} cy={half} r={half} fill={blankColor}/>
                <Path
                    d={`M${half} ${half} L${half} 0 ${generateArc(percentage, half)} Z`}
                    fill={donutColor}
                />
                <Text>{this.state.percentage}</Text>
                {<Circle cx={half} cy={half} r={progressWidth} fill={fillColor}/>}
            </Svg>
        </View>
    }
    return (
      <View style={{justifyContent:'center',alignItems:'center'}}>
    <CircularProgress />
    </View> );
  }
}

