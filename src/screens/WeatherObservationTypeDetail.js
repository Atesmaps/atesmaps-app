import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import type {Node} from 'react';
// import RadioButtonRN from 'radio-buttons-react-native';

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

const WeatherObservationTypeDetail: () => Node = ({ route, navigation }) => {

const { editingObservation, selectedIndex, setEditingObservation, updateObservations  } = useContext(ObservationContext);
const [ weatherValues, setWeatherValues ] = useState(editingObservation.observationTypes?.weather ? editingObservation.observationTypes?.weather : {status: false, values: {}});

const { control, handleSubmit, formState: { errors }, getValues, setValue, reset } = useForm({
    //defaultValues: preloadedValues
    defaultValues: {
        skyCondition: weatherValues.values.skyCondition ? weatherValues.values.skyCondition : null,
        precipitationType: weatherValues.values.precipitationType ? weatherValues.values.precipitationType : null,
        snowIntensity: weatherValues.values.snowIntensity ? weatherValues.values.snowIntensity : null,
        rainIntensity: weatherValues.values.rainIntensity ? weatherValues.values.rainIntensity : null,
        temp: weatherValues.values.temp ? weatherValues.values.temp : null,
        maxTemp: weatherValues.values.maxTemp ? weatherValues.values.maxTemp : null,
        minTemp: weatherValues.values.minTemp ? weatherValues.values.minTemp : null,
        tempChange: weatherValues.values.tempChange ? weatherValues.values.tempChange : null,
        snowAccumulation: weatherValues.values.snowAccumulation ? weatherValues.values.snowAccumulation : null,
        snowAccumulation24: weatherValues.values.snowAccumulation24 ? weatherValues.values.snowAccumulation24 : null,
        rainAccumulation: weatherValues.values.rainAccumulation ? weatherValues.values.rainAccumulation : null,
        stormDate: weatherValues.values.stormDate ? weatherValues.values.stormDate : null,
        windSpeed: weatherValues.values.windSpeed ? weatherValues.values.windSpeed : null,
        windCarry: weatherValues.values.windCarry ? weatherValues.values.windCarry : null,
        windDirection: weatherValues.values.windDirection ? weatherValues.values.windDirection : null,
        orientationN: weatherValues.values?.orientation?.N ? weatherValues.values?.orientation?.N : null,
        orientationNE: weatherValues.values?.orientation?.NE ? weatherValues.values?.orientation?.NE : null,
        orientationE: weatherValues.values?.orientation?.E ? weatherValues.values?.orientation?.E : null,
        orientationSE: weatherValues.values?.orientation?.SE ? weatherValues.values?.orientation?.SE : null,
        orientationS: weatherValues.values?.orientation?.S ? weatherValues.values?.orientation?.S : null,
        orientationSO: weatherValues.values?.orientation?.SO ? weatherValues.values?.orientation?.SO : null, 
        orientationO: weatherValues.values?.orientation?.O ? weatherValues.values?.orientation?.O : null,
        orientationNO: weatherValues.values?.orientation?.NO ? weatherValues.values?.orientation?.NO : null,
        comments: weatherValues.values.comments ? weatherValues.values.comments : null,
    
    }
});

useEffect(()=>{
    if (errors && Object.keys(errors).length != 0) {
        let errorsText = 'Revisa los siguientes campos: \n';
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
    Snackbar.dismiss();
},[])

//NOTE: Here we can dynamically change the header of the screen....
//check documentation here: https://reactnavigation.org/docs/navigation-prop/#setparams
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
          title="Guardar"
        />
      )
    });
   
  }, [navigation]);



const updateData = () => {
    console.log('------Weather report---------');
    const values = getValues();
    // console.log(values);

    let aux = {values: {}}

    aux['values']['orientation'] = {
        'N': values.orientationN,
        'NE': values.orientationNE,
        'E': values.orientationE,
        'SE': values.orientationSE,
        'SO': values.orientationSO,
        'O': values.orientationO,
        'NO': values.orientationNO,
    } 

    aux['values'].snowIntensity = values.snowIntensity
    aux['values'].stormDate = values.stormDate
    aux['values'].precipitationType = values.precipitationType
    aux['values'].skyCondition = values.skyCondition
    aux['values'].rainIntensity = values.rainIntensity
    aux['values'].tempChange = values.tempChange
    aux['values'].temp = values.temp
    aux['values'].maxTemp = values.maxTemp
    aux['values'].minTemp = values.minTemp
    aux['values'].comments = values.comments
    aux['values'].windSpeed = values.windSpeed
    aux['values'].windCarry = values.windCarry
    aux['values'].snowAccumulation = values.snowAccumulation
    aux['values'].rainAccumulation = values.rainAccumulation
    aux['values'].snowAccumulation24 = values.snowAccumulation24

    aux.status = true;
 
    setWeatherValues(aux);
    
    let observation = editingObservation;
    observation.observationTypes['weather'] = aux; 
    setEditingObservation({...editingObservation, observationTypes: observation.observationTypes['weather']});
    updateObservations(observation);
    Snackbar.show({
        text: 'Tu observación del tiempo se ha guardado.',
        duration: Snackbar.LENGTH_SHORT,
        numberOfLines: 2,
        textColor: "#fff",
        backgroundColor: "#62a256",
    });
    navigation.navigate('Observación',{selectedIndex});
}

