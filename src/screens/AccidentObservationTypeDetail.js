import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import type {Node} from 'react';
// import RadioButtonRN from 'radio-buttons-react-native';
import { useTranslation } from 'react-i18next';

import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ScrollView,
    useColorScheme,
    View,
    Button,
    Text,
    TextInput
} from 'react-native';

import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import CustomCheckbox from "../components/CustomCheckbox";
import Snackbar from "react-native-snackbar";


// import CheckBox from '@react-native-community/checkbox';
import { useForm, Controller } from "react-hook-form";

import { ObservationContext } from '../context/ObservationContext';

const AccidentObservationTypeDetail: () => Node = ({ route, navigation }) => {
const {t} = useTranslation();
const { editingObservation, selectedIndex, setEditingObservation, updateObservations  } = useContext(ObservationContext);
const [ accidentValues, setAccidentValues ] = useState(editingObservation.observationTypes?.accident ? editingObservation.observationTypes?.accident : {status: false, values: {}});
const [inputError, setInputError ] = useState(false);

const { control, handleSubmit, formState: { errors }, getValues, setValue, reset } = useForm({
    //defaultValues: preloadedValues
    defaultValues: {
        activityType: accidentValues.values.activityType ? accidentValues.values.activityType : null,
        accidentOrigin: accidentValues.values.accidentOrigin ? accidentValues.values.accidentOrigin : null,
        customActivityType: accidentValues.values.customActivityType ? accidentValues.values.customActivityType : null,
        numOfPeople: accidentValues.values.numOfPeople ? accidentValues.values.numOfPeople : null,
        numOfBuried: accidentValues.values.numOfBuried ? accidentValues.values.numOfBuried : null,
        numOfPartiallyBuried: accidentValues.values.numOfPartiallyBuried ? accidentValues.values.numOfPartiallyBuried : null,
        numOfInjured: accidentValues.values.numOfInjured ? accidentValues.values.numOfInjured : null,
        numOfSeverlyInjured: accidentValues.values.numOfSeverlyInjured ? accidentValues.values.numOfSeverlyInjured : null,
        numOfDead: accidentValues.values.numOfDead ? accidentValues.values.numOfDead : null,
        // terrainType: accidentValues.values.terrainType ? accidentValues.values.terrainType : null,
        crackDepth: accidentValues.values.crackDepth ? accidentValues.values.crackDepth : null,
        terrainTraps: accidentValues.values.terrainTraps ? accidentValues.values.terrainTraps : null,
        avalancheSize1: accidentValues.values.avalancheSize?.size_1 ? accidentValues.values.avalancheSize?.size_1 : null,
        avalancheSize2: accidentValues.values.avalancheSize?.size_2 ? accidentValues.values.avalancheSize?.size_2 : null,
        avalancheSize3: accidentValues.values.avalancheSize?.size_3 ? accidentValues.values.avalancheSize?.size_3 : null,
        avalancheSize4: accidentValues.values.avalancheSize?.size_4 ? accidentValues.values.avalancheSize?.size_4 : null,
        avalancheSize5: accidentValues.values.avalancheSize?.size_5 ? accidentValues.values.avalancheSize?.size_5 : null,
        comments: accidentValues.values.comments ? accidentValues.values.comments : null,
        contactMe: accidentValues.values.contactMe ? accidentValues.values.contactMe : null,
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
                text: t('close'),
                textColor: 'white',
                onPress: () => { /* Do something. */ },
            },
        });
    }
},[errors])

useEffect(() => {
    Snackbar.dismiss();
},[])

useLayoutEffect(() => {
    navigation.setOptions({
      // title: value === '' ? 'No title' : value,
      headerRight: () => (
        <Button
          onPress={() => {
            // console.log(getValues());
            console.log(errors);
            handleSubmit(updateData)();
           
            // navigation.navigate('Observación', {index, update:true})
          }}
          title={t('guardar')}
        />
      )
    });
    //TODO: Here we can dynamically change the header of the screen....
    //check documentation here: https://reactnavigation.org/docs/navigation-prop/#setparams
  }, [navigation]);



