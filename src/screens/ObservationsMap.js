import React, {Node, useState, useEffect, useRef, useLayoutEffect, useContext } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Image, 
    Animated,
    Text,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';

import { SelectList } from 'react-native-dropdown-select-list'
import { useTranslation } from 'react-i18next';


import MapView, {Marker, UrlTile} from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';

// import Svg from 'react-native-svg';
import Loading from '../components/Loading';

import { PULIC_BUCKET_URL } from '../config';

import { LocationContext } from '../context/LocationContext';
import { ObservationContext } from '../context/ObservationContext';

import CustomButton from "../components/CustomButton";
// import {locationsData, locationsNames, filterNames, filterData} from './data/MapFilterData';
import { useMapFilterData } from '../hooks/useMapFilterData';

const bluePin = require('../../assets/images/pins/atesmaps-blue.png');
const redPin = require('../../assets/images/pins/atesmaps-red.png')

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = (width * 0.2)/2;
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const ObservationsMap: () => Node = ({ navigation  }) => {
    const {LATITUDE_DELTA,LONGITUDE_DELTA, currentLocation} = useContext(LocationContext);
    const {isLoading, getAllObservations, allObservations,} = useContext(ObservationContext);
    const { t, i18n } = useTranslation();
    const [newDelta, setNewDelta]=useState({longitudeDelta: 0.7470, latitudeDelta: 0.7470})
    const [newRegion, setNewRegion]=useState({ 
      latitude: currentLocation.latitude, 
      longitude:currentLocation.longitude, 
      latitudeDelta: LATITUDE_DELTA, 
      longitudeDelta: LONGITUDE_DELTA}); 
    // const [locationIsLoading, setLocationIsLoading] = useState(false);
    const [flying, setFlying] = useState(false);
    const [mapIndex, setMapIndex] = useState(0);
    const {locationsData, locationsNames, filterNames, filterData} = useMapFilterData();
    const [dayFilter, setDayFilter] = useState(3);
    const [locationFilter, setLocationFilter] = useState(currentLocation)
    const [selectedLocation, setSelectedLocation] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);

    const [scrollWidth, setScrollWidth] = useState(0);

  
    const mapI18nToMomentLocale = (i18nCode) => {
        switch (i18nCode) {
            case 'cat':
                return 'ca'; // Catalan
            case 'en':
                return 'en'; // English
            case 'fr':
                return 'fr'; // French
            case 'es':
                return 'es'; // Spanish
            default:
                return 'en'; // Fallback to English
        }
    };

    //NOTE: This is React Native integrated animated library:
    let mapAnimation = new Animated.Value(0);
    //TODO: use React Reanimated library instead.
    //const mapAnimation = useSharedValue(0);
    const _map = useRef(null);
    const _scrollView = useRef(null);
    
  
  // useEffect(()=>{
  //   // console.log('Calling initial location set up');
  //   const newLocation = { latitude: currentLocation.latitude, longitude:currentLocation.longitude, latitudeDelta: newDelta.latitudeDelta, longitudeDelta: newDelta.longitudeDelta }
  //   setNewRegion(newLocation)
  //   // setLocationFilter(newLocation);
  // },[]) 

  useEffect(()=>{
    // console.log('calling getObservations');
    let location;
    if (selectedLocation == 0){
      location = currentLocation
    }else{
      location = locationsData[selectedLocation];
    }
    const days = filterData[selectedDay];
    getAllObservations({days: days,location: location});
  },[selectedLocation,selectedDay]);

  useEffect(()=>{
    if (selectedLocation == 0){
      location = currentLocation
    }else{
      location = locationsData[selectedLocation];
    }

    //console.log(location)

    if(allObservations.length > 0){
      // console.log('setting location to first obs...')
      setMapIndex(0);
      const { coordinates } = allObservations[0].location;
      setNewRegion({
        latitude:coordinates[1], 
        longitude:coordinates[0],
        latitudeDelta:newDelta.latitudeDelta,
        longitudeDelta:newDelta.longitudeDelta
      })
      // setNewDelta({latitudeDelta:0.717,
      //   longitudeDelta:0.717})
    }else{
      // console.log('reset Location to centroid.');
      setNewRegion({
        latitude:location.latitude, 
        longitude:location.longitude,
        latitudeDelta:newDelta.latitudeDelta,
        longitudeDelta:newDelta.longitudeDelta
      })

      // setNewDelta({latitudeDelta:0.717,
      //   longitudeDelta:0.717})
    }
  },[allObservations])

  // useEffect(()=>{
  //   console.log('New region has been set...');
  //   // _map.current.animateToRegion(
  //   //   {
  //   //     latitude: Number(coordinates[1]),
  //   //     longitude: Number(coordinates[0]),
  //   //     latitudeDelta: newDelta.latitudeDelta,
  //   //     longitudeDelta: newDelta.longitudeDelta,
  //   //   },
  //   //   100
  //   // );
  // },[newRegion])
 
  // useEffect(() => {
  //   mapAnimation.addListener(({ value }) => {
  //     // let index = 0;
  //    // let index = Math.floor((value-mapIndex*20) / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item

  //     //console.log('value:', value);
     
      
  //   //   console.log(Math.ceil(value / CARD_WIDTH));
  //   //  // console.log(index);
  //   //   console.log(CARD_WIDTH + 20);
  //     let index = Math.floor(value / CARD_WIDTH);
  //     if (index > allObservations.length) {
  //       console.log('Reset..')
  //       index = allObservations.length - 1;
  //     }
  //     if (index < 0) {
  //       console.log('Reset..')
  //       index = 0;
  //     }
  
  //     clearTimeout(regionTimeout);

  //     const regionTimeout = setTimeout(() => {
  //       if(flying){
  //         // console.log('saltant...');
  //         if (index === mapIndex) {
  //           // console.log(`On saltem? ${index}`)
  //           const { coordinates } = allObservations[index].location;
  //           _map.current.animateToRegion(
  //             {
  //               latitude: coordinates[1] ,
  //               longitude: coordinates[0],
  //               latitudeDelta: 0.1170 ,
  //               longitudeDelta: 0.1170 ,
  //             },
  //             350
  //           );
  //           setFlying(false);
  //         }
  //       }else{
  //         if (index !== mapIndex) {
  //           setMapIndex(index);
  //           const { coordinates } = allObservations[index].location;
  //           _map.current.animateToRegion(
  //             {
  //               latitude: coordinates[1] ,
  //               longitude: coordinates[0],
  //               latitudeDelta: 0.1170 ,
  //               longitudeDelta: 0.1170 ,
  //             },
  //             350
  //           );
  //         }
  //       }
  //     }, 10);
  //   });
  // });

  // const interpolations = allObservations.map((marker, index) => {
  //   const inputRange = [
  //     (index - 1) * (CARD_WIDTH + 20) ,
  //     index * (CARD_WIDTH + 20),
  //     ((index + 1) * (CARD_WIDTH + 20)),
  //   ];
  //   //NOTE: This is React Native integrated animated library:
  //   let scale;
  //   if(Platform.OS === 'ios'){
  //     scale = mapAnimation.interpolate({
  //       inputRange,
  //       outputRange: [1, 1.5, 1],
  //       extrapolate: "clamp"
  //     });
  //   }else{
  //     scale = mapAnimation.interpolate({
  //       inputRange,
  //       outputRange: [0.5, 0.75, 0.5],
  //       extrapolate: "clamp"
  //     });
  //   }
  //   return { scale };
  // });

  const onMarkerPress = (mapEventData) => {
    
    const markerID = mapEventData._targetInst.return.key;
   
    let x = (markerID * CARD_WIDTH) + (markerID * 20); 
    if (Platform.OS === 'ios') {
      x = x - SPACING_FOR_CARD_INSET;
    } 
    // mapIndex = Number(markerID);
    setMapIndex( Number(markerID))
    setFlying(true);
    // flying = true;
    _scrollView.current.scrollTo({x: x, y: 0, animated: true});


    const { coordinates } = allObservations[Number(markerID)].location;
    

    _map.current.animateToRegion(
      {
        latitude: Number(coordinates[1]),
        longitude: Number(coordinates[0]),
        latitudeDelta: newDelta.latitudeDelta,
        longitudeDelta: newDelta.longitudeDelta,
      },
      350
    );

    setNewRegion({
      latitude: Number(coordinates[1]),
      longitude: Number(coordinates[0]),
      latitudeDelta: newDelta.latitudeDelta,
      longitudeDelta: newDelta.longitudeDelta,
    })
  }

  const getMapRegion = () => {     

    console.log('New region has been set:',newRegion)
    return {latitude: newRegion.latitude, 
            longitude: newRegion.longitude, 
            latitudeDelta: newDelta.latitudeDelta,
            longitudeDelta: newDelta.longitudeDelta
          }
  };


  // if( isLoading ) {
  //   return(
  //     <Loading />
  //   )
  // }

    return(
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
              {isLoading ?
                (<Loading />)
                :
                (<>
                  <MapView
                    ref={_map}
                    // provider={this.props.provider}
                    provider={Platform.OS == "android" ?  "google" : undefined}
                    style={styles.map}
                    showsUserLocation = {true}
                    initialRegion={{latitude: newRegion.latitude, 
                      longitude: newRegion.longitude, 
                      latitudeDelta: newDelta.latitudeDelta,
                      longitudeDelta: newDelta.longitudeDelta
                    }}
                    onRegionChangeComplete={(region) => {
                      setNewDelta({latitudeDelta: region.latitudeDelta, longitudeDelta:region.longitudeDelta })
                      setNewRegion({latitude: region.latitude, longitude:region.longitude, latitudeDelta: region.latitudeDelta, longitudeDelta:region.longitudeDelta })}
                    }
                     // region={newRegion}>
                     //region={Platform.OS === 'ios' ? getMapRegion() : null}
                    >
                       <UrlTile
                        // urlTemplate={"https://4umaps.atesmaps.org/{z}/{x}/{y}.png"}
                        urlTemplate={"https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=0a7d6a77a3f34d94a359058bd54f0857"}
                        /**
                        * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
                        * MKTileOverlay. iOS only.
                        */
                        maximumZ={19}
                        /**
                        * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
                        * to be used. Its default value is false.
                        */
                        flipY={false}
                      />    
                   
                    
                      {allObservations.map((marker, index)=>{
                        //TODO: use React Reanimated library instead.
                        // const scaleStyle = useAnimatedStyle(() => ({
                        //     transform:  {scale: interpolations[index].scale} 
                        // }));
                        //NOTE: This is React Native integrated animated library:
                        const scaleStyle = {
                          ...Platform.select({
                            ios: {
                           
                            },
                            android: {
                              width: 51,
                              height: 60,
                              marginBottom: 0,
                            }
                          }),
                          // backgroundColor: (index === mapIndex ? 'red' : 'transparent'),
                          transform: [
                            {
                              //scale: 0.75
                              //scale: interpolations,
                               scale: (Platform.OS === 'ios' ? (index === mapIndex ? 1 : 0.75) : (index === mapIndex ? 0.80 : 0.5)),
                            },
                          ],
                        };
                        return(
                          <Marker
                            key={index}
                            style={[styles.pin]}
                            coordinate={{latitude:Number(marker.location?.coordinates[1]),longitude:Number(marker.location?.coordinates[0])}}
                            onPress={(e)=>onMarkerPress(e)}
                          >
                             {/* <Text>{index}</Text> */}
                            <Animated.Image style={[styles.pin,scaleStyle]}
                                source={(index === mapIndex ? redPin : bluePin)}
                            /> 
                          </Marker>
                        )
                      })}
                
                  </MapView>
                  </> 
                  )}
                  <View style={{position: 'absolute', left:10, top: 10}}>
                    <SelectList 
                      setSelected={(val) => {
                        setSelectedLocation(val)
                      }}
                      data={locationsNames} 
                      placeholder={t('cerca')}
                      save="key"
                    // defaultOption={{ key:'0', value:'Cerca de mi' }}
                      search={false}
                      boxStyles={{ backgroundColor: '#FFF',  height: 40, borderWidth: 0, minWidth: 190}}
                      dropdownStyles={{backgroundColor: '#FFF',borderWidth: 0,  maxWidth:190}}
                    />
                    </View>
                    <View style={{position: 'absolute', right:10, top: 10}}>
                    <SelectList 
                      setSelected={(val) => {
                        setSelectedDay(val)
                      }} 
                      data={filterNames} 
                      placeholder={"3 "+t("dias")}
                      search={false}
                      //defaultOption={{ key:'0', value:'3 días' }}
                      save="key"
                      boxStyles={{border:'none', height: 40, borderWidth: 0, backgroundColor: '#FFF', minWidth: 120}}
                      dropdownStyles={{backgroundColor: '#FFF',borderWidth: 0,  maxWidth:120}}
                    />
                  </View>
             
              {/* <ScrollView
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                height={50}
                style={styles.chipsScrollView}
                
                contentInset={{ // iOS only
                  top:0,
                  left:0,
                  bottom:0,
                  right:20
                }}
                contentContainerStyle={{
                  paddingRight: Platform.OS === 'android' ? 20 : 0
                }}
              >
                <TouchableOpacity key={1} style={styles.chipsItem}>
                 {category.icon} 
                  <Text>7 dias</Text>
                </TouchableOpacity>
                <TouchableOpacity key={2} style={styles.chipsItem}>
                  {category.icon} 
                  <Text>15 dias</Text>
                </TouchableOpacity>
                <TouchableOpacity key={3} style={styles.chipsItem}>
                  {category.icon} 
                  <Text>30 dias</Text>
                </TouchableOpacity>
                <TouchableOpacity key={4} style={styles.chipsItem}>
                  {category.icon} 
                  <Text>60 dias</Text>
                </TouchableOpacity>
              </ScrollView> */}
              {!isLoading &&
             
              (
              <Animated.ScrollView
                ref={_scrollView}
                horizontal
                pagingEnabled
                scrollEventThrottle={12}
                decelerationRate={0}
                showsHorizontalScrollIndicator={true}
                snapToInterval={CARD_WIDTH + 20}
                snapToAlignment={Platform.OS === 'android' ? "start" : "center"}
                style={styles.scrollView}
                onContentSizeChange={(width) => {
                   setScrollWidth(width);
                }}
                onMomentumScrollEnd={(event)=>{
                  // console.log('momentum ended')
                  // console.log('numberof cards on the scroll view: ',(scrollWidth/ (CARD_WIDTH + 20)));
                  // console.log('number of observations found: ',allObservations.length);

                  // console.log('current scroll position after snap',scrollWidth);
                  // console.log('hipotetical selected mark:',(Math.ceil((scrollWidth-SPACING_FOR_CARD_INSET) / (CARD_WIDTH + 20)) - Math.ceil((scrollWidth-SPACING_FOR_CARD_INSET - event.nativeEvent.contentOffset.x) / (CARD_WIDTH + 20))) )
                  let index;
                  if(flying){
                    console.log('jumping to:', mapIndex);
                    index = mapIndex;
                    setFlying(false);
                  }else{ 
                    if(Platform.os === 'ios'){
                      index = (1+Math.ceil(scrollWidth / (CARD_WIDTH + 20)) - Math.ceil((scrollWidth - event.nativeEvent.contentOffset.x) / (CARD_WIDTH + 20))) ;
                    }else{
                      index = (Math.ceil((scrollWidth-SPACING_FOR_CARD_INSET) / (CARD_WIDTH + 20)) - Math.ceil((scrollWidth-SPACING_FOR_CARD_INSET - event.nativeEvent.contentOffset.x) / (CARD_WIDTH + 20))) ;
                    }
                    if (index !== mapIndex) {
                      // console.log('setting new index and location.')
                      
                        const { coordinates } = allObservations[index].location;
                        _map.current.animateToRegion(
                          {
                            latitude: Number(coordinates[1]),
                            longitude: Number(coordinates[0]),
                            latitudeDelta: newDelta.latitudeDelta,
                            longitudeDelta: newDelta.longitudeDelta,
                          },
                          350
                        );
                        
                        setNewRegion({
                          latitude: Number(coordinates[1]),
                          longitude: Number(coordinates[0]),  
                          latitudeDelta: newDelta.latitudeDelta,
                          longitudeDelta: newDelta.longitudeDelta,
                        })
                        setMapIndex(Number(index));
                    }
                  //console.log((scrollWidth-(SPACING_FOR_CARD_INSET*2) / CARD_WIDTH) - (scrollWidth - event.nativeEvent.contentOffset.x) / (CARD_WIDTH))
                  //console.log(Math.ceil((scrollWidth-(SPACING_FOR_CARD_INSET*2) / CARD_WIDTH) - (scrollWidth - event.nativeEvent.contentOffset.x) / (CARD_WIDTH)));
                  }
            
                }}
                // onScroll={(event)=>{
                //   console.log(event.nativeEvent.contentOffset.y)
                // }}
                contentInset={{
                  top: 0,
                  left: SPACING_FOR_CARD_INSET,
                  bottom: 0,
                  right: SPACING_FOR_CARD_INSET
                }}
                contentContainerStyle={{
                  paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
                }}
                //TODO: Update to React NAtive Reanimated library instead.
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: mapAnimation,
                        }
                      },
                    },
                  ],
                  {useNativeDriver: true}
                )}
              >
                 {allObservations.map((marker, index)=>(
                    
                    <View style={styles.card} key={index}>
                    {marker.images.length > 0 && (
                      <Image 
                        source={{uri:PULIC_BUCKET_URL+'/'+marker.directoryId+'/'+marker.images[0]}}
                        style={styles.cardImage}
                        resizeMode="cover"
                      /> 
                    )}
                    {marker.images.length === 0 && (
                      <Image 
                        source={require('../../assets/images/backgrounds/no-image.jpg')}
                        style={styles.cardImage}
                        resizeMode="cover"
                      /> 
                    )}
                      <View style={styles.textContent}>
                        <View style={[styles.obsIcons, {justifyContent: 'space-between'}]}>

                          <Text numberOfLines={2} style={styles.cardtitle}>{(marker.title.length > 30 ? marker.title.substring(0, 30)+'...' : marker.title)} </Text>
                          <Text style={styles.cardDescription}>{moment(marker.date).locale(mapI18nToMomentLocale(i18n.language)).format('Do MMMM YY')}</Text>
                        </View> 
                        <View style={styles.obsIcons}>
                        <Text numberOfLines={1} style={styles.cardDescription}>{t('tipoIObs')}:</Text>
                        {marker.observationTypes.quick.status == true && (
                          <Image source={require("../../assets/images/icons/buttonIcons/button-quick.png")}
                                style={styles.obsIcon}
                                resizeMode="cover"
                          />
                        )}
                         {marker.observationTypes.weather.status == true && (
                          <Image source={require("../../assets/images/icons/buttonIcons/button-meteo.png")}
                                style={styles.obsIcon}
                                resizeMode="cover"
                          />
                        )}
                        {marker.observationTypes.snowpack.status == true && (
                          <Image source={require("../../assets/images/icons/buttonIcons/button-snow.png")}
                                style={styles.obsIcon}
                                resizeMode="cover"
                          />
                        )}
                        {marker.observationTypes.accident.status == true && (
                          <Image source={require("../../assets/images/icons/buttonIcons/button-accident.png")}
                                style={styles.obsIcon}
                                resizeMode="cover"
                          />
                        )}     
                        {marker.observationTypes.avalanche.status == true && (
                          <Image source={require("../../assets/images/icons/buttonIcons/button-avalanche.png")}
                                style={styles.obsIcon}
                                resizeMode="cover"
                          />
                        )}                                                                                          
                        </View>
                       
                        <CustomButton text={t('view')}  
                            bgColor={"#48a5e9"} 
                            fgColor='white' 
                            customStyle={{width: '100%', padding: 6, height: 30}}
                            iconName={null} 
                            onPress={() => {
                              navigation.navigate('ObservationModal',{item: marker, modal: 'modal' });
                            }} />
                        

                        {/* <View style={styles.button}>
                          <TouchableOpacity
                            // onPress={() => {}}
                            style={[styles.signIn, {
                              borderColor: '#FF6347',
                              borderWidth: 1
                            }]}
                          >
                            <Text style={[styles.textSign, {
                              color: '#FF6347'
                            }]}>Ver</Text>
                          </TouchableOpacity>
                        </View> */}
                      </View> 
                    </View>
                  ))}

              </Animated.ScrollView>
            )}
            </View>
        </SafeAreaView>
        
)};




const styles = StyleSheet.create({
  safeContainer: {
      flex: 1,
    //  flexDirection: 'column',
       justifyContent: 'center',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  }, 
  spacer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'gray',
    height: 1,
  },
  space: {
    height: 50,
  },
  scrollView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  obsIcons:{
    flex: 1,
    flexDirection: 'row',
  },
  obsIcon:{
    // marginTop: 2,
    marginLeft: 5,
    height: 15,
    width: 30,
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 2,
    padding: 10,
  },
  cardtitle: {
    fontSize: 12,
    // marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  chipsScrollView: {
    flex: 1,
    flexDirection: 'row',
    width:'100%',
    position:'absolute', 
    top:Platform.OS === 'ios' ? 10 : 10, 
  
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal:10
  },
  chipsItem: {
    flexDirection:"row",
    backgroundColor:'#fff', 
    borderRadius:20,
    padding:8,
    paddingHorizontal:20, 
    marginHorizontal:10,
    height:35,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  pin: {
      ...Platform.select({
        ios: {
          width: 51,
          height: 60,
          marginBottom: 55,
        },
        android: {
      
          marginBottom: 0,
        },
        default: {
          // other platforms, web for example
          marginBottom: 0,
        },
      }),
    },
});

export default ObservationsMap;