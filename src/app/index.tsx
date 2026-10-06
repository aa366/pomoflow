import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActivityIndicator } from 'react-native-paper';


export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View className='bg-slate-400 w-40 h-40' />
      <Text className='text-red-700' >Hello</Text>
      <ActivityIndicator />
    </SafeAreaView>
  );
}

