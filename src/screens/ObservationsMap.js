import React, { useState, useEffect, useRef, useLayoutEffect, useCallback, useContext } from 'react';
import {
    SafeAreaView,
    View,
    Image, 
    Animated,
    Text,
    StyleSheet,
    Dimensions,
    Platform,
    TouchableOpacity,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { SelectList } from 'react-native-dropdown-select-list'
import { useTranslation } from 'react-i18next';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import moment from 'moment';

import { PULIC_BUCKET_URL } from '../config';
import { LocationContext } from '../context/LocationContext';
import { ObservationContext } from '../context/ObservationContext';
import CustomButton from "../components/CustomButton";
import { useMapFilterData } from '../hooks/useMapFilterData';
import Loading from '../components/Loading';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Constants
const bluePin = require('../../assets/images/pins/atesmaps-blue.png');
const redPin = require('../../assets/images/pins/atesmaps-red.png');
const { width } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const CARD_SPACING = 20; 
const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

const ObservationsMap = ({ navigation, route }) => {
    // --- CONTEXT ---
    const { LATITUDE_DELTA, LONGITUDE_DELTA, currentLocation } = useContext(LocationContext);
    const { isLoading, getAllObservations, allObservations, findObservationIndex } = useContext(ObservationContext);
    const { t, i18n } = useTranslation();
    const { locationsData, locationsNames, filterNames, filterData } = useMapFilterData();

    // --- LOCAL STATE ---
    const [newDelta, setNewDelta] = useState({ longitudeDelta: 0.7470, latitudeDelta: 0.7470 });
    const [newRegion, setNewRegion] = useState({ 
      latitude: currentLocation.latitude, 
      longitude: currentLocation.longitude, 
      latitudeDelta: LATITUDE_DELTA, 
      longitudeDelta: LONGITUDE_DELTA
    }); 

    const [flying, setFlying] = useState(false);
    const [mapIndex, setMapIndex] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState(0);
    const [selectedDay, setSelectedDay] = useState(0);
    const [scrollWidth, setScrollWidth] = useState(0);

    // --- REFS & ANIMATIONS ---
    const _map = useRef(null);
    const _scrollView = useRef(null);
    const mapAnimation = new Animated.Value(0);

    // Helper for date formatting
    const mapI18nToMomentLocale = (code) => {
        const map = { 'cat': 'ca', 'en': 'en', 'fr': 'fr', 'es': 'es' };
        return map[code] || 'en';
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            // Title is optional, but good for context
            // title: t('mapTitle'), 
            
            headerRight: () => (
                <TouchableOpacity 
                    onPress={() => {
                        fetchData(); 
                    }}
                    style={{ marginRight: 10 }}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
                >
                    <MaterialCommunityIcons 
                        name="refresh" 
                        size={26} 
                        color="#48a5e9" // Using your app's primary blue color
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation, fetchData]);

    // --- 1. DATA FETCHING LOGIC ---
    const fetchData = useCallback(() => {
        let locationToUse;
        if (selectedLocation == 0){
            locationToUse = currentLocation;
        } else {
            locationToUse = locationsData[selectedLocation];
        }
        const days = filterData[selectedDay];
        
        console.log("🔄 Fetching observations...");
        getAllObservations({ days: days, location: locationToUse });
    }, [selectedLocation, selectedDay, currentLocation]);

    // --- 2. DEEP LINK HANDLING (Notifications) ---
    useEffect(() => {
        const { observationId } = route.params || {};

        if (observationId) {
            console.log("🔔 Deep Link Triggered for:", observationId);

            const targetIndex = findObservationIndex(observationId);

            if (targetIndex !== -1) {
                console.log("📍 Target found at index:", targetIndex);
                const { coordinates } = allObservations[targetIndex].location;
                
                // setTimeout(() => {
                //     onMarkerPress(targetIndex);
                // }, 500); 

                setTimeout(() => {
                    // 1. Trigger UI Selection (Scroll card, turn pin red)
                    onMarkerPress(targetIndex);

                    // We don't wait for the state listener. We force the camera now.
                    if (_map.current) {
                        const targetLoc = {
                            latitude: Number(coordinates[1]),
                            longitude: Number(coordinates[0]),
                        };

                        if (Platform.OS === 'android') {
                            _map.current.animateCamera({
                                center: targetLoc,
                                // Optional: Force a zoom level if you want closer view
                                // zoom: 15 
                            }, { duration: 1000 });
                        } else {
                            _map.current.animateToRegion({
                                ...targetLoc,
                                latitudeDelta: newDelta.latitudeDelta,
                                longitudeDelta: newDelta.longitudeDelta,
                            }, 1000);
                        }
                    }
                }, 1000);
                

            } else {
                // Prevent infinite loops: Only fetch if we aren't already loading
                if (!isLoading) {
                    console.log("⚠️ Deep Link ID not found in local list. Forcing data refresh...");
                    fetchData(); 
                }
            }
        }
    }, [route.params?.observationId, allObservations]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            const { observationId } = route.params || {};

            // 1. Check for Deep Link
            if (observationId) {
                console.log("⏸️ Navigation Focus: Deep Link active, skipping fetch.");
                return;
            }

            // 2. Standard Reload
            console.log("📍 Navigation Focus: Fetching Data...");
            fetchData();
        });

        // Cleanup listener
        return unsubscribe;
    }, [navigation, fetchData, route.params]);


    // --- 3. SCREEN FOCUS LOGIC ---
    // useFocusEffect(
    //     useCallback(() => {
    //         const { observationId } = route.params || {};
            
    //         // If handling a deep link, SKIP the generic reload to avoid resetting state
    //         if (observationId) {
    //             console.log("⏸️ Skipping Focus Reload (Deep Link active)");
    //             return;
    //         }

    //         // Normal behavior: Refresh data on focus
    //         console.log("👀 Screen Focused: Refreshing Data");
    //         fetchData();

    //     }, [fetchData, route.params?.observationId])
    // );

    // --- 4. CLEANUP ON LEAVE ---
    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            if (route.params?.observationId) {
                console.log("🧹 Leaving Map: Clearing Observation ID param");
                navigation.setParams({ observationId: undefined });
            }
        });
        return unsubscribe;
    }, [navigation, route.params?.observationId]);

    // --- 5. MAP MOVEMENT LOGIC ---
    // Moves camera when mapIndex changes (via scroll or pin tap)
    useEffect(() => {
        if (allObservations.length > 0 && _map.current && mapIndex < allObservations.length) {
            const { coordinates } = allObservations[mapIndex].location;
            
            if (Platform.OS === 'android') {
                _map.current.animateCamera({
                    center: {
                        latitude: Number(coordinates[1]),
                        longitude: Number(coordinates[0]),
                    }
                }, { duration: 500 });
            } else {
                _map.current.animateToRegion({
                    latitude: Number(coordinates[1]),
                    longitude: Number(coordinates[0]),
                    latitudeDelta: newDelta.latitudeDelta,
                    longitudeDelta: newDelta.longitudeDelta,
                }, 500);
            }
        }
    }, [mapIndex, allObservations]);

    // --- INTERACTION HANDLERS ---
    const onMarkerPress = (markerIndex) => { 
        let x = (markerIndex * CARD_WIDTH) + (markerIndex * 20); 
        if (Platform.OS === 'ios') x = x - SPACING_FOR_CARD_INSET;

        setFlying(true); 
        _scrollView.current?.scrollTo({x: x, y: 0, animated: true});
        setMapIndex(markerIndex); 
    };

    const onMomentumScrollEnd = (event) => {
        if (flying) {
            setFlying(false);
            return;
        }
        const offsetX = event.nativeEvent.contentOffset.x;
        const cardSize = CARD_WIDTH + 20;
        let newIndex = Math.round(offsetX / cardSize);
        
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= allObservations.length) newIndex = allObservations.length - 1;

        if (newIndex !== mapIndex) {
            setMapIndex(newIndex);
        }
    };

    return(
        <SafeAreaView style={styles.safeContainer}>
            <View style={styles.container}>
            {isLoading ?
                (<Loading />)
                :
                (
                <MapView
                    ref={_map}
                    provider={Platform.OS === "android" ? "google" : undefined}
                    style={styles.map}
                    showsUserLocation={true}
                    initialRegion={newRegion}
                    onRegionChangeComplete={(region) => {
                        setNewDelta({latitudeDelta: region.latitudeDelta, longitudeDelta:region.longitudeDelta })
                    }}
                >
                    <UrlTile
                        urlTemplate={"https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=0a7d6a77a3f34d94a359058bd54f0857"}
                        maximumZ={19}
                        flipY={false}
                        zIndex={-1} 
                    />    
                   
                    {allObservations.map((marker, index) => {
                        const isSelected = index === mapIndex;
                        // Determine scale based on selection
                        const scale = Platform.OS === 'ios' ? (isSelected ? 1 : 0.75) : (isSelected ? 0.80 : 0.5);
                        
                        return (
                            <Marker
                                key={`${index}_${marker._id}`}
                                coordinate={{latitude: Number(marker.location?.coordinates[1]), longitude: Number(marker.location?.coordinates[0])}}
                                onPress={() => onMarkerPress(index)}
                                tracksViewChanges={false} // Android Optimization
                            >
                                <Animated.Image 
                                    style={[styles.pin, { transform: [{ scale }] }]}
                                    source={isSelected ? redPin : bluePin}
                                    resizeMode="contain"
                                /> 
                            </Marker>
                        )
                    })}
                </MapView>)}
                {/* 🔽 DROPDOWN FILTERS */}
                <View style={{position: 'absolute', left:10, top: 10}}>
                    <SelectList 
                        setSelected={setSelectedLocation}
                        data={locationsNames} 
                        placeholder={t('cerca')}
                        save="key"
                        search={false}
                        boxStyles={{ backgroundColor: '#FFF', height: 40, borderWidth: 0, minWidth: 190}}
                        dropdownStyles={{backgroundColor: '#FFF', borderWidth: 0, maxWidth:190}}
                    />
                </View>
                <View style={{position: 'absolute', right:10, top: 10}}>
                    <SelectList 
                        setSelected={setSelectedDay}
                        data={filterNames} 
                        placeholder={"3 "+t("dias")}
                        search={false}
                        save="key"
                        boxStyles={{border:'none', height: 40, borderWidth: 0, backgroundColor: '#FFF', minWidth: 120}}
                        dropdownStyles={{backgroundColor: '#FFF', borderWidth: 0, maxWidth:120}}
                    />
                </View>

                {isLoading && (
                    <View style={styles.loadingOverlay}>
                        <Loading /> 
                        {/* <ActivityIndicator size="large" color="#48a5e9" /> */}
                    </View>
                )}

                {/* 🃏 CARD LIST (Hidden during load to prevent jumps) */}
                {!isLoading && (
                    <Animated.ScrollView
                        ref={_scrollView}
                        horizontal
                        pagingEnabled
                        scrollEventThrottle={1}
                        showsHorizontalScrollIndicator={true}
                        snapToInterval={CARD_WIDTH + 20}
                        snapToAlignment={"center"}
                        style={styles.scrollView}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        contentInset={{
                            top: 0,
                            left: SPACING_FOR_CARD_INSET,
                            bottom: 0,
                            right: SPACING_FOR_CARD_INSET
                        }}
                        contentContainerStyle={{
                            paddingHorizontal: Platform.OS === 'android' ? SPACING_FOR_CARD_INSET : 0
                        }}
                    >
                        {allObservations.map((marker, index) => (
                            <View style={styles.card} key={index}>
                                {/* Image Logic */}
                                {marker.images.length > 0 ? (
                                  <Image 
                                    source={{uri:PULIC_BUCKET_URL+'/'+marker.directoryId+'/'+marker.images[0]}}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                  /> 
                                ) : (
                                  <Image 
                                    source={require('../../assets/images/backgrounds/no-image.jpg')}
                                    style={styles.cardImage}
                                    resizeMode="cover"
                                  /> 
                                )}
                                
                                <View style={styles.textContent}>
                                    <View style={[styles.obsIcons, {justifyContent: 'space-between'}]}>
                                        <Text numberOfLines={2} style={styles.cardtitle}>
                                            {(marker.title.length > 30 ? marker.title.substring(0, 30)+'...' : marker.title)}
                                        </Text>
                                        <Text style={styles.cardDescription}>
                                            {moment(marker.date).locale(mapI18nToMomentLocale(i18n.language)).format('Do MMMM YY')}
                                        </Text>
                                    </View> 
                                    
                                    {/* Observation Type Icons */}
                                    <View style={styles.obsIcons}>
                                        <Text numberOfLines={1} style={styles.cardDescription}>{t('tipoIObs')}:</Text>
                                        {marker.observationTypes.quick.status && (
                                            <Image source={require("../../assets/images/icons/buttonIcons/button-quick.png")} style={styles.obsIcon} resizeMode="cover"/>
                                        )}
                                        {marker.observationTypes.weather.status && (
                                            <Image source={require("../../assets/images/icons/buttonIcons/button-meteo.png")} style={styles.obsIcon} resizeMode="cover"/>
                                        )}
                                        {marker.observationTypes.snowpack.status && (
                                            <Image source={require("../../assets/images/icons/buttonIcons/button-snow.png")} style={styles.obsIcon} resizeMode="cover"/>
                                        )}
                                        {marker.observationTypes.accident.status && (
                                            <Image source={require("../../assets/images/icons/buttonIcons/button-accident.png")} style={styles.obsIcon} resizeMode="cover"/>
                                        )}     
                                        {marker.observationTypes.avalanche.status && (
                                            <Image source={require("../../assets/images/icons/buttonIcons/button-avalanche.png")} style={styles.obsIcon} resizeMode="cover"/>
                                        )}                                                                                          
                                    </View>
                                   
                                    <CustomButton text={t('view')}  
                                        bgColor={"#48a5e9"} 
                                        fgColor='white' 
                                        customStyle={{width: '100%', padding: 6, height: 30}}
                                        iconName={null} 
                                        onPress={() => {
                                          navigation.navigate('ObservationModal',{item: marker, modal: 'modal' });
                                        }} 
                                    />
                                </View> 
                            </View>
                        ))}
                    </Animated.ScrollView>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  safeContainer: {
      flex: 1,
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
  loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.5)', 
      zIndex: 100
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
    marginLeft: 5,
    height: 15,
    width: 30,
  },
  card: {
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
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
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
      }),
    },
});

export default ObservationsMap;