const removeData = () => {
    // console.log('------Quick report---------');
    // console.log("Delete Quick report observation...");  

   
    let observation = editingObservation;
    observation.observationTypes['weather'] = {status: false, values: {}}; 
    setEditingObservation({...editingObservation, observationTypes: observation.observationTypes['weather']});
    updateObservations(observation);
    
    // console.log(observation);
    // console.log('---------------------------');
    Snackbar.show({
        text: 'Tu observación del tiempo se ha eliminado.',
        duration: Snackbar.LENGTH_SHORT,
        numberOfLines: 2,
        textColor: "#fff",
        backgroundColor: "#B00020",
    });
    navigation.navigate('Observación',{selectedIndex});
}

//Riding conditions:
const skyConditionOptions = [
    {label: 'Despejado (0/8)'},
    {label: 'Pocas nubes (1/8-2/8)'},
    {label: 'Nubes dispersas (2/8-4/8)'},
    {label: 'Nubes rotas (5/8-7/8)'},
    {label: 'Nublado (8/8)'},
    {label: 'Niebla'},
];

const [skyCondition, setSkyCondition] = useState(weatherValues.values?.skyCondition);

//Activity type:
const precipitationTypeOptions = [
    {label: 'Nieve'},
    {label: 'Lluvia'},
    {label: 'Aguanieve'},
    {label: 'Ninguna'},
]

const [precipitationType, setPrecipitationType] = useState();

//Activity type:
const snowIntensityOptions = [
    {label: '<1'},
    {label: '1-5'},
    {label: '5-10'},
    {label: '>10'},
]

const [snowIntensity, setSnowIntensity] = useState();


//Activity type:
const rainIntensityOptions = [
    {label: 'Llovizna'},
    {label: 'Chubasco (abrupto)'},
    {label: 'Lluvia(constante)'},
    {label: 'Diluvio'},
]

const [rainIntensity, setRainIntensity] = useState();

//Activity type:
const tempChangeOptions = [
    {label: 'Cayó'},
    {label: 'Constante'},
    {label: 'Subió'},
]

const [tempChange, setTempChange] = useState();

const windSpeedOptions = [
    {label: 'Calma'},
    {label: 'Suave (1-25km/h)'},
    {label: 'Moderado (26-40km/h)'},
    {label: 'Fuerte (41-60km/h)'},
    {label: 'Extremo (>60km/h)'},
]

const [windSpeed, setWindSpeed] = useState();


const windCarryOptions = [
    {label: 'No'},
    {label: 'Suave'},
    {label: 'Moderado'},
    {label: 'Intensa'},
]

const [windCarry, setWindCarry] = useState();


