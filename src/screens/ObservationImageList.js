import React, { useState, useEffect,useLayoutEffect, useContext, useRef } from 'react';
import type {Node} from 'react';

import {
    StatusBar,
    StyleSheet,
    Button,
    useColorScheme,
    Pressable,
    View,
    Text,
    FlatList,
    TouchableOpacity
  } from 'react-native';

// import fs from "react-native-fs";
const Base64Binary = require('base64-arraybuffer');

import { ObservationContext } from '../context/ObservationContext';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from "../components/CustomButton";
import Item from '../components/ImageItem';

// import BottomSheet from 'reanimated-bottom-sheet';

import Animated, 
{ useAnimatedStyle, 
  withSpring, 
  SlideInDown, 
  SlideOutDown, 
  FadeIn,
  FadeOut,
  useSharedValue,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
// import { PanGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/panGesture';
//import { baseGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon';

// import {PULIC_BUCKET_URL} from '../config'
// import { ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
// import { s3Client } from "../aws/s3";
// import { createIconSetFromFontello } from 'react-native-vector-icons';
// import { set } from 'react-hook-form';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const HEIGHT = 320;
const OVERDRAG = 20;

const ObservationImagesList: () => Node = ({ route, params, navigation }) => {

const { editingObservation,setEditingObservation,observations, selectedIndex, updateObservations  } = useContext(ObservationContext);
const [images, setImages] = useState(editingObservation.images ? editingObservation.images : []);
const [isOpen, setOpen] = useState(false);
const [image, setImage] = useState(null);
const [isLoading, setIsLoading] = useState(false);

// console.log(editingObservation);

const sheetRef = useRef();
//const fall = new Animated.Value(1);
const offset = useSharedValue(0);


const toggleSheet = () => {
  setOpen(!isOpen);
  offset.value = 0;
}

const translateY = useAnimatedStyle(() => ({
  transform: [{translateY: offset.value}], 
}));

const pan = Gesture.Pan().onChange((event)=>{
  const offsetDelta = event.changeY + offset.value;
  const clamp = Math.max(-OVERDRAG, offsetDelta);
  offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp); 
})
.onFinalize(()=>{
  if (offset.value < HEIGHT / 3){
    offset.value = withSpring(0);
  }else{
    offset.value = withTiming(HEIGHT, {}, () => {
      runOnJS(toggleSheet)();
    });
  }
})

useLayoutEffect(() => {
 
  navigation.setOptions({
    // title: value === '' ? 'No title' : value,
   
    headerRight:() => (
            <Pressable
              onPress={async ()  => {
                console.log('mostrar imagepicker....');
                //sheetRef.current.snapTo(0); 
                setOpen(true);
                }}
            >
              <MaterialCommunityIcons size={25} 
                                    color={'#307df6'} 
                                    name="camera-plus"/>
            </Pressable>),
    headerLeft:()=>(
      <Button
            onPress={() => {
              console.log('updating images list for observation')
              let aux = editingObservation;
              aux.images = images;
          
              
              setEditingObservation({...aux});
              updateObservations({...aux});
              //navigation.navigate('Observación', {selectedIndex, update:true})
              navigation.goBack();
            }}
            title="Guardar"
          />
    )
  });
  
  //TODO: Here we can dynamically change the header of the screen....
  //check documentation here: https://reactnavigation.org/docs/navigation-prop/#setparams
}, [navigation, images]);

const takePhotoFromCamera = () => {
  ImagePicker.openCamera({
    compressImageMaxWidth: 300,
    compressImageMaxHeight: 300,
    cropping: true,
    compressImageQuality: 0.7
  }).then(chosenImage => {
    // console.log(chosenImage.filename)
    // console.log(chosenImage.path.split("/").pop())
    const filename = chosenImage.path.split("/").pop()
    setImages( (arr) => { return [...arr, {path: chosenImage.path, filename: filename}]});
    //sheetRef.current.snapTo(1);
    toggleSheet();
  });
}

const deleteImage = (index) => {
  let aux = images;
  aux.splice(index, 1);
  setImages([...aux]);
}

const choosePhotoFromLibrary = async () => {
  ImagePicker.openPicker({
    width: 300,
    height: 300,
    cropping: true,
    compressImageQuality: 0.7
  }).then(chosenImage => {
    // console.log(chosenImage.filename)
    // console.log(chosenImage.path.split("/").pop())
    const filename = chosenImage.path.split("/").pop()
    setImages( (arr) => { return [...arr, {path: chosenImage.path, filename: filename}]});
    //sheetRef.current.snapTo(1);
    toggleSheet();
  });
}

const renderContent = 
  <View
    style={{
      backgroundColor: 'white',
      padding: 16,
      height: 450,
      zIndex: -1,
    }}
  >
    <View style={{alignItems: 'center'}}>
      <Text style={styles.panelTitle}>Cargar Foto</Text>
      <Text style={styles.panelSubtitle}>Sube imagenes de la observación</Text>
    </View>
    <CustomButton 
          text="Take Photo" 
          type="tertiary"
          onPress={takePhotoFromCamera}
          iconName = {null}
        />
    <CustomButton 
        text="Choose From Library" 
        type="tertiary"
        iconName = {null}
        onPress={choosePhotoFromLibrary} 
      />
    <CustomButton 
        text="Cancel" 
        type="tertiary"
        iconName = {null}
        onPress={() => {
          //sheetRef.current.snapTo(1)
          toggleSheet();
        }} 
      />
  </View>
;

const renderHeader = () => (
  <View style={styles.header}>
    <View style={styles.panelHeader}>
      <View style={styles.panelHandle} />
    </View>
  </View>
);

if(images?.length > 0){
  return(
    <>
    <View style={[styles.listContainer]}>
      <FlatList
          data={images}
          renderItem={({ item, index, path, directory }) => <Item item={item} index={index} deleteItem={deleteImage} navigation={navigation}/>}
          keyExtractor={(item,index) => index}
          />
    </View>
    {isOpen && (
    <GestureHandlerRootView>
      <AnimatedPressable 
        style={styles.backdrop} 
        entering={FadeIn} 
        exiting={FadeOut} 
        onPress={toggleSheet} />
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.sheet, translateY]} 
          entering={SlideInDown.springify().damping(15)} 
          exiting={SlideOutDown}
        >
        {renderContent}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
    )}
    {/* <BottomSheet
          ref={sheetRef}
          snapPoints={[330, -100]}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteration={true}
          borderRadius={10}
          renderContent={renderContent}
          renderHeader={renderHeader}
        /> */}
 </>
  )
}


