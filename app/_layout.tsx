import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      {/* Set status bar to light to contrast with our dark navy headers */}
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          // Header configuration for any screen that is NOT in the tab bar
          headerStyle: {
            backgroundColor: "#0f172a", // Matching your NeuroScan Navy
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          // Animation style for page transitions
          animation: "fade_from_bottom",
          headerShown: false, // We hide the root stack header because (tabs) has its own
        }}
      >
        {/* The main group containing your 3 tabs */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* You can add more screens here later, for example:
            <Stack.Screen name="settings" options={{ presentation: 'modal', title: 'User Settings' }} /> 
        */}
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a", // Prevents white flashes during screen transitions
  },
});
