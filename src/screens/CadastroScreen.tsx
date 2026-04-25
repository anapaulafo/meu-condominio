import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert
} from 'react-native'
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
    <View style={styles.container}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5
  },
  label: {
    marginTop: 10,
    marginBottom: 5
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  option: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    borderRadius: 5,
    marginHorizontal: 5
  },
  selectedOption: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff'
  },
  link: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center'
  }
})