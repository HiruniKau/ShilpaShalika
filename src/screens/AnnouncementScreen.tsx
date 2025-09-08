// src/screens/AnnouncementScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  timestamp: any;
  classId?: string;
  studentId?: string;
  studentName?: string;
}

const AnnouncementScreen = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setRefreshing(true);
      
      const querySnapshot = await firestore()
        .collection('announcements')
        .orderBy('timestamp', 'desc')
        .get();

      const announcementsData: Announcement[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Announcement));

      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Unknown date';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return 'person-add';
      case 'class':
        return 'class';
      case 'important':
        return 'warning';
      case 'update':
        return 'update';
      default:
        return 'announcement';
    }
  };

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'enrollment':
        return '#4CAF50';
      case 'class':
        return '#2196F3';
      case 'important':
        return '#FF9800';
      case 'update':
        return '#9C27B0';
      default:
        return '#666';
    }
  };

  const renderAnnouncementItem = ({ item }: { item: Announcement }) => (
    <View style={styles.announcementCard}>
      <View style={styles.announcementHeader}>
        <View style={styles.iconContainer}>
          <Icon 
            name={getAnnouncementIcon(item.type)} 
            size={20} 
            color={getAnnouncementColor(item.type)} 
          />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.announcementTitle}>{item.title}</Text>
          <Text style={styles.announcementType}>{item.type.toUpperCase()}</Text>
        </View>
        <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
      </View>
      
      <Text style={styles.announcementMessage}>{item.message}</Text>
      
      {item.studentName && (
        <View style={styles.metaInfo}>
          <Icon name="person" size={14} color="#666" />
          <Text style={styles.metaText}>By: {item.studentName}</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1800ad" />
        <Text style={styles.loadingText}>Loading announcements...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Announcements</Text>
        <Text style={styles.headerSubtitle}>
          Latest updates and important information
        </Text>
      </View>

      {announcements.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="announcement" size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No announcements yet</Text>
          <Text style={styles.emptyStateText}>
            Check back later for updates and important information
          </Text>
        </View>
      ) : (
        <FlatList
          data={announcements}
          renderItem={renderAnnouncementItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchAnnouncements}
              colors={['#1800ad']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1800ad',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#1800ad',
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  announcementType: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  announcementMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AnnouncementScreen;