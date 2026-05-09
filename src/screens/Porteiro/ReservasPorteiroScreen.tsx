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
    padding: 15
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  }
})