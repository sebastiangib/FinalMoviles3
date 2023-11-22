import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button,Picker } from 'react-native';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, addDoc } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function RentScreen() {
  const [alquiler, setAlquiler] = useState({
    numeroPlaca: '',
    fechaInicial: '',
    fechaFinal: '',
    numeroRenta: '',
  });
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState(true);
  const [carros, setCarros] = useState([]);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore();

  const auth = getAuth(app);

  useEffect(() => {
    const fetchCarros = async () => {
      try {
        const carrosSnapshot = await getDocs(collection(db, 'vehiculos'));
        const carrosData = carrosSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        console.log('Carros Data:', carrosData);
        setCarros(carrosData);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };
  
    fetchCarros();
  }, []);

  const guardarAlquiler = async () => {
    console.log('Vehículos:', carros); // Verifica que los vehículos estén presentes
  console.log('Numero Placa:', alquiler.numeroPlaca); // Verifica el valor de numeroPlaca

    const fechaActual = Date.now();
    const fechaInicial = Date.parse(alquiler.fechaInicial);
  
    if (fechaInicial < fechaActual) {
      setMessage('La fecha inicial no puede ser menor que la fecha del sistema.');
      setMessageColor(false);
      return;
    }
  
    try {
      const carroSeleccionado = carros.find((carro) => carro.id === alquiler.numeroPlaca);
      const nuevoAlquiler = {
        fechaInicial: alquiler.fechaInicial,
        fechaFinal: alquiler.fechaFinal,
        numeroRenta: alquiler.numeroRenta,
        numeroPlaca: alquiler.numeroPlaca,
      };
  
      await addDoc(collection(db, 'alquileres'), nuevoAlquiler);
  
      if (carroSeleccionado) {
  await updateDoc(doc(db, 'vehiculos', carroSeleccionado.id), { disponible: false });

  setMessageColor(true);
  setMessage('Alquiler guardado correctamente.');
  setAlquiler({
    fechaInicial: '',
    fechaFinal: '',
    numeroRenta: '',
    numeroPlaca: '',
  });

  // Volver a cargar la lista de vehículos disponibles después de guardar el alquiler
  fetchCarros();
} else {
  setMessageColor(false);
  setMessage('No se encontró el vehículo seleccionado.');
}
    } catch (error) {
      setMessageColor(false);
      setMessage('Error al guardar el alquiler.');
      console.error('Error:', error);
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
    <View style={{ marginTop: 10 }}>
      <Text>Vehículos Disponibles:</Text>
      <Picker
  selectedValue={alquiler.numeroPlaca}
  onValueChange={(itemValue) => setAlquiler({ ...alquiler, numeroPlaca: itemValue })}
>
  {carros.map((carro) => {
    if (carro.disponible) {
      return (
        <Picker.Item key={carro.id} label={carro.numeroPlaca} value={carro.id} />
        // Utiliza 'value={carro.id}' en lugar de 'value={carro.numeroPlaca}'
      );
    } else {
      return null;
    }
  })}
</Picker>
    </View>

    <Text>Fecha Inicial</Text>
    <TextInput
      value={alquiler.fechaInicial}
      onChangeText={(text) => setAlquiler({ ...alquiler, fechaInicial: text })}
    />

    <Text>Fecha Final</Text>
    <TextInput
      value={alquiler.fechaFinal}
      onChangeText={(text) => setAlquiler({ ...alquiler, fechaFinal: text })}
    />

    <Text>Numero de Renta</Text>
    <TextInput
      value={alquiler.numeroRenta}
      onChangeText={(text) => setAlquiler({ ...alquiler, numeroRenta: text })}
    />

    <Button title="Guardar" onPress={guardarAlquiler} />

    <Text style={{ marginTop: 10, color: messageColor ? 'green' : 'red' }}>{message}</Text>
  </View>
  );
}
