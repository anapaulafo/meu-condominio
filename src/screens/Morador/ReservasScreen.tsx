import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  FlatList,
  TouchableOpacity
} from 'react-native'

import { Calendar } from 'react-native-calendars'

import { supabase } from '../../services/supabase'

interface Area {
  id: string
  nome: string
}

interface Reserva {
  id: string
  user_id: string
  area_id: string
  data: string
  hora_inicio: string
  hora_fim: string

  areas?: {
    nome: string
  }

  users?: {
    nome: string
  }
}

export default function ReservasScreen() {
  const [areas, setAreas] = useState<Area[]>([])
  const [areaSelecionada, setAreaSelecionada] = useState('')

  const [dataSelecionada, setDataSelecionada] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFim, setHoraFim] = useState('')

  const [reservasArea, setReservasArea] = useState<Reserva[]>([])
  const [minhasReservas, setMinhasReservas] = useState<Reserva[]>([])

  // CARREGAR ÁREAS
  async function carregarAreas() {
    const { data, error } = await supabase
      .from('areas')
      .select('*')

    if (error) {
      Alert.alert('Erro', error.message)
      return
    }

    if (data) {
      setAreas(data)
    }
  }

  // MINHAS RESERVAS
  async function carregarMinhasReservas() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('reservas')
      .select(`
        *,
        areas(nome)
      `)
      .eq('user_id', user.id)
      .order('data', { ascending: false })

    if (error) {
      Alert.alert('Erro', error.message)
      return
    }

    if (data) {
      setMinhasReservas(data)
    }
  }

  // TODAS RESERVAS DA ÁREA/DATA
  async function carregarReservasArea(
    areaId: string,
    dataReserva: string
  ) {
    const { data: reservas, error } = await supabase
      .from('reservas')
      .select(`
        *,
        users(nome)
      `)
      .eq('area_id', areaId)
      .eq('data', dataReserva)
      .order('hora_inicio')

    if (error) {
      Alert.alert('Erro', error.message)
      return
    }

    if (reservas) {
      setReservasArea(reservas)
    }
  }

  function normalizarHora(hora: string) {
    const partes = hora.trim().split(':')

    if (partes.length !== 2) return null

    const horas = Number(partes[0])
    const minutos = Number(partes[1])

    if (
      Number.isNaN(horas) ||
      Number.isNaN(minutos) ||
      horas < 0 ||
      horas > 23 ||
      minutos < 0 ||
      minutos > 59
    ) {
      return null
    }

    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
  }

  // CRIAR RESERVA
  async function criarReserva() {
    if (
      !areaSelecionada ||
      !dataSelecionada ||
      !horaInicio ||
      !horaFim
    ) {
      Alert.alert(
        'Erro',
        'Preencha todos os campos'
      )
      return
    }

    const horaInicioNormalizada = normalizarHora(horaInicio)
    const horaFimNormalizada = normalizarHora(horaFim)

    if (!horaInicioNormalizada || !horaFimNormalizada) {
      Alert.alert(
        'Erro',
        'Informe os horários no formato HH:MM'
      )
      return
    }

    if (horaInicioNormalizada >= horaFimNormalizada) {
      Alert.alert(
        'Erro',
        'A hora final deve ser maior que a hora inicial'
      )
      return
    }

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      Alert.alert(
        'Erro',
        'Usuário não encontrado'
      )
      return
    }

    // BUSCAR CONFLITOS
    const {
      data: reservasExistentes,
      error: conflitoError
    } = await supabase
      .from('reservas')
      .select('id')
      .eq('area_id', areaSelecionada)
      .eq('data', dataSelecionada)
      .lt('hora_inicio', horaFimNormalizada)
      .gt('hora_fim', horaInicioNormalizada)

    if (conflitoError) {
      Alert.alert(
        'Erro',
        conflitoError.message
      )
      return
    }

    // VERIFICAR HORÁRIO
    const conflito =
      reservasExistentes &&
      reservasExistentes.length > 0

    if (conflito) {
      Alert.alert(
        'Horário ocupado',
        'Já existe reserva nesse horário.'
      )
      return
    }

    // INSERIR RESERVA
    const { error } = await supabase
      .from('reservas')
      .insert({
        user_id: user.id,
        area_id: areaSelecionada,
        data: dataSelecionada,
        hora_inicio: horaInicioNormalizada,
        hora_fim: horaFimNormalizada
      })

    if (error) {
      Alert.alert(
        'Erro',
        error.message
      )
      return
    }

    Alert.alert(
      'Sucesso',
      'Reserva realizada!'
    )

    setHoraInicio('')
    setHoraFim('')

    carregarReservasArea(
      areaSelecionada,
      dataSelecionada
    )

    carregarMinhasReservas()
  }

  useEffect(() => {
    carregarAreas()
    carregarMinhasReservas()
  }, [])

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>
            Nova Reserva
          </Text>

          <Text style={styles.label}>
            Escolha a área:
          </Text>

          <View style={styles.areaContainer}>
            {areas.map((area) => (
              <TouchableOpacity
                key={area.id}
                style={[
                  styles.areaButton,
                  areaSelecionada === area.id &&
                    styles.areaSelecionada
                ]}
                onPress={() => {
                  setAreaSelecionada(area.id)

                  if (dataSelecionada) {
                    carregarReservasArea(
                      area.id,
                      dataSelecionada
                    )
                  }
                }}
              >
                <Text style={styles.areaText}>
                  {area.nome}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Calendar
            onDayPress={(day) => {
              setDataSelecionada(day.dateString)

              if (areaSelecionada) {
                carregarReservasArea(
                  areaSelecionada,
                  day.dateString
                )
              }
            }}
            markedDates={{
              [dataSelecionada]: {
                selected: true
              }
            }}
          />

          {dataSelecionada !== '' && (
            <>
              <Text style={styles.subTitle}>
                Horários Ocupados
              </Text>

              {reservasArea.length === 0 ? (
                <Text>
                  Nenhuma reserva nesta data.
                </Text>
              ) : (
                reservasArea.map((reserva) => (
                  <View
                    style={styles.card}
                    key={reserva.id}
                  >
                    <Text style={styles.cardHorario}>
                      {reserva.hora_inicio} -{' '}
                      {reserva.hora_fim}
                    </Text>

                    {reserva.users?.nome && (
                      <Text>
                        Reservado por:{' '}
                        {reserva.users.nome}
                      </Text>
                    )}
                  </View>
                ))
              )}
            </>
          )}

          <TextInput
            placeholder="Hora início (18:00)"
            style={styles.input}
            value={horaInicio}
            onChangeText={setHoraInicio}
          />

          <TextInput
            placeholder="Hora fim (20:00)"
            style={styles.input}
            value={horaFim}
            onChangeText={setHoraFim}
          />

          <Button
            title="Reservar"
            onPress={criarReserva}
          />

          <Text style={styles.subTitle}>
            Minhas Reservas
          </Text>
        </View>
      }
      data={minhasReservas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardHorario}>
            {item.areas?.nome}
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

  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1E3A5F',
  },

  areaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },

  areaButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9E2EC',
  },

  areaSelecionada: {
    backgroundColor: '#1E3A5F',
    borderColor: '#1E3A5F',
  },

  areaText: {
    color: '#1F2937',
    fontWeight: '700',
  },

  input: {
    borderWidth: 1,
    borderColor: '#D9E2EC',
    padding: 16,
    marginTop: 10,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
  },

  subTitle: {
    fontSize: 22,
    marginTop: 30,
    marginBottom: 16,
    fontWeight: '700',
    color: '#1F2937',
  },

  card: {
  },
})
