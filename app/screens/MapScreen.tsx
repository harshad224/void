import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  TextInput,
  Image,
  PermissionsAndroid,
  Platform,
} from "react-native";
import MapView, { Callout, Marker, Polygon, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons"; // For icons
import GTextInput from "@/components/GTextInput";
import BottomSheet from "@gorhom/bottom-sheet";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import haversine from "haversine-distance";

const places = [
  {
    name: "place1",
    coordinates: [
      {
        latitude: 18.522237055063336,
        longitude: 73.94389752298594,
      },
      {
        latitude: 18.521325607619758,
        longitude: 73.94600339233875,
      },
      {
        latitude: 18.51961841883648,
        longitude: 73.94574388861656,
      },
      {
        latitude: 18.519343423146633,
        longitude: 73.94369937479496,
      },
      {
        latitude: 18.522237055063336,
        longitude: 73.94389752298594,
      },
    ],
    status: "buy",
    property: "land",
  },
  {
    name: "place2",
    coordinates: [
      {
        latitude: 18.516247227291903,
        longitude: 73.9425852522254,
      },
      {
        latitude: 18.516358499291456,
        longitude: 73.9448507130146,
      },
      {
        latitude: 18.515473090091813,
        longitude: 73.9445261657238,
      },
      {
        latitude: 18.515323031058813,
        longitude: 73.94288867712021,
      },
      {
        latitude: 18.516247227291903,
        longitude: 73.9425852522254,
      },
    ],
    status: "sell",
    property: "house",
  },
  {
    name: "place3",
    coordinates: [
      {
        latitude: 18.51687416458448,
        longitude: 73.93803186714649,
      },
      {
        latitude: 18.516322574339505,
        longitude: 73.93639001995325,
      },
      {
        latitude: 18.51830129673979,
        longitude: 73.93575735390186,
      },
      {
        latitude: 18.51687416458448,
        longitude: 73.93803186714649,
      },
    ],
    status: "lease",
    property: "shop",
  },
];

const MapScreen = () => {
  const [location, setLocation] = useState<any>(null); // Current location
  const [currentLocation, setCurrentLocation] = useState<any>(null); // Selected location
  const [selectedLocation, setSelectedLocation] = useState<any>(null); // Selected location
  const [routeCoordinates, setRouteCoordinates] = useState<any>([]); // Route coordinates
  const [mapRef, setMapRef] = useState<any>(null); // Reference to the
  const [mapStyle, setMapStyle] = useState<string>("standard"); // Reference to the MapView
  const [openMapModal, setOpenMapModal] = useState<boolean>(false); // Reference to the MapView
  const [openStyleModal, setOpenStyleModal] = useState<boolean>(false); // Reference to the MapView
  const [heading, setHeading] = useState<any>(new Animated.Value(0)); // Heading for compass rotation
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<string>("");
  const [filterCriteria, setFilterCriteria] = useState<any>({});
  const [bottomSheetIndex, setBottomSheetIndex] = useState<number>(0);
  const [searchedText, setSearchedText] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(places);
  const [filterResults, setFilterResults] = useState<any>([]);
  const [markerPosition, setMarkerPosition] = useState<any>(null);
  const [newMarkerPosition, setNewMarkerPosition] = useState<any>(null); // Position of the marker that changes when the map is tapped
  const [distance, setDistance] = useState(0); //

  const [text, setText] = useState("");
  const sheetRef: any = useRef(null);
  const snapPoinst = useMemo(() => ["5%", "50%", "85%"], []);

  const mapRegion = useSelector((state: RootState) => state.map.region);

  console.log("mapRegion", mapRegion);

  const navigation: any = useNavigation();

  const handleTextChange = (text: string) => {
    setText(text);
  };

  const handleTextClear = () => {
    setText("");
  };

  // Get current location when component mounts
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  useEffect(() => {
    setFilterCriteria({
      filter1: categoryList?.filter1[0],
      filter2: categoryList?.filter2[0],
    });
  }, []);

  useEffect(() => {
    if (Object.keys(mapRegion).length) {
      setSelectedLocation({
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Animate camera to the current location
      if (mapRef) {
        mapRef.animateCamera(
          {
            center: {
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude,
            },
            zoom: 15, // Optional: You can adjust zoom level here
          },
          { duration: 1000 }
        );
      }
    }
  }, [mapRegion]);

  // Reset to current location and recenter map
  const resetLocation = async (props: string) => {
    let newLocation: any;
    if (props === "currentLocation") {
      let currentLocation = await Location.getCurrentPositionAsync({});
      newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01, // Zoom level
        longitudeDelta: 0.01,
      };
    } else if (props === "selectedLocation") {
      newLocation = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        latitudeDelta: 0.01, // Zoom level
        longitudeDelta: 0.01,
      };
    }

    // Animate camera to the current location
    if (mapRef) {
      mapRef.animateCamera(
        {
          center: {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          },
          zoom: 15, // Optional: You can adjust zoom level here
        },
        { duration: 1000 }
      );
    }
  };

  // Track the map's heading and apply it to the compass rotation
  const onRegionChangeComplete = (region: any) => {
    if (mapRef) {
      mapRef.getCamera().then((camera: any) => {
        const mapHeading = camera.heading || 0;
        Animated.timing(heading, {
          toValue: mapHeading,
          duration: 0,
          useNativeDriver: true,
        }).start();
      });
    }
    console.log("region", region);
  };

  const handleOpenSheet = () => {
    setOpenMapModal(true);
  };

  const categoryList: any = {
    filter1: [
      { name: "Buy", id: "1", url: require("@/assets/images/rent.png") },
      { name: "Lease", id: "2", url: require("@/assets/images/rent.png") },
    ],
    filter2: [
      { name: "Flat", id: "2", url: require("@/assets/images/rent.png") },
      { name: "House", id: "3", url: require("@/assets/images/rent.png") },
      { name: "Land", id: "4", url: require("@/assets/images/rent.png") },
      { name: "Shop", id: "5", url: require("@/assets/images/rent.png") },
    ],
  };

  const handleFocus = () => {
    navigation.navigate("screens/Search");
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const onRegionSelected = (data: any) => {
    console.log("data", data);
  };

  const handleMapPress = (event: any) => {
    const { coordinate } = event?.nativeEvent;
    console.log("coordinate", coordinate);

    if (coordinate) {
      setNewMarkerPosition(coordinate); // Update the new marker position

      // Initialize coordinates object
      let coordinates: any = {};

      // Check if selectedLocation is defined and has the expected properties
      if (
        selectedLocation &&
        typeof selectedLocation === "object" &&
        Object.keys(selectedLocation)?.length > 0
      ) {
        coordinates = {
          longitude: selectedLocation?.longitude,
          latitude: selectedLocation?.latitude,
        };
      }
      // Check if currentLocation is defined and has the expected properties
      else if (
        currentLocation &&
        typeof currentLocation === "object" &&
        Object.keys(currentLocation)?.length > 0
      ) {
        coordinates = {
          longitude: currentLocation?.longitude,
          latitude: currentLocation?.latitude,
        };
      }

      // Proceed with distance calculation only if coordinates are set correctly
      if (coordinates && Object.keys(coordinates)?.length > 0) {
        const calculatedDistance = haversine(coordinates, coordinate);
        setDistance(calculatedDistance); // Set the calculated distance
      } else {
        console.warn("No valid coordinates found for distance calculation.");
      }
    }
  };

  const handleColor = (item: any) => {
    if (item?.status === "buy") {
      return "green";
    } else if (item?.status === "sell") {
      return "red";
    } else if (item?.status === "lease") {
      return "blue";
    }
  };

  const calculateCentroid = (coordinates: any) => {
    let latitudeSum = 0;
    let longitudeSum = 0;
    const totalPoints = coordinates.length;

    coordinates.forEach((point: any) => {
      latitudeSum += point.latitude;
      longitudeSum += point.longitude;
    });

    return {
      latitude: latitudeSum / totalPoints,
      longitude: longitudeSum / totalPoints,
    };
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <View
        style={{
          zIndex: 1000,
          paddingHorizontal: 20,
          position: "relative",
          flexDirection: "row",
          columnGap: 5,
        }}
      >
        <TextInput
          style={{
            backgroundColor: "white",
            height: 45,
            marginTop: 15,
            borderRadius: 20,
            paddingLeft: 15,
            width: "100%",
            borderWidth: 1,
            borderColor: "grey",
          }}
          placeholder="Search for products, brands and more"
          value={mapRegion.name}
          onChangeText={(text: any) => setSearchedText(text)}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>

      <View
        style={{
          flex: 1,
          position: "absolute",
          marginTop: 70,
          marginLeft: 20,
          flexDirection: "row",
          zIndex: 1000,
        }}
      >
        <Text style={{ alignSelf: "center", marginRight: 4 }}>Filter : </Text>
        <FlatList
          data={Object.keys(categoryList)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                backgroundColor: "white",
                paddingVertical: 5,
                paddingHorizontal: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "grey",
                flexDirection: "row",
              }}
              onPress={() => {
                setOpenDropdown(true);
                setActiveIndex(item);
                setBottomSheetIndex(0);
              }}
            >
              <Text style={{ alignSelf: "center" }}>
                {filterCriteria[item]?.name}
              </Text>
              <AntDesign
                name={item === activeIndex ? "up" : "down"}
                size={15}
                color="black"
                style={{ alignSelf: "center", marginTop: 3, marginLeft: 5 }}
              />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ gap: 10 }}
          horizontal
        />
      </View>

      {location ? (
        <MapView
          ref={(ref) => setMapRef(ref)}
          style={styles.map}
          region={location} // Update the map region based on the current location
          onRegionChangeComplete={onRegionChangeComplete} // Track the map rotation
          // rotateEnabled={true} // Allow map rotation
          showsCompass={true} // Disable default compass
          onPress={handleMapPress}
          mapType="standard"
        >
          {/* Marker for current location */}
          {/* <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Current Location"
          /> */}

          {/* Current Location Marker */}
          {currentLocation && (
            <Marker
              coordinate={currentLocation}
              title="Current Location"
              pinColor="blue" // Use blue color or custom icon for current location
              description="This is where you are"
            />
          )}

          {/* Markers for Nearby Places */}
          {/* {nearbyPlaces.map((place) => (
          <Marker
            key={place.id}
            coordinate={place.coordinate}
            title={place.title}
            description={place.description}
            pinColor="red" // Use red color or custom icon for nearby places
            onPress={() => setSelectedMarker(place)}
          />
        ))} */}
          {newMarkerPosition && (
            <Marker
              coordinate={newMarkerPosition}
              title="New Marker"
              description="This marker moves when you tap on the map."
              pinColor="green"
            />
          )}

          {newMarkerPosition && (
            <Polyline
              coordinates={[selectedLocation, newMarkerPosition]}
              strokeColor="#FF6347" // Line color
              strokeWidth={2}
              lineDashPattern={[5, 5]} // Dotted line pattern
            />
          )}

          {/* Marker for selected location */}
          {selectedLocation && (
            <Marker
              coordinate={selectedLocation}
              title="Selected Location"
              pinColor="red"
            />
          )}

          {/* Polyline for the route */}

          {filterResults.map((item: any) => {
            const centroid = calculateCentroid(item.coordinates);
            return item?.coordinates?.length > 0 ? (
              <>
                <Polygon
                  coordinates={item?.coordinates}
                  strokeColor={handleColor(item)}
                  strokeWidth={1}
                  fillColor={handleColor(item)}
                />

                <Marker coordinate={centroid}>
                  <Callout>
                    <Text>{item.name || "Polygon Info"}</Text>
                    <Text>Additional information here</Text>
                  </Callout>
                </Marker>
              </>
            ) : null;
          })}
        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}

      {/* Reset Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => resetLocation("currentLocation")}
      >
        <Ionicons name="locate" size={22} color="white" />
        {/* <Text style={styles.buttonText}>Reset Location</Text> */}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.selectedLocation}
        onPress={() => resetLocation("selectedLocation")}
      >
        <Ionicons name="locate" size={22} color="white" />
        {/* <Text style={styles.buttonText}>Reset Location</Text> */}
      </TouchableOpacity>
      {/* Reset Button */}
      <TouchableOpacity style={styles.imageFilter} onPress={handleOpenSheet}>
        <MaterialCommunityIcons
          name="image-filter-none"
          size={22}
          color="white"
        />
      </TouchableOpacity>
      {newMarkerPosition && (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            Distance between markers: {distance.toFixed(2)} meters
          </Text>
        </View>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={openMapModal}
        onRequestClose={() => {
          setOpenMapModal(!openMapModal);
          setOpenStyleModal(false);
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            marginTop: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text>Pawar</Text>
          <TouchableOpacity onPress={() => setOpenMapModal(false)}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        // animationType="fade"
        transparent={true}
        visible={openStyleModal}
        onRequestClose={() => {
          setOpenStyleModal(!openStyleModal);
          setOpenMapModal(false);
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            marginTop: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <Text>Harshad a</Text>
          <TouchableOpacity onPress={() => setOpenStyleModal(false)}>
            <AntDesign name="close" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={openDropdown}
        onRequestClose={() => {
          setOpenStyleModal(!openStyleModal);
          setOpenMapModal(false);
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            flex: 1,
            marginTop: "100%",
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setOpenStyleModal(false);
                setOpenDropdown(false);
                setActiveIndex("");
              }}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              // justifyContent: "space-evenly",
              alignItems: "center",
              flex: 1,
            }}
          >
            <FlatList
              data={categoryList?.[activeIndex]}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    let filterCrit: any = { ...filterCriteria };
                    if (activeIndex === "filter1") {
                      filterCrit[activeIndex] = item;
                    } else if (activeIndex === "filter2") {
                      filterCrit[activeIndex] = item;
                    }
                    console.log("item", item);
                    setFilterCriteria((prevState: any) => ({
                      ...prevState,
                      ...filterCrit,
                    }));
                    let filterResults = searchResults.filter(
                      (el: any) =>
                        el.status.toLowerCase() ===
                          filterCrit["filter1"].name.toLowerCase() &&
                        el.property.toLowerCase() ===
                          filterCrit["filter2"].name.toLowerCase()
                    );
                    console.log("filterCrit", filterCrit);

                    console.log("filterResults", filterResults);
                    console.log("searchResults", searchResults[0]);
                    setFilterResults(filterResults);
                    setActiveIndex("");
                    setOpenDropdown(false);
                  }}
                  style={{
                    // flexDirection: "column",
                    width: "19%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image source={item?.url} style={{ transform: "" }} />
                  <Text
                    style={{
                      fontSize: 25,
                      fontWeight: "500",
                      marginBottom: 40,
                    }}
                  >
                    {item?.name}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
            />
          </View>
        </View>
      </Modal>
      <BottomSheet index={bottomSheetIndex} snapPoints={snapPoinst}>
        <Text>Harshad</Text>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  map: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    top: 160,
    right: 13,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 100,
  },
  buttonText: {
    color: "white",
    marginLeft: 5,
  },
  compassButton: {
    position: "absolute",
    top: 90,
    right: 0,
    padding: 10,
    borderRadius: 50,
  },
  imageFilter: {
    position: "absolute",
    top: 105,
    right: 13,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    padding: 10,
    borderRadius: 100,
  },
  bottomSheetContent: {
    backgroundColor: "#F1F1F1",
    padding: 20,
    height: 300,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    justifyContent: "center",

    columnGap: 90,
  },
  selectedLocation: {
    position: "absolute",
    top: 215,
    right: 13,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red",
    padding: 10,
    borderRadius: 100,
  },
  distanceContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 8,
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MapScreen;
