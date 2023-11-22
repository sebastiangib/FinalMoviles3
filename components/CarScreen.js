import { useState, useEffect } from "react";
import { CheckBox, View, FlatList,Modal  } from "react-native";
import { TextInput, Button, Avatar, Text } from "react-native-paper";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, onSnapshot,updateDoc} from "firebase/firestore";
import { stylesCar } from "../assets/styles/stylesCar";

export default function CarScreen() {
  const [vehiculos, setVehiculos] = useState([]);
  const [nuevoCarro, setNuevoCarro] = useState({
    numeroPlaca: "",
    marca: "",
    disponible: false,
  });
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState(true);
  const [actualizarPantalla, setActualizarPantalla] = useState(false); // Nueva variable de estado
  const [editarVisible, setEditarVisible] = useState(false);
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

  const db = getFirestore();

  const agregarCarro = async () => {
    if (
      nuevoCarro.numeroPlaca.trim() === "" ||
      nuevoCarro.marca.trim() === ""
    ) {
      setMessage("Por favor completa todos los campos.");
      setMessageColor(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "vehiculos"), nuevoCarro);
      setMessageColor(true);
      setMessage("Vehículo agregado correctamente...");
      setNuevoCarro({ numeroPlaca: "", marca: "", disponible: false });
      setActualizarPantalla(!actualizarPantalla);
    } catch (error) {
      setMessage("Error al agregar el vehículo... Intentelo de nuevo");
      setMessageColor(false);
    }
  };

  const eliminarVehiculo = async (id) => {
    try {
      await deleteDoc(doc(db, 'vehiculos', id));
      // Vuelve a cargar la lista después de eliminar el vehículo
      setActualizarPantalla(!actualizarPantalla);
    } catch (error) {
      console.error("Error al eliminar el vehículo con ID", id, ":", error);
    }
    }
  
    const abrirEditor = (item) => {
      setVehiculoSeleccionado(item);
      setEditarVisible(true);
    };

    const cerrarEditor = async () => {
      setEditarVisible(false);
      if (vehiculoSeleccionado) {
        try {
          const vehiculoRef = doc(db, 'vehiculos', vehiculoSeleccionado.id);
          await updateDoc(vehiculoRef, {
            numeroPlaca: vehiculoSeleccionado.numeroPlaca,
            marca: vehiculoSeleccionado.marca,
            disponible: vehiculoSeleccionado.disponible, // Asegúrate de que este valor refleje la disponibilidad actualizada
          });
          // Realizar una nueva consulta a la base de datos para actualizar los vehículos
          const vehiculosSnapshot = await getDocs(collection(db, 'vehiculos'));
          const vehiculosData = vehiculosSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setVehiculos(vehiculosData);
        } catch (error) {
          console.error('Error al actualizar el vehículo:', error);
        }
      }
      setVehiculoSeleccionado(null);
    };
  
  useEffect(() => {
    const db = getFirestore();
    const fetchVehiculos = async () => {
      const vehiculosSnapshot = await getDocs(collection(db, "vehiculos"));
      const vehiculosData = vehiculosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehiculos(vehiculosData);
    };

    fetchVehiculos();
  }, []);

  useEffect(() => {
    const db = getFirestore();
    const vehiculosRef = collection(db, "vehiculos");
  
    const unsubscribe = onSnapshot(vehiculosRef, (snapshot) => {
      const vehiculosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehiculos(vehiculosData);
    });
  
    return () => unsubscribe();
  }, []);
  

  const actualizarEstadoVehiculo = async (id) => {
    try {
      const vehiculoRef = doc(db, "vehiculos", id);
      await updateDoc(vehiculoRef, { disponible: false });
      // Vuelve a cargar la lista después de actualizar el vehículo
      const vehiculosSnapshot = await getDocs(collection(db, "vehiculos"));
      const vehiculosData = vehiculosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehiculos(vehiculosData);
    } catch (error) {
      console.error("Error al actualizar el estado del vehículo:", error);
    }
  };
  return (
    <View style={stylesCar.container}>
      <Avatar.Image
        style={stylesCar.avatar}
        size={150}
        source={require("../assets/imgs/imgcar.jpg")}
      />
      <View
        style={{
          borderWidth: 2,
          borderColor: "gray",
          borderRadius: 10,
          padding: 30,
        }}
      >
        <Text style={stylesCar.title}>Ingresa un nuevo Vehiculo</Text>
        <TextInput
          style={stylesCar.input}
          placeholder="Número de Placa"
          value={nuevoCarro.numeroPlaca}
          onChangeText={(text) =>
            setNuevoCarro({ ...nuevoCarro, numeroPlaca: text })
          }
        />
        <TextInput
          style={stylesCar.input}
          placeholder="Marca"
          value={nuevoCarro.marca}
          onChangeText={(text) => setNuevoCarro({ ...nuevoCarro, marca: text })}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Text>Estado: </Text>
          <CheckBox
            style={stylesCar.checkbox}
            title="Disponible"
            value={nuevoCarro.disponible}
            onValueChange={(value) =>
              setNuevoCarro({ ...nuevoCarro, disponible: value })
            }
          />
        </View>
        <Button
          mode="contained"
          icon="content-save-all"
          style={stylesCar.button}
          onPress={agregarCarro}
        >
          Agregar Carro
        </Button>
        <Text
          style={{
            marginTop: 10,
            textAlign: "center",
            color: messageColor ? "green" : "red",
          }}
        >
          {message}
        </Text>
        <Text style={stylesCar.titleLista}>Lista de Vehículos:</Text>
        <FlatList
  data={vehiculos}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View>
      <View style={{textAlign: 'left'}}>
        <Text style={stylesCar.listacarros}>
          {`Placa: ${item.numeroPlaca}, Marca: ${
            item.marca
          }, Estado: ${
            item.disponible ? "Disponible" : "No Disponible"
          }`}
        </Text>
      </View>
      <View style={{flexDirection:'row', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
      <Button
        onPress={() => eliminarVehiculo(item.id)}
        mode="contained"
        icon="delete"
        style={stylesCar.buttonEliminar}
      >
        Eliminar
      </Button>
      <Button
              onPress={() => abrirEditor(item)}
              mode="contained"
              icon="pencil"
              style={stylesCar.buttonEditar}
            >
              Editar
            </Button>
    </View>
    </View>
  )}
/>
<Modal visible={editarVisible} animationType="slide">
        <View style={stylesCar.modalContent}>
          <Text style={stylesCar.title}>Editar Vehículo</Text>
          <TextInput
            style={stylesCar.input}
            placeholder="Número de Placa"
            value={vehiculoSeleccionado ? vehiculoSeleccionado.numeroPlaca : ""}
            onChangeText={(text) =>
              setVehiculoSeleccionado({
                ...vehiculoSeleccionado,
                numeroPlaca: text,
              })
            }
          />
          <TextInput
            style={stylesCar.input}
            placeholder="Marca"
            value={vehiculoSeleccionado ? vehiculoSeleccionado.marca : ""}
            onChangeText={(text) =>
              setVehiculoSeleccionado({
                ...vehiculoSeleccionado,
                marca: text,
              })
            }
          />
          <View style={stylesCar.checkboxContainer}>
            <Text>Estado: </Text>
            <CheckBox
              style={stylesCar.checkbox}
              value={vehiculoSeleccionado ? vehiculoSeleccionado.disponible : false}
              onValueChange={(value) =>
                setVehiculoSeleccionado({
                  ...vehiculoSeleccionado,
                  disponible: value,
                })
              }
            />
          </View>
          <View style={stylesCar.modalButtons}>
            <Button
              mode="contained"
              onPress={() => {
                // Lógica para guardar los cambios...
                cerrarEditor();
              }}
            >
              Guardar Cambios
            </Button>
            <Button mode="outlined" onPress={cerrarEditor}>
              Cancelar
            </Button>
          </View>
        </View>
      </Modal>
      </View>
    </View>
  );
};