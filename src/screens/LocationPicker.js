
import React, { useState, useEffect, useLayoutEffect, useContext, useRef } from 'react';
import type {Node} from 'react';

import {
    StyleSheet,
    View,
    Text,
    Image, 
    Platform,
    Button,
    TouchableOpacity,
  } from 'react-native';

import Svg from 'react-native-svg';

// import { HeaderBackButton } from '@react-navigation/elements';
//import { HeaderBackButton } from '@react-navigation/stack';
import  Snackbar  from "react-native-snackbar";
import MapView, {Marker, UrlTile} from 'react-native-maps';

import Geolocation from 'react-native-geolocation-service';

import Loading from '../components/Loading';


import { ObservationContext } from '../context/ObservationContext';
import { LocationContext } from '../context/LocationContext';

const LocationPicker: () => Node = ({ route, navigation }) => {

    const {LATITUDE_DELTA,LONGITUDE_DELTA} = useContext(LocationContext)
    const {editingObservation, setEditingObservation,updateObservations} = useContext(ObservationContext);
    const [pickedLocation, setPickedLocation]= useState({
      latitude: editingObservation.location?.latitude ? Number(editingObservation?.location?.latitude) : '' ,
      longitude: editingObservation.location?.longitude ? Number(editingObservation?.location?.longitude) : ''
    }); 
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newDelta, setNewDelta]=useState({latitude: 0.0220, longitude: 0.0170})
    const [newRegion, setNewRegion]=useState({latitude:Number(editingObservation.location.latitude),longitude:Number(editingObservation.location.longitude)}); 
    // const [ observation, setObservation ] = useState(observations[route.params?.index]);
    
    //const [marker, setMarker] = useState(null)


    const [marker, setMarker] = useState({
      coordinate: {latitude:Number(editingObservation.location?.latitude),longitude:Number(editingObservation.location?.longitude)},
      key: 1,
      color: '#ff0000'
    });
    // const map: LegacyRef<MapView> = useRef(null);

    useLayoutEffect( () => {
      navigation.setOptions({
        // title: value === '' ? 'No title' : value,
        headerRight: () => (
          <Button
            onPress={async () => {
              let index = route.params?.index;

              let observation = editingObservation;
              observation.location_update = true;
              observation.location = pickedLocation; 
              setEditingObservation(observation);
              updateObservations(observation);
              
              navigation.navigate('Observación', {index, update:true})

              Snackbar.show({
                text: 'Tu ubicación se ha guardado.',
                duration: Snackbar.LENGTH_SHORT,
                numberOfLines: 2,
                textColor: "#fff",
                backgroundColor: "#62a256",
            });
            }}
            title="Guardar"
          />
        )
        // headerRight: (props) => (
        //   <HeaderBackButton labelVisible={true} onPress={()=>{}}></HeaderBackButton>
        // )
      });
      //TODO: Here we can dynamically change the header of the screen....
      //check documentation here: https://reactnavigation.org/docs/navigation-prop/#setparams
    }, [navigation, pickedLocation]);

    useEffect(()=>{
        Geolocation.getCurrentPosition(
          //Will give you the current location
          (position) => {
            const newLocation = { ...position.coords, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
            setLocation(newLocation)
            if( !editingObservation.location_update ) {
              setNewRegion({latitude:Number(newLocation.latitude),longitude:Number(newLocation.longitude)});
              setMarker({
                coordinate: {latitude:Number(newLocation.latitude),longitude:Number(newLocation.longitude)},
                key: 1,
                color: '#ff0000'
              })
              setPickedLocation({latitude:Number(newLocation.latitude),longitude:Number(newLocation.longitude)});
            } 
            
            //setEditingObservation({...editingObservation, location: newLocation })          
            setIsLoading(false);
          },
          (error) => {
            console.log(error)
            setIsLoading(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 3000,
            maximumAge: 1000
          },
        );
    },[])



    const getMapRegion = () => {       
      return {latitude: newRegion.latitude ? newRegion.latitude : location?.latitude,
              longitude: newRegion.longitude ? newRegion.longitude : location?.longitude,
              latitudeDelta: newDelta.latitude,//pickedLocation.latitudeDelta ? pickedLocation.latitudeDelta : location?.latitudeDelta,
              longitudeDelta: newDelta.longitude//pickedLocation.longitudeDelta ? pickedLocation.longitudeDelta : location?.longitudeDelta,
            }
      
    };

    const onMapPress = (e) => {
        // console.log(e.nativeEvent)
        setMarker({
            coordinate: e.nativeEvent.coordinate,
            key: 1,
            color: '#ff0000'
        })
        setPickedLocation(e.nativeEvent.coordinate);
       // setNewRegion({latitude: e.nativeEvent.coordinate.latitude,longitude:e.nativeEvent.coordinate.longitude });
    }

   
    if( isLoading ) {
      return(
        <Loading />
      )
    }
    
return(
    <View style={styles.container}>
        <MapView
          // provider={this.props.provider}
          provider={Platform.OS == "android" ?  "google" : undefined}
          style={styles.map}
          showsUserLocation = {true}
          // mapType= {Platform.OS == "android" ? "terrain" : "satellite"}
          // initialRegion={{
          //   latitude: pickedLocation.latitude ? pickedLocation.latitude : location.latitude,
          //   longitude: pickedLocation.longitude ? pickedLocation.longitude : location.longitude,
          //   latitudeDelta: delta.latitude,//pickedLocation.latitudeDelta ? pickedLocation.latitudeDelta : location.latitudeDelta,
          //   longitudeDelta: delta.longitude//</View>pickedLocation.longitudeDelta ? pickedLocation.longitudeDelta : location.longitudeDelta,
          // }}
          onPress={onMapPress}
          onRegionChangeComplete={(region) => {
            setNewDelta({latitude: (region.latitudeDelta < 0.0170 ? 0.0170 : region.latitudeDelta),longitude:(region.longitudeDelta < 0.0200 ? 0.0200 : region.longitudeDelta) })
            setNewRegion({latitude: region.latitude,longitude:region.longitude })}
          }
          region={getMapRegion()}>
            <UrlTile
              /**
               * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
               * For example, http://c.tile.openstreetmap.org/{z}/{x}/{y}.png
               */
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
         { marker ? 
            <Marker
              key={marker.key}
              coordinate={marker.coordinate}
             
            >
              <Svg style={styles.pin} >
                <Image style={styles.pin}
                     source={require('../../assets/images/pins/atesmaps-blue.png')}/> 
              </Svg>
              {/* <Image style={styles.pin}
                     source={require('../../assets/images/pins/atesmaps-blue.png')}/> */}
            </Marker>
            : null
          }
        </MapView>
        {/* { marker || location ? 
        <View style={styles.topButtonContainer}>
          <TouchableOpacity
            onPress={() => setMarker(null)}
            style={styles.bubble}>
             <Text>{marker ? marker.coordinate.latitude : location.latitude}, {marker ? marker.coordinate.longitude : location.longitude}</Text>
          </TouchableOpacity>
        </View>
      : 
      null } */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setPickedLocation({latitude:location.latitude,longitude:location.longitude});
              setNewRegion({latitude: location.latitude,longitude:location.longitude });
              setMarker({
                coordinate: {latitude:location.latitude,longitude:location.longitude},
                key: 1,
                color: '#ff0000'
              });
            }}
            style={styles.bubble}>
            <Text>Borra selección</Text>
          </TouchableOpacity>
        </View>
      </View>
)};

const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    bubble: {
      backgroundColor: 'rgba(255,255,255,0.7)',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
    },
    button: {
      width: 80,
      paddingHorizontal: 12,
      alignItems: 'center',
      marginHorizontal: 10,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginVertical: 20,
      backgroundColor: 'transparent',
    },
    topButtonContainer: {
      flexDirection: 'row',
      marginVertical: 10,
      backgroundColor: 'transparent',
    },
    pin: {
      ...Platform.select({
        ios: {
          width: 42,
          height: 50,
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

export default LocationPicker;