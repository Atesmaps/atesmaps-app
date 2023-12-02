import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import  Snackbar  from "react-native-snackbar";
import { BASE_URL } from '../config';

import { AuthContext } from '../context/AuthContext';
import { GetBucketLoggingOutputFilterSensitiveLog } from '@aws-sdk/client-s3';

export const ObservationContext = createContext();

export const ObservationProvider = ({children}) => {
    const {userDetails,userToken, logout} = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);

    const [observations, setObservations] = useState([]);
    const [historicObservations, setHistoricObservations] = useState([]);
    
    const [editingObservation, setEditingObservation] = useState({});

    const [lastIndex, setLastIndex] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(false);
    

    const sentRequest = async (url, method, data) => {
        try {
          const response = await axios({
            method: method,
            url: `${BASE_URL}${url}`,
            data: data,
            //headers: { "Content-Type": "multipart/form-data" },
            headers: {"Authorization": `Bearer ${userToken}`}
          });
          return response;
        } catch (error) {
          console.log(error);
          return error;
        }
    };

    const getData = async (page = currentPage) => {
        setIsLoading(true);
        try{
            let response = null
            // console.log(page)
            if (userDetails)  response = await sentRequest(`/observations/user/${userDetails?._id}?page=${page}`, "get", '');
            //TODO: Sync local data with new data
            if(response && response.status != 200){
                if (userDetails){ 
                    setCurrentPage(1);
                    logout();
                }
            } else if (response && response.data) {
                if(page === 1){
            
                    setHistoricObservations(response.data);
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
                text: 'Tu borrador de observación se ha creado.',
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
                text: 'Tu borrador de observación se ha eliminado.',
                duration: Snackbar.LENGTH_SHORT,
                numberOfLines: 2,
                textColor: "#fff",
                backgroundColor: "#62a256",
            });
        }catch(err){
          console.log(err)
        } 
        setIsLoading(false);
        // console.log('---');
        // console.log(observations);
        // console.log('---END REmoving observation---');
        // navigation.navigate('Lista de Observaciones');
       
    }

    useEffect(()=>{
        // console.log('-----Observations updated-----')
        // console.log(observations);
        let index = observations.length 
       // console.log(index);
        setLastIndex(index);
       // setSelectedIndex(index-1);
      //  console.log('-----------------------------')
        // setList();
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
                sentRequest,
                getData,
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