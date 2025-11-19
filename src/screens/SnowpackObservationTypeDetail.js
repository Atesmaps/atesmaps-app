import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import type {Node} from 'react';
import { useTranslation } from 'react-i18next';

import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ScrollView,
    useColorScheme,
    Button,
    View,
    Text,
    TextInput
} from 'react-native';

import  Snackbar  from "react-native-snackbar";

import CustomInput from "../components/CustomInput";
import CustomRadioButton from "../components/CustomRadioButton";
import CustomButton from "../components/CustomButton";

import CustomCheckbox from "../components/CustomCheckbox";

import { useForm, Controller } from "react-hook-form";

import { ObservationContext } from '../context/ObservationContext';

const SnowpackObservationTypeDetail: () => Node = ({ route, navigation }) => {
   
    const {t} = useTranslation();

    useLayoutEffect(() => {
        navigation.setOptions({
          // title: value === '' ? 'No title' : value,
          headerRight: () => (
            <Button
              onPress={() => {
                console.log('Saving quick observation on local storage....');
                // console.log(getValues());
                // console.log(errors);
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

const { editingObservation, selectedIndex, setEditingObservation,updateObservations  } = useContext(ObservationContext);
const [snowpackValues, setSnowpackValues] = useState(editingObservation.observationTypes?.snowpack ? editingObservation.observationTypes?.snowpack : {status: false, values: {}});


const { control, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
    defaultValues: {
        // range_1: snowpackValues.values.altitudeRange?.range_1 ? snowpackValues.values.altitudeRange?.range_1 : null,
        // range_2: snowpackValues.values.altitudeRange?.range_2 ? snowpackValues.values.altitudeRange?.range_2 : null,
        // range_3: snowpackValues.values.altitudeRange?.range_3 ? snowpackValues.values.altitudeRange?.range_3 : null,
        // range_4: snowpackValues.values.altitudeRange?.range_4 ? snowpackValues.values.altitudeRange?.range_4 : null,
        altitude: snowpackValues.values?.altitude ? snowpackValues.values?.altitude : null,
        geoAccuracy: snowpackValues.values?.geoAccuracy ? snowpackValues.values?.geoAccuracy : null,
        altitudeRange1: snowpackValues.values?.altitudeRange?.range_1 ? snowpackValues.values?.altitudeRange?.range_1 : null,
        altitudeRange2: snowpackValues.values?.altitudeRange?.range_2 ? snowpackValues.values?.altitudeRange?.range_2 : null,
        altitudeRange3: snowpackValues.values?.altitudeRange?.range_3 ? snowpackValues.values?.altitudeRange?.range_3 : null,
        altitudeRange4: snowpackValues.values?.altitudeRange?.range_4 ? snowpackValues.values?.altitudeRange?.range_4 : null,
        orientationN: snowpackValues.values?.orientation?.N ? snowpackValues.values?.orientation?.N : null,
        orientationNE: snowpackValues.values?.orientation?.NE ? snowpackValues.values?.orientation?.NE : null,
        orientationE: snowpackValues.values?.orientation?.E ? snowpackValues.values?.orientation?.E : null,
        orientationSE: snowpackValues.values?.orientation?.SE ? snowpackValues.values?.orientation?.SE : null,
        orientationS: snowpackValues.values?.orientation?.S ? snowpackValues.values?.orientation?.S : null,
        orientationSO: snowpackValues.values?.orientation?.SO ? snowpackValues.values?.orientation?.SO : null, 
        orientationO: snowpackValues.values?.orientation?.O ? snowpackValues.values?.orientation?.O : null,
        orientationNO: snowpackValues.values?.orientation?.NO ? snowpackValues.values?.orientation?.NO : null,
        depth: snowpackValues.values?.depth ? snowpackValues.values?.depth : null,
        observationType: snowpackValues.values?.observationType ? snowpackValues.values?.observationType : null,
        woumpfs:snowpackValues.values?.woumpfs ? snowpackValues.values?.woumpfs : null, 
        cracks:snowpackValues.values?.cracks ? snowpackValues.values?.cracks : null, 
        snowType:snowpackValues.values?.snowType ? snowpackValues.values?.snowType : null, 
        footPenetration:snowpackValues.values?.footPenetration ? snowpackValues.values?.footPenetration : null,
        skiPenetration:snowpackValues.values?.skiPenetration ? snowpackValues.values?.skiPenetration : null,
        handTest:snowpackValues.values?.handTest ? snowpackValues.values?.handTest : null, 
        compresionTest:snowpackValues.values?.compresionTest ? snowpackValues.values?.compresionTest : null,
        extensionTest:snowpackValues.values?.extensionTest ? snowpackValues.values?.extensionTest : null,
        fractureType1:snowpackValues.values?.fractureType?.type_1 ? snowpackValues.values?.fractureType?.type_1 : null,
        fractureType2:snowpackValues.values?.fractureType?.type_2 ? snowpackValues.values?.fractureType?.type_2 : null,
        fractureType3:snowpackValues.values?.fractureType?.type_3 ? snowpackValues.values?.fractureType?.type_3 : null,
        fractureType4:snowpackValues.values?.fractureType?.type_4 ? snowpackValues.values?.fractureType?.type_4 : null,
        fractureType5:snowpackValues.values?.fractureType?.type_5 ? snowpackValues.values?.fractureType?.type_5 : null,
        fractureType6:snowpackValues.values?.fractureType?.type_6 ? snowpackValues.values?.fractureType?.type_6 : null,
        fractureType1:snowpackValues.values?.fractureTypeCt?.type_1 ? snowpackValues.values?.fractureTypeCt?.type_1 : null,
        fractureType2:snowpackValues.values?.fractureTypeCt?.type_2 ? snowpackValues.values?.fractureTypeCt?.type_2 : null,
        fractureType3:snowpackValues.values?.fractureTypeCt?.type_3 ? snowpackValues.values?.fractureTypeCt?.type_3 : null,
        fractureType4:snowpackValues.values?.fractureTypeCt?.type_4 ? snowpackValues.values?.fractureTypeCt?.type_4 : null,
        fractureType5:snowpackValues.values?.fractureTypeCt?.type_5 ? snowpackValues.values?.fractureTypeCt?.type_5 : null,
        fractureType6:snowpackValues.values?.fractureTypeCt?.type_6 ? snowpackValues.values?.fractureTypeCt?.type_6 : null,
        fractureDepthCt:snowpackValues.values?.fractureDepthCt ? snowpackValues.values?.fractureDepthCt : null,
        fractureDepth:snowpackValues.values?.fractureDepth ? snowpackValues.values?.fractureDepth : null,
        layerHardness:snowpackValues.values?.layerHardness ? snowpackValues.values?.layerHardness : null,
        weakLayerHardness:snowpackValues.values?.weakLayerHardness ? snowpackValues.values?.weakLayerHardness : null,
        snowHumidity:snowpackValues.values?.snowHumidity ? snowpackValues.values?.snowHumidity : null, 
        layerSnowType1:snowpackValues.values?.layerSnowType?.type_1 ? snowpackValues.values?.layerSnowType?.type_1 : null,
        layerSnowType2:snowpackValues.values?.layerSnowType?.type_2 ? snowpackValues.values?.layerSnowType?.type_2 : null,
        layerSnowType3:snowpackValues.values?.layerSnowType?.type_3 ? snowpackValues.values?.layerSnowType?.type_3 : null,
        layerSnowType4:snowpackValues.values?.layerSnowType?.type_4 ? snowpackValues.values?.layerSnowType?.type_4 : null,
        layerSnowType5:snowpackValues.values?.layerSnowType?.type_5 ? snowpackValues.values?.layerSnowType?.type_5 : null,
        layerSnowType6:snowpackValues.values?.layerSnowType?.type_6 ? snowpackValues.values?.layerSnowType?.type_6 : null,
        comments:snowpackValues.values?.comments ? snowpackValues.values?.comments : null,
    }
});

useEffect(()=>{
    if (errors && Object.keys(errors).length != 0) {
        let errorsText = t('errorTitle')
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

const removeData = () => {
    // console.log('------Snowpack report---------');
    // console.log("Delete Snowpack report observation...");  
    let observation = editingObservation;
    observation.observationTypes['snowpack'] = {status: false, values: {}}; 
    setEditingObservation({...editingObservation, observationTypes: observation.observationTypes['snowpack']});
    updateObservations(observation);
    // console.log(observation);
    // console.log('---------------------------');
    Snackbar.show({
        text: t('snowObsSnackBarText'),
        duration: Snackbar.LENGTH_SHORT,
        numberOfLines: 2,
        textColor: "#fff",
        backgroundColor: "#B00020",
    });
    navigation.navigate('Observación',{selectedIndex});
}

const updateData = () => {
    // console.log('------Quick report---------');
    const values = getValues();
    // console.log(values);
    let aux = {values: {}}

    // aux['values'].observationType= values.observationType;

    aux['values'].altitude= values.altitude;

    aux['values']['altitudeRange'] = {
        'range_1': values.altitudeRange1,
        'range_2': values.altitudeRange2,
        'range_3': values.altitudeRange3,
        'range_4': values.altitudeRange4,
    }
    aux['values']['orientation'] = {
        'N': values.orientationN,
        'NE': values.orientationNE,
        'E': values.orientationE,
        'SE': values.orientationSE,
        'SO': values.orientationSO,
        'O': values.orientationO,
        'NO': values.orientationNO,
    }
    
    aux['values']['layerSnowType'] = {
        'type_1': values.layerSnowType1,
        'type_2': values.layerSnowType2,
        'type_3': values.layerSnowType3,
        'type_4': values.layerSnowType4,
        'type_5': values.layerSnowType5,
        'type_6': values.layerSnowType6,
    }

    aux['values']['fractureType'] = {
        'type_1': values.fractureType1,
        'type_2': values.fractureType2,
        'type_3': values.fractureType3,
        'type_4': values.fractureType4,
        'type_5': values.fractureType5,
        'type_6': values.fractureType6,
    }

    aux['values']['fractureTypeCt'] = {
        'type_1': values.fractureType1Ct,
        'type_2': values.fractureType2Ct,
        'type_3': values.fractureType3Ct,
        'type_4': values.fractureType4Ct,
        'type_5': values.fractureType5Ct,
        'type_6': values.fractureType6Ct,
    }

    aux['values'].depth= values.depth;
    aux['values'].woumpfs= values.woumpfs;
    aux['values'].sounds= values.sounds;
    aux['values'].cracks= values.cracks;
    aux['values'].snowType= values.snowType;
    aux['values'].snowHumidity= values.snowHumidity;
    aux['values'].footPenetration= values.footPenetration;
    aux['values'].skiPenetration= values.skiPenetration;

    aux['values'].handTest= values.handTest;
    aux['values'].compresionTest= values.compresionTest;
    aux['values'].extensionTest= values.extensionTest;
    aux['values'].geoAccuracy= values.geoAccuracy;
    
    // aux['values'].fractureType= values.fractureType;
    aux['values'].fractureDepth= values.fractureDepth;
    aux['values'].fractureDepthCt= values.fractureDepthCt;
    aux['values'].layerHardness= values.layerHardness;
    aux['values'].weakLayerHardness= values.weakLayerHardness;
    aux['values'].comments= values.comments;
    

    aux.status = true;
    
    // console.log(aux.status);
    setSnowpackValues(aux);
    
    let observation = editingObservation;
    observation.observationTypes['snowpack'] = aux; 
    setEditingObservation({...editingObservation, observationTypes: observation.observationTypes['snowpack']});
    updateObservations(observation);
    // console.log("Value updated...");
    // console.log('---------------------------');
    navigation.navigate('Observación',{selectedIndex});
    Snackbar.show({
        text: t('snowObsSnackBarText2'),
        duration: Snackbar.LENGTH_SHORT,
        numberOfLines: 2,
        textColor: "#fff",
        backgroundColor: "#62a256",
    });
    navigation.navigate('Observación',{selectedIndex});
}

const accuracyOptions = [
        {label: t('exacta')},
        {label: t('bastantePrecisa')},
        {label: t('pocoPrecia')},
    ];

// const triggerOptions = [
//         {label: 'Accidental'},
//         {label: 'Natural'},
//         {label: 'Artificial'},
//     ];

const booleanOptions = [
        {label: t('si')},
        {label: t('no')},
    ];

const windExposureOptions = [
        {label: t('sotavento')},
        {label: t('sobrevento')},
        {label: t('cargaHumeda')},
        {label: t('sinExpoViento')},
    ];

const cmtOptions = [
        {label:  t('muyFacil')},
        {label:  t('facil')},
        {label:  t('moderado')},
        {label:  t('dificil')},
        {label:  t('noConcluyente')},
    ];

const  snowTypeOptions= [
        {label: t('nueva')},
        {label: t('crosta')},
        {label: t('facetas')},
        {label: t('granoFino')},
        {label: t('variable')},
    ];

const ctOptions = [
        {label: t('hits1')},
        {label: t('hits2')},
        {label: t('hits3')},
        {label: t('noConcluyente')},
    ];

const ectOptions = [
        {label: t('propagación')},
        {label: t('sinPropagación')},
        {label: t('noConcluyente')},
    ];

// const fractureOptions = [
//         {label: 'Subito/Colapso'},
//         {label: 'Subita/Planar'},
//         {label: 'Resistente/Planar'},
//         {label: 'Progresiva/Colapso'},
//         {label: 'Irregular'},
//     ];

const hardnessOptions = [
        {label: t('hardnessTest1')},
        {label: t('hardnessTest2')},
        {label: t('hardnessTest3')},
        {label: t('hardnessTest4')},
        {label: t('hardnessTest5')},
        {label: t('hardnessTest6')}
    ]

const humidityOptions = [
        {label: t('secaBola')},
        {label: t('humedaBola')},
        {label: t('mojadaGuanteNo')},
        {label: t('mojadaGuante')},
        {label: t('slush')},
     
    ]

const obsTypeOptions = [
        {label: t('singular')},
        {label: t('sintesis')},
    ];
    


return(
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <ScrollView >
            <View style={styles.container}>
                <View style={styles.introContainer} >
                    <Text style={styles.intro}>{t('estabManto')} </Text> 
                    <Text style={styles.introSubtext}>{t('campos')}</Text>
                </View>
                {/* <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                     <CustomRadioButton 
                        name="observationType"
                        title="Observación singular o síntesis de la salida?*"
                        control={control}
                        data={obsTypeOptions}
                        rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View> */}
                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="geoAccuracy"
                        title={t('geoloc')}
                        control={control}
                        data={accuracyOptions}
                        // rules={{required: 'Campo obligatorio'}}
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
                     <Text>{t('franjaAlti')}:</Text>
                    {/*<View style={styles.formGroup}>
                        <CustomCheckbox name="altitudeRange1"
                                        title="< 2.000m" 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="altitudeRange2" 
                                        title="2.000 - 2.300 m"
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                       
                    </View> 

                    <View style={styles.formGroup}>
                        <CustomCheckbox name="altitudeRange3"
                                        title="> 2.300 m" 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="altitudeRange4" 
                                        title="superior a 2.400 m"
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                       
                    </View>   */}
                    <CustomInput
                        name="altitude"
                        placeholder={t('cotaAlti')}
                        control={control}
                        // rules={{required: 'Title is required'}}
                    />      
                </View>
                {/* {errors.deepPowder && (
                    <Text style={{color: 'red', alignSelf: 'stretch'}}>{errors.deepPowder?.message || 'Error'}</Text>
                )} 
                </View>*/}

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
                    <Text style={{fontSize:12, color: 'gray', padding:5}}>{t('multiOpciones')}</Text>    
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
                {/* {errors.deepPowder && (
                    <Text style={{color: 'red', alignSelf: 'stretch'}}>{errors.deepPowder?.message || 'Error'}</Text>
                )} 
                </View>*/}

                <View style={styles.formContainer} >
                <View style={styles.spacer}></View>
                    <Text>{t('profManti')}:</Text>
                    <CustomInput
                        name="depth"
                        placeholder="(cm)"
                        control={control}
                        // rules={{required: 'Title is required'}}
                    />       
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                   
                    <CustomRadioButton 
                        name="woumpfs"
                        title={t('woumps')}
                        control={control}
                        data={booleanOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
               
                </View>

                <View style={styles.formContainer} >
               
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="cracks"
                        title={t('obsPropa')}
                        control={control}
                        data={booleanOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>

            
                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    {/* <CustomRadioButton 
                        name="layerSnowType"
                        title="Nieve en superfície"
                        control={control}
                        data={snowTypeOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    /> */}
                    <Text>{t('nieveSup')}:</Text>
                    <Text style={{fontSize:12, color: 'gray', padding:5}}>Puedes marcar multiples opciones</Text>    
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="layerSnowType1"
                                        title={t('nueva')} 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="layerSnowType2" 
                                        title={t('crosta')} 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="layerSnowType3"
                                        title={t('escarcha')} 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="layerSnowType4" 
                                        title={t('facetas')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="layerSnowType5"
                                        title={t('granoFino')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="layerSnowType6" 
                                        title={t('variable')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}></View>
                    <Text>{t('penetracionPie')}:</Text>
                    <CustomInput
                        name="footPenetration"
                        placeholder="(cm)"
                        control={control}
                        // rules={{required: 'Title is required'}}
                    />   
                </View>
            
                <View style={styles.formContainer} >
                    <View style={styles.spacer}></View>
                    <Text>{t('penetracionEsqui')}:</Text>
                    <CustomInput
                        name="skiPenetration"
                        placeholder="(cm)"
                        control={control}
                        // rules={{required: 'Title is required'}}
                    />   
                </View>

                

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="handTest"
                        title={t('testCizalla')}
                        control={control}
                        data={cmtOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                    {/* <Text>Test Cizalla de mano</Text>
                        <RadioButtonRN
                            textColor={'black'}
                            circleSize={14}
                            data={cmtOptions}
                            initial={handTest ? handTest : null}
                            box={false}
                            selectedBtn={(e) => {
                                setHandTest(cmtOptions.map(object => object.label).indexOf(e.label)+1);
                            }}
                            /> */}
                </View>

                <View style={styles.formContainer} >
                    <CustomRadioButton 
                        name="compresionTest"
                        title={t('cTTest')}
                        control={control}
                        data={ctOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                    
                </View>
                <View style={styles.formContainer} >
                    {/* <CustomRadioButton 
                        name="fractureType"
                        title="Tipo de fractura"
                        control={control}
                        data={fractureOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    /> */}
                    <Text>{t('tipoFracturaCT')}:</Text>
                    <Text style={{fontSize:12, color: 'gray', padding:5}}>Puedes marcar multiples opciones</Text>    
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="fractureType1Ct"
                                        title={t('colapsoSubito')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="fractureType2Ct" 
                                        title={t('planarSubito')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="fractureType3Ct"
                                        title={t('planarResistente')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="fractureType4Ct" 
                                        title={t('colapsoProgresivo')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="fractureType5Ct"
                                        title={t('roturaBreak')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                </View>
                <View style={styles.formContainer} >
               
                    <Text>{t('profFractCT')}:</Text>
                    <CustomInput
                        name="fractureDepthCt"
                        placeholder={t('profFractPlaceholder')}
                        control={control}
                        // rules={{required: 'Title is required'}}
                    />   
                  
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="extensionTest"
                        title={t('eCTTest')}
                        control={control}
                        data={ectOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                   
                </View>

                <View style={styles.formContainer} >
                    {/* <CustomRadioButton 
                        name="fractureType"
                        title="Tipo de fractura"
                        control={control}
                        data={fractureOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    /> */}
                    <Text>{t('tipoFracturaECT')}:</Text>
                    <Text style={{fontSize:12, color: 'gray', padding:5}}>Puedes marcar multiples opciones</Text>    
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="fractureType1"
                                        title={t('colapsoSubito')} 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="fractureType2" 
                                        title={t('planarSubito')}
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="fractureType3"
                                        title={t('planarResistente')} 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                        <CustomCheckbox name="fractureType4" 
                                        title={t('colapsoProgresivo')} 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                    <View style={styles.formGroup}>
                        <CustomCheckbox name="fractureType5"
                                        title={t('roturaBreak')} 
                                        control={control}  
                                        // rules={{required: 'Campo obligatorio'}}
                        />
                    </View> 
                </View>

                <View style={styles.formContainer} >
              
                    <Text>{t('profFractECT')}:</Text>
                    <CustomInput
                        name="fractureDepth"
                        placeholder={t('profFractPlaceholder')}
                        control={control}
                        // rules={{required: 'Title is required'}}
                    />   
                  
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="layerHardness"
                        title={t('durezaPlaca')}
                        control={control}
                        data={hardnessOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="weakLayerHardness"
                        title={t('durezaPlacaDebil')}
                        control={control}
                        data={hardnessOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}/>
                    <CustomRadioButton 
                        name="snowHumidity"
                        title={t('humedadCapa')}
                        control={control}
                        data={humidityOptions}
                        // rules={{required: 'Campo obligatorio'}}
                        box={false}
                        textColor={'black'}
                        circleSize={14}
                    />
                   
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}></View>
                    <Text>{t('tipoGranoCapaDebil')}:</Text>
                    <CustomInput
                        name="snowType"
                        placeholder={t('tipoCopo')}
                        control={control}
                        // rules={{required: 'Title is required'}}
                    />  
                </View>

                <View style={styles.formContainer} >
                    <View style={styles.spacer}></View>
                    <Text>{t('otrasObs')}:</Text>
                
                    <CustomInput
                        name="comments"
                        control={control}
                        multiline={true}
                        numberOfLines={4}
                        customStyles={[styles.inputContainer, {height: '20%'}]}
                        placeholder={t('letrasMax')}
                        />
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
        padding: 10
    },
    // introSubtext:{
    //     flex: 1,
    //     fontSize:10,
    //     // paddingLeft: 10,
    //     alignItems: 'flex-end'
    // },
    introSubtext:{
        color: 'gray',
        fontSize:12,
        paddingLeft:5,
    },
    formContainer:{
        padding: 10
    },
    intro: {
        paddingBottom: 5,
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
    textArea: {
        borderColor: "gray",
        width: "100%",
        height:'20%',
    },
    input: {
        borderColor: "gray",
        width: "100%",
        height:'20%',
        paddingTop: 10,
        paddingBottom: 10,
    },
    container: {
        width: '100%',
        borderColor: 'none',
        marginVertical: 5,
    }, 
    space: {
        height: 200,
    }

});

export default SnowpackObservationTypeDetail;