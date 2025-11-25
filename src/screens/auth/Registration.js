import React, { useState, useEffect, useContext } from 'react';
import type {Node} from 'react';

import {
    // SafeAreaView,
    // StatusBar,
    StyleSheet,
    // useColorScheme,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    View,
    // Text,
    Image,
    // TextInput,
    // TouchableOpacity,
    Keyboard,
  } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../context/AuthContext';
import  Snackbar  from "react-native-snackbar";

import { useForm, Controller } from "react-hook-form";
import { useTranslation } from 'react-i18next';


const Stack = createNativeStackNavigator();

const Registration: () => Node = () => {
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState(null);
  const { t } = useTranslation();

  const {signUp} = useContext(AuthContext);

  const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
    //defaultValues: preloadedValues
    defaultValues: {
        userName: '',
        email: '',
        emailConfirmation: '',
        password: '',
        passwordConfirmation: ''
    }
  });

  const submit = (data) => {
    console.log('performing Registration...');
    // console.log(data);

    if(data.password != data.passwordConfirmation) {
      console.log('password is different...');
      Snackbar.show({
          text: t('registrationSnackbarError1'),
          duration: Snackbar.LENGTH_SHORT,
          numberOfLines: 2,
          textColor: "#fff",
          backgroundColor: "#B00020",
      });
      return null;
    }
    if(data.email != data.emailConfirmation) {
      console.log('emails is different...');
      Snackbar.show({
          text: t('registrationSnackbarError2'),
          duration: Snackbar.LENGTH_SHORT,
          numberOfLines: 2,
          textColor: "#fff",
          backgroundColor: "#B00020",
      });
      return null;
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)){
      signUp(data.userName, data.password, data.email);
    }else{
      Snackbar.show({
        text: t('registrationSnackbarError3'),
        duration: Snackbar.LENGTH_SHORT,
        numberOfLines: 2,
        textColor: "#fff",
        backgroundColor: "#B00020",
      });
      return null;
    }
  }


  return(
      // <SafeAreaView style={{backgroundColor: '#dddddd',flex: 1, justifyContent: 'center'}}>
      <KeyboardAvoidingView  style={{backgroundColor: '#dddddd',flex: 1, justifyContent: 'center'}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}  >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{top: '-25%',paddingHorizontal: 25}}>
          {/* <View>
              <Text style={{fontSize: 28, fontWeight: '500', color: '#333', marginBottom: 25}}>Register</Text>
          </View> */}

          <View style={{top: '10%',justifyContent: 'center',alignItems: 'center'}}>
                <Image
                style={{height: 335, width: 335}}
                 source={require('../../../assets/images/logos/logo-floc.jpg')}
                /> 
          </View>

          <CustomInput
            name="userName"
            placeholder={t('userNamePlacehoder')}
            control={control}
            // customStyles={{width:"100%"}}
            rules={{required: t('requiredFieldUsernameText')}}
            // onPress={showDatepicker}
            />

          <CustomInput
            name="email"
            placeholder="Email"
            keyboardType='email-address'
            control={control}
            // customStyles={{width:"100%"}}
            rules={{required: t('requiredEmail')}}

            // onPress={showDatepicker}
            />

          <CustomInput
            name="emailConfirmation"
            placeholder={t('emailConfirmationPlaceholder')}
            keyboardType='email-address'
            control={control}
            // customStyles={{width:"100%"}}
            rules={{required: t('requiredEmailConfirmationText')}}

            // onPress={showDatepicker}
            />

          <CustomInput
            name="password"
            placeholder="Password"
            control={control}
            secureTextEntry={true}
            // customStyles={{width:"100%"}}
            rules={{required: t('requiredFieldPasswordText')}}

            // onPress={showDatepicker}
            />

          <CustomInput
            name="passwordConfirmation"
            placeholder={t('passwordConfirmationPlaceholder')}
            control={control}
            secureTextEntry={true}
            // customStyles={{width:"100%"}}
            rules={{required: t('requiredPasswordConfirmationText')}}

            // onPress={showDatepicker}
            />

          {/* <View style={{flexDirection: 'row', borderBottomColor:'#ccc', borderBottomWidth: 1, paddingBottom: 8, marginBottom: 25}}>
            <MaterialIcons name='person' size={20} color="#333" style={{marginRight: 5}}/>
            <TextInput 
              placeholder='User Name' 
              style={{flex: 1, paddingVertical: 0}} 
              value={userName}
              onChangeText={text => setUserName(text)} 
            />

          </View> */}
          
    
          <View style={{marginTop: 0}}>
                <CustomButton text={t('sendButton')} bgColor={"#3098CF"} fgColor='white' iconName={null} onPress={handleSubmit(submit)} />
            </View>
          {/* <TouchableOpacity style={{backgroundColor: '#3098CF', padding: 20, borderRadius:10, marginBottom: 20}} onPress={() => {signUp(userName, password, email)}}>
              <Text style={{textAlign:'center', color:'#fff', fontWeight: '700', fontSize: 17  }}>Register</Text>
          </TouchableOpacity> */}
          {/* <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
            <Text>New to AtesMaps?</Text>
            <TouchableOpacity onPress={() => {}}>
                <Text style={{color: '#3098CF', fontWeight: '700'  }}>  Register</Text>
            </TouchableOpacity>
          </View> */}
        </View>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      // </SafeAreaView>
 
)};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
  });

export default Registration;