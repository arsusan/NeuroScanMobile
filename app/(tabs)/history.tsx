import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BACKEND_URL = "https://arsusan-neuroscan.hf.space";

interface ScanRecord {
  id: number;
  user_name: string;
  filename: string;
  prediction: string;
  confidence: string;
  heatmap_url: string;
  created_at: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not connect to medical records server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const generateReport = async (item: ScanRecord) => {
    const fullHeatmapUrl = item.heatmap_url.startsWith("http")
      ? item.heatmap_url
      : `${BACKEND_URL}${item.heatmap_url}`;

    const html = `
      <html>
        <body style="font-family: Helvetica; padding: 30px;">
          <h1 style="color: #1e3a8a;">CLINICAL RECORD #${item.id}</h1>
          <p><strong>Patient:</strong> ${item.user_name}</p>
          <p><strong>Result:</strong> ${item.prediction.toUpperCase()}</p>
          <p><strong>Confidence:</strong> ${item.confidence}</p>
          <p><strong>Date:</strong> ${new Date(item.created_at).toLocaleDateString()}</p>
          <hr/>
          <div style="text-align: center;">
            <img src="${fullHeatmapUrl}" style="width: 350px; border-radius: 10px; margin-top: 20px;" />
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (e) {
      Alert.alert("Error", "Failed to generate PDF report.");
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.user_name.toLowerCase().includes(search.toLowerCase()) ||
      item.prediction.toLowerCase().includes(search.toLowerCase()),
  );

  const renderItem = ({ item }: { item: ScanRecord }) => (
    <View style={styles.recordCard}>
      <View style={styles.cardInfo}>
        <View style={styles.iconContainer}>
          <Ionicons name="person-outline" size={20} color="#64748b" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName}>{item.user_name}</Text>
          <Text style={styles.dateText}>
            {new Date(item.created_at).toDateString()}
          </Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor:
                  item.prediction === "notumor" ? "#f0fdf4" : "#fef2f2",
              },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                {
                  color: item.prediction === "notumor" ? "#16a34a" : "#dc2626",
                },
              ]}
            >
              {item.prediction.toUpperCase()} • {item.confidence}
            </Text>
          </View>
        </View>
        {/* FIXED ICON SYNTAX BELOW */}
        <TouchableOpacity
          style={styles.downloadIcon}
          onPress={() => generateReport(item)}
        >
          <Ionicons name="cloud-download-outline" size={24} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Clinical History</Text>
        <Text style={styles.headerCount}>{history.length} Total Scans</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#94a3b8"
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Search records..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={filteredHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No records found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    padding: 25,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  headerCount: { fontSize: 13, color: "#64748b", marginTop: 4 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  searchInput: { flex: 1, height: 50, fontSize: 16 },
  recordCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    elevation: 2,
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  patientName: { fontSize: 17, fontWeight: "700", color: "#1e293b" },
  dateText: { fontSize: 12, color: "#94a3b8", marginBottom: 8 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: { fontSize: 11, fontWeight: "bold" },
  downloadIcon: { padding: 10, backgroundColor: "#eff6ff", borderRadius: 12 }, // FIXED: missing brace was here
  emptyText: { textAlign: "center", marginTop: 50, color: "#94a3b8" },
});
