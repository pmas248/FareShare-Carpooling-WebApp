import { StyleSheet, SafeAreaView, TouchableOpacity, View, Text, Image, FlatList, Modal, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SHARED, COLORS } from '../styles/global.jsx';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { CDN_URL} from '@env';

export default function RideStatus() {
  const router = useRouter();
  const { rideId } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [giveUpModalVisible, setGiveUpModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && rideId) {
        const token = await currentUser.getIdToken();
        try {
          const res = await fetch(`${CDN_URL}/api/rides/${rideId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          setRide(data);
        } catch (err) {
          console.error('Failed to fetch ride:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [rideId]);

  const handleGiveUpSeat = async () => {
    if (!user || !ride) return;
    setGiveUpModalVisible(false);
    const token = await user.getIdToken();
    try {
      const res = await fetch(`${CDN_URL}/api/rides/${rideId}/unbook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to remove passenger');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('Something went wrong while giving up your seat.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={SHARED.container}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  if (!ride) {
    return (
      <SafeAreaView style={SHARED.container}>
        <Text style={{ textAlign: 'center', marginTop: 50 }}>Ride not found.</Text>
      </SafeAreaView>
    );
  }

  let statusColor = 'rgba(255, 209, 102, 0.77)';
  switch (ride.status.toLowerCase()) {
    case 'ongoing':    statusColor = 'rgba(131, 56, 236, 0.3)'; break;
    case 'completed':  statusColor = 'rgba(6, 214, 160, 0.3)'; break;
    case 'cancelled':  statusColor = 'rgba(239, 71, 111, 0.3)'; break;
  }

  return (
    <SafeAreaView style={SHARED.container}>
      <LinearGradient colors={['#af96ff', '#FFFFFF']} style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => router.push('/')}> 
          <View style={SHARED.header}>
            <Image source={require('@/assets/images/fareshare/logo.png')} style={SHARED.logoImage} />
            <Text style={SHARED.logoText}>FareShare</Text>
            <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {user ? (
                <>
                  <Text style={{ color: '#fff', fontWeight: 'bold', marginRight: 4 }}>
                    {user.email.split('@')[0]}
                  </Text>
                  <TouchableOpacity onPress={() => signOut(auth)}>
                    <Feather name="log-out" size={22} color="black" />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => router.push('/login')}>
                    <Feather name="log-in" size={22} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/register')}>
                    <Feather name="user-plus" size={22} color="black" />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <FlatList
          ListHeaderComponent={() => (
            <>
              <View style={styles.titleSection}>
                <Text style={styles.title}>Ride Details</Text>
              </View>
              <View style={styles.rideDetailsSection}>
                <Text style={[styles.status, { backgroundColor: statusColor }]}>Status: {ride.status}</Text>
                <Text style={styles.route}>From: {ride.from} ➔ To: {ride.to}</Text>
                <Text style={styles.metaSecondary}>{new Date(ride.dateTime).toLocaleString()}</Text>
                <Text style={styles.meta}>NZ$ {ride.cost} • Seats left: {ride.seats}</Text>
              </View>
              <Text style={styles.passengerTitle}>Passengers</Text>
            </>
          )}
          data={ride.passengers}
          keyExtractor={(item) => item.userID._id.toString()}
          renderItem={({ item }) => (
            <View style={styles.passengerCard}>
              <Image source={require('@/assets/images/fareshare/logo.png')} style={styles.passengerImage} />
              <Text style={styles.passengerName}>{item.userID.firstName} {item.userID.lastName}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />

        {ride.status !== 'completed' ? (
          <TouchableOpacity style={styles.cancelButton} onPress={() => setGiveUpModalVisible(true)}>
            <Text style={styles.cancelText}>Give up Seat</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.cancelButton, { backgroundColor: '#06D6A0' }]} onPress={() => router.push('/')}>  
            <Text style={styles.cancelText}>Back to Home</Text>
          </TouchableOpacity>
        )}

        <Modal visible={giveUpModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <TouchableOpacity style={styles.modalBackdrop} onPress={() => setGiveUpModalVisible(false)} />
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Give Up Seat</Text>
              <Text style={styles.modalMessage}>Are you sure you want to give up your seat?</Text>
              <TouchableOpacity style={styles.confirmButton} onPress={handleGiveUpSeat}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    titleSection: { marginTop: 1, padding: 16, backgroundColor: '#8338EC' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
    hostDetails: {
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#f3f3f3',
        alignItems: 'center',
    },
    driverImage: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#fff' },
    driverInfo: { marginLeft: 12 },
    driverName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
    rideDetails: {
        margin: 16,
        padding: 20,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#ccc',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
    },
    status: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        color: '#333',
        marginBottom: 16,
        textTransform: 'capitalize',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    detailsLeft: {
        flex: 2,
    },
    detailsRight: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    route: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    meta: {
        fontSize: 14,
        color: '#555',
    },
    metaSecondary: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    highlightRow: {
        flexDirection: 'row',
        gap: 20,
    },
    highlightBox: {
        marginBottom: 12,
        alignItems: 'center',
    },
    highlightLabel: {
        fontSize: 13,
        color: '#333',
    },
    highlightValue: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#000',
    },
    passengerDetails: { marginTop: 10, paddingHorizontal: 16 },
    passengerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, marginHorizontal: 16 },
    passengerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginHorizontal: 16,
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 10,
    },
    passengerImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    passengerName: { fontSize: 16 },
    cancelButton: {
        position: 'absolute',
        bottom: 20,
        left: 16,
        right: 16,
        backgroundColor: '#8338EC',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
    },
        modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 12,
    },
    confirmButton: {
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: '#EF476F',
    },
    confirmText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});