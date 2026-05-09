import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";

import { supabase } from "../../services/supabase";

interface Aviso {
  id: string;
  titulo: string;
  mensagem: string;
  data_criacao: string;
}

export default function AvisosPorteiroScreen() {
  const [titulo, setTitulo] = useState("");
  const [mensagem, setMensagem] = useState("");
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

  async function publicarAviso() {
    if (!titulo || !mensagem) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Erro", "Usuário não encontrado");
      return;
    }

    const { error } = await supabase.from("avisos").insert({
      titulo,
      mensagem,
      criado_por: user.id,
    });

    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    Alert.alert("Sucesso", "Aviso publicado!");

    setTitulo("");
    setMensagem("");

    carregarAvisos();
  }

  useEffect(() => {
    carregarAvisos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publicar Aviso</Text>

      <TextInput
        placeholder="Título"
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        placeholder="Mensagem"
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={5}
        value={mensagem}
        onChangeText={setMensagem}
      />

      <Button title="Publicar" onPress={publicarAviso} />

      <Text style={styles.subTitle}>Avisos Publicados</Text>

      <FlatList
        data={avisos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>

            <Text style={styles.cardMessage}>{item.mensagem}</Text>

            <Text style={styles.cardDate}>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 20,
    marginTop: 25,
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardMessage: {
    fontSize: 16,
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 12,
    color: "gray",
  },
});
