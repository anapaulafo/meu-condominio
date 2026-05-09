import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { supabase } from "../../services/supabase";

interface Aviso {
  id: string;
  titulo: string;
  mensagem: string;
  data_criacao: string;
}

export default function AvisosScreen() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  async function carregarAvisos() {
    const { data, error } = await supabase
      .from("avisos")
      .select("*")
      .order("data_criacao", { ascending: false });

    if (!error && data) {
      setAvisos(data);
    }
  }

  useEffect(() => {
    carregarAvisos();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={avisos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.titulo}>{item.titulo}</Text>

            <Text style={styles.mensagem}>{item.mensagem}</Text>

            <Text style={styles.data}>
              {new Date(item.data_criacao).toLocaleString()}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f2f2f2",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  mensagem: {
    fontSize: 16,
    marginBottom: 10,
  },
  data: {
    fontSize: 12,
    color: "gray",
  },
});
