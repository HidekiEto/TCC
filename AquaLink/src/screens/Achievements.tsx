import { 
    Text, 
    View, 
    StyleSheet, 
    Dimensions, 
    ScrollView, 
    TouchableOpacity,
    Animated,
    StatusBar
} from "react-native";
import BottomMenu from "../components/BottomNavigation";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useDbContext } from "../hooks/useDbContext";
import { auth, firestore } from "../config/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import dayjs from "dayjs";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    iconFamily: 'MaterialCommunityIcons' | 'FontAwesome5' | 'Ionicons';
    color: string;
    gradient: [string, string];
    requirement: number;
    currentProgress: number;
    unlocked: boolean;
    category: 'daily' | 'streak' | 'total' | 'milestone';
}

export default function Achievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalConsumed: 0,
        daysTracked: 0,
        currentStreak: 0,
        bestStreak: 0,
        perfectDays: 0,
    });
    const { getConsumoAcumuladoDoDia } = useDbContext();

    useEffect(() => {
        loadUserStats();
    }, []);

    const loadUserStats = async () => {
        try {
            const uid = auth.currentUser?.uid;
            if (!uid) return;

            const q = query(
                collection(firestore, "consumoDiario"),
                where("userId", "==", uid)
            );

            const querySnapshot = await getDocs(q);
            let totalConsumed = 0;
            let perfectDays = 0;
            let currentStreak = 0;
            let bestStreak = 0;
            let tempStreak = 0;
            let lastDate: dayjs.Dayjs | null = null;

            const docs = querySnapshot.docs.map(doc => ({
                date: doc.data().date,
                total: doc.data().total,
                meta: doc.data().meta,
                percentual: doc.data().percentual
            })).sort((a, b) => b.date.localeCompare(a.date));

            docs.forEach((doc, index) => {
                totalConsumed += doc.total;
                
                if (doc.percentual >= 100) {
                    perfectDays++;
                }

                // Calcular streak
                const currentDocDate = dayjs(doc.date);
                
                if (index === 0) {
                    // Primeiro documento (mais recente)
                    const today = dayjs().format("YYYY-MM-DD");
                    const yesterday = dayjs().subtract(1, 'day').format("YYYY-MM-DD");
                    
                    if (doc.date === today || doc.date === yesterday) {
                        if (doc.percentual >= 100) {
                            tempStreak = 1;
                            currentStreak = 1;
                        }
                    }
                } else if (lastDate) {
                    const diffDays = lastDate.diff(currentDocDate, 'day');
                    
                    if (diffDays === 1 && doc.percentual >= 100) {
                        tempStreak++;
                        if (index === docs.findIndex(d => d.date === docs[0].date) + tempStreak - 1) {
                            currentStreak = tempStreak;
                        }
                        bestStreak = Math.max(bestStreak, tempStreak);
                    } else {
                        bestStreak = Math.max(bestStreak, tempStreak);
                        tempStreak = doc.percentual >= 100 ? 1 : 0;
                    }
                } else if (doc.percentual >= 100) {
                    tempStreak = 1;
                }
                
                lastDate = currentDocDate;
            });

            bestStreak = Math.max(bestStreak, tempStreak, currentStreak);

            setStats({
                totalConsumed,
                daysTracked: querySnapshot.size,
                currentStreak,
                bestStreak,
                perfectDays,
            });

            generateAchievements({
                totalConsumed,
                daysTracked: querySnapshot.size,
                currentStreak,
                bestStreak,
                perfectDays,
            });

        } catch (error) {
            console.error("Erro ao carregar estatísticas:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateAchievements = (stats: any) => {
        const achievementsList: Achievement[] = [
            // Conquistas de Total Consumido
            {
                id: 'total_1l',
                title: 'Primeiro Litro',
                description: 'Consuma 1 litro de água',
                icon: 'water',
                iconFamily: 'Ionicons',
                color: '#4A90E2',
                gradient: ['#4A90E2', '#357ABD'],
                requirement: 1000,
                currentProgress: stats.totalConsumed,
                unlocked: stats.totalConsumed >= 1000,
                category: 'total'
            },
            {
                id: 'total_10l',
                title: 'Hidratação Constante',
                description: 'Consuma 10 litros de água',
                icon: 'water-outline',
                iconFamily: 'Ionicons',
                color: '#5BA3F5',
                gradient: ['#5BA3F5', '#4A90E2'],
                requirement: 10000,
                currentProgress: stats.totalConsumed,
                unlocked: stats.totalConsumed >= 10000,
                category: 'total'
            },
            {
                id: 'total_50l',
                title: 'Oceano Pessoal',
                description: 'Consuma 50 litros de água',
                icon: 'waves',
                iconFamily: 'MaterialCommunityIcons',
                color: '#2E86DE',
                gradient: ['#2E86DE', '#1E5FA8'],
                requirement: 50000,
                currentProgress: stats.totalConsumed,
                unlocked: stats.totalConsumed >= 50000,
                category: 'total'
            },
            {
                id: 'total_100l',
                title: 'Mestre da Hidratação',
                description: 'Consuma 100 litros de água',
                icon: 'trophy',
                iconFamily: 'FontAwesome5',
                color: '#FFD700',
                gradient: ['#FFD700', '#FFA500'],
                requirement: 100000,
                currentProgress: stats.totalConsumed,
                unlocked: stats.totalConsumed >= 100000,
                category: 'total'
            },

            // Conquistas de Streak
            {
                id: 'streak_3',
                title: 'Compromisso Inicial',
                description: 'Atinja sua meta por 3 dias seguidos',
                icon: 'fire',
                iconFamily: 'FontAwesome5',
                color: '#FF6B6B',
                gradient: ['#FF6B6B', '#EE5A52'],
                requirement: 3,
                currentProgress: stats.currentStreak,
                unlocked: stats.bestStreak >= 3,
                category: 'streak'
            },
            {
                id: 'streak_7',
                title: 'Uma Semana Perfeita',
                description: 'Atinja sua meta por 7 dias seguidos',
                icon: 'fire',
                iconFamily: 'FontAwesome5',
                color: '#FF8C42',
                gradient: ['#FF8C42', '#FF6B35'],
                requirement: 7,
                currentProgress: stats.currentStreak,
                unlocked: stats.bestStreak >= 7,
                category: 'streak'
            },
            {
                id: 'streak_14',
                title: 'Determinação em Chamas',
                description: 'Atinja sua meta por 14 dias seguidos',
                icon: 'fire',
                iconFamily: 'FontAwesome5',
                color: '#FF4757',
                gradient: ['#FF4757', '#FF3838'],
                requirement: 14,
                currentProgress: stats.currentStreak,
                unlocked: stats.bestStreak >= 14,
                category: 'streak'
            },
            {
                id: 'streak_30',
                title: 'Mestre do Hábito',
                description: 'Atinja sua meta por 30 dias seguidos',
                icon: 'fire',
                iconFamily: 'FontAwesome5',
                color: '#D63031',
                gradient: ['#D63031', '#C0392B'],
                requirement: 30,
                currentProgress: stats.currentStreak,
                unlocked: stats.bestStreak >= 30,
                category: 'streak'
            },

            // Conquistas de Dias Perfeitos
            {
                id: 'perfect_5',
                title: 'Começando Bem',
                description: 'Complete sua meta em 5 dias',
                icon: 'star',
                iconFamily: 'FontAwesome5',
                color: '#F39C12',
                gradient: ['#F39C12', '#E67E22'],
                requirement: 5,
                currentProgress: stats.perfectDays,
                unlocked: stats.perfectDays >= 5,
                category: 'milestone'
            },
            {
                id: 'perfect_15',
                title: 'Dedicado',
                description: 'Complete sua meta em 15 dias',
                icon: 'star',
                iconFamily: 'FontAwesome5',
                color: '#E67E22',
                gradient: ['#E67E22', '#D35400'],
                requirement: 15,
                currentProgress: stats.perfectDays,
                unlocked: stats.perfectDays >= 15,
                category: 'milestone'
            },
            {
                id: 'perfect_30',
                title: 'Comprometido',
                description: 'Complete sua meta em 30 dias',
                icon: 'medal',
                iconFamily: 'FontAwesome5',
                color: '#8E44AD',
                gradient: ['#8E44AD', '#7D3C98'],
                requirement: 30,
                currentProgress: stats.perfectDays,
                unlocked: stats.perfectDays >= 30,
                category: 'milestone'
            },
            {
                id: 'perfect_60',
                title: 'Lenda da Hidratação',
                description: 'Complete sua meta em 60 dias',
                icon: 'crown',
                iconFamily: 'FontAwesome5',
                color: '#FFD700',
                gradient: ['#FFD700', '#FFA500'],
                requirement: 60,
                currentProgress: stats.perfectDays,
                unlocked: stats.perfectDays >= 60,
                category: 'milestone'
            },

            // Conquistas de Dias Rastreados
            {
                id: 'days_7',
                title: 'Primeira Semana',
                description: 'Use o app por 7 dias',
                icon: 'calendar',
                iconFamily: 'FontAwesome5',
                color: '#00B894',
                gradient: ['#00B894', '#00A085'],
                requirement: 7,
                currentProgress: stats.daysTracked,
                unlocked: stats.daysTracked >= 7,
                category: 'daily'
            },
            {
                id: 'days_30',
                title: 'Mês de Jornada',
                description: 'Use o app por 30 dias',
                icon: 'calendar-check',
                iconFamily: 'FontAwesome5',
                color: '#00CEC9',
                gradient: ['#00CEC9', '#00B894'],
                requirement: 30,
                currentProgress: stats.daysTracked,
                unlocked: stats.daysTracked >= 30,
                category: 'daily'
            },
            {
                id: 'days_90',
                title: 'No Foco!',
                description: 'Use o app por 90 dias',
                icon: 'calendar-star',
                iconFamily: 'MaterialCommunityIcons',
                color: '#0984E3',
                gradient: ['#0984E3', '#0770C4'],
                requirement: 90,
                currentProgress: stats.daysTracked,
                unlocked: stats.daysTracked >= 90,
                category: 'daily'
            },
        ];

        setAchievements(achievementsList);
    };

    const renderIcon = (achievement: Achievement) => {
        const IconComponent = 
            achievement.iconFamily === 'MaterialCommunityIcons' ? MaterialCommunityIcons :
            achievement.iconFamily === 'FontAwesome5' ? FontAwesome5 : Ionicons;

        return (
            <IconComponent 
                name={achievement.icon as any} 
                size={40} 
                color={achievement.unlocked ? achievement.color : '#BDC3C7'} 
            />
        );
    };

    const getProgressPercentage = (achievement: Achievement): number => {
        return Math.min((achievement.currentProgress / achievement.requirement) * 100, 100);
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}L`;
        }
        return `${num}ml`;
    };

    const renderAchievement = (achievement: Achievement) => {
        const progress = getProgressPercentage(achievement);

        return (
            <TouchableOpacity 
                key={achievement.id} 
                style={[
                    styles.achievementCard,
                    achievement.unlocked && styles.achievementUnlocked
                ]}
                activeOpacity={0.7}
            >
                <View style={styles.achievementIcon}>
                    {achievement.unlocked ? (
                        <LinearGradient
                            colors={achievement.gradient}
                            style={styles.iconGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            {renderIcon(achievement)}
                        </LinearGradient>
                    ) : (
                        <View style={styles.iconLocked}>
                            {renderIcon(achievement)}
                        </View>
                    )}
                </View>

                <View style={styles.achievementContent}>
                    <Text style={[
                        styles.achievementTitle,
                        !achievement.unlocked && styles.achievementTitleLocked
                    ]}>
                        {achievement.title}
                    </Text>
                    <Text style={styles.achievementDescription}>
                        {achievement.description}
                    </Text>
                    
                    {!achievement.unlocked && (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressBar}>
                                <View 
                                    style={[
                                        styles.progressFill, 
                                        { 
                                            width: `${progress}%`,
                                            backgroundColor: achievement.color 
                                        }
                                    ]} 
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {achievement.category === 'total' 
                                    ? `${formatNumber(achievement.currentProgress)} / ${formatNumber(achievement.requirement)}`
                                    : `${achievement.currentProgress} / ${achievement.requirement}`
                                }
                            </Text>
                        </View>
                    )}

                    {achievement.unlocked && (
                        <View style={styles.unlockedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#27AE60" />
                            <Text style={styles.unlockedText}>Desbloqueado!</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const unlockedCount = achievements.filter(a => a.unlocked).length;

    return (
        <View style={styles.container}>
            <StatusBar 
                barStyle="light-content" 
                backgroundColor="#4A90E2" 
                translucent={false}
            />
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header com Estatísticas */}
                <LinearGradient
                    colors={['#4A90E2', '#357ABD']}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.headerTitle}>Conquistas</Text>
                    <Text style={styles.headerSubtitle}>
                        {unlockedCount} de {achievements.length} desbloqueadas
                    </Text>
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="water" size={24} color="#FFF" />
                            <Text style={styles.statValue}>{formatNumber(stats.totalConsumed)}</Text>
                            <Text style={styles.statLabel}>Total</Text>
                        </View>
                        
                        <View style={styles.statItem}>
                            <FontAwesome5 name="fire" size={24} color="#FFF" />
                            <Text style={styles.statValue}>{stats.currentStreak}</Text>
                            <Text style={styles.statLabel}>Sequência</Text>
                        </View>
                        
                        <View style={styles.statItem}>
                            <FontAwesome5 name="star" size={24} color="#FFF" />
                            <Text style={styles.statValue}>{stats.perfectDays}</Text>
                            <Text style={styles.statLabel}>Dias Perfeitos</Text>
                        </View>
                    </View>
                </LinearGradient>

                {/* Lista de Conquistas */}
                <View style={styles.achievementsContainer}>
                    {loading ? (
                        <Text style={styles.loadingText}>Carregando conquistas...</Text>
                    ) : (
                        achievements.map(achievement => renderAchievement(achievement))
                    )}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <BottomMenu />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
    scrollView: {
        flex: 0,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        opacity: 0.9,
        marginBottom: 24,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#FFF',
        opacity: 0.9,
        marginTop: 4,
    },
    achievementsContainer: {
        padding: 16,
    },
    achievementCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        opacity: 0.6,
    },
    achievementUnlocked: {
        opacity: 1,
        borderWidth: 2,
        borderColor: '#E8F5E9',
    },
    achievementIcon: {
        marginRight: 16,
    },
    iconGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconLocked: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ECF0F1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    achievementContent: {
        flex: 1,
        justifyContent: 'center',
    },
    achievementTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    achievementTitleLocked: {
        color: '#7F8C8D',
    },
    achievementDescription: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 8,
    },
    progressContainer: {
        marginTop: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#ECF0F1',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 12,
        color: '#7F8C8D',
        textAlign: 'right',
    },
    unlockedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    unlockedText: {
        fontSize: 14,
        color: '#27AE60',
        fontWeight: '600',
        marginLeft: 4,
    },
    loadingText: {
        textAlign: 'center',
        color: '#7F8C8D',
        fontSize: 16,
        marginTop: 32,
    },
    footer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#fff',
        paddingBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
});