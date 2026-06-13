import React, {useRef, useState, useEffect, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {methodSecurityDecoded} from '../utils/helper';
import {Colors, Fonts} from '../theme';
import imagePath from '../theme/imagePath';
import {keys} from '../utils/firebaseRemoteConfig';
import {Background} from '.';
import {hasNotch} from 'react-native-device-info';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';
import GetLocation from 'react-native-get-location';
import {locationPermissions, settingAlert} from '../permissions/appPermissions';
import {useSelector} from 'react-redux';

interface Location {
  latitude: number;
  longitude: number;
  address: string;
  city?: string;
  country?: string;
}

interface PlacePrediction {
  description: string;
  place_id: string;
  placePrediction?: {
    placeId: string;
    text:
      | {
          text: string;
        }
      | any;
  };
}

interface GoogleSearchProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (location: Location) => void;
  placeholder?: string;
  maps?: boolean;
  autoFetchCurrentLocation?: boolean;
}

const GOOGLE_PLACE_KEY = methodSecurityDecoded(keys.google_place_api_key);

const GoogleSearch: React.FC<GoogleSearchProps> = ({
  visible,
  onCancel,
  onSubmit,
  placeholder = 'Enter location',
  maps,
  autoFetchCurrentLocation = false,
}) => {
  const {address, latitude, longitude} = useSelector(
    (state: any) => state.location,
  ); // Get location from Redux
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>(address || '');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    latitude && longitude
      ? {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          address,
        }
      : null,
  );
  const [isMapLoading, setIsMapLoading] = useState(false);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFetchCurrentLocation) {
      getCurrentLocatioAddress(true);
    } else if (address && latitude && longitude) {
      setSearchText(address);
      setSelectedLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
      });
    }
  }, [autoFetchCurrentLocation]);

  useEffect(() => {
    if (searchText.length > 0 && searchText.length < 25) {
      fetchPredictions();
    } else {
      setPredictions([]);
    }
  }, [searchText]);

  const fetchPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'X-Goog-FieldMask': '*',
            'X-Goog-Api-Key': GOOGLE_PLACE_KEY,
          },
        },
      );
      const json = await response.json();
      return json?.location;
    } catch (error) {
      console.log('Error fetching place details:', error);
      return null;
    }
  };

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const data = {
        input: searchText,
        locationBias: {
          circle: {
            center: {latitude: 37.7937, longitude: -122.3965},
            radius: 500.0,
          },
        },
      };

      const response = await fetch(
        'https://places.googleapis.com/v1/places:autocomplete',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_PLACE_KEY,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const json = await response.json();
      setPredictions(json.suggestions || []);
    } catch (error) {
      console.log('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = async (item: PlacePrediction | any) => {
    const location: any = await fetchPlaceDetails(
      item?.placePrediction?.placeId,
    );

    if (location) {
      const address = item?.placePrediction?.text?.text;
      setSearchText(address);
      setSelectedLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        address: address,
      });

      Keyboard.dismiss();
      setPredictions([]);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onSubmit(selectedLocation);
      onCancel();
    } else {
      Keyboard.dismiss();
      settingAlert('Please select a valid address before confirming.');
    }
  };

  const getCurrentLocatioAddress = async (autoConfirm: boolean = false) => {
    setIsMapLoading(true);
    try {
      console.log('Fetching current location...');

      if (Platform.OS === 'android') {
        try {
          const enableResult = await promptForEnableLocationIfNeeded();
          if (!enableResult) {
            setIsMapLoading(false);
            return;
          }
        } catch (error) {
          console.log('Android location enable error:', error);
          setIsMapLoading(false);
          return;
        }
      }

      const hasPermission = await new Promise(resolve => {
        locationPermissions(status => resolve(status));
      });

      if (!hasPermission) {
        setIsMapLoading(false);
        return;
      }

      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });

      if (!location.latitude || !location.longitude) {
        setIsMapLoading(false);
        return;
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location.latitude},${location.longitude}&key=${GOOGLE_PLACE_KEY}`,
      );
      const responseJson = await response.json();

      if (!responseJson?.results?.[0]?.formatted_address) {
        setIsMapLoading(false);
        return;
      }

      const address = responseJson.results[0].formatted_address;
      const locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: address,
        city: responseJson.results[0]?.address_components?.find((item: any) =>
          item.types.includes('locality'),
        )?.long_name,
        country: responseJson.results[0]?.address_components?.find(
          (item: any) => item.types.includes('country'),
        )?.long_name,
      };

      setSearchText(address);
      setSelectedLocation(locationData);

      if (autoConfirm) {
        onSubmit(locationData);
      }
    } catch (error) {
      console.log('Error in getCurrentLocation:', error);
      settingAlert('Failed to fetch current location.');
    } finally {
      setIsMapLoading(false);
    }
  };

  const handleMapPress = async (e: any) => {
    setIsMapLoading(true);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${e.nativeEvent.coordinate.latitude},${e.nativeEvent.coordinate.longitude}&key=${GOOGLE_PLACE_KEY}`,
      );
      const json = await response.json();
      const addressText = json.results[0]?.formatted_address || '';
      setSearchText(addressText);
      setSelectedLocation({
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude,
        address: address,
        city: json.results[0]?.address_components?.find((item: any) =>
          item.types.includes('locality'),
        )?.long_name,
        country: json.results[0]?.address_components?.find((item: any) =>
          item.types.includes('country'),
        )?.long_name,
      });
    } catch (error) {
      console.warn('Geocoding error:', error);
    } finally {
      setIsMapLoading(false);
    }
  };

  const renderItem = ({item}: {item: PlacePrediction}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.itemContainer}
        onPress={() => {
          Keyboard.dismiss();
          handleAddressSelect(item);
        }}>
        <Text style={styles.addressText}>
          {item?.placePrediction?.text?.text}
        </Text>
      </TouchableOpacity>
    );
  };

  const usePlatformEdges = (): Edge[] => {
    return useMemo(
      () =>
        Platform.OS === 'android'
          ? ['bottom', 'left', 'right']
          : ['left', 'right'],
      [],
    );
  };
  const edges = usePlatformEdges();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      statusBarTranslucent>
      <SafeAreaView style={styles.container} edges={edges}>
        <Background>
          <View style={styles.profile_info_view}>
            <TouchableOpacity
              style={styles.image_container_view}
              onPress={() => {
                setSearchText('');
                setSelectedLocation(null);
                onCancel();
              }}>
              <Image source={imagePath.back_icon} style={styles.back} />
            </TouchableOpacity>
            <View style={styles.profile_name_email_view}>
              <Text style={styles.user_name_text}>Map</Text>
            </View>
          </View>

          <View style={styles.input_view}>
            <TextInput
              ref={textInputRef}
              placeholder={placeholder}
              value={searchText}
              onChangeText={setSearchText}
              style={styles.text_input_style}
              autoFocus={true}
              placeholderTextColor={Colors.secondary.GREY}
            />
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                setSearchText('');
                setSelectedLocation(null);
              }}
              style={{
                display: searchText ? 'flex' : 'none',
              }}>
              <Image
                source={imagePath.cross_icon}
                resizeMode="contain"
                style={styles.close_Img}
              />
            </TouchableOpacity>
          </View>

          {maps ? (
            <MapView
              region={{
                latitude: selectedLocation?.latitude ?? 37.78825,
                longitude: selectedLocation?.longitude ?? -122.4324,
                latitudeDelta: 0.0122,
                longitudeDelta: 0.0121,
              }}
              style={styles.map_view}
              onPress={handleMapPress}>
              {selectedLocation && (
                <Marker
                  coordinate={{
                    latitude: selectedLocation.latitude,
                    longitude: selectedLocation.longitude,
                  }}
                />
              )}
            </MapView>
          ) : null}
          {isMapLoading && (
            <ActivityIndicator
              animating={isMapLoading}
              size="large"
              color={Colors.secondary.ORANGE}
              style={styles.mapLoadingIndicator}
            />
          )}
          <TouchableOpacity
            style={styles.useCurrentBtn}
            onPress={() => getCurrentLocatioAddress(false)}>
            <Image source={imagePath.location} style={styles.gpsIcon2} />
            <Text style={styles.useCurrentText}>Use my current location</Text>
            <Image
              source={imagePath.right_arrow}
              style={styles.rightArrow}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          {loading && (
            <ActivityIndicator
              size="small"
              color={Colors.secondary.ORANGE}
              style={styles.loadingIndicator}
            />
          )}

          <FlatList
            data={predictions}
            keyExtractor={(item: any) =>
              item.place_id || item.placePrediction?.placeId
            }
            renderItem={renderItem}
            style={{
              display: predictions?.length ? 'flex' : 'none',
              maxHeight: 250,
              marginHorizontal: 15,
              backgroundColor: Colors.primary.WHITE,
              borderRadius: 8,
              elevation: 3,
              zIndex: 10,
            }}
            keyboardShouldPersistTaps="handled"
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleConfirm}
            style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </Background>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input_view: {
    height: 52,

    marginTop: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    marginBottom: 10,
    position: 'relative',
    zIndex: 15,
    paddingHorizontal: 15,
    borderColor: Colors.secondary.PURPLE,
    backgroundColor: Colors.secondary.SEARCH_INPUT,
    marginHorizontal: 12,
    color: Colors.primary.WHITE,
  },
  map_view: {
    flex: 1,
    borderRadius: 12,
  },
  close_Img: {
    height: 20,
    width: 20,
    marginLeft: 10,
  },
  back_Img: {
    height: 35,
    width: 35,
  },
  text_input_style: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.WHITE,
    flex: 1,
  },
  map_text: {
    fontFamily: Fonts.Poppins_Bold,
    fontSize: Fonts.SIZE_15,
    color: Colors.primary.BLACK,
    flex: 1,
    textAlign: 'center',
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addressText: {
    fontFamily: Fonts.Poppins_Regular,
    fontSize: Fonts.SIZE_14,
    color: Colors.primary.BLACK,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  confirmButton: {
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? 70 : 50,
    alignSelf: 'center',
    backgroundColor: Colors.primary.APP_THEME,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 48,
    width: '40%',
  },
  confirmButtonText: {
    fontSize: 16,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
  },
  currentLocationButton: {
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? 70 : 50,
    right: 20,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsIcon: {
    width: 50,
    height: 50,
  },
  mapLoadingIndicator: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 20,
    left: Dimensions.get('window').width / 2 - 10,
    zIndex: 1,
  },

  profile_info_view: {
    width: '100%',
    marginTop: hasNotch() ? 40 : 30,
    flexDirection: 'row',
    alignItems: 'center',

    borderBottomColor: Colors.secondary.HEADER_BOTTOM_COLOR,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  image_container_view: {
    height: 70,
    width: 70,

    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    width: 24,
    height: 24,
  },
  profile_name_email_view: {
    flex: 1,
    marginHorizontal: 1,
  },
  user_name_text: {
    fontFamily: Fonts.Poppins_SemiBold,
    fontSize: Fonts.SIZE_18,
    color: Colors.primary.WHITE,
  },
  useCurrentBtn: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 10,
    marginHorizontal: 24,
    marginVertical: 12,
  },
  gpsIcon2: {
    width: 25,
    height: 25,
    tintColor: Colors.primary.APP_THEME,
  },
  useCurrentText: {
    flex: 1,
    fontFamily: Fonts.Poppins_Medium,
    color: Colors.primary.WHITE,
    marginLeft: 10,
    fontSize: Fonts.SIZE_16,
  },
  rightArrow: {
    alignSelf: 'center',
    marginRight: 7,
    height: 14,
    width: 14,
  },
});

export default GoogleSearch;
