import React, {useState, useEffect, useContext} from "react";
import { Text, View, TextInput, Button, Alert, StyleSheet, Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import moment from 'moment';

import DateTimePicker from '@react-native-community/datetimepicker';

import axios from 'axios';
import { BASE_URL } from '../config';

import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";

import { ObservationContext } from '../context/ObservationContext';
import { AuthContext } from '../context/AuthContext';

export default function ObservationDetail({ route, navigation }) {
    const {editingObservation, observations, updateObervations } = useContext(ObservationContext);
    const {userDetails,userToken} = useContext(AuthContext);

    const [index, setIndex] = useState(route.params?.index);
    const [update, setUpdate] = useState(route.params?.update);

    const [ observation, setObservation ] = useState(editingObservation);
    const [ location, setLocation] = useState(editingObservation.location);

    const [rawDate, setRawDate] = useState(moment(observation.date).toDate());
    const [show, setShow] = useState(false);
    

    const formatLocation = (locationDetails) =>{
      return locationDetails.latitude + ', ' +locationDetails.longitude;
    }

    const sentData = async (id,data) => {
      
      try {
        const response = await axios({
          method: "post",
          url: `${BASE_URL}/observations`,
          data: data,
          //headers: { "Content-Type": "multipart/form-data" },
          headers: {"Authorization": `Bearer ${userToken}`}
        });
        //let response = await axios.post(`${BASE_URL}/users/${id}`,data,{ "Content-Type": "multipart/form-data" });
       // console.log('-----Performed a user updat to the API-----')
        //console.log(response);
      } catch (error) {
        //console.log('error triggered while sending data')
        console.log(error);
      }
    };
    

    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
      defaultValues: {
        title: observation.title,
        date: moment(observation.date).format('MMMM Do YYYY, hh:mm:ss'),
        location: formatLocation(location),
      }
    });

    // React.useLayoutEffect(() => {
    //   // navigation.setOptions({
    //   //   title: value === '' ? 'No title' : value,
    //   // });
    //   //TODO: Here we can dynamically change the header of the screen....
    //   //check documentation here: https://reactnavigation.org/docs/navigation-prop/#setparams
    // }, [navigation]);


    
    const onSubmit = (data) => {
     
      let obj = data;
      obj.date = moment(rawDate).format();
      obj.location = location;
      obj.observationTypes = editingObservation.observationTypes;
     
      updateObervations(obj,index);
      console.log(obj);
      console.log('----- BEGGIN Generation From data ------ ')
      let formData = new FormData(obj);
      console.log(formData);
      console.log('----- END Generation From data ------ ')
      sentData(userDetails.userId,obj);
    }; 

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setRawDate(currentDate);      
      setValue('date',moment(currentDate).format('MMMM Do YYYY, hh:mm:ss'))
    };

    const showDatepicker = () => {
      // console.log('showing date picker...');
      // showMode('date');
      setShow(!show);
    };

    useEffect(()=>{
      console.log('Observation has been updated');
      editingObservation.user = userDetails.userId;
      setObservation(editingObservation);
     // console.log(observation);
    },[editingObservation]);

    useEffect(()=>{
      setLocation(editingObservation.location);
      setValue('location', formatLocation(editingObservation.location));
      route.params={index}
    },[route.params?.update]);
  

    return (
  
        <View style={styles.container}>
          <CustomInput
            name="title"
            placeholder="Titulo"
            control={control}
            rules={{required: 'Title is required'}}
          />
          
          <CustomInput
            name="date"
            placeholder={moment().format('MMMM Do YYYY, hh:mm:ss')}
            control={control}
            rules={{required: 'Date is required'}}
            onPress={showDatepicker}
          />
        
        {/* <CustomButton 
            text="Date" 
            type="TERTIARY"
            onPress={showDatepicker}
          /> */}

        {show && (
          
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <DateTimePicker
              style={{ width: '43%',}}
              testID="datePicker"
              value={rawDate}
              mode='date'
              is24Hour={true}
              onChange={onChange}
            />
            <DateTimePicker
              style={{width: '33%'}}
              testID="TimePicker"
              value={rawDate}
              mode='time'
              is24Hour={true}
              onChange={onChange}
            />
          </View>
        )}  

          {/* <CustomInput
            name="location"
            placeholder={'Ubicación'}
            control={control}
            rules={{required: 'Ubicación is required'}}
            onPress={() => navigation.navigate('Location Picker')}
          />  */}

          <CustomButton 
            text={'Ubicación: '+ getValues("location")} 
            type="custom"
            fColor="gray"
            onPress={() => {
              navigation.navigate('Location Picker',{index, resetPin: true});
            }} 
          />

          <CustomButton 
            text="Fotos" 
            type="custom"
            fColor="gray"
            onPress={() => {
              console.log('photos library to be called');
              navigation.navigate('Imagenes',{index});
            }} 
          />

          <View style={{marginTop: 50}}>
              
            <Text style={{marginBottom: 10, fontWeight:'bold'}}>Observaciones</Text>
            <CustomButton text="Quick" type="custom" order="top" bgColor={"#48a5e9"} fColor='white' iconName={observation.observationTypes.quick?.status ?  "arrow-forward-ios" : "add-circle"} onPress={() => navigation.navigate('Rapida')} />
            <CustomButton text="Avalanche" type="custom" order="middle" bgColor={"#4062ff"} fColor='white' iconName={observation.observationTypes.avalanche?.status ?  "arrow-forward-ios" : "add-circle"} onPress={() => navigation.navigate('Avalancha')} />
            <CustomButton text="Snowpack" type="custom" order="bottom" bgColor={"#48a5e9"} fColor='white' iconName={"add-circle"} onPress={() => navigation.navigate('Manto de nieve')} />
            {/* <CustomButton text="Weather" type="custom" order="middle" bgColor={"#f5c144"} fgColor='white' iconName={"add-circle"} onPress={()=>{console.log('seting type Weather')}} />
            <CustomButton text="Incident" type="custom" order="bottom" bgColor={"#e15141"} fgColor='white' iconName={"add-circle"} onPress={()=>{console.log('seting type Incident')}} /> */}
          </View>
          <View style={{marginTop: 50}}>
            <CustomButton text="Submit" bgColor={"#62a256"} fgColor='white' iconName={null} onPress={handleSubmit(onSubmit)} />
          </View>
       
          {/* <Text style={styles.status}> {keyboardStatus}</Text> */}
        </View>
      
    );
}

const styles = StyleSheet.create({

  label:{ 
    fontWeight: 'bold', 
    fontSize: 15, 
    marginBottom: 5,
    marginTop: 5
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
  }
});