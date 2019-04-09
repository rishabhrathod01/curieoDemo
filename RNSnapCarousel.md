#React-native-snap-Carousel

##Required props : 

Depending on horizontal or vertical carousel choosen :-
if horizontal Carousel then 
itemWidth and SliderWidth are Required Props
else 
if vertical Caraousel then 
itemHeight and sliderHeight are Required Props.

Check All Required Props In link below :-
https://github.com/archriss/react-native-snap-carousel/blob/master/doc/PROPS_METHODS_AND_GETTERS.md#required

Check below link to understand style
https://github.com/archriss/react-native-snap-carousel/blob/master/doc/TIPS_AND_TRICKS.md#understanding-styles


##Tips and tricks :-

1.Implement shouldComponentUpdate (see the shallowCompare addon) for every carousel children (in renderItem()) or make it a PureComponent (some users report that shouldComponentUpdate is faster, but you should try both and decide for yourself).
2.Make sure the carousel isn't a child of a ScrollView (this includes FlatList, VirtualizedList and many plugins). Apparently, it would render all child components, even those currently off-screen.
3. consider loading additional chunks of data only when the user has reached the end of the current set. 


The value of itemWidth must include extra margin mentioned in the link.
https://github.com/archriss/react-native-snap-carousel/blob/master/doc/TIPS_AND_TRICKS.md#margin-between-slides

Check All Tips and Tricks in link Below :-
https://github.com/archriss/react-native-snap-carousel/blob/master/doc/TIPS_AND_TRICKS.md


##To use Methods and getters :-

methods like
-onSnapToItem(index)
-onBeforeSnapToItem(index)
need to be called by refernce of carousel.

CHECK the Link below for more..
https://github.com/archriss/react-native-snap-carousel/blob/master/doc/PROPS_METHODS_AND_GETTERS.md#reference-to-the-component



###Important note regarding Android:-

->On Android, you will experience issues with carousel's behavior when JS Dev Mode is enabled, and you might have trouble with unreliable callbacks and loop mode when it isn't.
->This is unfortunate, but it's rooted in various flaws of ScrollView/FlatList's implementation and the miscellaneous workarounds we had to implement to compensate for it.
-> Therefore you should always check if the issue you experience also happens in a production environment. This is, sadly, the only way to test the real performance and behavior of the carousel.


###Important note regarding iOS:-	
	
When debugging with the iOS simulator, you're only one "Cmd + T" away from toggling "Slow Animations". If carousel's animations seem painfully slow, make sure that you haven't enabled this setting by mistake


#Known Issues : 
1.RN 0.43.x is the minimum recommended version for plugin releases >= 3.0.0 since it was the first version to introduce the FlatList component.
2.Make sure to test carousel's performance and behavior without JS Dev Mode enabled, ideally with a production build.
3.Error with Jest
	https://github.com/archriss/react-native-snap-carousel/blob/master/doc/KNOWN_ISSUES.md#error-with-jest

