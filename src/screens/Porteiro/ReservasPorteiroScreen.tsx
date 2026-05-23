import { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native'

import { supabase } from '../../services/supabase'

interface Reserva {
  id: string
  data: string
  hora_inicio: string
  hora_fim: string

  areas: {
    nome: string
  }

  users: {
    nome: string
    unidade: string
  }
}

export default function ReservasPorteiroScreen() {
  const [reservas, setReservas] = useState<Reserva[]>([])

  async function carregarReservas() {
    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        areas(nome),
        users(nome, unidade)
      `)
      .order('data', { ascending: false })

    if (!error && data) {
      setReservas(data)
    }
  }

  useEffect(() => {
    carregarReservas()
  }, [])

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={reservas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>
            {item.areas.nome}
          </Text>

          <Text>
            Morador: {item.users.nome}
          </Text>

          <Text>
            Unidade: {item.users.unidade}
          </Text>

          <Text>
            Data: {item.data}
          </Text>

          <Text>
            {item.hora_inicio} - {item.hora_fim}
          </Text>
        </View>
      )}
    />
  )
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

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1E3A5F',
  },
})