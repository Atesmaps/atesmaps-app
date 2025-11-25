import React, {useState, useLayoutEffect, useEffect, useContext} from "react";
import { 
  SafeAreaView,
  ScrollView, 
  Text,
  View, 
  Image, 
  Animated,
  StyleSheet, 
  Dimensions,
  Platform
} from "react-native";
import { HeaderBackButton } from '@react-navigation/elements'

import moment from 'moment';
import { PULIC_BUCKET_URL } from '../config';
import MapView, {Marker, UrlTile} from 'react-native-maps';
import Svg from 'react-native-svg';
import { ObservationContext } from '../context/ObservationContext';
import { useTranslation } from "react-i18next";
import { useMomentLocale } from "../hooks/useMomentLocale";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
// const SPACING_FOR_CARD_INSET = width * 0.1 - 10;

export default function ShowObservation({ route, navigation }) {  
    const {t} = useTranslation();
    const momentLocale = useMomentLocale();
  

    const [item, setItem] = useState(route.params?.item);
    const [userName, setUserName] = useState('');
    const {getObservationUserDetails} = useContext(ObservationContext);

   
    useLayoutEffect( () => {
      navigation.setOptions({
        // title: item.title === '' ? 'No title' : item.title,
        title: t('observationTitle'),
        headerLeft: (props) => (
          <HeaderBackButton labelVisible={false} onPress={()=>{
            navigation.goBack();
          }}></HeaderBackButton>
        )
      });
    })
    useEffect(()=>{
      
      const getUserDetais = async (id) => {
        const user = await getObservationUserDetails(id);
        // console.log("--------");
        // console.log(user);
        setUserName(user.username);
      }
      // console.log(route.params?.modal)
      if (route.params?.modal){
        setUserName(item.user.username);
      }else{
        getUserDetais(item.user);
      }

     
     
      
    },[])
  
    const weatherObs = () => {
      if (item.observationTypes.weather.status == true) {
        return (
          <View style={[styles.obsCard]}>
            <View style={{flexDirection:'row', marginTop: 10, marginBottom: 10}}>
            <Image
                style={styles.rightImage}
                source={require("../../assets/images/icons/buttonIcons/button-meteo.png")}
              />
              <Text style={styles.subtitle}>{t('meteo')}</Text>
            </View>
            <View style={styles.spacer}/> 

            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('estadoCielo')}:</Text>
              { item.observationTypes.weather.values.skyCondition === 1 && (<Text style={styles.description}>{t('despejado')}</Text>)}
              { item.observationTypes.weather.values.skyCondition === 2 && (<Text style={styles.description}>{t('pocasNubes')}</Text>)}
              { item.observationTypes.weather.values.skyCondition === 3 && (<Text style={styles.description}>{t('nubesDispersas')}</Text>)}
              { item.observationTypes.weather.values.skyCondition === 4 && (<Text style={styles.description}>{t('nubesRotas')}</Text>)}
              { item.observationTypes.weather.values.skyCondition === 5 && (<Text style={styles.description}>{t('nublado8')}</Text>)}
              { item.observationTypes.weather.values.skyCondition === 6 && (<Text style={styles.description}>{t('niebla')}</Text>)}
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('tipoPrec')}:</Text>
              { item.observationTypes.weather.values.precipitationType === 1 && (<Text style={styles.description}>{t('nieve')}</Text>)}
              { item.observationTypes.weather.values.precipitationType === 2 && (<Text style={styles.description}>{t('lluvia')}</Text>)}
              { item.observationTypes.weather.values.precipitationType === 3 && (<Text style={styles.description}>{t('aguanieve')}</Text>)}
              { item.observationTypes.weather.values.precipitationType === 4 && (<Text style={styles.description}>{t('ninguna')}</Text>)}
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('intensPrecNev')}:</Text>
              { item.observationTypes.weather.values.snowIntensity === 1 && (<Text style={styles.description}>>1</Text>)}
              { item.observationTypes.weather.values.snowIntensity === 2 && (<Text style={styles.description}>1-5</Text>)}
              { item.observationTypes.weather.values.snowIntensity === 3 && (<Text style={styles.description}>5-10</Text>)}
              { item.observationTypes.weather.values.snowIntensity === 4 && (<Text style={styles.description}>>10</Text>)}
            </View>
            

            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('intensPrecLuvia')}:</Text>
              { item.observationTypes.weather.values.rainIntensity === 1 && (<Text style={styles.description}>{t('llovizna')}</Text>)}
              { item.observationTypes.weather.values.rainIntensity === 2 && (<Text style={styles.description}>{t('chubasco')}</Text>)}
              { item.observationTypes.weather.values.rainIntensity === 3 && (<Text style={styles.description}>{t('lluviaConst')}</Text>)}
              { item.observationTypes.weather.values.rainIntensity === 4 && (<Text style={styles.description}>{t('diluvio')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tempObs')}:</Text><Text style={styles.description}>{item.observationTypes.weather.values.temp}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tempMax')}:</Text><Text style={styles.description}>{item.observationTypes.weather.values.maxTemp}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tempMin')}:</Text><Text style={styles.description}>{item.observationTypes.weather.values.minTemp}</Text>
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('tempDescr')}:</Text>
              { item.observationTypes.weather.values.tempChange === 1 && (<Text style={styles.description}>{t('cayo')}</Text>)}
              { item.observationTypes.weather.values.tempChange === 2 && (<Text style={styles.description}>{t('constante')}</Text>)}
              { item.observationTypes.weather.values.tempChange === 3 && (<Text style={styles.description}>{t('subio')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('cantNieve')} (cm):</Text><Text style={styles.description}>{item.observationTypes.weather.values.snowAccumulation}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('combLluviaNieve')} (mm):</Text><Text style={styles.description}>{item.observationTypes.weather.values.rainAccumulation24}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('cantNieveReciente')} (cm):</Text><Text style={styles.description}>{item.observationTypes.weather.values.snowAccumulation24}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('fechaTorm')}:</Text><Text style={styles.description}>{item.observationTypes.weather.values.stormDate}</Text>
            </View>

            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('velViento')}:</Text>
              { item.observationTypes.weather.values.windSpeed === 1 && (<Text style={styles.description}>{t('calma')}</Text>)}
              { item.observationTypes.weather.values.windSpeed === 2 && (<Text style={styles.description}>{t('suave')}</Text>)}
              { item.observationTypes.weather.values.windSpeed === 3 && (<Text style={styles.description}>{t('moderado')}</Text>)}
              { item.observationTypes.weather.values.windSpeed === 4 && (<Text style={styles.description}>{t('fuerte')}</Text>)}
              { item.observationTypes.weather.values.windSpeed === 5 && (<Text style={styles.description}>{t('extremVel')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('oriOrientación')}:</Text>
            </View>
            
              { item.observationTypes.weather.values.orientation?.N && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>N</Text></View>)}
              { item.observationTypes.weather.values.orientation?.NE && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>NE</Text></View>)}
              { item.observationTypes.weather.values.orientation?.E && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>E</Text></View>)}
              { item.observationTypes.weather.values.orientation?.SE && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>SE</Text></View>)}
              { item.observationTypes.weather.values.orientation?.S && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>S</Text></View>)}
              { item.observationTypes.weather.values.orientation?.SO && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>SO</Text></View>)}
              { item.observationTypes.weather.values.orientation?.O && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>O</Text></View>)}
              { item.observationTypes.weather.values.orientation?.NO && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>NO</Text></View>)}        
            
            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('transNieveViento')}:</Text>
              { item.observationTypes.weather.values.windCarry === 1 && (<Text style={styles.description}>{t('no')}</Text>)}
              { item.observationTypes.weather.values.windCarry === 2 && (<Text style={styles.description}>{t('suave')} </Text>)}
              { item.observationTypes.weather.values.windCarry === 3 && (<Text style={styles.description}>{t('moderado')}</Text>)}
              { item.observationTypes.weather.values.windCarry === 4 && (<Text style={styles.description}>{t('intensa')}</Text>)}
            </View>
          </View>
        )
      }
    }

    const accidentObs = () => {
      if (item.observationTypes.accident.status == true) {
        return (
          <View style={[styles.obsCard]}>
            <View style={{flexDirection:'row', marginTop: 10, marginBottom: 10}}>
            <Image
                style={styles.rightImage}
                source={require("../../assets/images/icons/buttonIcons/button-accident.png")}
              />
              <Text style={styles.subtitle}>{t('accidente')}</Text>
            </View>
            <View style={styles.spacer}/> 
            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('actividad')}:</Text>
              { item.observationTypes.accident.values.activityType === 1 && (<Text style={styles.description}>{t('skimo')}</Text>)}
              { item.observationTypes.accident.values.activityType === 2 && (<Text style={styles.description}>{t('raquetasNieve')}</Text>)}
              { item.observationTypes.accident.values.activityType === 3 && (<Text style={styles.description}>{t('escaladaApli')}</Text>)}
              { item.observationTypes.accident.values.activityType === 4 && (<Text style={styles.description}>{t('pista')}</Text>)}
              { item.observationTypes.accident.values.activityType === 5 && (<Text style={styles.description}>{t('trek')}</Text>)}
              { item.observationTypes.accident.values.activityType === 6 && (<Text style={styles.description}>{item.observationTypes.accident.values.customActivityType}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('desencadenamiento')}:</Text>
              { item.observationTypes.accident.values.accidentOrigin === 1 && (<Text style={styles.description}>{t('natural')}</Text>)}
              { item.observationTypes.accident.values.accidentOrigin === 2 && (<Text style={styles.description}>{t('accidental')}</Text>)}
            </View>

          
            {/* <View style={styles.spacer}/> */}
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('persGrupo')}:</Text><Text style={styles.description}>{item.observationTypes.accident.values.numOfPeople}</Text>
            </View>
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('persEnteParc')}:</Text><Text style={styles.description}>{item.observationTypes.accident.values.numOfPartiallyBuried}</Text>
              </View>
              <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('persEnteTot')}:</Text><Text style={styles.description}>{item.observationTypes.accident.values.numOfBuried}</Text>
              </View>
              <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('persLesLeve')}:</Text><Text style={styles.description}>{item.observationTypes.accident.values.numOfInjured}</Text>
              </View>
              <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('persLesGrav')}:</Text><Text style={styles.description}>{item.observationTypes.accident.values.numOfSeverlyInjured}</Text>
              </View>
              <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('fallecidos')}:</Text><Text style={styles.description}>{item.observationTypes.accident.values.numOfDead}</Text>
              </View>
            
            {/* <View style={styles.spacer}/> */}
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('profCicatriz')}:</Text><Text style={styles.description}>{item.observationTypes.accident.values.crackDepth}</Text>
            </View>
            
           
            
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tamAva')}:</Text>
            </View>
            
              { item.observationTypes.accident.values.avalancheSize?.size_1 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('enteMin1')}</Text></View>)}
              { item.observationTypes.accident.values.avalancheSize?.size_2 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('entePers2')}</Text></View>)}
              { item.observationTypes.accident.values.avalancheSize?.size_3 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('enteCoche3')}</Text></View>)}
              { item.observationTypes.accident.values.avalancheSize?.size_4 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('enteTren4')}</Text></View>)}
              { item.observationTypes.accident.values.avalancheSize?.size_5 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('paisaje5')}</Text></View>)}
            
         

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('trampas')}:</Text>
              {!item.observationTypes.accident.values.terrainTraps === 1 && (<Text style={styles.description}>{t('sinAp')}</Text>)}
              { item.observationTypes.accident.values.terrainTraps === 2 && (<Text style={styles.description}>{t('cortadoZanja')}</Text>)}
              { item.observationTypes.accident.values.terrainTraps === 3 && (<Text style={styles.description}>{t('desnPend')}</Text>)}
              { item.observationTypes.accident.values.terrainTraps === 4 && (<Text style={styles.description}>{t('arbol')}</Text>)}
              { item.observationTypes.accident.values.terrainTraps === 5 && (<Text style={styles.description}>{t('barranco')}</Text>)}
            </View>

         
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('contacto2')}</Text><Text style={styles.description}>{item.observationTypes.accident.values.contactMe ? 'Sí' : 'No'}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('otrasObs')}:</Text>
            </View>
            <View style={styles.linkContainer}>
              <Text style={[styles.description,{paddingVertical: 5, maxWidth:'100%', textAlign:'left'}]}>{item.observationTypes.accident.values.comments}</Text>
            </View>
          </View>
        )
      }
    }

    const avalancheObs = () => {
      if (item.observationTypes.avalanche.status == true) {
        return (
          <View style={[styles.obsCard]}>
            <View style={{flexDirection:'row', marginTop: 10, marginBottom: 10}}>
            <Image
                style={styles.rightImage}
                source={require("../../assets/images/icons/buttonIcons/button-avalanche.png")}
              />
              <Text style={styles.subtitle}>Avalancha</Text>
            </View>
            <View style={styles.spacer}/> 
            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('obsSing')}:</Text>
              { item.observationTypes.avalanche.values.obsType === 1 && (<Text style={styles.description}>{t('singular')}</Text>)}
              { item.observationTypes.avalanche.values.obsType === 2 && (<Text style={styles.description}>{t('sintesis')}</Text>)}
            </View>
          
            <View style={[styles.linkContainer,{marginTop:5}]}>
            <Text style={[styles.link,{maxWidth: 150}]}>{t('geoloc')}?</Text>
              { item.observationTypes.avalanche.values.geoAccuracy === 1 && (<Text style={styles.description}>{t('exacta')}</Text>)}
              { item.observationTypes.avalanche.values.geoAccuracy === 2 && (<Text style={styles.description}>{t('bastantePrecisa')}</Text>)}
              { item.observationTypes.avalanche.values.geoAccuracy === 3 && (<Text style={styles.description}>{t('pocoPrecia')}</Text>)}
             
            </View>
          

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('actiAva')}:</Text>
              { item.observationTypes.avalanche.values.when === 1 && (<Text style={styles.description}>{t('dia')}</Text>)}
              { item.observationTypes.avalanche.values.when === 2 && (<Text style={styles.description}>{t('diaAnte')}</Text>)}
              { item.observationTypes.avalanche.values.when === 3 && (<Text style={styles.description}>{t('dosDias')}</Text>)}
             
            </View>
      
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('numAva')}:</Text>
              { item.observationTypes.avalanche.values.amount === 1 && (<Text style={styles.description}>1</Text>)}
              { item.observationTypes.avalanche.values.amount === 2 && (<Text style={styles.description}>2-5</Text>)}
              { item.observationTypes.avalanche.values.amount === 3 && (<Text style={styles.description}>6-10</Text>)}
              { item.observationTypes.avalanche.values.amount === 4 && (<Text style={styles.description}>+10</Text>)}
            </View>
           

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('medida')}:</Text>
            </View>
            
              { item.observationTypes.avalanche.values.dangerLevel?.level_1 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('enteMin1')}</Text></View>)}
              { item.observationTypes.avalanche.values.dangerLevel?.level_2 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('entePers2')}</Text></View>)}
              { item.observationTypes.avalanche.values.dangerLevel?.level_3 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('enteCoche3')}</Text></View>)}
              { item.observationTypes.avalanche.values.dangerLevel?.level_4 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('enteTren4')}</Text></View>)}
              { item.observationTypes.avalanche.values.dangerLevel?.level_5 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('paisaje5')}</Text></View>)}

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tipoAlud')}:</Text>
            </View>
            
              { item.observationTypes.avalanche.values.avalancheType?.type_1 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('placaReciente')}</Text></View>)}
              { item.observationTypes.avalanche.values.avalancheType?.type_2 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('placaViento')}</Text></View>)}
              { item.observationTypes.avalanche.values.avalancheType?.type_3 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('debilCapa')}</Text></View>)}
              { item.observationTypes.avalanche.values.avalancheType?.type_4 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('placaHumeda')}</Text></View>)}
              { item.observationTypes.avalanche.values.avalancheType?.type_5 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('cornisa')}</Text></View>)}
              { item.observationTypes.avalanche.values.avalancheType?.type_6 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('cornisaPlaca')}</Text></View>)}
              { item.observationTypes.avalanche.values.avalancheType?.type_7 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('caracteristicaAva')}</Text></View>)}
              { item.observationTypes.avalanche.values.avalancheType?.type_8 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('puntualSeca')}</Text></View>)}
              { item.observationTypes.avalanche.values.avalancheType?.type_9 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('desli')}</Text></View>)}

            <View style={[styles.linkContainer,{marginTop:5, marginBottom: 5}]}>
              <Text style={styles.link}>{t('caracteristicaAva')}</Text>
              
            </View>
            <View style={[styles.linkContainer,{marginLeft: 15}]}>
              <Text style={styles.link}>{t('profundidadFract')}:</Text>
              <Text style={styles.description}>{item.observationTypes.avalanche.values.depth} cm</Text>
            </View>
            <View style={[styles.linkContainer,{marginLeft: 15}]}>
              <Text style={styles.link}>{t('anchoAva')}:</Text>
              <Text style={styles.description}>{item.observationTypes.avalanche.values.width} m</Text>
            </View>
            <View style={[styles.linkContainer,{marginLeft: 15}]}>
              <Text style={styles.link}>{t('largoAval')}:</Text>
              <Text style={styles.description}>{item.observationTypes.avalanche.values.length} m</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('desencadenamiento')}:</Text>
              { item.observationTypes.avalanche.values.trigger === 1 && (<Text style={styles.description}>{t('accidental')}</Text>)}
              { item.observationTypes.avalanche.values.trigger === 2 && (<Text style={styles.description}>{t('natural')}</Text>)}
              { item.observationTypes.avalanche.values.trigger === 3 && (<Text style={styles.description}>{t('artificial')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('franjaAlti')}:</Text>
            </View>
            
              { item.observationTypes.avalanche.values.heightRange?.range_1 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>-2.000m</Text></View>)}
              { item.observationTypes.avalanche.values.heightRange?.range_2 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>2.000-2.300m</Text></View>)}
              { item.observationTypes.avalanche.values.heightRange?.range_3 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>+2.300m</Text></View>)}
            
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('cotaZonaSalida')}:</Text>
              <Text style={styles.description}>{item.observationTypes.avalanche.values.height}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('inclinaciónZona')} (m):</Text>
              <Text style={styles.description}>{item.observationTypes.avalanche.values.inclination}º</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('oriOrientación')}:</Text>
            </View>
            
              { item.observationTypes.avalanche.values.orientation?.N && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>N</Text></View>)}
              { item.observationTypes.avalanche.values.orientation?.NE && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>NE</Text></View>)}
              { item.observationTypes.avalanche.values.orientation?.E && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>E</Text></View>)}
              { item.observationTypes.avalanche.values.orientation?.SE && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>SE</Text></View>)}
              { item.observationTypes.avalanche.values.orientation?.S && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>S</Text></View>)}
              { item.observationTypes.avalanche.values.orientation?.SO && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>SO</Text></View>)}
              { item.observationTypes.avalanche.values.orientation?.O && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>O</Text></View>)}
              { item.observationTypes.avalanche.values.orientation?.NO && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>NO</Text></View>)}        
            
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('granoCapaDebil')}:</Text>
              <Text style={styles.description}>{item.observationTypes.avalanche.values.snowType}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('otrasObs')}:</Text>
              { item.observationTypes.avalanche.values.windExposure === 1 && (<Text style={styles.description}>{t('sotavento')}Sotavento</Text>)}
              { item.observationTypes.avalanche.values.windExposure === 2 && (<Text style={styles.description}>{t('cargaHumeda')}Carga cruzada</Text>)}
              { item.observationTypes.avalanche.values.windExposure === 3 && (<Text style={styles.description}>{t('otrasHumeda')}Otras situaciones</Text>)}
              { item.observationTypes.avalanche.values.windExposure === 4 && (<Text style={styles.description}>{t('sinExpoViento')}Sin exposición al viento</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('otrasObs')}:</Text>
            </View>
            <View style={styles.linkContainer}>
              <Text style={[styles.description,{paddingVertical: 5, maxWidth:'100%', textAlign:'left'}]}>{item.observationTypes.avalanche.values.comments}</Text>
            </View>
          </View>
        )
      }
    }

    const snowObs = () => {
      if (item.observationTypes.snowpack.status == true) {
        return (
          <View style={[styles.obsCard]}>
            <View style={{flexDirection:'row', marginTop: 10, marginBottom: 10}}>
            <Image
                style={styles.rightImage}
                source={require("../../assets/images/icons/buttonIcons/button-snow.png")}
              />
              <Text style={styles.subtitle}>{t('observationSnowTitle')}</Text>
            </View>
            <View style={styles.spacer}/> 
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={[styles.link,{maxWidth: 150}]}>{t('geoloc')}?</Text>
              { item.observationTypes.snowpack.values.geoAccuracy === 1 && (<Text style={styles.description}>{t('exacta')}</Text>)}
              { item.observationTypes.snowpack.values.geoAccuracy === 2 && (<Text style={styles.description}>{t('bastantePrecisa')}</Text>)}
              { item.observationTypes.snowpack.values.geoAccuracy === 3 && (<Text style={styles.description}>{t('pocoPrecia')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('franjaAltiTest')}:</Text>
              <Text style={styles.description}>{item.observationTypes.snowpack.values.altitude}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('oriOrientación')}:</Text>
            </View>
            
              { item.observationTypes.snowpack.values.orientation?.N && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>N</Text></View>)}
              { item.observationTypes.snowpack.values.orientation?.NE && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>NE</Text></View>)}
              { item.observationTypes.snowpack.values.orientation?.E && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>E</Text></View>)}
              { item.observationTypes.snowpack.values.orientation?.SE && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>SE</Text></View>)}
              { item.observationTypes.snowpack.values.orientation?.S && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>S</Text></View>)}
              { item.observationTypes.snowpack.values.orientation?.SO && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>SO</Text></View>)}
              { item.observationTypes.snowpack.values.orientation?.O && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>O</Text></View>)}
              { item.observationTypes.snowpack.values.orientation?.NO && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>NO</Text></View>)}        
            
            <View style={[styles.linkContainer,{marginTop: 5}]}>
              <Text style={styles.link}>{t('profManti')}:</Text>
              <Text style={styles.description}>{item.observationTypes.snowpack.values.depth} cm</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('woumps')}</Text>
              { item.observationTypes.snowpack.values.woumpfs === 1 && (<Text style={styles.description}>{t('si')}</Text>)}
              { item.observationTypes.snowpack.values.woumpfs === 2 && (<Text style={styles.description}>{t('no')}</Text>)}
            </View>
            
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('obsPropa')}</Text>
              { item.observationTypes.snowpack.values.cracks === 1 && (<Text style={styles.description}>{t('si')}</Text>)}
              { item.observationTypes.snowpack.values.cracks === 2 && (<Text style={styles.description}>{t('no')}</Text>)}
            </View>
             
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('nieveSup')}:</Text>
            </View>
            
              { item.observationTypes.snowpack.values.layerSnowType?.type_1 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('nueva')}</Text></View>)}
              { item.observationTypes.snowpack.values.layerSnowType?.type_2 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('crosta')}</Text></View>)}
              { item.observationTypes.snowpack.values.layerSnowType?.type_3 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('escarcha')}</Text></View>)}
              { item.observationTypes.snowpack.values.layerSnowType?.type_4 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('facetas')}</Text></View>)}
              { item.observationTypes.snowpack.values.layerSnowType?.type_5 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('granoFino')}</Text></View>)}
              { item.observationTypes.snowpack.values.layerSnowType?.type_6 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('variable')}</Text></View>)}

           
            <View style={[styles.linkContainer,{marginTop: 5}]}>
              <Text style={styles.link}>{t('penetracionPie')}:</Text>
              <Text style={styles.description}>{item.observationTypes.snowpack.values.footPenetration}cm</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop: 5}]}>
              <Text style={styles.link}>{t('penetracionEsqui')}:</Text>
              <Text style={styles.description}>{item.observationTypes.snowpack.values.skiPenetration}cm</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('testCizalla')}:</Text>
              { item.observationTypes.snowpack.values.handTest === 1 && (<Text style={styles.description}>{t('muyFacil')}</Text>)}
              { item.observationTypes.snowpack.values.handTest === 2 && (<Text style={styles.description}>{t('facil')}</Text>)}
              { item.observationTypes.snowpack.values.handTest === 3 && (<Text style={styles.description}>{t('moderado')}</Text>)}
              { item.observationTypes.snowpack.values.handTest === 4 && (<Text style={styles.description}>{t('dificil')}</Text>)}
              { item.observationTypes.snowpack.values.handTest === 5 && (<Text style={styles.description}>{t('noConcluyente')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('cTTest')}:</Text>
              { item.observationTypes.snowpack.values.compresionTest === 1 && (<Text style={styles.description}>{t('hits1')}</Text>)}
              { item.observationTypes.snowpack.values.compresionTest === 2 && (<Text style={styles.description}>{t('hits2')}</Text>)}
              { item.observationTypes.snowpack.values.compresionTest === 3 && (<Text style={styles.description}>{t('hits3')}</Text>)}
              { item.observationTypes.snowpack.values.compresionTest === 4 && (<Text style={styles.description}>{t('noConcluyente')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tipoFracturaCT')}:</Text>
            </View>
            
              { item.observationTypes.snowpack.values.fractureTypeCt?.type_1 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('colapsoSubito')}</Text></View>)}
              { item.observationTypes.snowpack.values.fractureTypeCt?.type_2 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('planarSubito')}</Text></View>)}
              { item.observationTypes.snowpack.values.fractureTypeCt?.type_3 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('planarResistente')}</Text></View>)}
              { item.observationTypes.snowpack.values.fractureTypeCt?.type_4 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('colapsoProgresivo')}</Text></View>)}
              { item.observationTypes.snowpack.values.fractureTypeCt?.type_5 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('roturaBreak')}</Text></View>)}
             

            <View style={[styles.linkContainer,{marginTop: 5}]}>
              <Text style={styles.link}>{t('profFractCT')}:</Text>
              <Text style={styles.description}>{item.observationTypes.snowpack.values.fractureDepthCt}cm</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('eCTTest')}:</Text>
              { item.observationTypes.snowpack.values.extensionTest === 1 && (<Text style={styles.description}>{t('propagación')}</Text>)}
              { item.observationTypes.snowpack.values.extensionTest === 2 && (<Text style={styles.description}>{t('sinPropagación')}</Text>)}
              { item.observationTypes.snowpack.values.extensionTest === 3 && (<Text style={styles.description}>{t('noConcluyente')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tipoFracturaECT')}:</Text>
            </View>
            
              { item.observationTypes.snowpack.values.fractureType?.type_1 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('colapsoSubito')}</Text></View>)}
              { item.observationTypes.snowpack.values.fractureType?.type_2 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('planarSubito')}</Text></View>)}
              { item.observationTypes.snowpack.values.fractureType?.type_3 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('planarResistente')}</Text></View>)}
              { item.observationTypes.snowpack.values.fractureType?.type_4 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('colapsoProgresivo')}</Text></View>)}
              { item.observationTypes.snowpack.values.fractureType?.type_5 && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={[styles.description, {maxWidth:250}]}>{t('roturaBreak')}</Text></View>)}
             

            <View style={[styles.linkContainer,{marginTop: 5}]}>
              <Text style={styles.link}>{t('profFractECT')}:</Text>
              <Text style={styles.description}>{item.observationTypes.snowpack.values.fractureDepth}cm</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('durezaPlaca')}:</Text>
              { item.observationTypes.snowpack.values.layerHardness === 1 && (<Text style={styles.description}>{t('hardnessTest1')}</Text>)}
              { item.observationTypes.snowpack.values.layerHardness === 2 && (<Text style={styles.description}>{t('hardnessTest2')}</Text>)}
              { item.observationTypes.snowpack.values.layerHardness === 3 && (<Text style={styles.description}>{t('hardnessTest3')}</Text>)}
              { item.observationTypes.snowpack.values.layerHardness === 4 && (<Text style={styles.description}>{t('hardnessTest4')}</Text>)}
              { item.observationTypes.snowpack.values.layerHardness === 5 && (<Text style={styles.description}>{t('hardnessTest5')}</Text>)}
              { item.observationTypes.snowpack.values.layerHardness === 6 && (<Text style={styles.description}>{t('hardnessTest6')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('durezaPlacaDebil')}:</Text>
              { item.observationTypes.snowpack.values.weakLayerHardness === 1 && (<Text style={styles.description}>{t('hardnessTest1')}</Text>)}
              { item.observationTypes.snowpack.values.weakLayerHardness === 2 && (<Text style={styles.description}>{t('hardnessTest2')}</Text>)}
              { item.observationTypes.snowpack.values.weakLayerHardness === 3 && (<Text style={styles.description}>{t('hardnessTest3')}</Text>)}
              { item.observationTypes.snowpack.values.weakLayerHardness === 4 && (<Text style={styles.description}>{t('hardnessTest4')}</Text>)}
              { item.observationTypes.snowpack.values.weakLayerHardness === 5 && (<Text style={styles.description}>{t('hardnessTest5')}</Text>)}
              { item.observationTypes.snowpack.values.weakLayerHardness === 6 && (<Text style={styles.description}>{t('hardnessTest6')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('humedadCapa')}:</Text>
              { item.observationTypes.snowpack.values.snowHumidity === 1 && (<Text style={styles.description}>{t('secaBola')}</Text>)}
              { item.observationTypes.snowpack.values.snowHumidity === 2 && (<Text style={styles.description}>{t('humedaBola')}</Text>)}
              { item.observationTypes.snowpack.values.snowHumidity === 3 && (<Text style={styles.description}>{t('mojadaGuanteNo')}</Text>)}
              { item.observationTypes.snowpack.values.snowHumidity === 4 && (<Text style={styles.description}>{t('mojadaGuante')}</Text>)}
              { item.observationTypes.snowpack.values.snowHumidity === 5 && (<Text style={styles.description}>{t('slush')}</Text>)}
              
            </View>

            <View style={[styles.linkContainer,{marginTop: 5}]}>
              <Text style={styles.link}>{t('tipoGranoCapaDebil')}:</Text>
              <Text style={styles.description}>{item.observationTypes.snowpack.values.snowType}</Text>
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('otrasObs')}:</Text>
            </View>
            <View style={styles.linkContainer}>
              <Text style={[styles.description,{paddingVertical: 5, maxWidth:'100%', textAlign:'left'}]}>{item.observationTypes.snowpack.values.comments}</Text>
            </View>
          </View>
        )
      }
    }

    const quickObs = () => {
      if (item.observationTypes.quick.status == true) {
        return (
          <View style={[styles.obsCard]}>
            <View style={{flexDirection:'row', marginTop: 10, marginBottom: 10}}>
            <Image
                style={styles.rightImage}
                source={require("../../assets/images/icons/buttonIcons/button-quick.png")}
              />
              <Text style={styles.subtitle}>{t('observationQuickTitle')}</Text>
              
            </View>
            <View style={styles.spacer}/> 
           
            <View style={styles.linkContainer}>
              <Text style={styles.link}>{t('acti')}:</Text>
              { item.observationTypes.quick.values.activityType === 1 && (<Text style={styles.description}>{t('skimo')}</Text>)}
              { item.observationTypes.quick.values.activityType === 2 && (<Text style={styles.description}>{t('raquetasNieve')}</Text>)}
              { item.observationTypes.quick.values.activityType === 3 && (<Text style={styles.description}>{t('alpinismo')}</Text>)}
              { item.observationTypes.quick.values.activityType === 4 && (<Text style={styles.description}>{t('pista')}</Text>)}
              { item.observationTypes.quick.values.activityType === 5 && (<Text style={styles.description}>{t('fondo')}</Text>)}
              { item.observationTypes.quick.values.activityType === 6 && (<Text style={styles.description}>{t('sinActividad')}</Text>)}
              { item.observationTypes.quick.values.activityType === 7 && (<Text style={styles.description}>{item.observationTypes.quick.values.customActivityType}</Text>)}
            </View>
        
            {/* <View style={styles.spacer}/> */}
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>Evaluacion general de la actividad:</Text>
            </View>
            <View style={styles.linkContainer}>
              <Text style={styles.link}></Text>
              { item.observationTypes.quick.values.ridingQuality === 1 && (<Text style={styles.description}>{t('muyBuenas')}</Text>)}
              { item.observationTypes.quick.values.ridingQuality === 2 && (<Text style={styles.description}>{t('buenas')}</Text>)}
              { item.observationTypes.quick.values.ridingQuality === 3 && (<Text style={styles.description}>{t('aceptables')}</Text>)}
              { item.observationTypes.quick.values.ridingQuality === 4 && (<Text style={styles.description}>{t('malas')}</Text>)}
            </View>

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('condicionesNieve')}:</Text>
            </View>
            
              { item.observationTypes.quick.values.snowConditions.crusty  && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('crosta')}</Text></View>)}
              {/* { item.observationTypes.quick.values.snowConditions.deepPowder && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text>Polvo</Text></View>)} */}
              { item.observationTypes.quick.values.snowConditions.hard && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('dura')}</Text></View>)}
              { item.observationTypes.quick.values.snowConditions.heavy && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('heavy')}</Text></View>)}
              { item.observationTypes.quick.values.snowConditions.powder && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('polvo')}</Text></View>)}
              { item.observationTypes.quick.values.snowConditions.wet && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('humeda')}</Text></View>)}
              { item.observationTypes.quick.values.snowConditions.windyAffected && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('venteada')}</Text></View>)}

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tipoTerreno')}:</Text>
            </View>
            
              { item.observationTypes.quick.values.rodeSlopeTypes?.mellow  && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('suave')}</Text></View>)}
              { item.observationTypes.quick.values.rodeSlopeTypes?.alpine && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('alpino')}</Text></View>)}
              { item.observationTypes.quick.values.rodeSlopeTypes?.steep && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('empinado')}</Text></View>)}
              { item.observationTypes.quick.values.rodeSlopeTypes?.clear && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('terrenoAbierto')}</Text></View>)}
              { item.observationTypes.quick.values.rodeSlopeTypes?.dense && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('bosqueDenso')}</Text></View>)}
              { item.observationTypes.quick.values.rodeSlopeTypes?.openTrees && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('bosqueAbierto')}</Text></View>)}
              { item.observationTypes.quick.values.rodeSlopeTypes?.shade && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('umbrio')}</Text></View>)}
              { item.observationTypes.quick.values.rodeSlopeTypes?.sunny && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('soleado')}</Text></View>)}
            
            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('tiempoMeteo')}:</Text>
            </View>
            
              { item.observationTypes.quick.values.dayType?.cloudy  && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('nublado')}</Text></View>)}
              { item.observationTypes.quick.values.dayType?.cold && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('frio')}</Text></View>)}
              { item.observationTypes.quick.values.dayType?.foggy && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('niebla')}</Text></View>)}
              { item.observationTypes.quick.values.dayType?.stormy && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('lluvia')}</Text></View>)}
              { item.observationTypes.quick.values.dayType?.sunny && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('soleado')}</Text></View>)}
              { item.observationTypes.quick.values.dayType?.warm && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('calurodos')}</Text></View>)}
              { item.observationTypes.quick.values.dayType?.weakSnow && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('nevadaLeve')}</Text></View>)}
              { item.observationTypes.quick.values.dayType?.wet && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('húmedo')}</Text></View>)}
              { item.observationTypes.quick.values.dayType?.windy && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('venteado')}</Text></View>)}

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('alertas')}:</Text>
            </View>
            
              { item.observationTypes.quick.values.avalancheConditions?.newConditions  && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('cargaNieve')}</Text></View>)}
              { item.observationTypes.quick.values.avalancheConditions?.slabs && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('aludesPlaca')}</Text></View>)}
              { item.observationTypes.quick.values.avalancheConditions?.snowAccumulation && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('acumulViento')}</Text></View>)}
              { item.observationTypes.quick.values.avalancheConditions?.sounds && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('woumpfs')}</Text></View>)}
              { item.observationTypes.quick.values.avalancheConditions?.tempChanges && (<View style={styles.linkContainer}><Text style={styles.link}></Text><Text style={styles.description}>{t('fusion')}</Text></View>)}

            <View style={[styles.linkContainer,{marginTop:5}]}>
              <Text style={styles.link}>{t('otrasObs')}:</Text>
            </View>
            <View style={styles.linkContainer}>
              <Text style={[styles.description,{paddingVertical: 5, maxWidth:'100%', textAlign:'left'}]}>{item.observationTypes.quick.values.comments}</Text>
            </View>
          </View>
        )
      }
    }

    const locationCard = () => {
      return (
      <View style={[styles.locationCard]}>
        <View style={{flexDirection:'row'}}>
        <Image
            style={[styles.locationIcon]}
            source={require("../../assets/images/pins/atesmaps-icon.png")}
          
          />
          <View style={{flexDirection:'column'}}>
          <Text style={{fontSize: 12, paddingVertical:3, color: "gray"}}>Lat: {item.location?.coordinates[1]}</Text>
          <Text style={{fontSize: 12, paddingVertical:3, color: "gray"}}>Long: {item.location?.coordinates[0]}</Text>
          </View>
        </View>
      </View>
      )  
    }
    const getMapRegion = () => {       
      return {latitude: Number(item.location?.coordinates[1])+0.004,
              longitude: Number(item.location?.coordinates[0]),
              latitudeDelta: 0.0170,
              longitudeDelta: 0.0170
            }   
      
    };

    const obsHeader = () => {
      return (
      <View style={styles.obsHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={{fontSize: 12}}>{moment(item.date).locale(momentLocale).format('Do MMMM YY - HH:mm')}</Text>
         {/*{ item.status === 0 && (<Text style={{fontSize: 12}}>Tomada: Durante la salida (sobre el terreno)</Text>)}
        { item.status === 1 && (<Text style={{fontSize: 12}}>Tomada: Immediatamente después de la salida (parquing)</Text>)}
        { item.status === 2 && (<Text style={{fontSize: 12}}>Tomada: Posteriormente (casa/refugio)</Text>)} */}
        <Text style={{fontSize: 12}}>{t('userTitle')}: {userName}</Text> 
      </View>
      )
    }

    const mapBlock = () => {
      return (
        <MapView
          provider={Platform.OS == "android" ?  "google" : undefined}
          style={styles.map}
          showsUserLocation = {false}
          region={getMapRegion()}
        >
        <UrlTile
              // urlTemplate={"https://4umaps.atesmaps.org/{z}/{x}/{y}.png"}
              urlTemplate={"https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=0a7d6a77a3f34d94a359058bd54f0857"}
              /**
              * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
              * MKTileOverlay. iOS only.
              */
              maximumZ={19}
              /**
              * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
              * to be used. Its default value is false.
              */
              flipY={false}
            />    
          <Marker
            key={1}
            coordinate={{latitude:Number(item.location?.coordinates[1]),longitude:Number(item.location?.coordinates[0])}}
          >
             {Platform.OS == "android" && (
                <Image style={styles.pin} source={require('../../assets/images/pins/atesmaps-blue.png')}/>
              )}
              
              {Platform.OS == "ios" && (    
                <Svg style={styles.pin} >
                  <Image style={styles.pin}
                      source={require('../../assets/images/pins/atesmaps-blue.png')}/> 
                </Svg>
              )}
            {/* <Svg style={styles.pin} >
              <Image style={styles.pin}
                    source={require('../../assets/images/pins/atesmaps-blue.png')}/> 
            </Svg> */}
          </Marker>
           
        </MapView>
      )
    }

    const imagesCards = () => {
      return (
        <Animated.ScrollView
        // contentInsetAdjustmentBehavior="automatic"
        horizontal
        scrollEventThrottle={1}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        pagingEnabled
        snapToInterval={CARD_WIDTH + 20}
        snapToAlignment="center" 
        >
          {item.images.map((image, index)=>(
            <View key={index} style={styles.card}>
              <Image 
                source={{uri:PULIC_BUCKET_URL+'/'+item.directoryId+'/'+image}}
                style={styles.cardImage}
                resizeMode="cover" 
              />  
            </View>
            )
          )} 
     
        </Animated.ScrollView>
      )
    }

    return (
      <SafeAreaView style={styles.safeContainer}>
        <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        >
          {mapBlock()}
          {obsHeader()}
          <View style={styles.container}>
            {/* <View style={styles.spacer}/> */}
            {locationCard()}
            {imagesCards()}
            {quickObs()}
            {avalancheObs()}
            {snowObs()}
            {accidentObs()}
            {weatherObs()}
          </View>
        </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    paddingBottom: Platform.OS == "android" ? 0 : 40
  },
  card: {
    // padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    // borderRadius:5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    borderRadius:5,
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  scrollView: {
   marginTop: 10
  },
  obsImage: {
    width:"100%",
    height:200,
    flex:1,
    alignSelf:"center",
    flexDirection:"column",
    borderRadius:5,
  },
  obsCard:{
    backgroundColor: "#FFF",
    borderRadius:5,
    marginTop: 10,
    padding: 15,
  },
  obsHeader: {
    backgroundColor: "rgba(255,255,255,0.6)",
    position:"absolute",
    width: "90%",
    padding: 10,
    top:10,
    left: 20,
    borderRadius:5,
  },
  locationCard: {
    backgroundColor: "#FFF",
    borderRadius:5,
    marginTop: 0,
    padding: 10,
  },
  linkContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    // paddingVertical: 8,
  },
  link: {
    flex: 2,
    color: 'gray',
    fontWeight: '600', 
    fontSize: 12, 
    // maxWidth: 200,
    //marginRight: 100,
  },
  description: {
    color: 'gray',
    flex: 3,
    fontSize: 12, 
    maxWidth: 120,
    textAlign: 'right',
    // fontWeight: '400',
  },
  map: {
    width:"100%",
    marginLeft: -5,
    marginRight:-5,
    height:300,
    flex:1,
    alignSelf:"center",
    flexDirection:"column",
    // borderRadius:5,
  },
  label:{ 
    fontWeight: 'bold', 
    fontSize: 15, 
    marginBottom: 5,
    marginTop: 5
  },
  title:{
    fontWeight: 'bold', 
    fontSize: 20, 
    marginBottom: 5,
    
  },
  subtitle:{
    fontWeight: 'bold', 
    fontSize: 15, 
    marginBottom: 20,
  
  },
  container: {
    flex: 1,
    padding: 15
  },
  spacer: {
    width: '100%',
    marginTop: -10,
    marginBottom: 20,
    backgroundColor: 'rgb(230,230,230)',
    height: 1,
  },
  rightImage: {
    // marginTop: 5,
    marginRight: 10,
    height: 20,
    width: 40,
  },
  locationIcon: {
    marginTop: 5,
    marginRight: 20,
    resizeMode: 'contain',
    height: 30,
    width: 30,
  },
  pin: {
    ...Platform.select({
      ios: {
        width: 42,
        height: 50,
        marginBottom: 55,
      },
      android: {
        marginBottom: 0,
      },
      default: {
        // other platforms, web for example
        marginBottom: 0,
      },
    }),
  },
});