const updateData = () => {
    console.log('------Accident report---------');
    const values = getValues();

    if( values.activityType == 6 && (values.customActivityType === null || values.customActivityType == "")){
        setInputError(true);
        Snackbar.show({
            text: t('quickObsSnackBarText'),
            duration: Snackbar.LENGTH_SHORT,
            numberOfLines: 2,
            textColor: "#fff",
            backgroundColor: "#B00020",
        });
    }else{
        setInputError(false);
        let aux = {values: {}}

        aux['values'].activityType = values.activityType
        aux['values'].accidentOrigin = values.accidentOrigin
        
        aux['values'].customActivityType = values.customActivityType
        aux['values'].numOfPeople = values.numOfPeople
        aux['values'].numOfBuried = values.numOfBuried
        aux['values'].numOfPartiallyBuried = values.numOfPartiallyBuried
        aux['values'].numOfInjured = values.numOfInjured
        aux['values'].numOfSeverlyInjured = values.numOfSeverlyInjured
        aux['values'].numOfDead = values.numOfDead
        aux['values'].terrainType = values.terrainType
        aux['values'].terrainTraps = values.terrainTraps

        aux['values']['avalancheSize'] = {
            'size_1': values.avalancheSize1,
            'size_2': values.avalancheSize2,
            'size_3': values.avalancheSize3,
            'size_4': values.avalancheSize4,
            'size_5': values.avalancheSize5,
        }

        aux['values'].crackDepth = values.crackDepth
        aux['values'].comments = values.comments
        aux['values'].contactMe = values.contactMe
        
        aux.status = true;
    
        setAccidentValues(aux);
        
        let observation = editingObservation;
        observation.observationTypes['accident'] = aux; 
        setEditingObservation({...editingObservation, observationTypes: observation.observationTypes['quick']});
        updateObservations(observation);
        Snackbar.show({
            text: t('accidentObsSnackBarText2'),
            duration: Snackbar.LENGTH_SHORT,
            numberOfLines: 2,
            textColor: "#fff",
            backgroundColor: "#62a256",
        });
        navigation.navigate('Observación',{selectedIndex});
    }
}

const removeData = () => {
    let observation = editingObservation;
    observation.observationTypes['accident'] = {status: false, values: {}}; 
    setEditingObservation({...editingObservation, observationTypes: observation.observationTypes['accident']});
    updateObservations(observation);
    
    Snackbar.show({
        text: t('accidentObsSnackBarText'),
        duration: Snackbar.LENGTH_SHORT,
        numberOfLines: 2,
        textColor: "#fff",
        backgroundColor: "#B00020",
    });
    navigation.navigate('Observación',{selectedIndex});
}


//Activity options:
const activityData = [
    {label: t('skimo')},
    {label: t('freeride')},
    {label: t('escaladaApli')},
    {label: t('raquetasNieve')},
    {label: t('trek')},
    {label: t('otra')},
];

// Terrain options
// const terrainOptionsData = [
//     {label: 'Convexo: un puente'},
//     {label: 'Cóncavo: forma de cuenco'},
//     {label: 'Planar: liso sin convexidades o concavidades significativas'},
//     {label: 'Sin apoyo: una pendiente que cae abruptamente en la parte inferior'},
// ];

const terrainTrapOptions = [
    {label: t('sinAp')},
    {label: t('cortadoZanja')},
    {label: t('desnPend')},
    {label: t('arbol')},
    {label: t('barranco')},
]

const accidentOriginOptions = [
    {label: t('natural')},
    {label: t('accidental')},
]


