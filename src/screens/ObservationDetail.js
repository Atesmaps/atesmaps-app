import React, {useState, useEffect, useLayoutEffect, useContext, useRef} from "react";
import { Text, View, ActivityIndicator, Button, Platform, ScrollView, StyleSheet, SafeAreaView, Keyboard } from "react-native";
import { HeaderBackButton } from '@react-navigation/elements'
import { useForm, Controller } from "react-hook-form";
import moment from 'moment';
import { useMomentLocale } from "../hooks/useMomentLocale";
import DateTimePicker from '@react-native-community/datetimepicker';
//import Geolocation from 'react-native-geolocation-service';

import axios from 'axios';
import fs from "react-native-fs";
const Base64Binary = require('base64-arraybuffer');
import { BASE_URL, PULIC_BUCKET_URL } from '../config';
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../aws/s3";

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

import { ObservationContext } from '../context/ObservationContext';
import { AuthContext } from '../context/AuthContext';
import { LocationContext } from '../context/LocationContext';
import  Snackbar  from "react-native-snackbar";
// import { UpdateIdentityPoolCommand } from "@aws-sdk/client-cognito-identity";
import { useTranslation } from "react-i18next";
import { useConnection } from '../hooks/useConnection';

export default function ObservationDetail({ route, navigation }) {
    const {t} = useTranslation();
     const isConnected = useConnection();
    const momentLocale = useMomentLocale();
    const {editingObservation,setEditingObservation, newObservation, selectedIndex, observations,setCurrentPage, setLastPage, getData, deleteObservation, updateObservations } = useContext(ObservationContext);
    const {userDetails,userToken} = useContext(AuthContext);
    const {currentLocation, LATITUDE_DELTA,LONGITUDE_DELTA,getOneTimeLocation } = useContext(LocationContext)

    
    const newObs = {
      title: '',
      date: Date.now(),
      location_update: false,
      location: {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude
      },
      directoryId: userDetails._id+moment().format('X'),
      observationTypes:{},
      whenObsTaken: null,
      images: [],
      status: 0,
      submitted: false,
    }
   
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(route.params?.index);
    const [update, setUpdate] = useState(route.params?.update);
    const [ observation, setObservation ] = useState(Object.keys(editingObservation).length === 0 ? newObs : editingObservation );

    // const [ location, setLocation] = useState(editingObservation.location);
    const [ locationError, setLocationError] = useState(false);

    const [rawDate, setRawDate] = useState(moment(observation.date).toDate());
    const [show, setShow] = useState(false);
    const [showAndroidDatePicker, setShowAndroidDatePicker] = useState(false);
    const [showAndroidTimePicker, setShowAndroidTimePicker] = useState(false);
    const dateTimeInput = useRef(null);
    // const [whenObsTaken, setWhenObsTaken] = useState(1);

  //   const obsTakenOptions = [
  //     {label: 'Durante la salida (sobre el terreno)'},
  //     {label: 'Immediatamente después de la salida (parquing)'},
  //     {label: 'Posteriormente (casa/refugio)'},
  // ]

    useEffect(()=>{
      if(Object.keys(editingObservation).length === 0){
        // setEditingObservation(observation)
        console.log(observation);
        newObservation(observation)
      }else{
        console.log(observation)
        console.log(editingObservation)
      }
      return function cleanup() {
        console.log('cleaning up observation Details ');
        setEditingObservation({});
        setObservation({});
        Snackbar.dismiss();
      };
    },[])
    
    useEffect(()=>{
      console.log('editing observation was updated...');
      console.log(editingObservation)
      setObservation(editingObservation);
      // setLocation(editingObservation.location);
      // setValue('location',formatLocation(editingObservation.location))
      setLocationError(false)
      setValue('location',checkLocation(editingObservation))
      setIsLoading(false);
    },[editingObservation]);

    const formatLocation = (locationDetails) =>{
      return locationDetails?.latitude + ', ' +locationDetails?.longitude;
    }

    const parseLocation = (locationString) => {
      return {latitude:Number(locationString.split(',')[0]), longitude: Number(locationString.split(',')[1])}
    }

    const uploadFile = async (image) => {
      const file = image.path; // Path to and name of object. For example '../myFiles/index.js'.
      const fileStream = await fs.readFile(file,'base64');
      const arrayBuffer = Base64Binary.decode(fileStream);
      
      let bucketParams = {
        Bucket: "atesmaps",
        ACL: 'public-read',
        Key: observation.directoryId + "/" + image.filename,
        Body: arrayBuffer
      };
      try {
        const data = await s3Client.send(new PutObjectCommand(bucketParams));
        //console.log(data);
        console.log(
          "Successfully uploaded object: " +
            bucketParams.Bucket +
            "/" +
            bucketParams.Key
        );
        return data;
      } catch (err) {
        console.log("Error", err);
      }
      //setIsLoading(false);
    }

    const sendData = async (id,data) => {
      setIsLoading(true);
      data.user = id;
      const aux_images = data.images;
      data.images = []
      aux_images.forEach(image => {
        data.images.push(image.filename);
      });
      try {
        const response = await axios({
          method: "post",
          url: `${BASE_URL}/observations`,
          data: data,
          //headers: { "Content-Type": "multipart/form-data" },
          headers: {"Authorization": `Bearer ${userToken}`}
        });
   
        if (response.status === 201){
            //console.log('uploading images...');
            aux_images.forEach(image => {
              uploadFile(image);
            });
            // console.log('cleaning local storage');
            // getData();
            getData(1);
            setLastPage(false);
            setCurrentPage(1);
            setObservation({});
            // setObservation({
            //   title: 'Has no title',
            //   date: Date.now(),
            //   location: {
            //     latitude: location.latitude,
            //     longitude: location.longitude
            //   },
            //   directoryId: userDetails._id+moment().format('X'),
            //   observationTypes:{},
            //   status: 0,
            //   images: [],
            //   submitted: false,
            // });
            setIsLoading(false);
            navigation.navigate('Mis Observaciones');
            deleteObservation();
            
          
            await analyticsService.logObservationCreate( userDetails._id, data.title);

            Snackbar.show({
              text: t('snackbarObservationText'),
              duration: Snackbar.LENGTH_SHORT,
              numberOfLines: 2,
              textColor: "#fff",
              backgroundColor: "#62a256",
            });
        }else{
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error.response.status);
        setIsLoading(false);
      }
    };
    
    const checkLocation = (observation) => {
      return observation.location_update ? formatLocation(observation.location) : t('ubiSelecciona')
    }

    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
      defaultValues: {
        title: observation.title,
        date: moment(observation.date).locale(momentLocale).format('Do MMMM YY - HH:mm'),
        location: checkLocation(observation),//formatLocation(observation.location),
        whenObsTaken: observation.whenObsTaken
      }
    });

    useEffect(()=>{
      if (errors && Object.keys(errors).length != 0) {         
          let errorsText = t('errorTitle');
          for (const key in errors) {
              errorsText += `${key}: ${errors[key]['message']} \n`
              // console.log(`${key}: ${errors[key]}`);
          }
          Snackbar.show({
              text: errorsText,
              duration: Snackbar.LENGTH_INDEFINITE,
              numberOfLines: 4,
              textColor: "#fff",
              backgroundColor: "#B00020",
              action: {
                text: 'Cerrar',
                textColor: 'white',
                onPress: () => { /* Do something. */ },
            },
          });
      }
    },[errors])

    useEffect(() => {
      getOneTimeLocation();
    },[])

    useLayoutEffect(() => {
      navigation.setOptions({
        // title: value === '' ? 'No title' : value,
        headerLeft:()=>(
          <HeaderBackButton 
            labelVisible={false}
            onPress={() => {
                navigation.goBack();
            }}>
          </HeaderBackButton>),
        headerRight: () => (
          <Button
            onPress={() => {
              // console.log(handleSubmit);
              onSave();
              // handleSubmit(onSave)();
              // let index = route.params?.index;
              // setEditingObservation({...editingObservation, location:pickedLocation});
              navigation.navigate('Mis Observaciones');
            }}
            title={t('guardar')}
          />
        )
      });

    }, [navigation, editingObservation, rawDate]);


    const onSave = () => {
      let obj = getValues(); 

      obj.date = moment(rawDate).format();
      obj.location = editingObservation.location_update ? parseLocation(obj.location) : {latitude: currentLocation.latitude,longitude: currentLocation.longitude};
      obj.images = editingObservation.images;
      obj.directoryId= editingObservation.directoryId;
      obj.observationTypes = editingObservation.observationTypes;
      obj.status = 0;
      obj.location_update = editingObservation.location_update;
      obj.observationTypes = editingObservation.observationTypes;
      console.log(obj) ;
      // setEditingObservation(obj);
      updateObservations(obj);
      // Snackbar.show({
      //   text: 'Los datos de tu observación se han guardado.',
      //   duration: Snackbar.LENGTH_SHORT,
      //   numberOfLines: 2,
      //   textColor: "#fff",
      //   backgroundColor: "#62a256",
      // });
    }

    const onSubmit = (data) => {
      console.log(editingObservation);
      if(!editingObservation.location_update){
        setLocationError(true)
        Snackbar.show({
          text: t('snackbarObservationRequired'),
          duration: Snackbar.LENGTH_SHORT,
          numberOfLines: 2,
          textColor: "#fff",
          backgroundColor: "#B00020",
        });
      }else if(editingObservation.observationTypes.quick?.status ||
        editingObservation.observationTypes.snowpack?.status ||
        editingObservation.observationTypes.avalanche?.status || 
        editingObservation.observationTypes.accident?.status || 
        editingObservation.observationTypes.weather?.status){
        //console.log('at least one report...')
       
        let obj = data;
   
        obj.directoryId= editingObservation.directoryId;
        obj.images = editingObservation.images;
        //TODO: check if date updates properly
        obj.date = moment(rawDate).format();
        
        obj.location = editingObservation.location;
        obj.observationTypes = editingObservation.observationTypes;
    
        sendData(userDetails._id,obj); 
  
      }else{
        Snackbar.show({
          text: t('snackbarObservationText3'),
          duration: Snackbar.LENGTH_SHORT,
          numberOfLines: 2,
          textColor: "#fff",
          backgroundColor: "#B00020",
        });
      } 
    }; 

   

    const onChange = (event, selectedDate) => {
      if(Platform.OS == "android"){
        if(showAndroidTimePicker) setShowAndroidTimePicker(false);
        if(showAndroidDatePicker) setShowAndroidDatePicker(false);          
      }else{
        setShow(false);
      }
      
      const currentDate = selectedDate;
      currentDate && setRawDate(currentDate);   
      setValue('date',moment(currentDate).locale(momentLocale).format('Do MMMM YY - HH:mm'))
    };

    const showDatepicker = () => {
      console.log('showing date picker...');
      // showMode('date');
      setShow(!show);
    };

    if( isLoading ) {
      return(
          <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
              <ActivityIndicator size={'large'}/> 
          </View>
      )
    }
    const plaformDateComponent = () =>{
    if (Platform.OS == "android") {
      return (
        <>
          <View style={{display: 'flex',  flexDirection: 'row', marginBottom: 5}}>
              <CustomButton text={t('obsDayTitle')}  
                            bgColor={"#48a5e9"} 
                            fgColor='white' 
                            customStyle={{width: '33%', marginRight: 15, padding: 11, height:40}}
                            iconName={null} 
                            onPress={() => {
                              console.log('photos library to be called');
                              setShowAndroidDatePicker(true);
                            }} />
              <CustomButton text={t('obsHourTitle')}  
                            customStyle={{width: '33%', marginRight: 15, padding: 11, height:40}}
                            bgColor={"#48a5e9"} 
                            fgColor='white' 
                            iconName={null}
                            onPress={() => {
                              console.log('photos library to be called');
                              setShowAndroidTimePicker(true);
                            }} />
            </View>
          {showAndroidDatePicker && (
            <View style={{display: 'flex',  flexDirection: 'row', marginBottom: 5}}>
              <DateTimePicker
                style={{ width: '43%'}}
                testID="datePicker"
                value={rawDate}
                mode='date'
                onChange={onChange}
              />
            </View>
          )}  

          {showAndroidTimePicker && (
            <View style={{display: 'flex',  flexDirection: 'row', marginBottom: 5}}>
                <DateTimePicker
                  style={{width: '43%'}}
                  testID="timePicker"
                  value={rawDate}
                  mode='time'
                  is24Hour={true}
                  onChange={onChange}
                />
              </View>
          )}  
        </>
      )
    }else{
      return (
        <>
          {show && (
            <View style={{display: 'flex',  flexDirection: 'row', marginBottom: 5}}>
              <DateTimePicker
                style={{ width: '43%'}}
                testID="datePicker"
                value={rawDate}
                mode='date'
                is24Hour={true}
                onChange={onChange}
              />
              <DateTimePicker
                style={{width: '33%'}}
                testID="timePicker"
                value={rawDate}
                mode='time'
                is24Hour={true}
                onChange={onChange}
              />
            </View>
          )} 
        </> 
      )
    }
  }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView style={styles.container}>
          <View style={styles.introContainer} >
            <Text style={styles.intro}>{t('infoBasica')}.</Text> 
          </View>
          <View style={styles.spacer}/>
          <CustomInput
            name="title"
            placeholder={t('lugar')}
            control={control}
            rules={{required: t('obsFormLocationValidationText')}}
          />
          <Text style={[styles.intro,{marginTop:10}]}>{t('fecha')}</Text>
          <CustomInput
            name="date"
            placeholder={moment().locale(momentLocale).format('Do MMMM YY - HH:mm')}
            control={control}
            rules={{required: t('obsFormDateValidationText')}}
            onPress={showDatepicker}
            blurOnTap={Platform.OS == "android" ? false : true}
            ref={dateTimeInput}
          />

          {plaformDateComponent()}

          <CustomButton 
            text={getValues("location")} 
            type="custom"
            order="top"
            fColor={locationError ? "red" : "gray"}
            bgColor={"#fff"}
            onPress={() => {
              navigation.navigate('Ubicación',{index, resetPin: true});
            }} 
          />

          {/* <CustomButton 
            text={`${t('foto')} (${editingObservation.images ? editingObservation.images.length : 0})`}
            type="custom"
            order="bottom"
            bgColor={"#fff"}
            fColor="gray"
            onPress={() => {
              console.log('photos library to be called');
              navigation.navigate('Imagenes',{index});
            }} 
          /> */}

          <CustomButton 
              text={isConnected 
                  ? `${t('foto')} (${editingObservation.images ? editingObservation.images.length : 0})`
                  : `${t('foto')} (${editingObservation.images ? editingObservation.images.length : 0})`  
              }
              type="custom"
              order="bottom"
              iconName={isConnected ? 'arrow-forward-ios' : 'block'}
              bgColor={isConnected ? "#fff" : "#e0e0e0"} 
              fColor={isConnected ? "gray" : "#a0a0a0"}
              disabled={!isConnected}
              onPress={() => {
                  if (isConnected) {
                      console.log('photos library to be called');
                      navigation.navigate('Imagenes', { index });
                  }
              }} 
          />

         {/* <CustomRadioButton 
                name="whenObsTaken"
                title="Publicación de la OBS:"
                control={control}
                data={obsTakenOptions}
                rules={{required: 'Debes indicar cuando realizaste la Observación'}}
                box={false}
                textColor={'black'}
                containerStyle={styles.radioButtonCointainer}
                circleSize={14}
            />*/}

          {/* <CustomButton 
              text={`Meteorología`}
              type="custom"
              order="bottom"
              bgColor={"#fff"}
              fColor="gray"
              onPress={() => {
                navigation.navigate('Tiempo');
              }} 
            /> */}

          <View style={{marginTop: 10}}>
              
            <Text style={{marginBottom: 5}}>{t('tipoIObs')}</Text>
            <CustomButton 
                text={t('rapida')}
                type="custom" 
                order="top" 
                // bgColor={"#48a5e9"} 
                bgColor={"#fff"}
                fColor="gray"
                // fColor='white' 
                iconName={observation.observationTypes?.quick?.status ?  "arrow-forward-ios" : "add-circle"} 
                leftIconImage={require("../../assets/images/icons/buttonIcons/button-quick.png")}
                onPress={() => navigation.navigate('Rapida')} />
              <CustomButton 
                text={t('meteo')}
                type="custom" 
                order="top" 
                // bgColor={"#48a5e9"} 
                bgColor={"#fff"}
                fColor="gray"
                // fColor='white' 
                iconName={observation.observationTypes?.weather?.status ?  "arrow-forward-ios" : "add-circle"} 
                leftIconImage={require("../../assets/images/icons/buttonIcons/button-meteo.png")}
                onPress={() => navigation.navigate('Tiempo')} />
            <CustomButton 
                text={t('avalancha')}
                type="custom" 
                order="middle" 
                bgColor={"#fff"} 
                fColor='gray' 
                leftIconImage={require("../../assets/images/icons/buttonIcons/button-avalanche.png")}
                iconName={observation.observationTypes?.avalanche?.status ?  "arrow-forward-ios" : "add-circle"} 
                onPress={() => navigation.navigate('Avalancha')} /> 
            <CustomButton 
                text={t('manto')}
                type="custom" 
                order="middle" 
                bgColor={"#fff"}
                fColor='gray' 
                leftIconImage={require("../../assets/images/icons/buttonIcons/button-snow.png")}
                iconName={observation.observationTypes?.snowpack?.status ?  "arrow-forward-ios" : "add-circle"} 
                onPress={() => navigation.navigate('Manto de nieve')} />
            <CustomButton 
                text={t('accidente')}
                type="custom" 
                order="bottom" 
                // bgColor={"#B00020"} 
                bgColor={"#fff"}
                fColor='gray' 
                leftIconImage={require("../../assets/images/icons/buttonIcons/button-accident.png")}
                iconName={observation.observationTypes?.accident?.status ?  "arrow-forward-ios" : "add-circle"} 
                onPress={() => navigation.navigate('Accidente')} /> 
            {/* <CustomButton text="Weather" type="custom" order="middle" bgColor={"#f5c144"} fgColor='white' iconName={"add-circle"} onPress={()=>{console.log('seting type Weather')}} />
            <CustomButton text="Incident" type="custom" order="bottom" bgColor={"#e15141"} fgColor='white' iconName={"add-circle"} onPress={()=>{console.log('seting type Incident')}} /> */}
          </View>
          <View style={{marginTop: 40}}>
            {/* <CustomButton 
                  // Cambiamos el texto para dar seguridad al usuario
                  text={isConnected ? t('subir') : t('guardarLocal')} 
                  
                  // Cambiamos el color a uno más neutro si está offline
                  bgColor={isConnected ? "#62a256" : "#808080"} 
                  fgColor='white' 
                  
                  // Mostramos un icono de guardado local si no hay red
                  iconName={isConnected ? null : "save"} 
                  
                  // Importante: No deshabilitamos este botón, pero cambiamos su lógica
                  onPress={handleSubmit(onSubmit)} 
                  
            
                  disabled={false} 
                /> */}
            <CustomButton text={t('subir')} disabled={!isConnected} iconName={null} bgColor={isConnected ? "#62a256" : "#808080"}  fgColor='white'  onPress={handleSubmit(onSubmit)} />
          </View>
          <View style={{marginBottom: 30}}>
            <CustomButton text={t('eliminar')}
                bgColor={"#B00020"} 
                fgColor='white' 
               
                iconName={null} 
                onPress={() => {
                  //let index = selectedIndex;
                  deleteObservation();
                  setObservation({});
                  // setObservation({
                  //   title: 'Has no title',
                  //   date: Date.now(),
                  //   location: {
                  //     latitude: location.latitude,
                  //     longitude: location.longitude
                  //   },
                  //   directoryId: userDetails._id+moment().format('X'),
                  //   observationTypes:{},
                  //   status: 0,
                  //   images: [],
                  //   submitted: false,
                  // });
                  navigation.navigate('Mis Observaciones');
                }} />
          </View>
       
       
          {/* <Text style={styles.status}> {keyboardStatus}</Text> */}
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({

  label:{ 
    fontWeight: 'bold', 
    fontSize: 15, 
    marginBottom: 5,
    marginTop: 5
  },

  introContainer:{
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
    padding: 15
  },
  errorText: {
    color: 'red',
    padding: 5
  },
  datePicker:{
    width: "100%",
  },
  status: {
    padding: 10,
    textAlign: "center"
  },
  safeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: Platform.OS == "android" ? 0 : 40
  },
  spacer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'gray',
    height: 1,
  },
  radioButtonCointainer: {
    backgroundColor: 'white',
    width: '100%',
    borderColor: '#e8e8e8',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  }
});