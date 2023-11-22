import { StyleSheet } from "react-native";

const stylesHome = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      backgroundColor: 'red',
      padding: 10, 
      margin: 10, 
      borderRadius: 10,
      width: 300
    },
    buttonText: {
      color: 'white', 
      fontSize: 20, 
      textAlign: 'center'
    },
    button2: {
        backgroundColor: 'blue', 
        padding: 10, 
        margin: 10,
        borderRadius: 10,
        width: 300
      },
      buttonText2: {
        color: 'white', 
        fontSize: 20, 
        textAlign: 'center'
      },
  });

export { stylesHome }