return(
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <ScrollView >
            <View style={styles.container}>
                <View style={styles.introContainer} >
                    <Text style={styles.intro}>{t('obsAccid')}</Text> 
                    <Text style={styles.introSubtext}>{t('campos')}</Text>
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                     <CustomRadioButton 
                        name="activityType"
                        title={`${t('acti')}*:`}
                        control={control}
                        data={activityData}
                        rules={{required: t('requiredField')}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                    <CustomInput
                            name="customActivityType"
                            placeholder={t('otroTipo')}
                            control={control}
                            customError={inputError}
                            customStyles={{width:"100%"}}
                            // rules={getValues('activityType') == 6 ? {required: 'Indica actividad'} : null}
                            // onPress={showDatepicker}
                            />
                </View>
                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                     <CustomRadioButton 
                        name="accidentOrigin"
                        title={`${t('desencadenamiento')}*:`}
                        control={control}
                        data={accidentOriginOptions}
                        rules={{required: t('requiredField')}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                   
                </View>
                <View style={styles.formContainer} >
                <Text>{t('infoGrupo')}:</Text>
                <View style={styles.spacer}></View>
                    <View style={[styles.inputGroup, {flexDirection:'row'}]}>
                        <CustomInput
                            name="numOfPeople"
                            placeholder={t('persGrupo')}
                            control={control}
                            customStyles={{width:"100%",marginRight: 15}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    </View> 
                    <View style={styles.inputGroup}>
                        <CustomInput
                            name="numOfPartiallyBuried"
                            placeholder={t('persEnteParc')}
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    </View> 
                    <View style={styles.inputGroup}>
                        <CustomInput
                            name="numOfBuried"
                            placeholder={t('persEnteTot')}
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    </View> 
                    <View style={styles.inputGroup}>
                        <CustomInput
                            name="numOfInjured"
                            placeholder={t('persLesLeve')}
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    </View> 
                    <View style={styles.inputGroup}>
                        <CustomInput
                            name="numOfSeverlyInjured"
                            placeholder={t('persLesGrav')}
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    </View> 
                    <View style={styles.inputGroup}>
                        <CustomInput
                            name="numOfDead"
                            placeholder={t('fallecidos')}
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    </View> 
                </View>

                <View style={styles.formContainer} >
                <Text>{t('profCicatriz')}:</Text>
                <View style={styles.spacer}></View>
                <CustomInput
                    name="crackDepth"
                    placeholder="(cm)"
                    control={control}
                    customStyles={{width:"100%"}}
                    // rules={{required: 'Email is required'}}
                    // onPress={showDatepicker}
                    />
                </View> 
                {/* <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="terrainType"
                        title="Morfología del terreno en la zona de salida:"
                        control={control}
                        data={terrainOptionsData}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View> */}
                
                <View style={styles.formContainer} >
                    <View style={styles.spacer}></View>
                    {/* <View
                        style={[
                        styles.container,
                        { borderColor: errors.deepPowder ? 'red' : 'none',
                            borderWidth:  errors.deepPowder ? 1 : 0,
                            borderRadius: errors.deepPowder ? 5 : 0,
                            padding: errors.deepPowder ? 5 : 0
                        }
                        ]}
                    > */}

                    
                    <Text>{t('tamAva')}:</Text>
                    <Text style={{fontSize:12, color: 'gray', padding:5}}>{t('multiOpciones')}</Text>    
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="avalancheSize1"
                                        title={t('enteMin1')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="avalancheSize2" 
                                        title={t('entePers2')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 

                    <View style={styles.formGroup}>
                        <CustomCheckbox name="avalancheSize3"
                                        title={t('enteCoche3')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="avalancheSize4" 
                                        title={t('enteTren4')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="avalancheSize5"
                                        title={t('paisaje5')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />

                    </View> 
                </View>
                {/* {errors.deepPowder && (
                    <Text style={{color: 'red', alignSelf: 'stretch'}}>{errors.deepPowder?.message || 'Error'}</Text>
                )} 
                </View>*/}

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                     <CustomRadioButton 
                        name="terrainTraps"
                        title={`${t('trampas')}:`}
                        control={control}
                        data={terrainTrapOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />

                </View>
                <View style={styles.spacer}></View>
                
                <View style={styles.formContainer} >
                    
                    <Text>{t('otrasObs')}:</Text>
                
                    <CustomInput
                        name="comments"
                        control={control}
                        multiline={true}
                        numberOfLines={4}
                        customStyles={[styles.inputContainer, {height: '20%'}]}
                        placeholder={t('letrasMax')}
                        />
                       <View style={{width:'100%',flexDirection: 'row'}}>
                            <CustomCheckbox name="contactMe" 
                                            title={t('contacto')}
                                            control={control}  
                                            // customStyles={styles.inputContainer}
                                            // rules={{required: 'Campo obligatorio'}}
                            />
                      </View> 
                      <Text>{t('datosContacto')}</Text>

                        <View style={{marginTop: 30}}>
                            <CustomButton text={t('guardar')} bgColor={"#62a256"} fgColor='white' iconName={null} onPress={handleSubmit(updateData)} />
                        </View>
                        <View>
                            <CustomButton text={t('deleteData')} bgColor={"#B00020"} fgColor='white' iconName={null} onPress={removeData} />
                        </View>
                </View>
            </View>
            <View style={styles.space} />
        </ScrollView>
    </SafeAreaView>
)};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginBottom: 100
    },
    introContainer:{
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    formContainer:{
        padding: 10
    },
    intro: {
        padding:10,
        textAlign: 'left'
    },
    introSubtext:{
        color: 'gray',
        fontSize:12,
        paddingLeft:5,
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
    textArea: {
        borderColor: "gray",
        width: "100%",
        height:'20%',
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
    container: {
        width: '100%',
        borderColor: 'none',
        marginVertical: 5,
    }, 
    space: {
        height: 150,
    }
});

export default AccidentObservationTypeDetail;