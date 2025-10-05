import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { updateProfile, updateEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, storage, firestore } from "../../config/firebase";

const db = firestore;
const { width, height } = Dimensions.get('window');

export default function EditProfile() {
	const user = auth.currentUser;
	const [loading, setLoading] = useState(true);
	const [editField, setEditField] = useState<string | null>(null);
	const [profile, setProfile] = useState({
		name: "",
		email: "",
		height: "",
		weight: "",
		gender: "",
		birthdate: ""
	});
	const [fieldValue, setFieldValue] = useState("");

	useEffect(() => {
		async function fetchProfile() {
			if (!user) return;
			try {
				// Busca dados extras do Firestore
				const docRef = doc(db, "users", user.uid);
				const docSnap = await getDoc(docRef);
				let data = docSnap.exists() ? docSnap.data() : {};
				setProfile({
					name: user.displayName || data.name || "",
					email: user.email || "",
					height: data.height || "",
					weight: data.weight || "",
					gender: data.gender || "",
					birthdate: data.birthdate || ""
				});
			} catch (e) {
				Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
			} finally {
				setLoading(false);
			}
		}
		fetchProfile();
	}, [user]);

	const handleEdit = (field: string) => {
		setEditField(field);
		setFieldValue(profile[field as keyof typeof profile] || "");
	};

	const handleSave = async () => {
		if (!user) return;
		setLoading(true);
		try {
			let updates: any = {};
			if (editField === "name") {
				await updateProfile(user, { displayName: fieldValue });
				updates.name = fieldValue;
			} else if (editField === "email") {
				await updateEmail(user, fieldValue);
				updates.email = fieldValue;
			} else {
				updates[editField!] = fieldValue;
			}
			// Salva dados extras no Firestore
			await setDoc(doc(db, "users", user.uid), {
				...profile,
				...updates
			});
			setProfile((prev) => ({ ...prev, ...updates }));
			Alert.alert("Sucesso", "Dados atualizados!");
			setEditField(null);
		} catch (e: any) {
			Alert.alert("Erro", e.message || "Falha ao atualizar dados.");
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#084F8C" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Perfil do Usuário</Text>
			{Object.entries(profile).map(([field, value]) => (
				<View key={field} style={styles.fieldRow}>
					<Text style={styles.fieldLabel}>{
						field === "name" ? "Nome" :
						field === "email" ? "E-mail" :
						field === "height" ? "Altura" :
						field === "weight" ? "Peso" :
						field === "gender" ? "Gênero" :
						field === "birthdate" ? "Nascimento" : field
					}</Text>
					{editField === field ? (
						<View style={styles.editContainer}>
							<TextInput
								style={styles.input}
								value={fieldValue}
								onChangeText={setFieldValue}
								autoFocus
							/>
							<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
								<Ionicons name="checkmark" size={22} color="#fff" />
							</TouchableOpacity>
							<TouchableOpacity style={styles.cancelButton} onPress={() => setEditField(null)}>
								<Ionicons name="close" size={22} color="#fff" />
							</TouchableOpacity>
						</View>
					) : (
						<View style={styles.valueRow}>
							<Text style={styles.fieldValue}>{value || "-"}</Text>
							<TouchableOpacity onPress={() => handleEdit(field)}>
								<Ionicons name="pencil" size={20} color="#084F8C" />
							</TouchableOpacity>
						</View>
					)}
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F7FA",
		padding: 24,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		color: "#084F8C",
		marginBottom: 24,
		textAlign: "center",
	},
	fieldRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 18,
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 2,
		elevation: 2,
	},
	fieldLabel: {
		fontSize: 16,
		color: "#333",
		fontWeight: "500",
		width: 110,
	},
	valueRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	fieldValue: {
		fontSize: 16,
		color: "#084F8C",
		marginRight: 8,
	},
	editContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: "#27D5E8",
		borderRadius: 6,
		padding: 6,
		minWidth: 100,
		fontSize: 15,
		backgroundColor: "#F8F9FA",
	},
	saveButton: {
		backgroundColor: "#27D5E8",
		borderRadius: 6,
		padding: 6,
		marginLeft: 4,
	},
	cancelButton: {
		backgroundColor: "#F44336",
		borderRadius: 6,
		padding: 6,
		marginLeft: 4,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
});
