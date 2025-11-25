import React, {useContext} from "react";
import { StyleSheet, Text, View, Image, Linking, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import { useTranslation } from "react-i18next";

import {ObservationContext } from '../context/ObservationContext';
import { useMomentLocale } from "../hooks/useMomentLocale";

// moment.locale('es', {
//   months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
//   monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
//   weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
//   weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
//   weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
// }
// );

export default function Item({ item, index,  navigation  }) {
    const { t } = useTranslation();
    const momentLocale = useMomentLocale();
    const {setSelectedIndex, updateSelectedIndex} = useContext(ObservationContext);
    // console.log(item);

    const status = () => {
      if (item.status == 0) {
        return (
          <View style={styles.itemStatus}>
            <Text style={{fontSize:10, textAlign: 'center', color: 'white'}}>{t('borrador')}</Text>
          </View>
        )
      }
      if (item.status == 1) {
        return (
          <View style={[styles.itemStatus,{backgroundColor:"#62a256"}]}>
            <Text style={{fontSize:10, textAlign: 'center', color: 'white'}}>{ t('env')}</Text>
          </View>
        )
      }
    }

    const button = () => {
    //  if (item.status == 0) {
      return (
        <TouchableOpacity 
            style={{height:50,width:50, justifyContent:"center",alignItems:"center"}}
            onPress={() => {
              if(item.status > 0){
                navigation.navigate('Detalles',{item});
              }else{
                 updateSelectedIndex(index);
                // setSelectedIndex(index);
                 navigation.navigate('Observación',{item, index});
              }
            }}
        > 
     
          {/* <Text style={{color:"green"}}>Edit</Text> */}
          <MaterialIcons name='arrow-forward-ios' size={20} color="#333" style={{marginRight: 5}}/>
        </TouchableOpacity>
        );
      // }
    }

    const title = (title) => {
      if (title === ''){
        return <Text style={{color:"gray"}}>{t('noTitle')}</Text>
      }else{
       return  <Text style={{fontWeight:"bold"}}>{item.title}</Text>
      }
    }

    return (
      <>
      {/* {item.status < 0 && (
        <View style={styles.bannerItem}>
          <TouchableOpacity 
            style={[{width:'100%', flex:1}, styles.bannerItem]}
            onPress={() => {
              Linking.openURL('https://www.verticoutdoor.com/');
            }}
          > 
          <Image source={require('../../assets/images/banners/vertic_320x50px.gif')} style={styles.bannerItem} /> 
          </TouchableOpacity>
        </View>
      )} */}
      {item.status >= 0 && (
        <>
        <View style={styles.listItem}>
          <View style={{marginTop:5,marginBottom: (item.status > 0 ? 5 : 0), alignItems:"flex-start",flex:1}}>
            {/* <Text style={{fontWeight:"bold"}}>{item.title}</Text> */}
            {title(item.title)}
            <Text style={{ marginTop: (item.status > 0 ? 5 : 0)}}>{moment(item.date).locale(momentLocale).format('Do MMMM YYYY')}</Text>
            
          </View>
          {button()}
        </View>
        {status()}
        </>
      )}
      </>
    );
  }

  const styles = StyleSheet.create({
    bannerItem: {
      backgroundColor:"#FFF",
      width:"90%",
      flex:1,
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5,
      //margin:5,
      //padding:10,
    },
    listItem:{
      margin:5,
      padding:10,
      backgroundColor:"#FFF",
      width:"90%",
      flex:1,
      alignSelf:"center",
      flexDirection:"row",
      borderRadius:5
    },
    itemStatus: {
      backgroundColor:"red",
      margin:5, 
      alignSelf:"center",
      alignContent: 'center',
      bottom: 0, 
      width:'90%', 
      position:'absolute',
      borderBottomRightRadius:5,
      borderBottomLeftRadius:5
    }
  });