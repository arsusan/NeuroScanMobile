import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: "#fff",
        headerLeft: () => (
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              {/* Using MaterialCommunityIcons for the brain icon (no warning) */}
              <MaterialCommunityIcons name="brain" size={22} color="#fff" />
            </View>
            <Text style={styles.headerLogo}>
              NeuroScan <Text style={styles.headerLogoAccent}>AI</Text>
            </Text>
          </View>
        ),
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={90}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: "#ffffff" }]}
            />
          ),
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: "Analyze",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "medkit" : "medkit-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "Clinical History",
          tabBarLabel: "Records",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Insights",
          tabBarLabel: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "stats-chart" : "stats-chart-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0f172a",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    display: "none",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    gap: 8,
  },
  headerIcon: {
    backgroundColor: "#2563eb",
    padding: 6,
    borderRadius: 10,
  },
  headerLogo: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerLogoAccent: {
    color: "#3b82f6",
    fontWeight: "600",
  },
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    elevation: 8, // Safe value for Android
    height: Platform.OS === "ios" ? 85 : 65,
    paddingBottom: Platform.OS === "ios" ? 28 : 8,
    paddingTop: 8,
    backgroundColor: Platform.OS === "ios" ? "transparent" : "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontWeight: "600",
    fontSize: 11,
    marginBottom: Platform.OS === "ios" ? 0 : 4,
  },
  tabBarItem: {
    paddingVertical: 4,
  },
});
