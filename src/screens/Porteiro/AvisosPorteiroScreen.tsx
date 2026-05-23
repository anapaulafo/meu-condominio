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
    padding: 20,
    backgroundColor: '#F4F6F8',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 24,
  },

  subTitle: {
    fontSize: 22,
    marginTop: 30,
    marginBottom: 14,
    fontWeight: '700',
    color: '#1F2937',
  },

  input: {
    borderWidth: 1,
    borderColor: '#D9E2EC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#1F2937',
  },

  textArea: {
    height: 120,
    textAlignVertical: 'top',
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

  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1E3A5F',
  },

  cardMessage: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 24,
    color: '#4B5563',
  },

  cardDate: {
    fontSize: 13,
    color: '#6B7280',
  },
})