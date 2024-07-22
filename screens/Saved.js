import React, { useState, useRef } from 'react';
import { SafeAreaView, View, FlatList, Animated, StyleSheet, Text, StatusBar, TouchableOpacity, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const DATA = [
  {id: '1', title: 'Seasonal Sales Associate', salary: 'PlanetStream', job_posting_url: "https://www.linkedin.com/jobs/view/3701359617/?trk=jobs_biz_prem_srch"},
  {id: '2', title: 'Outside Sales Representative', salary: 'Aether'},
  {id: '3', title: 'Retail Sales Associate', salary: 'FusionTech, (Cary, NC)'},
  {id: '4', title: 'Retail Sales – Part Time', salary: 'Mirage'},
  {id: '5', title: 'Retail Sales Associate', salary: 'TidalForce'},
  {id: '6', title: 'Manager, Sales and Customer Service', salary: 'Zenith'},
  {id: '7', title: 'Retail Sales Associate', salary: 'FusionTech, (Frisco, TX)'},
  {id: '8', title: 'Sales Director ', salary: 'Vortex'},
  {id: '9', title: 'Regional Sales Manager', salary: 'NexiTech'},
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const handleOpenURL = async (url) => {
    // Checking if the link is supported for links that can be opened by apps
    const supported = await Linking.canOpenURL(url);

    if (supported) {
        // Opening the link with some app, if the URL scheme is supported (optional)
        await Linking.openURL(url);
    } else {
        console.error("Don't know how to open this URL: " + url);
    }
};

const Item = ({ title, salary, isSaved, onSave, scrollY, index }) => {
  const inputRange = [
    -1,
    0,
    (index - 1) * 100,
    index * 100
  ];
  const opacity = scrollY.interpolate({
    inputRange,
    outputRange: [1, 1, 1, 0]
  });

  return (
    <Animated.View style={[styles.item, { opacity }]}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.salary}>{salary}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={onSave}>
          <Icon name={isSaved ? "bookmark-border" : "bookmark"} size={24} color="#000" />
        </TouchableOpacity>
        <Icon name="link" size={24} color="#000" onPress={() => handleOpenURL('https://www.linkedin.com/jobs/view/3701359617/?trk=jobs_biz_prem_srch')}/>
      </View>
    </Animated.View>
  );
};

const App = () => {
  const [savedItems, setSavedItems] = useState(new Set());
  const scrollY = useRef(new Animated.Value(0)).current;

  const toggleSaved = (id) => {
    setSavedItems(prev => new Set(prev).add(id));
  };

  const renderItem = ({ item, index }) => (
    <Item
      title={item.title}
      salary={item.salary}
      isSaved={savedItems.has(item.id)}
      onSave={() => toggleSaved(item.id)}
      scrollY={scrollY}
      index={index}
    />
  );

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <AnimatedFlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginVertical: 9,
    marginHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  salary: {
    fontSize: 16,
    color: '#606060',
  },
});

export default App;