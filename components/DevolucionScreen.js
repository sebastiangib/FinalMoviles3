import React, { useState, useEffect } from 'react';
import { View, Text, Picker, TextInput, Button } from 'react-native';
import { getFirestore, collection, getDocs,updateDoc, doc } from 'firebase/firestore';
import { devolucionStyles } from '../assets/styles/devolucion';

export default function DevolucionScreen({navigation}) {
  const [alquileres, setAlquileres] = useState([]);
  const [numeroRenta, setNumeroRenta] = useState('');
  const [numeroPlaca, setNumeroPlaca] = useState('');
  const [fechaDevolucion, setFechaDevolucion] = useState('');
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState(false);

  useEffect(() => {
    const fetchAlquileres = async () => {
      try {
        const db = getFirestore();
        const alquileresSnapshot = await getDocs(collection(db, 'alquileres'));
        const alquileresData = alquileresSnapshot.docs.map((doc) => ({
          id: doc.id,
          numeroRenta: doc.data().numeroRenta,
          numeroPlaca: doc.data().vehiculoId.numeroPlaca, // Suponiendo que 'vehiculoId' almacena el ID del vehículo alquilado
          fechaDevolucion: doc.data().fechaFinal, // O la fecha de devolución, según cómo se almacene en la colección 'alquileres'
        }));
        setAlquileres(alquileresData);
      } catch (error) {
        console.error('Error al cargar alquileres:', error);
      }
    };

    fetchAlquileres();
  }, []);

  const handleReturn = async () => {
    if (!numeroRenta || !fechaDevolucion) {
      setMessage("Por favor seleccione un número de renta y fecha de devolución.");
      setMessageColor(false);
      return;
    }
  
    try {
      const db = getFirestore();
      const alquilerRef = collection(db, 'alquileres');
      
      // Encuentra el documento correspondiente al número de renta seleccionado
      const alquilerDoc = alquileres.find((alquiler) => alquiler.numeroRenta === numeroRenta);
  
      if (alquilerDoc) {
        // Realiza la lógica para marcar el vehículo como devuelto o realizar las acciones necesarias en tu base de datos
        // Por ejemplo, podrías actualizar un campo 'devuelto' a true en el documento de alquiler correspondiente
        await updateDoc(doc(alquilerRef, alquilerDoc.id), { devuelto: true });
        
        // Aquí puedes realizar otras acciones relacionadas con la devolución, como registrar la fecha de devolución, etc.
  
        // Mensaje de éxito
        setMessage('Vehículo devuelto correctamente.');
        setMessageColor(true);
        navigation.navigate("Rent");
      } else {
        console.error('No se encontró información para el número de renta seleccionado.');
      }
    } catch (error) {
      console.error('Error al devolver el vehículo:', error);
    }
  };

  return (
    <View style={devolucionStyles.container}>
      <View
        style={{
          borderWidth: 2,
          borderColor: "gray",
          borderRadius: 10,
          padding: 30,
        }}
      >
      <Text>Seleccione el número de renta:</Text>
      <Picker
        selectedValue={numeroRenta}
        onValueChange={(itemValue) => {
          setNumeroRenta(itemValue);
          // Aquí puedes buscar y establecer la placa y la fecha de devolución asociadas al número de renta seleccionado
          const alquilerSeleccionado = alquileres.find((alquiler) => alquiler.numeroRenta === itemValue);
          if (alquilerSeleccionado) {
            setNumeroPlaca(alquilerSeleccionado.numeroPlaca);
            setFechaDevolucion(alquilerSeleccionado.fechaDevolucion);
          } else {
            setNumeroPlaca('');
            setFechaDevolucion('');
          }
        }}>
        <Picker.Item label="Seleccione un número de renta" value="" />
        {alquileres.map((alquiler) => (
          <Picker.Item
            key={alquiler.id}
            label={alquiler.numeroRenta}
            value={alquiler.numeroRenta}
          />
        ))}
      </Picker>

      <Text>Número de Placa:</Text>
      <TextInput value={numeroPlaca} editable={false} />

      <Text>Fecha de Devolución:</Text>
      <TextInput value={fechaDevolucion} editable={false} />

      <Button title="Devolver Vehículo" onPress={handleReturn} />
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
