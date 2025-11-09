// AboutMicrofinanceScreen.js
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Header from '../Header/header';

const { width } = Dimensions.get('window');

const FEATURES = [
  { key: 'mikataba_yote', title: 'Mikataba yote', desc: 'Inaonyesha wateja wote waliopo kwenye kituo; waliomaliza mikataba na wanaoendelea na mikataba.' },
  { key: 'mikataba_hai', title: 'Mikataba hai', desc: 'Inaonyesha wateja wote walio kwenye mikataba ambayo bado hawajalipwa au hawajakamilisha kulipa mkopo wao.' },
  { key: 'nje_mkataba_leo', title: 'Nje ya mkataba leo', desc: 'Wateja ambao mkataba wao unaisha leo — orodha ya wanaohusika.' },
  { key: 'nje_mkataba_wote', title: 'Nje ya mkataba wote', desc: 'Wateja ambao muda wa kulipa umeisha lakini bado wana deni.' },
  { key: 'hawajarejesha_jana', title: 'Hawajarejesha jana', desc: 'Wateja ambao jana hawakurudisha marejesho yao.' },
  { key: 'wamemaliza', title: 'Wamemaliza hawajakopa tena', desc: 'Wateja ambao wameamaliza kulipa zote na hawana deni tena.' },
  { key: 'ripoti_ya_siku', title: 'Ripoti ya siku', desc: 'Ripoti ya kila siku kwa tarehe unayoitaja — marejesho, faini, kiasi kilichokabidhiwa, n.k.' },
  { key: 'ripoti_summary', title: 'Ripoti summary', desc: 'Muhtasari wa kifedha wa kituo au branch nzima — mikopo, marejesho, faini, n.k.' },
  { key: 'marejesho_yote', title: 'Marejesho yote', desc: 'Orodha ya marejesho yote kwa siku husika au tarehe uliyochagua.' },
  { key: 'faini_za_leo', title: 'Faini za leo', desc: 'Faini zote za leo au faini za tarehe uliyochagua.' },
  { key: 'pokea_rejesho', title: 'Pokea rejesho', desc: 'Fomu ya kupokea rejesho au faini mteja anaporudi ofisini.' },
];

export default function AboutMicrofinanceScreen() {
  return (
    <SafeAreaView style={styles.safe}>

    <Header />


    
      <LinearGradient colors={['#0f172a', '#000000']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Mgore Microfinance</Text>
            <Text style={styles.subHeader}>
              Mfumo huu unakuwezesha kusimamia mikopo, marejesho, faini, na ripoti za kituo kwa urahisi na usalama.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Muhtasari wa Vipengele</Text>
            <View style={styles.featuresGrid}>
              {FEATURES.map((f, index) => (
                <View key={index} style={styles.featureItem}>
                  <View style={styles.featureIconWrap}>
                    <FontAwesome5 name="cogs" size={24} color="#fff" />
                  </View>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jinsi ya Kutumia Mfumo</Text>

            <View style={styles.stepItem}>
              <FontAwesome5 name="user-plus" size={22} color="#fff" style={styles.stepIcon} />
              <Text style={styles.stepTitle}>1. Sajili mteja</Text>
              <Text style={styles.stepDesc}>
                Jaza taarifa za mteja, anwani, na mkataba wa mkopo. Angalia kiasi, muda wa kulipa, na masharti kabla ya kuandika mkataba.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <FontAwesome5 name="money-bill-wave" size={22} color="#fff" style={styles.stepIcon} />
              <Text style={styles.stepTitle}>2. Pokea marejesho</Text>
              <Text style={styles.stepDesc}>
                Tumia kipengele cha 'Pokea rejesho' unapopokea malipo au faini. Mfumo utahifadhi taarifa zote kiotomatiki.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <FontAwesome5 name="file-alt" size={22} color="#fff" style={styles.stepIcon} />
              <Text style={styles.stepTitle}>3. Andaa ripoti ya siku</Text>
              <Text style={styles.stepDesc}>
                Baada ya kufunga kituo, jaza fomu ya ripoti ya siku ili mfumo uzihifadhi na kuzitumia kwenye muhtasari wa kifedha.
              </Text>
            </View>

            <View style={styles.stepItem}>
              <FontAwesome5 name="bell" size={22} color="#fff" style={styles.stepIcon} />
              <Text style={styles.stepTitle}>4. Fuata orodha za tahadhari</Text>
              <Text style={styles.stepDesc}>
                Tumia 'Nje ya mkataba' na 'Hawajarejesha jana' kufuatilia wateja wanaohitajika kuwasiliana nao.
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f172a' },
  gradient: { flex: 1 },
  headerContainer: { padding: 20, alignItems: 'center' },
  header: { color: 'wheat', fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  subHeader: { color: '#cbd5e1', fontSize: 14, marginTop: 8, textAlign: 'center' },

  section: { padding: 20 },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 15, textAlign: 'center' },

  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  featureIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  featureTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, textAlign: 'center' },
  featureDesc: { color: '#cbd5e1', fontSize: 12, marginTop: 4, textAlign: 'center' },

  stepItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  stepIcon: { alignSelf: 'center', marginBottom: 8 },
  stepTitle: { color: '#fff', fontWeight: 'bold', fontSize: 15, textAlign: 'center' },
  stepDesc: { color: '#cbd5e1', fontSize: 13, textAlign: 'center', marginTop: 6 },
});
