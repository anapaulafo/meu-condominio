import { View, Text, Button, StyleSheet, Alert } from 'react-native'
import { supabase } from '../services/supabase'

export default function HomeScreen({ navigation }: any) {
  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      Alert.alert('Erro', error.message)
    } else {
      navigation.replace('Login')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button title="Sair" onPress={handleLogout} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F6F8',
    padding: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 30,
  },
})