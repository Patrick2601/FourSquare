import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  Platform,
  ActivityIndicator,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {searchFavourite} from '../services/Places';
import {useDispatch, useSelector} from 'react-redux';
import {getVerifiedKeys} from '../Function';
import {FavouriteList} from '../components/Flatlists';

const FavouriteScreen = ({navigation}) => {
  const {height, width} = useWindowDimensions();
  const h1 =
    width > height
      ? Platform.OS === 'ios'
        ? '80%'
        : '78%'
      : Platform.OS === 'ios'
      ? '85%'
      : '85%';
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [favData, setFavData] = useState([]);
  const userData = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(async () => {
      setLoading(true);
      const key = await getVerifiedKeys(userData.userToken);
      const response = await searchFavourite(
        text,
        userData.latitude,
        userData.longitude,
        key,
      );

      setFavData(response);
      setLoading(false);
    }, 500);
  }, [text, userData.skip]);

  return (
    <SafeAreaView styles={styles.main}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 15,
          }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Image
              source={require('../assets/images/back_icon.png')}
              style={styles.imgBack}
            />
          </Pressable>

          <Text style={styles.headerText}>Favourites</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Filter', 'filterFav')}>
            <Image
              source={require('../assets/images/filter_icon.png')}
              style={styles.imgBack}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.searchView}>
          <Image
            source={require('../assets/images/serch_xxxhdpi.png')}
            style={styles.imgSearch}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor={'black'}
            style={{
              color: 'black',
              width: '85%',
              height: 40,
              fontSize: 16,

              fontFamily: 'AvenirLTStd-Book',
            }}
            onChangeText={text => setText(text)}
          />
        </View>
      </View>
      {loading ? (
        <View style={{backgroundColor: 'white'}}>
          <ActivityIndicator
            size={'large'}
            color="#370f24"
            style={{marginTop: 10}}
          />
        </View>
      ) : null}
      <View
        style={{
          height: h1,
          backgroundColor: 'white',
          marginBottom: 20,
        }}>
        {favData.length > 0 ? (
          <FavouriteList data={favData} navigation={navigation} />
        ) : (
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 22,
                color: 'black',
                fontFamily: 'AvenirLTStd-Book',
                fontWeight: '600',
              }}>
              No Results
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 0,
  },
  header: {
    width: '100%',
    height: 110,
    backgroundColor: '#370f24',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,
  },
  imgBack: {
    resizeMode: 'contain',
    width: 25,
    height: 25,
  },
  headerText: {
    fontSize: 22,
    color: 'white',
    fontFamily: 'AvenirLTStd-Book',
    fontWeight: '600',
  },
  searchView: {
    borderWidth: 1,
    width: '80%',
    flexDirection: 'row',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'white',
  },
  imgSearch: {
    resizeMode: 'contain',
    width: 20,
    height: Platform.OS === 'ios' ? 50 : 30,
    marginHorizontal: 10,
  },
});
