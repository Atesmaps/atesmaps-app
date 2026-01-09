import React from 'react';
import {View, Image, Text, StyleSheet, Pressable} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomButton = ({
  onPress, 
  order,
  text, 
  type = 'primary', 
  bgColor,
  fColor,
  iconName = 'arrow-forward-ios',
  leftIconImage,
  leftIconStyles = {},
  customStyle = {},
  disabled = false,
}) => {
  return (
    <Pressable
      onPress={disabled ? null : onPress}
      disabled={disabled}
      style={[
        styles.container,
        styles[`container_${type}`],
        styles[`position_${order}`],
        bgColor ? {backgroundColor: bgColor} : {},
        customStyle,
      ]}>
      {leftIconImage && (
        <Image
        style={[styles.LeftImage, leftIconStyles]}
        source={leftIconImage}
        />
      )}
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fColor ? {color: fColor} : {},
          leftIconImage ? { width: '75%',} : {},
        ]}>
        {text}
      </Text>
      
      {iconName && (
        <MaterialIcons 
          name={iconName} 
          size={20} 
          color={fColor ? fColor : 'gray'} 
          style={{marginRight: 5, width: '10%'}}/>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection:"row",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
  },

  container_primary: {
    backgroundColor: '#3B71F3',
    // alignContent: 'center',
     justifyContent: 'center'
  },

  container_scondary: {
    borderColor: '#3B71F3',
    borderWidth: 2,
  },

  container_tertiary: {
    backgroundColor: '#f7f7f7',
  },

  container_custom: {
    backgroundColor: '#f7f7f7',
    marginVertical: 0,
  },

  text: {
    fontWeight: 'bold',
    color: 'white',
  },

  text_scondary: {
    color: '#3B71F3',
  },

  text_tertiary: {
    color: 'gray',
  },

  text_custom: {
    width: '90%',
  },

  position_top:{
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0
  },
  position_middle:{
    borderRadius: 0
  },
  position_bottom:{
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5
  },
  LeftImage: {
    // marginTop: 5,
    marginRight: 10,
    height: 20,
    width: 40,
},
});

export default CustomButton;
