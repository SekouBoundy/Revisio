import { StyleSheet, Text, View } from 'react-native';

export default function StudyPlannerScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Planificateur d’études</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, alignItems:'center', justifyContent:'center' },
  text: { fontSize:16 },
});
