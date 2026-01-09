import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import {Controller} from 'react-hook-form';

const CustomRadioButton = ({
  control,
  name,
  title,
  rules = {},
  data = {},
  box=false,
  textColor='black',
  circleSize=14,
  containerStyle={},
  secureTextEntry,
}) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}

      render={({field: {value, onChange}, fieldState: {error}}) => (
  <View style={styles.outerWrapper}>
    <View
      style={[
        styles.container,
        containerStyle,
        { 
          // Use a transparent border when no error to prevent layout jumps
          borderColor: error ? 'red' : 'transparent',
          borderWidth: error ? 1 : 0,
          borderRadius: 5,
          padding: error ? 5 : 0
        }
      ]}
    >
      <Text style={styles.titleStyle}>{title}</Text>
      <RadioButtonRN
        textColor={textColor}
        circleSize={circleSize}
        data={data}
        // Force re-render of the radio group when value is cleared
        initial={value ? value : -1} 
        box={box}
        selectedBtn={(e) => {
          // Find index + 1 to match your logic
          const idx = data.findIndex(obj => obj.label === e?.label);
          onChange(idx !== -1 ? idx + 1 : null);
        }}
      />
    </View>
    {error && (
      <Text style={styles.errorText}>{error.message || 'Error'}</Text>
    )}
  </View>
)}
      // render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
      //   <>
      //     <View
      //       style={[
      //         styles.container,
      //         containerStyle,
      //         { borderColor: error ? 'red' : containerStyle.borderColor ? containerStyle.borderColor : 'none',
      //           borderWidth: error ? 1 : containerStyle.borderWidth ? containerStyle.borderWidth : 0,
      //           borderRadius: error ? 5 : containerStyle.borderRadius ? containerStyle.borderRadius : 0,
      //           padding: error ? 5 : containerStyle.padding ? containerStyle.padding : 0
      //         }
      //       ]}
      //     >

      //     <Text>{title}</Text>
      //     <RadioButtonRN
      //         textColor={textColor}
      //         circleSize={circleSize}
      //         data={data}
      //         initial={value ? value : null}
      //         box={box}
      //         selectedBtn={(e) => {
      //             onChange(data.map(object => object.label).indexOf(e?.label)+1);
      //         }}
      //         />
      //     </View>
      //     {error && (
      //       <Text style={{color: 'red', alignSelf: 'stretch'}}>{error.message || 'Error'}</Text>
      //     )}
      //   </>
      // )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderColor: 'none',
    marginVertical: 5,
  },
  input: {
    borderColor: "gray",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  errorText: {
    color: 'red'
  }
});

export default CustomRadioButton;
