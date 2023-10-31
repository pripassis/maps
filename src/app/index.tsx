import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  LocationAccuracy,
  LocationObject,
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import { AntDesign } from "@expo/vector-icons";

export default function TabOneScreen() {
  const [location, setLocation] = useState<LocationObject | null>();

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: response.coords,
        });
      }
    );
  }, []);

  useEffect(() => {
    mapRef.current?.animateCamera({
      center: {
        latitude: location!.coords.latitude,
        longitude: location!.coords.longitude,
      },
    });
  }, [location]);

  return (
    !!location && (
      <View className="flex flex-1 items-center justify-center bg-white">
        <MapView
          provider={PROVIDER_GOOGLE}
          mapType="mutedStandard"
          ref={mapRef}
          style={{ width: "100%", height: "100%" }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          onPress={(v) =>
            setLocation({
              coords: {
                latitude: v.nativeEvent.coordinate.latitude,
                longitude: v.nativeEvent.coordinate.longitude,
                altitude: 0,
                accuracy: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null,
              },
              timestamp: v.timeStamp,
            })
          }
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
        {/* NUNCA USE ESTE TIPO DE CLASSNAME, ISSO AQUI É UMA GAMBIARRA QUE EU FIZ PRA FUNCIONAR DE ULTIMA HORA left-[25%] w-[50%] */}
        <Text className="absolute bottom-12 bg-white border-2 rounded-md p-4 left-[25%] w-[50%] text-center">
          longitude:{location.coords.longitude}- latitude:
          {location.coords.latitude}
        </Text>
      </View>
    )
  );
}
