// app/index.js

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/dashboard" />;
}

// import { Text, View } from 'react-native';

// export default function App() {
//   return (
//     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
//       <Text style={{fontSize: 24}}>App Works!</Text>
//     </View>
//   );
// }