return(
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <ScrollView >
            <View style={styles.container}>
                <View style={styles.introContainer} >
                    <Text style={styles.intro}>Incluye información sobre la precipitación, temperatura y viento;
                    así como los cambios que hayas percibido en los mismos.Rellena solamente aquellos campos de 
                    los que tengas informacion precisa</Text> 
                    <Text style={styles.introSubtext}> * campos obligatorios</Text>
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                     <CustomRadioButton 
                        name="skyCondition"
                        title="Estado del cielo*:"
                        control={control}
                        data={skyConditionOptions}
                        rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>
                
                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="precipitationType"
                        title="Tipo de precipitación*:"
                        control={control}
                        data={precipitationTypeOptions}
                        rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>
                  
                <View style={styles.formContainer} >
                   
                    <CustomRadioButton 
                        name="snowIntensity"
                        title="Intensidad precipitacion - Nieve (cm/hora):"
                        control={control}
                        data={snowIntensityOptions}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>
                
                            
                <View style={styles.formContainer} >
                  
                    <CustomRadioButton 
                        name="rainIntensity"
                        title="Intensidad precipitación - Lluvia:"
                        control={control}
                        data={rainIntensityOptions}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>

                <View style={styles.formContainer} >
                <View style={styles.spacer}></View>
                <Text>Temperatura en el momento de la observación:</Text>
                
                <View style={styles.inputGroup}>
                
                    <CustomInput
                        name="temp"
                        placeholder="º"
                        control={control}
                        customStyles={{width:"100%"}}
                        //   rules={{required: 'Email is required'}}
                        // onPress={showDatepicker}
                        />
                
                </View> 
                <Text>Temperatura máxima en las últimas 24h:</Text>
                <View style={styles.inputGroup}>
                
                    <CustomInput
                        name="maxTemp"
                        placeholder="º"
                        control={control}
                        customStyles={{width:"100%"}}
                        //   rules={{required: 'Email is required'}}
                        // onPress={showDatepicker}
                        />
                
                </View> 
                <Text>Temperatura mínima en las últimas 24h:</Text>
             
                    <View style={styles.inputGroup}>
                    
                        <CustomInput
                            name="minTemp"
                            placeholder="º"
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    
                    </View> 
               
                    

                    <CustomRadioButton 
                        name="tempChange"
                        title="Describe como la temperatura cambió en las últimas 3h:"
                        control={control}
                        data={tempChangeOptions}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>

                <View style={styles.formContainer} >
                <View style={styles.spacer}></View>
                <Text>Cantidad de nieve en las últimas 24h:</Text>
                
                    <View style={styles.inputGroup}>
                    
                        <CustomInput
                            name="snowAccumulation"
                            placeholder="(cm)"
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    
                    </View> 
                </View>

                <View style={styles.formContainer} >
                <Text>Combinación de lluvia y nieve total en las últimas 24h:</Text>
                    <View style={styles.inputGroup}>
                    
                        <CustomInput
                            name="rainAccumulation"
                            placeholder="(mm)"
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    
                    </View> 
                </View>

                <View style={styles.formContainer} >
                <Text>Cantidad de nieve de la nevada más reciente:</Text>
                    <View style={styles.inputGroup}>
                    
                        <CustomInput
                            name="snowAccumulation24"
                            placeholder="(cm)"
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    
                    </View> 
                </View>

                <View style={styles.formContainer} >
                <Text>Fecha del inicio de la tormenta:</Text>
                    <View style={styles.inputGroup}>
                    
                        <CustomInput
                            name="stormDate"
                            placeholder="dd/mm/yyyy"
                            control={control}
                            customStyles={{width:"100%"}}
                            //   rules={{required: 'Email is required'}}
                            // onPress={showDatepicker}
                            />
                    
                    </View> 
                </View>
                
                 
                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="windSpeed"
                        title="Velocidad del viento:"
                        control={control}
                        data={windSpeedOptions}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>

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
                    <Text>Orientación:</Text>
                    <Text style={{fontSize:12, color: 'gray', padding:5}}>Puedes marcar multiples opciones</Text>    
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="orientationN"
                                        title="N" 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="orientationNE" 
                                        title="NE"
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                         <CustomCheckbox name="orientationE" 
                                        title="E"
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 

                    <View style={styles.formGroup}>
                        <CustomCheckbox name="orientationSE"
                                        title="SE" 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="orientationS" 
                                        title="S"
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                         <CustomCheckbox name="orientationSO" 
                                        title="SO"
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                       
                    </View> 
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="orientationO"
                                        title="O" 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="orientationNO" 
                                        title="NO"
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                         <View style={styles.checkboxGroup}>
                            
                            </View>
                        
                       
                    </View> 
                  
                  
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="windCarry"
                        title="Transporte de nive por viento:"
                        control={control}
                        data={windCarryOptions}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}></View>
                    <Text>Otras observaciones:</Text>
                
                    <CustomInput
                        name="comments"
                        control={control}
                        multiline={true}
                        numberOfLines={4}
                        customStyles={[styles.inputContainer, {height: '20%'}]}
                        placeholder="1000 letras max"
                        />
                        <View style={{marginTop: 30}}>
                            <CustomButton text="Guardar" bgColor={"#62a256"} fgColor='white' iconName={null} onPress={handleSubmit(updateData)} />
                        </View>
                        <View>
                            <CustomButton text="Borrar datos" bgColor={"#B00020"} fgColor='white' iconName={null} onPress={removeData} />
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
        paddingBottom: 5,
        textAlign: 'left'
    },
    introSubtext:{
        color: 'gray',
        fontSize:12,
        paddingLeft:10,
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

export default WeatherObservationTypeDetail;