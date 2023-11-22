import { useState,useEffect } from "react";
import { View,Text } from "react-native";
import { TextInput,Avatar,Button } from "react-native-paper";
import { styles } from "../assets/styles/styles";
// Firebase
import { getAuth,createUserWithEmailAndPassword } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { firebaseConfig } from "../firebaseConfig";

export default function RegisterScreen({navigation}){
    const [email,setEmmail] = useState('');
    const [password,setPassword] = useState('');
    const [rol,setRol] = useState('');
    const [palabraReservada,setPalabraReservada] = useState('');
    const [message,setMessage] = useState('');
    const [showPass,setShowPass] = useState(false)
    const [messageColor,setMessageColor] = useState(true)

    // Definir constantes para la autenticación
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)

    // Metodos para crear cuenta en Firebase Authentication y SignIn
    const handleCreateAccount = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential)=>{
            //console.log(userCredential.user.providerData)
            setMessageColor(true)  
            setEmmail('')
            setPassword('')
            setRol('')
            setPalabraReservada('')
            setMessage("Cuenta creada correctamente...")
            
            // Retraso de 2 segundos antes de navegar a la pantalla de inicio de sesión
            setTimeout(() => {
                navigation.navigate('Login')
            }, 2000); // 2000 milisegundos = 2 segundos
        })
        .catch((error) => {
            //console.log(error.message)
            setMessage("Error al crear la cuenta... Intentelo de nuevo")
            setMessageColor(false)
        })
    }
    

    return(
        <View style={styles.container}>
            <Avatar.Image
                style={{ marginBottom: 20 }}
                size={100}
                source={require('../assets/imgs/register.png')} />
            <View style={{ borderWidth: 2, borderColor: 'gray', borderRadius: 10, padding: 50 }}>
                <TextInput
                    autoFocus
                    label="Correo Electrónico"
                    right={<TextInput.Icon icon="email" />}
                    onChangeText={(email) => setEmmail(email)}
                    value={email}
                />
                <TextInput
                    style={{ marginTop: 20 }}
                    label="Contraseña"
                    secureTextEntry={!showPass}
                    right={<TextInput.Icon icon={showPass ? "eye" : "eye-off"} onPress={()=>setShowPass(!showPass)} />}
                    onChangeText={(password) => setPassword(password)}
                    value={password}
                />
                <TextInput
                    style={{ marginTop: 20 }}
                    label="Rol"
                    right={<TextInput.Icon icon="account" />}
                    onChangeText={(rol) => setRol(rol)}
                    value={rol}
                />
                <TextInput
                    style={{ marginTop: 20 }}
                    label="Palabra Reservada"    
                    right={<TextInput.Icon icon="keyboard" />}             
                    onChangeText={(palabraReservada) => setPalabraReservada(palabraReservada)}
                    value={palabraReservada}
                />
                <Button
                    style={{ marginTop: 20, backgroundColor: 'purple' }}
                    icon="account"
                    mode="outlined"
                    labelStyle={{ color: "white", fontWeight: "bold" }}
                    onPress={handleCreateAccount}
                >
                    Registrarte
                </Button>
                <Text style={{marginTop:5,color:messageColor ? 'green' : 'red'}}>{message}</Text>
            </View>
        </View>
    );
}