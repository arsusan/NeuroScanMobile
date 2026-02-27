import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const BACKEND_URL = "https://arsusan-neuroscan.hf.space";

export default function DiagnosticDashboard() {
  const [patientName, setPatientName] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your gallery to upload scans.",
      );
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
      setResult(null);
    }
  };

  const generatePDF = async () => {
    if (!result || !patientName) return;

    const fullHeatmapUrl = result.heatmap_url.startsWith("http")
      ? result.heatmap_url
      : `${BACKEND_URL}${result.heatmap_url}`;

    const htmlContent = `
      <html>
        <body style="font-family: Helvetica; padding: 40px; color: #1e293b;">
          <h1 style="color: #1e3a8a; text-align: center;">NEUROSCAN AI REPORT</h1>
          <div style="border-bottom: 2px solid #e2e8f0; margin-bottom: 20px;"></div>
          <p><strong>Patient:</strong> ${patientName.toUpperCase()}</p>
          <p><strong>Diagnosis:</strong> ${result.prediction.toUpperCase()}</p>
          <p><strong>Confidence:</strong> ${result.confidence}</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          <div style="text-align: center; margin-top: 30px;">
            <img src="${fullHeatmapUrl}" style="width: 400px; border-radius: 15px;" />
            <p style="color: #64748b; font-size: 12px;">Neural Activation Heatmap (Grad-CAM)</p>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to generate report.");
    }
  };

  const analyzeScan = async () => {
    if (!image || !patientName) {
      return Alert.alert(
        "Required",
        "Please provide patient name and MRI image.",
      );
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("user_name", patientName);

    const fileToUpload = {
      uri: image,
      name: "mri_scan.jpg",
      type: "image/jpeg",
    } as any;

    formData.append("file", fileToUpload);

    try {
      const response = await axios.post(`${BACKEND_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Connection Error", "Check if the server is awake.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Compact Header - no icon, reduced spacing */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Diagnostic Console</Text>
              <Text style={styles.headerSubtitle}>
                AI-Powered Neuro Imaging
              </Text>
            </View>
            <View style={styles.statusBadge}>
              <View style={styles.pulseDot} />
              <Text style={styles.statusText}>AI ACTIVE</Text>
            </View>
          </View>

          {/* Registration & Upload Card */}
          <View style={styles.card}>
            <Text style={styles.sectionLabel}>PATIENT DATA</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Patient Full Name"
              value={patientName}
              onChangeText={setPatientName}
              placeholderTextColor="#94a3b8"
            />

            <TouchableOpacity
              style={[styles.uploadZone, image && styles.uploadZoneActive]}
              onPress={pickImage}
              activeOpacity={0.7}
            >
              {image ? (
                <Image source={{ uri: image }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={48}
                    color="#94a3b8"
                  />
                  <Text style={styles.uploadText}>Tap to select MRI scan</Text>
                  <Text style={styles.uploadHint}>Supports JPG, PNG</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btnPrimary,
                (!image || !patientName || loading) && styles.btnDisabled,
              ]}
              onPress={analyzeScan}
              disabled={loading || !!result}
              activeOpacity={0.8}
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.btnText}>Processing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="analytics-outline" size={20} color="#fff" />
                  <Text style={styles.btnText}>
                    {result ? "Analysis Complete" : "Run AI Diagnostic"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Result Card */}
          {result && (
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={styles.resultTitle}>Clinical Findings</Text>
                <TouchableOpacity
                  onPress={generatePDF}
                  style={styles.downloadIcon}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="#2563eb"
                  />
                </TouchableOpacity>
              </View>

              <View
                style={[
                  styles.diagnosisBox,
                  {
                    backgroundColor:
                      result.prediction === "notumor" ? "#e6f7e6" : "#fee9e9",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.diagnosisText,
                    {
                      color:
                        result.prediction === "notumor" ? "#2e7d32" : "#b71c1c",
                    },
                  ]}
                >
                  {result.prediction.toUpperCase()}
                </Text>
                <Text style={styles.confidenceText}>
                  Confidence: {result.confidence}
                </Text>
              </View>

              <Text style={styles.heatmapTitle}>NEURAL ATTENTION MAP</Text>
              <Image
                source={{
                  uri: result.heatmap_url.startsWith("http")
                    ? result.heatmap_url
                    : `${BACKEND_URL}${result.heatmap_url}`,
                }}
                style={styles.heatmapImage}
                resizeMode="cover"
              />

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  setResult(null);
                  setImage(null);
                  setPatientName("");
                }}
                activeOpacity={0.6}
              >
                <Text style={styles.resetText}>CLEAR SESSION</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0a0f1e",
  },
  scrollContainer: {
    backgroundColor: "#f1f5f9",
    paddingBottom: 40,
  },
  header: {
    backgroundColor: "#0a0f1e",
    paddingHorizontal: 20,
    paddingVertical: 12, // reduced vertical padding
    paddingTop: Platform.OS === "android" ? 20 : 12, // safe adjustment
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22, // slightly smaller
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    marginLeft: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
    marginRight: 6,
  },
  statusText: {
    color: "#10b981",
    fontSize: 11,
    fontWeight: "600",
  },
  card: {
    margin: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: "#f8fafc",
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    color: "#1e293b",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  uploadZone: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#f8fafc",
  },
  uploadZoneActive: {
    borderStyle: "solid",
    borderColor: "#2563eb",
  },
  uploadPlaceholder: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  uploadText: {
    color: "#334155",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  uploadHint: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  btnPrimary: {
    backgroundColor: "#2563eb",
    padding: 18,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnDisabled: {
    backgroundColor: "#94a3b8",
    shadowOpacity: 0.1,
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  resultCard: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  downloadIcon: {
    padding: 10,
    backgroundColor: "#eff6ff",
    borderRadius: 40,
  },
  diagnosisBox: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  diagnosisText: {
    fontSize: 26,
    fontWeight: "700",
  },
  confidenceText: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
  },
  heatmapTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  heatmapImage: {
    width: "100%",
    height: 260,
    borderRadius: 18,
    backgroundColor: "#0f172a",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  resetBtn: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 30,
    backgroundColor: "#fee2e2",
  },
  resetText: {
    color: "#b91c1c",
    fontWeight: "700",
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
