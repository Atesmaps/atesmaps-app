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
    Text,
    // TextInput,
    Image,
    TouchableOpacity,
    Keyboard,
    Platform,
  } from 'react-native';

// import {
//     //GoogleSignin,
//     GoogleSigninButton,
//     //statusCodes,
// } from '@react-native-google-signin/google-signin';
// import { appleAuthAndroid, AppleButton } from '@invertase/react-native-apple-authentication';
import { useTranslation } from 'react-i18next';


// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useForm, Controller } from "react-hook-form";

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../context/AuthContext';


import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";

const Stack = createNativeStackNavigator();

const Login: () => Node = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const { t } = useTranslation();

  const {login, 
         googleLogin, 
         appleLogin
  } = useContext(AuthContext);
  const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
    //defaultValues: preloadedValues
    defaultValues: {
        email: '',
        password: '',
    }
  });

  const submit = (data) => {
    console.log('performing login...');
    // console.log(data);
    login(data.email, data.password);
  }

  return(

      // <SafeAreaView style={{backgroundColor: '#dddddd',flex: 1, justifyContent: 'center'}}>
        <KeyboardAvoidingView style={{backgroundColor: '#dddddd',flex: 1, justifyContent: 'center'}} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{top: '-15%',paddingHorizontal: 25}}>
          {/* <View>
              <Text style={{fontSize: 28, fontWeight: '500', color: '#333', marginBottom: 25}}>Login</Text>
          </View> */}

          <View style={{top: '7%',justifyContent: 'center',alignItems: 'center'}}>
                <Image
                 style={{height: 330, width: 330}}
                 source={require('../../../assets/images/logos/logo-floc.jpg')}
                /> 
          </View>

          <CustomButton 
            text={t('googleLogin')} 
            //bgColor={"white"} 
            fColor='black'
            type='custom'
            customStyle={{ paddingLeft: '30%', marginVertical: 5,}}
            leftIconStyles={{marginTop: 1, width:12,height:15}}
            leftIconImage={require("../../../assets/images/icons/buttonIcons/google.png")}
            iconName={null} 
            onPress={googleLogin} 
          />
          {/* {appleAuthAndroid.isSupported || Platform.OS === 'ios' && ( */}
            <CustomButton 
              text={t('appleLogin')} 
              fColor='black'
              type='custom'
              customStyle={{ paddingLeft: '30%', marginVertical: 5,alignItems:'center'}}
              leftIconStyles={{marginTop: 0, width:12,height:15}}
              leftIconImage={require("../../../assets/images/icons/buttonIcons/apple.png")}
              iconName={null} 
              onPress={appleLogin} 
            /> 
          {/* )} */}

          <View style={styles.spacer}/>

          <CustomInput
            name="email"
            placeholder="Email"
            control={control}
            // customStyles={{width:"100%"}}
            keyboardType='email-address'
            rules={{required: t('userFormEmailRule')}}
            />

          <CustomInput
            name="password"
            placeholder="Password"
            control={control}
            // customStyles={{width:"100%"}}
            secureTextEntry={true}
            rules={{required: t('userFormPassRule')}}
            />
          <TouchableOpacity style={{alignItems: 'flex-end', marginBottom: 25}} onPress={() => {navigation.navigate('Forgot');}}>
                 <Text style={{color: '#3098CF', fontWeight: '700'  }}>{t('forgotPassButton')}</Text>
          </TouchableOpacity>
          <View style={{marginTop: 0}}>
                <CustomButton text={t('loginButton')} bgColor={"#3098CF"} fgColor='white' iconName={null} onPress={handleSubmit(submit)} />
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom:100}}>
            <Text> {t('createAccountText')}</Text>
            <TouchableOpacity onPress={() => {
              //navigation.popToTop();
              navigation.navigate('Register');
            }}>
                <Text style={{color: '#3098CF', fontWeight: '700'  }}> {t('createAccountButton')} </Text>
            </TouchableOpacity>
          </View>
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
    },
    spacer: {
      width: '100%',
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: 'gray',
      height: 1,
  },
  });

export default Login;