import React, { useState, useEffect, useContext } from 'react';
// import type {Node} from 'react';
import  Snackbar  from "react-native-snackbar";
import { useTranslation } from 'react-i18next';

import {
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    Text,
    TouchableOpacity,
    SafeAreaView
  } from 'react-native';

//  import axios from 'axios';
//  import { BASE_URL } from '../config';

import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import CustomRadioButton from "../components/CustomRadioButton";
import RadioButtonRN from 'radio-buttons-react-native';

import { useForm, Controller } from "react-hook-form";

const UserForm = ({preloadedValues, onSubmit, onDelete}) => {
    // const [user, setUser] = useState(null);
    const { t } = useTranslation();
    const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
      //defaultValues: preloadedValues
      
      defaultValues: {
        username: preloadedValues?.username,
        name: preloadedValues?.name,
        lastName: preloadedValues?.lastName,
        email: preloadedValues?.email,
        // password: "",
        // passwordConfirmation: "",
        gender: Number(preloadedValues?.gender),
        age: Number(preloadedValues?.age),
        twitterProfile: preloadedValues?.twitterProfile,
        instagraProfile: preloadedValues?.instagraProfile,
        professionalOrientation: Number(preloadedValues?.professionalOrientation),
        snowEducationLevel: Number(preloadedValues?.snowEducationLevel),
        snowExperienceLevel: Number(preloadedValues?.snowExperienceLevel),
        avalanchExposure: Number(preloadedValues?.avalanchExposure),
        terrainType: Number(preloadedValues?.terrainType),
        conditionsType:Number(preloadedValues?.conditionsType),
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

    //Activity type:
    const genderOptions = [
        {label: t('mujer')},
        {label: t('hombre')},
        {label: t('binario')},
        {label: t('prefiero')}
    ]
    const [gender, setGender] = useState(false);

    const ageOptions = [
        {label: '15-30'},
        {label: '30-45'},
        {label: '45-60'},
        {label: '>60'}
    ]
     //Activity type:
     const carreerOptions = [
        {label: t('noTA')},
        {label: t('siTA')},
        {label: t('relTA')},
    ]
    const [carreer, setCarreer] = useState(false);

     //Activity type:
     const educationOptions = [
        {label: t('noformacion')},
        {label: t('nivel1')},
        {label: t('nivel2')},
        {label: t('nivelProf')},
    ]
    const [education, setEducation] = useState(false);


     //Activity type:
     const terrainExpirienceOptions = [
        {label: t('novel')},
        {label: t('aprendiente')},
        {label: t('experto')},
    ]
    const [terrainExpirience, setTerrainExpirience] = useState(false);

     //Activity type:
     const terrainFrequencyOptions = [
        {label: t('baja')},
        {label: t('mediana')},
        {label: t('alta')},
    ]
    const [terrainFrequency, setTerrainFrequency] = useState(false);

     //Activity type:
     const terrainTypeOptions = [
        {label: t('simple')},
        {label: t('exigente')},
        {label: t('complejo')},
    ]
    const [terrainType, setTerrainType] = useState(false);

     //Activity type:
     const conditionsOptions = [
        {label: t('grado1')},
        {label: t('grado3')},
        {label: t('grado4')},
    ]
    const [condition, setCondition] = useState(false);

    return(
       <>
            <Text style={styles.sectionTitle}>{t('datosUser')}</Text>
            <View style={styles.spacer}/>
            <View style={{marginTop: 10}}>
                
                <CustomInput
                  name="username"
                  placeholder= {t("namePlacehodler")}
                  control={control}
                  rules={{required: t('userFormNameRule')}}
                  // onPress={showDatepicker}
                />

                {preloadedValues?.email.includes('privaterelay.appleid.com') && (
                    <Text>Email privado</Text>
                )}
            
                <CustomInput
                  name="email"
                  placeholder="Email"
                  control={control}
                  rules={{required: t('userFormEmailRule')}}
                  secureTextEntry={preloadedValues?.email.includes('privaterelay.appleid.com')}
                  selectTextOnFocus={false}
                  editable={false}
                  // onPress={showDatepicker}
                />
               
    
                {/* <CustomInput
                  name="password"
                  placeholder="Password"
                  secureTextEntry={true}
                  control={control}
                  //rules={{required: {value: (getValues('password') != '') ,message: 'password is required'}}}
                  // onPress={showDatepicker}
                />
    
                <CustomInput
                  name="passwordConfirmation"
                  placeholder="Confrimación password"
                  secureTextEntry={true}
                  control={control}
                  //rules={{required: 'password is required'}}
                  // onPress={showDatepicker}
                /> */}
              </View>
              <Text style={[styles.sectionTitle,{marginTop: 30}]}>{t('datosPerson')}</Text>
              <View style={styles.spacer}/>
              <View style={{marginTop: 10}}>
                <Text>{t('nombre')}*</Text>
                <CustomInput
                    name="name"
                    placeholder={t('nombre')}
                    control={control}
                    rules={{required: t('userFormNameRule')}}
                   
                    // onPress={showDatepicker}
                />
        
                <Text>Apellidos*</Text>
                <CustomInput
                    name="lastName"
                    placeholder={t('apellidos')}
                    control={control}
                    rules={{required:t('userFormSurnameRule')}}
                    // onPress={showDatepicker}
                />

                <CustomRadioButton 
                    name="gender"
                    title={t('genero')}
                    control={control}
                    data={genderOptions}
                    // rules={{required: 'Genero is required'}}
                    box={false}
                    textColor={'black'}
                    circleSize={14}
                    
                />

                <CustomRadioButton 
                    name="age"
                    title={t('franjaEdad')}
                    control={control}
                    data={ageOptions}
                    // rules={{required: 'Genero is required'}}
                    box={false}
                    textColor={'black'}
                    circleSize={14}
                    
                />

                <Text style={{marginTop: 15}}>{t('userFormInstaTitle')}</Text>
                <CustomInput
                    name="instagraProfile"
                    placeholder={t('userFormInstaTitlePlacehodler')}
                    control={control}
                />

                <Text>{t('userFormXTitle')}</Text>
                <CustomInput
                    name="twitterProfile"
                    placeholder={t('userFormXTitlePlacehodler')}
                    control={control}
                />
                
                <Text style={[styles.sectionTitle,{marginTop: 30}]}>{t('tAExperiencia')}</Text>
                <View style={styles.spacer}/>
                <CustomRadioButton 
                    name="professionalOrientation"
                    title={t('profesion')}
                    control={control}
                    data={carreerOptions}
                    rules={{required: t('userFormProfession')}}
                    box={false}
                    textColor={'black'}
                    circleSize={14}
                    containerStyle={{marginTop: 10}}
                />

                <CustomRadioButton 
                    name="snowEducationLevel"
                    title={t('formacionTA')}
                    control={control}
                    data={educationOptions}
                   //rules={{required: 'Profesión is required'}}
                    box={false}
                    textColor={'black'}
                    circleSize={14}
                    containerStyle={{marginTop: 30}}
                />

                <CustomRadioButton 
                    name="snowExperienceLevel"
                    title={t('expTA')}
                    control={control}
                    data={terrainExpirienceOptions}
                   //rules={{required: 'Profesión is required'}}
                    box={false}
                    textColor={'black'}
                    circleSize={14}
                    containerStyle={{marginTop: 30}}
                />

                <CustomRadioButton 
                    name="avalanchExposure"
                    title={t('frecTA')}
                    control={control}
                    data={terrainFrequencyOptions}
                   //rules={{required: 'Profesión is required'}}
                    box={false}
                    textColor={'black'}
                    circleSize={14}
                    containerStyle={{marginTop: 30}}
                />

                <Text style={[styles.sectionTitle,{marginTop: 30}]}>{t('expRA')}</Text>
                <View style={styles.spacer}/>
                <CustomRadioButton 
                    name="terrainType"
                    title={t('tipoTerrenoAtes')}
                    control={control}
                    data={terrainTypeOptions}
                   //rules={{required: 'Profesión is required'}}
                    box={false}
                    textColor={'black'}
                    circleSize={14}
                    containerStyle={{marginTop: 10}}
                />

                <CustomRadioButton 
                    name="conditionsType"
                    title={t('conidicionesAludes')}
                    control={control}
                    data={conditionsOptions}
                   //rules={{required: 'Profesión is required'}}
                    box={false}
                    textColor={'black'}
                    circleSize={14}
                    containerStyle={{marginTop: 30}}
                />
               
              
            </View>
            <View style={{marginTop: 30}}>
                <CustomButton text={t('guardar')} bgColor={"#62a256"} fColor='white' iconName={null} onPress={handleSubmit(onSubmit)} />
            </View>
            <View style={{marginTop: 10}}>
                <CustomButton text={t('cancelar')} bgColor={"#B00020"} fColor='white' iconName={null} onPress={onDelete} />
            </View>
            </>
    )};

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
            marginBottom: 100
        },
        introContainer:{
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        formContainer:{
            padding: 10
        },
        intro: {
            padding:10,
            textAlign: 'left'
        },
        formGroup: {
            flex: 1,
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'flex-start',
          
        },
        checkboxGroup:{
            padding: 10,
            marginRight: 10,
            width: '30%',
            flex:1,
            flexDirection: 'row',
            // justifyContent: 'space-between',
            alignItems: 'center'
        },
        textInput: {
            borderColor: 'gray',
            borderWidth: 1,
          },
        spacer: {
            width: '100%',
            marginTop: 10,
            marginBottom: 10,
            backgroundColor: 'gray',
            height: 1,
        },
        inputContainer: {
            backgroundColor: 'white',
            width: '100%',
            borderColor: '#e8e8e8',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginVertical: 5,
        },
        input: {
            borderColor: "gray",
            width: "100%",
            height:'30%',
            paddingTop: 10,
            paddingBottom: 10,
        }, 
        sectionTitle: {
            fontSize: 20,
            fontWeight: '600',
        },
    });
      
      
export default UserForm;