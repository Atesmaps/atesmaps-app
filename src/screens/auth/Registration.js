import React, { useState, useEffect, useContext } from 'react';
import type {Node} from 'react';

import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    Text,
    TextInput,
    TouchableOpacity
  } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../../context/AuthContext';

const Stack = createNativeStackNavigator();

const Registration: () => Node = () => {
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState(null);

  const {signUp} = useContext(AuthContext);

  return(
      <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <View style={{paddingHorizontal: 25}}>
          {/* <View>
              <Text style={{fontSize: 28, fontWeight: '500', color: '#333', marginBottom: 25}}>Register</Text>
          </View> */}


          <View style={{flexDirection: 'row', borderBottomColor:'#ccc', borderBottomWidth: 1, paddingBottom: 8, marginBottom: 25}}>
            <MaterialIcons name='person' size={20} color="#333" style={{marginRight: 5}}/>
            <TextInput 
              placeholder='User Name' 
              style={{flex: 1, paddingVertical: 0}} 
              value={userName}
              onChangeText={text => setUserName(text)} 
            />

          </View>
          <View style={{flexDirection: 'row', borderBottomColor:'#ccc', borderBottomWidth: 1, paddingBottom: 8, marginBottom: 25}}>
            <MaterialIcons name='alternate-email' size={20} color="#333" style={{marginRight: 5}}/>
            <TextInput 
              placeholder='Email' 
              style={{flex: 1, paddingVertical: 0}} 
              keyboardType='email-address'
              value={email}
              onChangeText={text => setEmail(text)} 
             />
          </View>
          <View style={{flexDirection: 'row', borderBottomColor:'#ccc', borderBottomWidth: 1, paddingBottom: 8, marginBottom: 25}}>
            <MaterialIcons 
              name='lock' 
              size={20} 
              color="#333" 
              style={{marginRight: 5}}/>
            <TextInput 
              
              placeholder='Password' 
              style={{flex: 1, paddingVertical: 0}} 
              secureTextEntry={true} 
              value={password}
              onChangeText={text => setPassword(text)} 
              />
              {/* <TouchableOpacity onPress={() => {}}>
                 <Text style={{color: '#3098CF', fontWeight: '700'  }}>Forgot?</Text>
              </TouchableOpacity> */}
          </View>
          <View style={{flexDirection: 'row', borderBottomColor:'#ccc', borderBottomWidth: 1, paddingBottom: 8, marginBottom: 25}}>
            <MaterialIcons 
              name='lock' 
              size={20} 
              color="#333" 
              style={{marginRight: 5}}/>
            <TextInput 
              
              placeholder='Password confirmation' 
              style={{flex: 1, paddingVertical: 0}} 
              secureTextEntry={true} 
              value={passwordConfirmation}
              onChangeText={text => setPasswordConfirmation(text)} 
            />
              {/* <TouchableOpacity onPress={() => {}}>
                 <Text style={{color: '#3098CF', fontWeight: '700'  }}>Forgot?</Text>
              </TouchableOpacity> */}
          </View>
          <TouchableOpacity style={{backgroundColor: '#3098CF', padding: 20, borderRadius:10, marginBottom: 20}} onPress={() => {signUp(userName, password, email)}}>
              <Text style={{textAlign:'center', color:'#fff', fontWeight: '700', fontSize: 17  }}>Register</Text>
          </TouchableOpacity>
          {/* <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 30}}>
            <Text>New to AtesMaps?</Text>
            <TouchableOpacity onPress={() => {}}>
                <Text style={{color: '#3098CF', fontWeight: '700'  }}>  Register</Text>
            </TouchableOpacity>
          </View> */}
        </View>
      </SafeAreaView>
 
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