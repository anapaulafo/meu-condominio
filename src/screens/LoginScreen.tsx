import { useState } from 'react'
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native'
import { supabase } from '../services/supabase'

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      Alert.alert('Erro', error.message)
    } else {
      navigation.replace('Home')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

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

      <Button title="Entrar" onPress={handleLogin} />

      <Text onPress={() => navigation.navigate('Cadastro')}>
        Não tem conta? Cadastre-se
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
})