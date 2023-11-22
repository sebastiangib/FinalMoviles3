import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { TextInput, Avatar, Button } from "react-native-paper";
import { styles } from "../assets/styles/styles";

import {
  getAuth,
  updatePassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebaseConfig";

export default function ForgotPassword() {
  const [showNewPass, setShowNewPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [palabraReservada,setPalabraReservada] = useState('');
  const [messageColor, setMessageColor] = useState(false);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleResetPassword = () => {
    if (email === "" || newPassword === "") {
      setMessage("Por favor completa todos los campos.");
      setMessageColor(false);
      return;
    }

    const currentPassword = "sebas0627"; // Reemplaza con la contraseña actual del usuario

    if (currentPassword === "") {
      setMessage("Ingresa tu contraseña actual para proceder.");
      setMessageColor(false);
      return;
    }

    // Autenticar el usuario con el correo electrónico y la contraseña actual
    signInWithEmailAndPassword(auth, email, currentPassword)
      .then((userCredential) => {
        // Actualizar la contraseña
        const user = userCredential.user;
        updatePassword(user, newPassword)
          .then(() => {
            setMessage("Contraseña actualizada exitosamente.");
            setMessageColor(true);
          })
          .catch((error) => {
            setMessage(`Error al actualizar la contraseña: ${error.message}`);
            setMessageColor(false);
          });
      })
      .catch((error) => {
        setMessage(`Error de autenticación: ${error.message}`);
        setMessageColor(false);
      });
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title}>¿Olvidaste la Contraseña?</Text>
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
          onChangeText={(email) => setEmail(email)}
          value={email}
        />
        <TextInput
          style={{ marginTop: 20 }}
          label="Palabra Reservada"
          right={<TextInput.Icon icon="keyboard" />}
          onChangeText={(palabraReservada) =>
            setPalabraReservada(palabraReservada)
          }
          value={palabraReservada}
        />
        <TextInput
          style={{ marginTop: 20 }}
          label="Nueva Contraseña"
          secureTextEntry={!showNewPass}
          right={
            <TextInput.Icon
              icon={showNewPass ? "eye" : "eye-off"}
              onPress={() => setShowNewPass(!showNewPass)}
            />
          }
          onChangeText={(newPassword) => setNewPassword(newPassword)}
          value={newPassword}
        />
    
        <TouchableOpacity
        style={styles.button}
        icon="key"
        onPress={handleResetPassword}
      >
        <Text style={styles.buttonText}>Restablecer Contraseña</Text>
      </TouchableOpacity>
        <Text
          style={{
            marginTop: 10,
            textAlign: "center",
            color: messageColor ? "green" : "red",
          }}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}
