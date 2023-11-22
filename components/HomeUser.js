import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { stylesHome } from "../assets/styles/stylesHome";
import { Avatar } from "react-native-paper";

export default function HomeUser({navigation, route}){
    return(
        <View style={stylesHome.container}>
            <Avatar.Image
                style={{ marginBottom: 20 }}
                size={400}
                source={require('../assets/imgs/fondoHome.jpg')} />

      <TouchableOpacity
        style={stylesHome.button2}
        onPress={() => navigation.navigate('Rent')}
      >
        <Text style={stylesHome.buttonText2}>Rentas</Text>
      </TouchableOpacity>
    </View>
    )
}