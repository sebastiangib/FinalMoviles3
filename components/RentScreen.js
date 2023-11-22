import React, { useState, useEffect } from 'react';
import { TextInput, Button, View, Picker, Text } from 'react-native';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { devolucionStyles } from '../assets/styles/devolucion';

export default function RentScreen() {
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);
  const [fechaInicial, setFechaInicial] = useState('');
  const [fechaFinal, setFechaFinal] = useState('');
  const [numeroRenta, setNumeroRenta] = useState('');
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState({});

  useEffect(() => {
    const db = getFirestore();
    const fetchVehiculosDisponibles = async () => {
      try {
        const vehiculosSnapshot = await getDocs(collection(db, 'vehiculos'));
        const vehiculosData = vehiculosSnapshot.docs
          .filter((doc) => doc.data().disponible)
          .map((doc) => ({
            id: doc.id,
            numeroPlaca: doc.data().numeroPlaca,
          }));
        setVehiculosDisponibles(vehiculosData);
      } catch (error) {
        console.error('Error al cargar vehículos disponibles:', error);
      }
    };

    fetchVehiculosDisponibles();
  }, []);

  const guardarAlquiler = async () => {
    console.log('vehiculoSeleccionado:', vehiculoSeleccionado);
    console.log('fechaInicial:', fechaInicial);
    console.log('fechaFinal:', fechaFinal);
    console.log('numeroRenta:', numeroRenta);
  
    if (!vehiculoSeleccionado || !fechaInicial || !fechaFinal || !numeroRenta) {
      console.error('Por favor completa todos los campos.');
      return;
    }

    const db = getFirestore();
    try {
      // Objeto con los detalles del alquiler
      const alquiler = {
        vehiculoId: vehiculoSeleccionado,
        fechaInicial,
        fechaFinal,
        numeroRenta,
      };

      // Agregar el objeto a la colección 'alquileres'
      await addDoc(collection(db, 'alquileres'), alquiler);
 // Actualizar el estado del vehículo seleccionado a No Disponible
 await actualizarEstadoVehiculo(vehiculoSeleccionado.id);

 console.log('Alquiler guardado exitosamente.');

// Reiniciar los campos de entrada
setFechaInicial('');
setFechaFinal('');
setNumeroRenta('');
setVehiculoSeleccionado(null);
} catch (error) {
console.error('Error al guardar el alquiler:', error);
}
  }

  const actualizarEstadoVehiculo = async (id) => {
    try {
      const vehiculoRef = doc(db, 'vehiculos', id);
      await updateDoc(vehiculoRef, { disponible: false });
      // Vuelve a cargar la lista después de actualizar el vehículo
      const vehiculosSnapshot = await getDocs(collection(db, 'vehiculos'));
      const vehiculosData = vehiculosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehiculosDisponibles(vehiculosData);
    } catch (error) {
      console.error('Error al actualizar el estado del vehículo:', error);
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
      <Text>Fecha Inicial</Text>
      <TextInput value={fechaInicial} onChangeText={setFechaInicial} />

      <Text>Fecha Final</Text>
      <TextInput value={fechaFinal} onChangeText={setFechaFinal} />

      <Text>Numero de Renta</Text>
      <TextInput value={numeroRenta} onChangeText={setNumeroRenta} />

      {/* Dropdown de vehículos disponibles */}
      <Picker
  selectedValue={vehiculoSeleccionado ? vehiculoSeleccionado.id : ''}
  onValueChange={async (itemValue) => {
    const selectedVehicle = vehiculosDisponibles.find(
      (vehiculo) => vehiculo.id === itemValue
    );
    setVehiculoSeleccionado(selectedVehicle || {});

    // Actualizar el estado de disponibilidad del vehículo seleccionado
    await actualizarEstadoVehiculo(itemValue);
  }}
>
  {/* Agrega una opción por defecto */}
  <Picker.Item label="Seleccione un vehículo" value="" />

  {vehiculosDisponibles.map((vehiculo) => (
    <Picker.Item
      key={vehiculo.id}
      label={vehiculo.numeroPlaca}
      value={vehiculo.id}
    />
  ))}
</Picker>

      <Button title="Guardar" onPress={guardarAlquiler} />
    </View>
    </View>
  );
}
