import { Tabs } from 'expo-router';
import { ChartNoAxesCombined, Settings, Timer } from "lucide-react-native";

export default function Layout() {
    return (
        <Tabs
            initialRouteName='timer'
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60,
                    margin: 0,
                    padding: 0,
                    display: "flex",
                    paddingTop: 10,
                    // position: "absolute",

                }
            }} >

            {/* <Tabs.Screen name='Records'
                options={{
                    tabBarIcon: ({ color }) => <Archive size={32} color={color} />
                }} /> */}
            <Tabs.Screen name='timer'
                options={{
                    tabBarIcon: ({ color }) => <Timer size={32} color={color} />
                }}
            />
            <Tabs.Screen name='statics'
                options={{
                    tabBarIcon: ({ color }) => <ChartNoAxesCombined size={32} color={color} />
                }} />
            <Tabs.Screen name='settings'
                options={{
                    tabBarIcon: ({ color }) => <Settings size={32} color={color} />
                }} />
        </Tabs>
    )
}