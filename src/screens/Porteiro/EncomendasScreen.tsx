import { useEffect, useState } from 'react'

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  Alert,
  Image
} from 'react-native'

import * as ImagePicker from 'expo-image-picker'

import { supabase } from '../../services/supabase'

interface Encomenda {
  id: string
  unidade: string
  foto_url: string
  status: string
  data_recebimento: string
}

export default function EncomendasScreen() {
  const [unidade, setUnidade] = useState('')

  const [foto, setFoto] = useState<string | null>(null)

  const [encomendas, setEncomendas] = useState<
    Encomenda[]
  >([])

  async function carregarEncomendas() {
    const { data, error } = await supabase
      .from('encomendas')
      .select('*')
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
  }

  async function tirarFoto() {
    const permissao =
      await ImagePicker.requestCameraPermissionsAsync()

    if (!permissao.granted) {
      Alert.alert(
        'Erro',
        'Permissão da câmera negada'
      )
      return
    }

    const resultado =
      await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.5
      })

    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri)
    }
  }

  async function uploadImagem(uri: string) {
    try {
      const response = await fetch(uri)

      const arrayBuffer =
        await response.arrayBuffer()

      const nomeArquivo = `${Date.now()}.jpg`

      const { error } = await supabase.storage
        .from('encomendas')
        .upload(nomeArquivo, arrayBuffer, {
          contentType: 'image/jpeg'
        })

      if (error) {
        console.log(error)

        Alert.alert(
          'Erro upload',
          error.message
        )

        return null
      }

      const { data } = supabase.storage
        .from('encomendas')
        .getPublicUrl(nomeArquivo)

      console.log(
        'URL PUBLICA:',
        data.publicUrl
      )

      return data.publicUrl
    } catch (err) {
      console.log(err)

      Alert.alert(
        'Erro',
        'Erro ao enviar imagem'
      )

      return null
    }
  }

  async function cadastrarEncomenda() {
    try {
      if (!unidade) {
        Alert.alert(
          'Erro',
          'Informe a unidade'
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

      let fotoUrl = ''

      // UPLOAD DA FOTO
      if (foto) {
        Alert.alert(
          'Upload',
          'Enviando foto...'
        )

        const uploadedUrl =
          await uploadImagem(foto)

        if (!uploadedUrl) {
          Alert.alert(
            'Erro',
            'Falha ao enviar imagem'
          )
          return
        }

        fotoUrl = uploadedUrl
      }

      // INSERIR ENCOMENDA
      const { error } = await supabase
        .from('encomendas')
        .insert({
          unidade,
          foto_url: fotoUrl,
          recebido_por: user.id,
          status: 'pendente'
        })

      if (error) {
        Alert.alert(
          'Erro ao salvar',
          error.message
        )
        return
      }

      // LIMPAR CAMPOS
      setUnidade('')
      setFoto(null)

      // RECARREGAR LISTA
      carregarEncomendas()

      // SUCESSO
      Alert.alert(
        'Sucesso',
        'Encomenda registrada com sucesso!'
      )
    } catch (err) {
      console.log(err)

      Alert.alert(
        'Erro',
        'Erro inesperado ao registrar encomenda'
      )
    }
  }

  async function marcarRetirado(id: string) {
    const { error } = await supabase
      .from('encomendas')
      .update({
        status: 'retirado'
      })
      .eq('id', id)

    if (error) {
      Alert.alert('Erro', error.message)
      return
    }

    carregarEncomendas()
  }

  useEffect(() => {
    carregarEncomendas()
  }, [])

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.container}>
          <Text style={styles.title}>
            Registrar Encomenda
          </Text>

          <TextInput
            placeholder="Unidade"
            style={styles.input}
            value={unidade}
            onChangeText={setUnidade}
          />

          <Button
            title="Tirar Foto"
            onPress={tirarFoto}
          />

          {foto && (
            <Image
              source={{ uri: foto }}
              style={styles.image}
            />
          )}

          <View style={{ marginTop: 15 }}>
            <Button
              title="Registrar"
              onPress={cadastrarEncomenda}
            />
          </View>

          <Text style={styles.subTitle}>
            Encomendas
          </Text>
        </View>
      }
      data={encomendas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text>
            Unidade: {item.unidade}
          </Text>

          <Text>
            Status: {item.status}
          </Text>

          {item.foto_url ? (
            <Image
              source={{ uri: item.foto_url }}
              style={styles.image}
            />
          ) : null}

          <Text>
            {new Date(
              item.data_recebimento
            ).toLocaleString()}
          </Text>

          {item.status === 'pendente' && (
            <Button
              title="Marcar como retirado"
              onPress={() =>
                marcarRetirado(item.id)
              }
            />
          )}
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
    color: '#1E3A5F',
    marginBottom: 24,
  },

  subTitle: {
    fontSize: 22,
    marginTop: 30,
    marginBottom: 16,
    fontWeight: '700',
    color: '#1F2937',
  },

  input: {
    borderWidth: 1,
    borderColor: '#D9E2EC',
    padding: 16,
    marginBottom: 14,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
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

  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 12,
  },
})