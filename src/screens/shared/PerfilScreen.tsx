import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert
} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from '../../services/supabase'

export default function PerfilScreen({
  navigation
}: any) {
  async function handleLogout() {
    const { error } =
      await supabase.auth.signOut()

    if (error) {
      Alert.alert('Erro', error.message)
      return
    }

    navigation.replace('Login')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        Perfil
      </Text>

      <Button
        title="Sair"
        onPress={handleLogout}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F4F6F8',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 30,
  },
})