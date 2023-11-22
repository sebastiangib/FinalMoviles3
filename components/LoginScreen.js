import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput, Avatar, Button } from "react-native-paper";
import { styles } from "../assets/styles/styles";
// Firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("");
  const [message, setMessage] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [messageColor, setMessageColor] = useState(true);

  // Definir constantes para la autenticación
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        if(rol=="admin" || rol=="Admin" || rol=="ADMIN" || rol=="administrador" || rol=="Administrador"){
        setEmmail("");
        setPassword("");
        setRol("");
        navigation.navigate("Home", { email: email });
        }else{
          navigation.navigate("HomeUser", { email: email });
        }
        
      })
      .catch((error) => {
        //console.log(error.message)
        setMessage("Usuario o contraseña invalido...");
        setMessageColor(false);
      });
  };
  
  return (
    <View style={styles.container}>
      <Avatar.Image
        style={{ marginBottom: 20 }}
        size={100}
        source={require("../assets/imgs/imglogin.jpg")}
      />
      <View
        style={{
          borderWidth: 2,
          borderColor: "gray",
          borderRadius: 10,
          padding: 50,
        }}
      >
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
          right={
            <TextInput.Icon
              icon={showPass ? "eye" : "eye-off"}
              onPress={() => setShowPass(!showPass)}
            />
          }
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
        <Button
          style={{ marginTop: 20, backgroundColor: "#4267b2", color: "white" }}
          icon="login"
          mode="outlined"
          onPress={handleSignIn}
          labelStyle={{ color: "white", fontWeight: "bold" }}
        >
          Iniciar Sesión
        </Button>
        <Button
          style={{ marginTop: 20, backgroundColor: "#42b72a" }}
          icon="account"
          mode="outlined"
          labelStyle={{ color: "white", fontWeight: "bold" }}
          onPress={() => navigation.navigate("Register")}
        >
          Crear cuenta nueva
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.olvidasteContra}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 10, textAlign: 'center', color: messageColor ? "green" : "red" }}>
          {message}
        </Text>
      </View>
    </View>
  );
}