return(
  <>
    <View style={[styles.container]}>
         <MaterialIcons 
            // name='add-a-photo'
            name='collections'
            size={50} 
            color={'gray'}
            style={{marginBottom: 20}}/>
        <Text>No se ha subido ninguna imagen.</Text>
        <Button style={styles.button} 
          title="Añadir imagen" 
          onPress={() => {
            console.log('mostrar imagepicker....');
            //sheetRef.current.snapTo(0); 
            toggleSheet();
          }} />
        {/* <TouchableOpacity style={{backgroundColor: '#3098CF', padding: 20, borderRadius:10, marginBottom: 20}} onPress={() => {console.log('buttons pressed....')}}>
          <Text style={{textAlign:'center', color:'#fff', fontWeight: '700', fontSize: 17  }}>Añadir image</Text>
        </TouchableOpacity> */}
    </View>
    {isOpen && (
    <GestureHandlerRootView>
      <AnimatedPressable 
        style={styles.backdrop} 
        entering={FadeIn} 
        exiting={FadeOut} 
        onPress={toggleSheet} 
      />
       <GestureDetector gesture={pan}>
      <Animated.View style={[styles.sheet, translateY]} 
        entering={SlideInDown.springify().damping(15)}
        exiting={SlideOutDown}
      >
   
       {renderContent}
      </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
    )}
    
    {/* <BottomSheet
          ref={sheetRef}
          snapPoints={[330, -100]}
          initialSnap={1}
          callbackNode={fall}
          enabledGestureInteration={true}
          borderRadius={10}
          renderContent={renderContent}
          renderHeader={renderHeader}
        /> */}
 </>
   
)};

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    listContainer: {
      flex: 1,
     // paddingTop: 15
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -1},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      // elevation: 5,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    backdrop:{
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      zIndex: 1,
    },
    sheet: {
      backgroundColor: "white",
      padding: 16,
      height: HEIGHT,
      width: "100%",
      position: "absolute",
      bottom: -OVERDRAG * 1.1,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      zIndex: 1,
    },
  });

export default ObservationImagesList;