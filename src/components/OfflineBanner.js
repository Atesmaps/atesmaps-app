import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useConnection } from '../hooks/useConnection'; // Tu hook creado
import { useTranslation } from 'react-i18next';

const OfflineBanner = () => {
  const isConnected = useConnection();
  const { t } = useTranslation();

  if (isConnected) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>
          ⚠️ {t('offlineMode')} ⚠️ 
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#b52d2d', // Rojo suave/aviso
  },
  bannerContainer: {
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bannerText: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default OfflineBanner;