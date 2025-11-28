import React, {createContext, useContext, useState, useEffect} from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
import api from '../api/axiosConfig';

import  Snackbar  from "react-native-snackbar";
// x    

import { AuthContext } from './AuthContext';
import { useTranslation } from 'react-i18next';

export const ObservationContext = createContext();

export const ObservationProvider = ({children}) => {
    const {userDetails,userToken, logout} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();

    const [observations, setObservations] = useState([]);
   
    //const [historicObservations, setHistoricObservations] = useState([{"_id":"-1", "status": -1}]);  //uncomment to add banner on the list
    const [historicObservations, setHistoricObservations] = useState([]); // comment to add baner
    const [allObservations, setAllObservations] = useState([]);
    
    const [editingObservation, setEditingObservation] = useState({});

    const [lastIndex, setLastIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(false);
    

    // const sentRequest = async (url, method, data) => {
    //     try {
    //       const response = await axios({
    //         method: method,
    //         url: `${BASE_URL}${url}`,
    //         data: data,
    //         //headers: { "Content-Type": "multipart/form-data" },
    //         headers: {"Authorization": `Bearer ${userToken}`}
    //       });
    //       return response;
    //     } catch (error) {
    //       console.log(error);
    //       return error;
    //     }
    // };

    const showUpdateAlert = () => {
        Alert.alert(
          'Error Loading Data',
          'You might not have Network access.',
          [
            {
              text: 'Ok',
              onPress: () => {
                console.log("Error Acknowladged");  // true       
              },
            },
          ],
          { cancelable: false }
        );
      };

    const getAllObservations = async (filter = {}) =>{
        setIsLoading(true);
        // console.log(`API call to get observations with filter values Days: ${filter.days} and location:`);
        // console.log(filter.location);
        try{
           
            const response = await api.get(`/observations?days=${filter.days}&long=${filter.location.longitude}&lat=${filter.location.latitude}`);
            // response = await sentRequest(`/observations?days=${filter.days}&long=${filter.location.longitude}&lat=${filter.location.latitude}`, "get", '');
            // if(response && response.status != 200){
            //     if (userDetails){ 
            //         showUpdateAlert();
            //     }else{
            //         console.log("Error no valid Token");
            //         logout();
            //     }
            // } else if (response && response.data) {
            //     setAllObservations(response.data);
            // }
            if (response && response.data) {
                setAllObservations(response.data);
            }
            setIsLoading(false);
        } catch (err){
            console.log(err);
            if (err.response && err.response.status !== 200) {
                 if (userDetails){ 
                    showUpdateAlert();
                } else {
                    console.log("Error no valid Token");
                    logout();
                }
            }
            setIsLoading(false);
        }
    }

    const getObservationUserDetails = async (userId) => {
        setIsLoading(true);
        let user = {username: 'Anonymous'};
        try{
            const response = await api.get(`/users/${userId}`);
            //let response = null
            //response = await sentRequest(`/users/${userId}`, "get", '');
            //console.log(response.data);
            user = response.data;
        }catch (err){
            console.log(err);
        }
        setIsLoading(false);
        return user;
    }

    const getData = async (page = currentPage) => {
        setIsLoading(true);
        try{
            let response = null
            // console.log(page)
            //if (userDetails)  response = await sentRequest(`/observations/user/${userDetails?._id}?page=${page}`, "get", '');
            if (userDetails) {
                 response = await api.get(`/observations/user/${userDetails?._id}?page=${page}`);
            }
         
            if (response && response.data) {
                if(page === 1){
                    //let aux = [{"_id":"-1", "status": -1}];  // uncomment to enable banner
                    let aux = []; // comment to add baner
                    aux = aux.concat(response.data)
                    setHistoricObservations(aux);
                    setCurrentPage(2);
                }else{
                    if (response.data.length > 0){
                        let aux = historicObservations;
                        aux = aux.concat(response.data)
                        setCurrentPage(currentPage + 1);
                        setHistoricObservations(aux);

                    }else{
                        setLastPage(true)
                    }
                }            
            }
            
        } catch (err){
            console.log(err);
            setHistoricObservations(historicObservations);
            if (err.response && err.response.status !== 200) {
                if (userDetails){ 
                    setCurrentPage(1);
                    showUpdateAlert();
                } else {
                    console.log("Error no valid Token");
                    setCurrentPage(1);
                    logout();
                }
            }
        }
        try{
            let list = JSON.parse(await AsyncStorage.getItem('list'));
            if(list) setObservations(list);
        }catch(err){
            console.log(err)
        }
        setIsLoading(false);
    }
    
    const newObservation = async (observation) => {
        setIsLoading(true);
        // console.log('------ New Observation data received----')
        // console.log(observation);
        // console.log('----------------------------------------')
        try{
            let aux = observations;
            aux.push(observation);
            
            // setObservations( (arr) => { return [...arr, observation]});
            setObservations(aux);
            updateSelectedIndex(aux.length-1)
            await AsyncStorage.setItem('list', JSON.stringify(aux)); 
            setEditingObservation(observation);
            Snackbar.show({
                text: t('snackbarDraftCreated'),
                duration: Snackbar.LENGTH_SHORT,
                numberOfLines: 2,
                textColor: "#fff",
                backgroundColor: "#62a256",
            });
        }catch(err){
            console.log(err)
        }
        setIsLoading(false);
    }

  
    const updateSelectedIndex = (index) => {
        setEditingObservation(observations[index]); 
        setSelectedIndex(index)
    }

    const updateObservations = async (obj) => {
        console.log('calling update observations');
        setIsLoading(true);
        let aux = observations;
        aux[selectedIndex] = obj;
        setObservations(aux);
        setEditingObservation({...obj}); 
        try{
            await AsyncStorage.setItem('list', JSON.stringify(aux));
        }catch (err){
            console.log(err)
        }
        
       // console.log('------------------');  
        setIsLoading(false);
        
    }

    const deleteObservation = async () => {
        console.log('Remove observation');
        //let response = await sentRequest(`/observations`, "delete", editingObservation);
        //TODO: update async storage list
        setIsLoading(true);
        try{
            let aux = observations;
            aux.splice(selectedIndex,1);
            setEditingObservation({});
            setObservations(aux);
    
            await AsyncStorage.setItem('list', JSON.stringify(aux));
            let index = aux.length 
            setLastIndex(index);
            setSelectedIndex(null);
            Snackbar.show({
                text: t('snackbarDraftDeleted'),
                duration: Snackbar.LENGTH_SHORT,
                numberOfLines: 2,
                textColor: "#fff",
                backgroundColor: "#62a256",
            });
        }catch(err){
          console.log(err)
        } 
        setIsLoading(false);       
    }

    const findObservationIndex = (id) => {
        if (!allObservations || allObservations.length === 0) return -1;
        return allObservations.findIndex((obs) => obs._id === id || obs.id === id);
    };

    useEffect(()=>{
        let index = observations.length 
        setLastIndex(index);
    },[observations]);


    useEffect(()=>{  
        console.log('Loading user oservations data...');  
        getData();
    },[userDetails]);

    return(
        <ObservationContext.Provider 
            value={{
                newObservation, 
                updateObservations, 
                setObservations,
                deleteObservation,
                setSelectedIndex,
                setEditingObservation,
                updateSelectedIndex,
                findObservationIndex,
                // sentRequest,
                getData,
                getAllObservations,
                getObservationUserDetails,
                allObservations,
                setCurrentPage,
                setLastPage,
                lastPage,
                isLoading, 
                currentPage,
                observations,
                historicObservations,
                editingObservation,
                lastIndex,
                selectedIndex
            }}> 
            {children}
        </ObservationContext.Provider>
    )
}