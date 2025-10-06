import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, Alert, Dimensions, StatusBar, ScrollView, Modal } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { updateProfile, updateEmail } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, storage, firestore } from "../../config/firebase";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';

const db = firestore;
const { width, height } = Dimensions.get('window');

export default function EditProfile() {
	const navigation = useNavigation<any>();
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
	const [showGenderModal, setShowGenderModal] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	
	const genderOptions = [
		{ label: 'Masculino', value: 'masculino', icon: 'gender-male' },
		{ label: 'Feminino', value: 'feminino', icon: 'gender-female' },
		{ label: 'Outro', value: 'outro', icon: 'gender-male-female' },
	];

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
		if (field === 'birthdate' && profile.birthdate) {
			// Converte a string ISO para Date
			const date = new Date(profile.birthdate);
			setSelectedDate(date);
			setShowDatePicker(true);
		} else if (field === 'gender') {
			setShowGenderModal(true);
		} else {
			setEditField(field);
			setFieldValue(profile[field as keyof typeof profile] || "");
		}
	};

	const handleGenderSelect = (gender: string) => {
		setFieldValue(gender);
		setShowGenderModal(false);
		// Salva automaticamente
		handleSaveField('gender', gender);
	};

	const handleDateChange = (event: any, selectedDateValue?: Date) => {
		setShowDatePicker(false);
		if (selectedDateValue) {
			setSelectedDate(selectedDateValue);
			const isoDate = selectedDateValue.toISOString();
			setFieldValue(isoDate);
			// Salva automaticamente
			handleSaveField('birthdate', isoDate);
		}
	};

	const handleSaveField = async (field: string, value: string) => {
		if (!user) return;
		setLoading(true);
		try {
			let updates: any = {};
			if (field === "name") {
				await updateProfile(user, { displayName: value });
				updates.name = value;
			} else if (field === "email") {
				await updateEmail(user, value);
				updates.email = value;
			} else {
				updates[field] = value;
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

	const handleSave = async () => {
		if (!user || !editField) return;
		await handleSaveField(editField, fieldValue);
	};

	const formatDate = (isoDate: string) => {
		if (!isoDate) return "";
		const date = new Date(isoDate);
		return date.toLocaleDateString('pt-BR');
	};

	const formatGender = (gender: string) => {
		if (!gender) return "";
		const genderMap: any = {
			'masculino': 'Masculino',
			'feminino': 'Feminino',
			'outro': 'Outro'
		};
		return genderMap[gender] || gender;
	};

	if (loading) {
		return (
			<LinearGradient
				colors={["#1081C7", "#27D5E8", "#FFFFFF"]}
				locations={[0.2, 0.5, 1]}
				start={{ x: 0, y: 0 }}
				end={{ x: 0, y: 0.3 }}
				style={styles.container}
			>
				<StatusBar backgroundColor="#1081C7" barStyle="light-content" />
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#FFFFFF" />
					<Text style={styles.loadingText}>Carregando...</Text>
				</View>
			</LinearGradient>
		);
	}

	return (
		<LinearGradient
			colors={["#1081C7", "#27D5E8", "#FFFFFF"]}
			locations={[0.2, 0.5, 1]}
			start={{ x: 0, y: 0 }}
			end={{ x: 0, y: 0.3 }}
			style={styles.container}
		>
			<StatusBar backgroundColor="#1081C7" barStyle="light-content" />
			<SafeAreaView style={styles.safeArea}>
				<ScrollView 
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.scrollContainer}
				>
					{/* Header com Botão Voltar */}
					<View style={styles.header}>
						<TouchableOpacity 
							style={styles.backButton}
							onPress={() => navigation.goBack()}
						>
							<Ionicons name="arrow-back" size={28} color="#FFFFFF" />
						</TouchableOpacity>
						
						<View style={styles.headerContent}>
							<MaterialCommunityIcons name="account-edit" size={48} color="#FFFFFF" />
							<Text style={styles.title}>Editar Perfil</Text>
							<Text style={styles.subtitle}>Atualize suas informações</Text>
						</View>
					</View>

					{/* Formulário de Edição */}
					<View style={styles.formContainer}>
						{Object.entries(profile).map(([field, value]) => (
							<View key={field} style={styles.fieldCard}>
								<View style={styles.fieldHeader}>
									<MaterialCommunityIcons 
										name={
											field === "name" ? "account" :
											field === "email" ? "email" :
											field === "height" ? "human-male-height" :
											field === "weight" ? "weight" :
											field === "gender" ? "gender-male-female" :
											field === "birthdate" ? "calendar" : "information"
										}
										size={24}
										color="#1081C7"
										style={styles.fieldIcon}
									/>
									<Text style={styles.fieldLabel}>
										{
											field === "name" ? "Nome Completo" :
											field === "email" ? "E-mail" :
											field === "height" ? "Altura (cm)" :
											field === "weight" ? "Peso (kg)" :
											field === "gender" ? "Gênero" :
											field === "birthdate" ? "Data de Nascimento" : field
										}
									</Text>
								</View>

								{editField === field ? (
									<View style={styles.editContainer}>
										<TextInput
											style={styles.input}
											value={fieldValue}
											onChangeText={setFieldValue}
											autoFocus
											placeholder={`Digite seu ${field === "name" ? "nome" : field === "email" ? "e-mail" : field}`}
											placeholderTextColor="#999"
											keyboardType={
												field === "email" ? "email-address" :
												field === "height" || field === "weight" ? "numeric" : "default"
											}
										/>
										<View style={styles.buttonRow}>
											<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
												<Ionicons name="checkmark-circle" size={24} color="#fff" />
												<Text style={styles.buttonText}>Salvar</Text>
											</TouchableOpacity>
											<TouchableOpacity style={styles.cancelButton} onPress={() => setEditField(null)}>
												<Ionicons name="close-circle" size={24} color="#27D5E8" />
												<Text style={styles.cancelButtonText}>Cancelar</Text>
											</TouchableOpacity>
										</View>
									</View>
								) : (
									<View style={styles.valueContainer}>
										<Text style={styles.fieldValue}>
											{field === 'birthdate' && value ? formatDate(value) :
											 field === 'gender' && value ? formatGender(value) :
											 value || "Não informado"}
										</Text>
										<TouchableOpacity 
											style={styles.editIconButton}
											onPress={() => handleEdit(field)}
										>
											<Ionicons name="pencil" size={20} color="#27D5E8" />
										</TouchableOpacity>
									</View>
								)}
							</View>
						))}
					</View>
				</ScrollView>
			</SafeAreaView>

			{/* Gender Selection Modal */}
			<Modal
				visible={showGenderModal}
				transparent={true}
				animationType="fade"
				onRequestClose={() => setShowGenderModal(false)}
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Selecione seu Gênero</Text>
							<TouchableOpacity onPress={() => setShowGenderModal(false)}>
								<Ionicons name="close" size={28} color="#084F8C" />
							</TouchableOpacity>
						</View>
						<View style={styles.genderOptionsContainer}>
							{genderOptions.map((option) => (
								<TouchableOpacity
									key={option.value}
									style={styles.genderOption}
									onPress={() => handleGenderSelect(option.value)}
								>
									<MaterialCommunityIcons name={option.icon as any} size={40} color="#1081C7" />
									<Text style={styles.genderOptionText}>{option.label}</Text>
								</TouchableOpacity>
							))}
						</View>
					</View>
				</View>
			</Modal>

			{/* Date Picker */}
			{showDatePicker && (
				<DateTimePicker
					value={selectedDate}
					mode="date"
					display="default"
					onChange={handleDateChange}
					maximumDate={new Date()}
				/>
			)}
		</LinearGradient>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	safeArea: {
		flex: 1,
	},
	scrollContainer: {
		paddingBottom: height * 0.05,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadingText: {
		marginTop: 16,
		fontSize: 16,
		color: '#FFFFFF',
		fontWeight: '600',
	},
	header: {
		paddingTop: height * 0.02,
		paddingBottom: height * 0.04,
		paddingHorizontal: width * 0.05,
		position: 'relative',
	},
	backButton: {
		position: 'absolute',
		top: height * 0.02,
		left: width * 0.05,
		zIndex: 10,
		backgroundColor: 'rgba(255, 255, 255, 0.2)',
		borderRadius: 12,
		padding: 8,
		width: 44,
		height: 44,
		justifyContent: 'center',
		alignItems: 'center',
	},
	headerContent: {
		alignItems: 'center',
		width: '100%',
	},
	title: {
		fontSize: Math.round(width * 0.07),
		fontWeight: 'bold',
		color: '#FFFFFF',
		marginTop: 12,
		marginBottom: 8,
		textAlign: 'center',
	},
	subtitle: {
		fontSize: Math.round(width * 0.038),
		color: '#FFFFFF',
		textAlign: 'center',
		opacity: 0.9,
	},
	formContainer: {
		paddingHorizontal: width * 0.05,
		paddingTop: 10,
	},
	fieldCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 16,
		padding: 20,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 5,
	},
	fieldHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 12,
	},
	fieldIcon: {
		marginRight: 12,
	},
	fieldLabel: {
		fontSize: 16,
		color: '#333',
		fontWeight: '600',
	},
	valueContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingLeft: 36,
	},
	fieldValue: {
		fontSize: 16,
		color: '#084F8C',
		fontWeight: '500',
		flex: 1,
	},
	editIconButton: {
		backgroundColor: '#E8F7FA',
		borderRadius: 8,
		padding: 8,
		marginLeft: 12,
	},
	editContainer: {
		paddingLeft: 36,
	},
	input: {
		borderWidth: 2,
		borderColor: '#27D5E8',
		borderRadius: 12,
		padding: 14,
		fontSize: 16,
		backgroundColor: '#F8F9FA',
		marginBottom: 12,
		color: '#333',
	},
	buttonRow: {
		flexDirection: 'row',
		gap: 12,
	},
	saveButton: {
		flex: 1,
		backgroundColor: '#27D5E8',
		borderRadius: 12,
		padding: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		shadowColor: '#27D5E8',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 4,
	},
	cancelButton: {
		flex: 1,
		backgroundColor: '#FFFFFF',
		borderRadius: 12,
		borderWidth: 2,
		borderColor: '#27D5E8',
		padding: 14,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 8,
		shadowColor: '#27D5E8',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.15,
		shadowRadius: 3,
		elevation: 3,
	},
	buttonText: {
		color: '#FFFFFF',
		fontSize: 15,
		fontWeight: '600',
	},
	cancelButtonText: {
		color: '#27D5E8',
		fontSize: 15,
		fontWeight: '600',
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		backgroundColor: '#FFFFFF',
		borderRadius: 20,
		padding: 24,
		width: width * 0.85,
		maxWidth: 400,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 8 },
		shadowOpacity: 0.3,
		shadowRadius: 16,
		elevation: 8,
	},
	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
		paddingBottom: 16,
		borderBottomWidth: 2,
		borderBottomColor: '#E0E0E0',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#084F8C',
	},
	genderOptionsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingTop: 12,
	},
	genderOption: {
		alignItems: 'center',
		padding: 16,
		borderRadius: 16,
		backgroundColor: '#F0F9FF',
		borderWidth: 2,
		borderColor: '#27D5E8',
		minWidth: 100,
		shadowColor: '#27D5E8',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 3,
	},
	genderOptionText: {
		marginTop: 8,
		fontSize: 14,
		fontWeight: '600',
		color: '#084F8C',
	},
});
