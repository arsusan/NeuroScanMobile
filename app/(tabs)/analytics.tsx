import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Your Final Year Project Assets
const CLOUDINARY_ASSETS = {
  trainingHistory:
    "https://res.cloudinary.com/djxhxejwr/image/upload/v1771883852/training_history_az8vjj.png",
  confusionMatrix:
    "https://res.cloudinary.com/djxhxejwr/image/upload/v1771883851/sample_test_results_bkc3ea.png",
};

const classData = [
  { name: "Pituitary", recall: 0.97, color: "#3b82f6" },
  { name: "No Tumor", recall: 0.91, color: "#10b981" },
  { name: "Meningioma", recall: 0.84, color: "#6366f1" },
  { name: "Glioma", recall: 0.7, color: "#f43f5e" },
];

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>MODEL VALIDATION</Text>
          <Text style={styles.headerSubtitle}>
            CNN-2026-02-18 | Dataset N=656
          </Text>
        </View>

        {/* 1. KPI Grid */}
        <View style={styles.kpiGrid}>
          {[
            {
              label: "Accuracy",
              val: "86%",
              icon: "analytics",
              color: "#3b82f6",
            },
            {
              label: "Precision",
              val: "0.86",
              icon: "medal-outline",
              color: "#10b981",
            },
            {
              label: "Recall",
              val: "0.86",
              icon: "eye-outline",
              color: "#6366f1",
            },
            {
              label: "F1-Score",
              val: "0.86",
              icon: "shield-checkmark-outline",
              color: "#f43f5e",
            },
          ].map((item, i) => (
            <View key={i} style={styles.kpiCard}>
              <Ionicons name={item.icon as any} size={20} color={item.color} />
              <Text style={styles.kpiVal}>{item.val}</Text>
              <Text style={styles.kpiLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* 2. Sensitivity Chart (Visualized with simple bars for performance) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CLASS-SPECIFIC SENSITIVITY</Text>
          {classData.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barLabelRow}>
                <Text style={styles.barLabel}>{item.name}</Text>
                <Text style={styles.barValue}>
                  {(item.recall * 100).toFixed(0)}%
                </Text>
              </View>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${item.recall * 100}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* 3. Critical Insight Card */}
        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Ionicons name="warning" size={20} color="#fbbf24" />
            <Text style={styles.insightTitle}>Critical Confusion Insight</Text>
          </View>
          <Text style={styles.insightBody}>
            Evaluation identifies Glioma (70% recall) as the primary clinical
            challenge. Implement multi-view analysis to improve differentiation.
          </Text>
        </View>

        {/* 4. Visual Evidence - Cloudinary Images */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionHeading}>STATISTICAL CONVERGENCE</Text>
          <Image
            source={{ uri: CLOUDINARY_ASSETS.trainingHistory }}
            style={styles.statsImage}
            resizeMode="contain"
          />

          <Text style={[styles.sectionHeading, { marginTop: 20 }]}>
            DIAGNOSTIC CONFUSION MAP
          </Text>
          <Image
            source={{ uri: CLOUDINARY_ASSETS.confusionMatrix }}
            style={styles.statsImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { padding: 20, paddingBottom: 100 },
  header: { marginBottom: 20 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#0f172a",
    fontStyle: "italic",
  },
  headerSubtitle: { fontSize: 13, color: "#64748b", fontWeight: "500" },

  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  kpiCard: {
    width: (width - 50) / 2,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  kpiVal: { fontSize: 20, fontWeight: "bold", color: "#0f172a", marginTop: 5 },
  kpiLabel: {
    fontSize: 10,
    color: "#94a3b8",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#94a3b8",
    marginBottom: 15,
    letterSpacing: 1,
  },
  barContainer: { marginBottom: 15 },
  barLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  barLabel: { fontSize: 14, fontWeight: "600", color: "#1e293b" },
  barValue: { fontSize: 14, fontWeight: "bold", color: "#1e293b" },
  barBg: {
    height: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4 },

  insightCard: {
    backgroundColor: "#0f172a",
    padding: 20,
    borderRadius: 25,
    marginBottom: 25,
  },
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  insightTitle: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  insightBody: { color: "#94a3b8", fontSize: 13, lineHeight: 20 },

  imageSection: { marginTop: 10 },
  sectionHeading: {
    fontSize: 10,
    fontWeight: "900",
    color: "#94a3b8",
    marginBottom: 10,
  },
  statsImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
});
 