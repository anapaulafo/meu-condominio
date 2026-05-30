import { useEffect, useState } from 'react'

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native'

import { SafeAreaView } from "react-native-safe-area-context";

import { supabase } from '../../services/supabase'

interface Encomenda {
  id: string
  unidade: string
  status: string
  data_recebimento: string
  foto_url: string
}

export default function EncomendasScreen() {
  const [loading, setLoading] = useState(true)
  const [encomendas, setEncomendas] = useState<
    Encomenda[]
  >([])

  async function carregarEncomendas() {
    setLoading(true)

    try {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        setEncomendas([])
        return
      }

      // BUSCAR UNIDADE DO MORADOR
      const { data: usuario } = await supabase
        .from('users')
        .select('unidade')
        .eq('id', user.id)
        .single()

      if (!usuario) {
        setEncomendas([])
        return
      }

      const { data, error } = await supabase
        .from('encomendas')
        .select('*')
        .eq('unidade', usuario.unidade)
        .order('data_recebimento', {
          ascending: false
        })

      if (error) {
        Alert.alert('Erro', error.message)
        return
      }

      if (data) {
        setEncomendas(data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarEncomendas()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>
            Carregando encomendas...
          </Text>
        </View>
      ) : (
      <FlatList
        contentContainerStyle={styles.container}
        data={encomendas}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
        <Text style={styles.title}>
          Minhas Encomendas
        </Text>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.status}>
            Status: {item.status}
          </Text>

          {item.foto_url ? (
            <Image
              source={{ uri: item.foto_url }}
              style={styles.image}
            />
          ) : (
            <Text>
              Sem foto disponível
            </Text>
          )}

          <Text style={styles.data}>
            {new Date(
              item.data_recebimento
            ).toLocaleString()}
          </Text>
        </View>
      )}
      />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    color: '#1F2937',
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1E3A5F',
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  status: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E3A5F',
  },

  data: {
    marginTop: 12,
    color: '#6B7280',
  },

  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginTop: 10,
  },
})