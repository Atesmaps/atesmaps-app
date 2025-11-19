import React, {useState, useEffect, useLayoutEffect, useContext} from "react";
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Linking, 
  RefreshControl,
  Platform,
  Pressable,
  ActivityIndicator,
  Button,
   } from 'react-native';

// import moment from 'moment';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from 'react-i18next';

import { AuthContext } from '../context/AuthContext';
import { ObservationContext } from '../context/ObservationContext';
import { LocationContext } from '../context/LocationContext';


import Item from '../components/ObservationItem';
import Loading from '../components/Loading';

export default function ObservationDetail({ navigation }) {
    const {currentLocation, getOneTimeLocation} = useContext(LocationContext);
    const {isLoading, lastIndex, observations, historicObservations, newObservation, currentPage, setCurrentPage, setLastPage, lastPage, getData} = useContext(ObservationContext);
    const {userDetails} = useContext(AuthContext);
    const { t } = useTranslation();

    //const [user, setUser] = useState(userDetails);
    const [drafts, setDrafts] = useState(observations);
    const [uploaded, setUplodaded] = useState(historicObservations);
    const [refreshing, setRefreshing] = useState(false);
    
  

    useLayoutEffect(() => {
      navigation.setOptions({
        // title: 'lolObservaciones',
        headerRight: userDetails.status ? () => (
                <Pressable
                  onPress={async ()  => {
                    // getOneTimeLocation()
                    // await newObservation({
                    //   title: 'Nueva Observación',
                    //   date: Date.now(),
                    //   location: {
                    //     latitude: currentLocation.latitude,
                    //     longitude: currentLocation.longitude
                    //   },
                    //   directoryId: userDetails._id+moment().format('X'),
                    //   observationTypes:{},
                    //   images: [],
                    //   status: 0,
                    //   submitted: false,
                    // });
                    let index = lastIndex;      
                    navigation.navigate('Observación', {index})
                    }}
                >
                  <MaterialCommunityIcons size={25} 
                                        color={'#307df6'} 
                                        name="eye-plus"/>
                </Pressable>
            ) :  null
      });
      //TODO: Here we can dynamically change the header of the screen....
      //check documentation here: https://reactnavigation.org/docs/navigation-prop/#setparams
    }, [navigation, userDetails]);

    
    //const [numOfItems, setNumOfItems] = useState(setNumOfItems)

    // useEffect(()=>{
    //   console.log('updateing user data on oservations view');
    //   console.log(userDetails.status);
    //   // setUser(userDetails);
    // },[userDetails])

    useEffect(()=>{
      setDrafts(observations);
    },[observations])

    useEffect(()=>{
      setUplodaded(historicObservations);
      setRefreshing(false);
    },[historicObservations])

    useEffect(()=>{
      return function cleanup() {
        // console.log('cleaning up observations ')
        getOneTimeLocation();
      };
    },[])

    const handleRefreshing = () => {
      setRefreshing(true);
      // setCurrentPage(1);
      getData(1);
      setLastPage(false);
    
    }

    const renderLoader = () => {
       return (
        (!lastPage && 
        <View style={{marginVertical:16, flex:1, justifyContent: 'center', alignItems:'center'}}>
           <ActivityIndicator size={'small'}/> 
        </View>)
       )
    }

    const loadMoreObservations = () => {
      // console.log('calling load more fucntion... reached end of list');
      if (!lastPage){
      getData();
      }
    }

    if( isLoading &&  uploaded.length < 1 ) {
      return(
          <Loading />
          // <View style={{flex:1, justifyContent: 'center', alignItems:'center'}}>
          //     <ActivityIndicator size={'large'}/> 
          // </View>
      )
    }

    if (!userDetails.status) {
      
      return ( 
        <View style={styles.container}>
        <MaterialCommunityIcons 
        
          // name='add-a-photo'
          name='account'
          size={50} 
          color={'gray'}
          style={{marginBottom: 20}}/>
        <Text>Por favor, antes de realizar observaciones,</Text>
        <Text>complete su perfil de usuario.</Text>
        <Text>Gracias.</Text>
        
        <Button style={styles.button} title="Volver al perfil"  onPress={async () => {
                navigation.navigate('Perfil')
                }} />
      </View>
    )};

   // console.log(observations.length);
   // console.log(historicObservations.length);
    if( drafts.length < 1 && uploaded.length < 1) {
      return(
        <View style={styles.container}>
          <MaterialIcons 
            // name='add-a-photo'
            name='my-library-books'
            size={50} 
            color={'gray'}
            style={{marginBottom: 20}}/>
          <Text>No se ha creado ninguna observación.</Text>
          <Button style={styles.button} title="Añadir observación"  onPress={async () => {
                  // await newObservation({
                  //   title: 'New observation',
                  //   date: Date.now(),
                  //   location: {
                  //     latitude: currentLocation.latitude,
                  //     longitude: currentLocation.longitude
                  //   },
                  //   directoryId: userDetails._id+moment().format('X'),
                  //   observationTypes:{},
                  //   images: [],
                  //   status: 0,
                  //   submitted: false,
                  // });
                  let index = lastIndex;      
                  navigation.navigate('Observación', {index})
                  }} />
        </View>
      )
    }

    let draftList;
    if (observations.length < 1) {
      draftList = <View style={styles.empty}>
          <MaterialIcons 
            // name='add-a-photo'
            name='my-library-books'
            size={50} 
            color={'gray'}
            style={{marginBottom: 20}}/>
          <Text>No hay ningún borrador de observaciones.</Text>
        </View>
    }else{ 
      draftList = <FlatList
        style={styles.list}
        data={drafts}
        renderItem={({ item, index }) => <Item item={item} index={index} navigation={navigation}/>}
        keyExtractor={(item,index) => index}
        />
    }
 
    let uploadedList; 
    if (uploaded.length < 1) {
      uploadedList = <View style={styles.empty}>
          <MaterialIcons 
            // name='add-a-photo'
            name='my-library-books'
            size={50} 
            color={'gray'}
            style={{marginBottom: 20}}/>
          <Text>No se envió ninguna observación.</Text>
        </View>
    }else{
      uploadedList = <FlatList
      style={styles.list}
        data={uploaded}
        renderItem={({ item, index }) => <Item item={item} index={index} navigation={navigation}/>}
        keyExtractor={(item,index) => index}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefreshing} />
        }
        ListFooterComponent={renderLoader}
        onEndReached={loadMoreObservations}
        onEndReachedThreshold={Platform.OS === 'ios' ? 0 : 1}
        />
    }


    return (
        <View style={styles.listContainer}>
           {/* <SectionList
              
              sections={[{index: 1, title:'Borradores', data: observations},{index: 2, title:'Historial', data: historicObservations}]}
              renderItem={({ item, index }) => <Item item={item} index={index} navigation={navigation}/>}
              // renderSectionHeader={({section})=>(
              //   <View style={{
              //                 borderBottomWidth: 1,
              //                 borderBottomColor: '#333',
              //                 marginBottom: 10,
              //                 // marginTop: (section.index > 1 ? 10 : 0)
              //                 }}>            
              //     <Text style={styles.taskTitle}>{section.title}</Text>
              //   </View>
              // )}
              keyExtractor={(item,index) => index}
              stickySectionHeadersEnabled
            /> */}
           {/* <FlatList
            data={observations}
            renderItem={({ item, index }) => <Item item={item} index={index} navigation={navigation}/>}
            keyExtractor={(item,index) => index}
            /> */}
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>{t('borradores')}</Text>
              <View style={styles.spacer}/>
            </View>
            {draftList}
            <View style={[styles.formContainer,{ marginTop: 15}]}>
              <View style={{flexDirection: 'row',justifyContent: 'space-between'}}>
              <Text style={[styles.sectionTitle,{ justifyContent: 'flex-start'}]}>{t('obsRel')}</Text>
              <Pressable
                  style={{ justifyContent: 'flex-end'}}
                  onPress={()  => {
                    
                    Linking.openURL('https://atesmaps.org/geovisor.html');
                    }}
                >
                
                  <MaterialCommunityIcons size={25} 
                                        color={'#307df6'} 
                                        name="open-in-new"/>
                </Pressable>
              </View>
              <View style={styles.spacer}/>
            </View>
            {uploadedList}
            
        </View>
       
    );

}

const styles = StyleSheet.create({
    listContainer: {
      flex: 1,
      paddingTop: 15
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
    },
    formContainer:{
      paddingLeft: 20,
      paddingRight: 20
    },
    spacer: {
      width: '100%',
      marginTop: 10,
      marginBottom: 10,
      backgroundColor: 'gray',
      height: 1,
    },
    container: {
      paddingTop: 100,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    list: {
      height: '45%',
      flexGrow: 0
    },
    empty: {
      flex: 1,
      paddingTop: 50,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    taskTitle:{
      backgroundColor: "#ffffff",
      fontSize: 20,
      fontWeight: "bold",
      padding: 10,
      elevation: 4,
  
      
      
    }
  });