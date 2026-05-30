import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '../services/supabase'

export default function CadastroScreen({ navigation }: any) {
  const [nome, setNome] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [role, setRole] = useState<'morador' | 'porteiro'>('morador')
  const [unidade, setUnidade] = useState<string>('')

  async function handleCadastro() {
    if (!nome || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos')
      return
    }

    if (role === 'morador' && !unidade) {
      Alert.alert('Erro', 'Informe a unidade')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      Alert.alert('Erro', error.message)
      return
    }

    const userId = data.user?.id

    if (!userId) {
      Alert.alert('Erro', 'Não foi possível obter o usuário')
      return
    }

    const { error: dbError } = await supabase.from('users').insert({
      id: userId,
      nome,
      email,
      role,
      unidade: role === 'morador' ? unidade : null
    })

    if (dbError) {
      Alert.alert('Erro', dbError.message)
      return
    }

    Alert.alert('Sucesso', 'Conta criada!')
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          placeholder="Nome"
          style={styles.input}
          onChangeText={setNome}
        />

        <TextInput
          placeholder="Email"
          style={styles.input}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Tipo de usuário:</Text>

        <View style={styles.row}>
          <Text
            style={[
              styles.option,
              role === 'morador' && styles.selectedOption
            ]}
            onPress={() => setRole('morador')}
          >
            Morador
          </Text>

          <Text
            style={[
              styles.option,
              role === 'porteiro' && styles.selectedOption
            ]}
            onPress={() => setRole('porteiro')}
          >
            Porteiro
          </Text>
        </View>

        {role === 'morador' && (
          <TextInput
            placeholder="Unidade (ex: Apt 101)"
            style={styles.input}
            onChangeText={setUnidade}
          />
        )}

        <Button title="Cadastrar" onPress={handleCadastro} />

        <Text style={styles.link} onPress={() => navigation.goBack()}>
          Já tem conta? Voltar para login
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F4F6F8',
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 30,
    textAlign: 'center',
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 16,
    color: '#1F2937',
  },

  label: {
    marginTop: 10,
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  option: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#D9E2EC',
    textAlign: 'center',
    borderRadius: 16,
    marginHorizontal: 5,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
    fontWeight: '600',
  },

  selectedOption: {
    backgroundColor: '#1E3A5F',
    color: '#FFFFFF',
    borderColor: '#1E3A5F',
  },

  link: {
    marginTop: 20,
    color: '#3B82F6',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
})