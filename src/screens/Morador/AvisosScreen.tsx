import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    borderLeftWidth: 5,
    borderLeftColor: '#3B82F6',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  titulo: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1E3A5F',
  },

  mensagem: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
    color: '#4B5563',
  },

  data: {
    fontSize: 13,
    color: '#6B7280',
  },
})
