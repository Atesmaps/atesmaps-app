import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import type {Node} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    Modal,
    TouchableOpacity,
    Pressable,
    SafeAreaView,
    ActivityIndicator
  } from 'react-native';

import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { BASE_URL } from '../config';

import { AuthContext } from '../context/AuthContext';
import { ObservationContext } from '../context/ObservationContext';

import UserForm from '../components/UserForm';
// import { AccessControlTranslationFilterSensitiveLog } from '@aws-sdk/client-s3';
import  Snackbar  from "react-native-snackbar";
import { Layout } from 'react-native-reanimated';

import CustomButton from "../components/CustomButton";

// const Stack = createNativeStackNavigator();



const Profile: () => Node = () => {

const {logout, userDetails, setUserDetails,updateUser, userToken} = useContext(AuthContext);
const {setCurrentPage} = useContext(ObservationContext);
const {t} = useTranslation();
const [user, setUser] = useState(userDetails);
const [isLoading, setIsLoading] = useState(false);
const [modalVisible, setModalVisible] = useState(false);

// useLayoutEffect(() => {
//   console.log('refershing Layout...');
//   // setUser(userDetails);
// },[user]);

const sentData = async (id,data) => {
  setIsLoading(true);
  try {
    const response = await axios({
      method: "put",
      url: `${BASE_URL}/users/${id}`,
      data: data,
      //headers: { "Content-Type": "multipart/form-data" },
      headers: {"Authorization": `Bearer ${userToken}`}
    });
    //let response = await axios.post(`${BASE_URL}/users/${id}`,data,{ "Content-Type": "multipart/form-data" });
    // console.log('-----Performed a user updat to the API-----')
   
    if (response.status === 200){
      // updateUser(response.data);
      await AsyncStorage.setItem('userDetails', JSON.stringify(response.data));
      setUserDetails(response.data);
      // console.log(response.data.status);
      setIsLoading(false);
      Snackbar.show({
        text: data.blocked ? 'Cuenta eliminada correctamente' : 'Los datos se actualizaron correctamente.',
        duration: Snackbar.LENGTH_SHORT,
        numberOfLines: 2,
        textColor: "#fff",
        backgroundColor: "#62a256",
      });
    }
  } catch (error) {
    console.log('error triggered while sending data')
    console.log(error);
    setIsLoading(false);
    Snackbar.show({
      text: 'Ooops, algo fue mal.',
      duration: Snackbar.LENGTH_SHORT,
      numberOfLines: 2,
      textColor: "#fff",
      backgroundColor: "#B00020",
    });
  }
};



// useEffect(()=>{
//   console.log('user data updeted...');
// },[user]);


const onSubmit = (data) => {
  // console.log('submit data:')
  //console.log(data);
  setUser({...data});
  // let formData = new FormData(data);
  sentData(userDetails._id, data);

};

const handleDelete = () => {
  // console.log('submit data:')
  //console.log(data);
  sentData(userDetails._id, {blocked: true})
  logout();
  setCurrentPage(1);
  // setUser({...data});
  // let formData = new FormData(data);
  // sentData(userDetails._id, data);

};


if( isLoading ) {
  return(
      <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
          <ActivityIndicator size={'large'}/> 
      </View>
  )
}


return userDetails ? (
  <SafeAreaView style={styles.safeContainer}>
    <ScrollView style={styles.container}>
      <UserForm preloadedValues={user} onSubmit={onSubmit} onDelete={() => setModalVisible(!modalVisible)}/>
      {/*<View>
        <CustomButton text="Logout" bgColor={"#f00"} fgColor='white' iconName={null} onPress={() => {logout()}} />
      </View>*/}
      <View style={styles.space} />
      
    </ScrollView>
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{t('deleteAccountPopMessage')}</Text>
            <View>
              <CustomButton text={t('deleteAccountPopDeleteButton')} bgColor={"#B00020"} fColor='#fff' iconName={null} onPress={handleDelete} />
            </View>
            <View>
            <CustomButton text={t('deleteAccountPopBackButton')} bgColor={"#48a5e9"} fColor='#fff' iconName={null}  onPress={() => setModalVisible(!modalVisible)} />
            </View>
           
          </View>
        </View>
      </Modal>
  </SafeAreaView>
) : ( 
      <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
        <ActivityIndicator size={'large'}/> 
      </View>
)};



const styles = StyleSheet.create({
  safeContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      paddingBottom: 40
  },
  container: {
    flex: 1,
    padding: 15,
    
  },
  space: {
    height: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  // modelButtonsBox: {
  //   flexDirection: 'row',
  // }
});

export default Profile;