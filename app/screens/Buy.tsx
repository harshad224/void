import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Button,
  Pressable,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import GTextInput from "@/assets/components/TextInput";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import * as Location from "expo-location";
import MapScreen from "@/screens/MapScreen";
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import RNPickerSelect from "react-native-picker-select";
import { ResizeMode, Video } from "expo-av";
import VideoPlayer from "expo-video-player";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");

const Buy = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX: any = useRef(new Animated.Value(0)).current;
  const [selectedState, setSelectedState] = useState("");
  const videoRef: any = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // State to control muting
  const [isVideo, setIsVideo] = useState(false); // State to control muting

  const toggleMute = () => {
    setIsMuted((prevState) => !prevState); // Toggle mute state
  };

  const handleInView = (inView: any) => {
    if (inView) {
      videoRef.current.playAsync();
      setIsPlaying(true);
    } else {
      videoRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const navigation: any = useNavigation();

  // const handleCategoryPress = (category: string) => {
  //   // Navigate to the respective page based on the category
  //   navigation.navigate(category);
  // };
  const states = [
    { label: "Alabama", value: "AL" },
    { label: "Alaska", value: "AK" },
    { label: "Arizona", value: "AZ" },
    { label: "California", value: "CA" },
    { label: "Colorado", value: "CO" },
    // Add more states as needed
  ];

  const categoryList = [
    {
      id: 1,
      name: "Buy",
      color: "grey",
      subTitle: "a\n new/rented property",
      route: "screens/Buy",
    },
    {
      id: 2,
      name: "Sell",
      color: "grey",
      subTitle: "your\n owned\n property",
      route: "screens/Sell",
    },
    {
      id: 3,
      name: "Lease",
      color: "grey",
      subTitle: "your\n owned\n  property",
      route: "screens/Lease",
    },
    {
      id: 4,
      name: "Insurance",
      color: "grey",
      subTitle: "your\n owned\n property",
      route: "screens/Insurance",
    },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      // You can now use the location
      const location = await Location.getCurrentPositionAsync({});
      console.log(location);
    })();
  }, []);

  const carousolList: any = [
    {
      id: 1,
      image: "https://via.placeholder.com/100/FF0000",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/100/00FF00",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/100/0000FF",
    },
  ];

  const renderCarousolItem = () => {
    return (
      <View
        style={{
          width: 150,
          height: 150,
          backgroundColor: "white",
          marginRight: 10,
          borderRadius: 9,
        }}
      ></View>
    );
  };
  const renderCarousolItem1 = (itemData: any) => {
    return (
      <View
        style={{
          width: width,
          height: 400,
          backgroundColor: "#D9D9D9",
          // marginTop: 5,
          // borderRadius: 9,
        }}
      >
        <Image
          source={{ uri: itemData.item.image }} // Use the image from the item data
        />
      </View>
    );
  };

  const renderCarousolItem2 = (itemData: any) => {
    return (
      <View
        style={{
          width: width,
          height: 280,
          backgroundColor: "#D9D9D9",
          // marginTop: 5,
          // borderRadius: 9,
        }}
      >
        <Image
          source={{ uri: itemData.item.image }} // Use the image from the item data
        />
      </View>
    );
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderDots = () => {
    return (
      <View style={styles.dotContainer}>
        {carousolList.map((_: any, i: any) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View>
    );
  };

  const renderDots1 = () => {
    return (
      <View style={styles.dotContainer1}>
        {carousolList.map((_: any, i: any) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i} style={[styles.dot, { opacity }]} />;
        })}
      </View>
    );
  };

  return (
    <GestureHandlerRootView>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          position: "relative",
          zIndex: 999,
          backgroundColor: "unset",
          // opacity: 1,
        }}
      >
        <View
          style={{
            position: "absolute",
            // flex: 1,
            top: 10,
            zIndex: 999,
            backgroundColor: "white",
            // marginTop: 10,
            paddingHorizontal: 5,
            paddingBottom: 2,
            marginHorizontal: 20,
            borderRadius: 15,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              // marginHorizontal: 40,
              marginVertical: 7,
            }}
          >
            {categoryList.map((item: any) => {
              return (
                <Pressable
                  style={{
                    flexDirection: "row",
                    marginHorizontal: 20,
                  }}
                  key={item.id}
                  onPress={() => handleCategoryPress(item?.route)} // Handle press
                >
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        fontSize: 13,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View> */}

      <ScrollView style={{ flex: 1 }}>
        <FlatList
          data={carousolList}
          renderItem={renderCarousolItem1}
          keyExtractor={(itemData: any) => itemData.id.toString()}
          horizontal // Make FlatList horizontal like a carousel
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToAlignment="center"
          decelerationRate="fast"
          style={styles.exploreContainer2}
          onScroll={onScroll}
        />
        {renderDots()}
        <Text
          style={{
            fontWeight: "light",
            marginLeft: 10,
            marginTop: 5,
            // fontSize: 13,
          }}
        >
          Recently Viewed
        </Text>
        <View
          style={{
            flexDirection: "row",
            columnGap: 9,
            marginLeft: 10,
            marginTop: 5,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "#D9D9D9",
              borderRadius: 100,
            }}
          ></View>
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "#D9D9D9",
              borderRadius: 100,
            }}
          ></View>
          <View
            style={{
              width: 80,
              height: 80,
              backgroundColor: "#D9D9D9",
              borderRadius: 100,
            }}
          ></View>
        </View>
        <Text style={{ fontWeight: "light", marginLeft: 10, marginTop: 0 }}>
          Suggested for you
        </Text>
        <View
          style={{
            flexDirection: "row",
            columnGap: 9,
            marginLeft: 10,
            marginTop: 5,
          }}
        >
          <View
            style={{
              width: 180,
              height: 210,
              backgroundColor: "#D9D9D9",
              borderRadius: 9,
            }}
          ></View>
          <View
            style={{
              width: 180,
              height: 210,
              backgroundColor: "#D9D9D9",
              borderRadius: 9,
            }}
          ></View>
          <View
            style={{
              width: 120,
              height: 140,
              backgroundColor: "#D9D9D9",
              borderRadius: 9,
            }}
          ></View>
        </View>
        <View
          style={{
            width: width,
            height: 280,
            backgroundColor: "#D9D9D9",
            marginTop: 20,
            position: "relative",
            // borderRadius: 9,
          }}
        >
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              resizeMode: ResizeMode.CONTAIN,
              // ❗ source is required https://docs.expo.io/versions/latest/sdk/video/#props
              source: {
                uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              },
              isMuted: isMuted, // Set the muted state
            }}
            style={styles.video}
          />
          <View style={styles.buttonContainer}>
            {!isMuted ? (
              <Entypo
                name="sound"
                size={30}
                color="white"
                onPress={toggleMute}
              />
            ) : (
              <Entypo
                name="sound-mute"
                size={30}
                color="white"
                onPress={toggleMute}
              />
            )}
            <Entypo
              name="video"
              size={30}
              color="white"
              style={{ marginTop: 10 }}
            />
            <Fontisto
              name="picture"
              size={24}
              color="white"
              style={{ marginTop: 10 }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <View style={{ flexDirection: "row", columnGap: 15 }}>
            <SimpleLineIcons name="bag" size={25} color="black" />
            <MaterialCommunityIcons
              name="heart-plus-outline"
              size={27}
              color="black"
            />
            <FontAwesome name="location-arrow" size={27} color="black" />
            <Ionicons name="arrow-redo-outline" size={27} color="black" />
          </View>
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "top",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              backgroundColor: "#D9D9D9",
              // marginTop: 20,
              borderRadius: 20,
              marginRight: 5,
            }}
          ></View>

          <View style={{ alignSelf: "flex-start" }}>
            <Text>Nyati eerewrwe erw r we rewrew wer</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", marginRight: 5, fontSize: 8 }}>
                Nyati
              </Text>
              <View
                style={{
                  width: 3,
                  height: 3,
                  backgroundColor: "#D9D9D9",
                  // marginTop: 20,
                  borderRadius: 20,
                  marginRight: 5,
                }}
              ></View>
              <Text style={{ fontWeight: "bold", marginRight: 5, fontSize: 8 }}>
                300k views
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            width: width,
            height: 280,
            backgroundColor: "#D9D9D9",
            marginTop: 20,
            // borderRadius: 9,
          }}
        >
          {isVideo ? (
            <>
              <VideoPlayer
                videoProps={{
                  shouldPlay: true,
                  resizeMode: ResizeMode.CONTAIN,
                  // ❗ source is required https://docs.expo.io/versions/latest/sdk/video/#props
                  source: {
                    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                  },
                  isMuted: isMuted, // Set the muted state
                }}
                style={styles.video}
              />
              <View style={styles.buttonContainer}>
                {!isMuted ? (
                  <Entypo
                    name="sound"
                    size={30}
                    color="white"
                    onPress={toggleMute}
                  />
                ) : (
                  <Entypo
                    name="sound-mute"
                    size={30}
                    color="white"
                    onPress={toggleMute}
                  />
                )}
              </View>
            </>
          ) : (
            <>
              <FlatList
                data={carousolList}
                renderItem={renderCarousolItem2}
                keyExtractor={(itemData: any) => itemData.id.toString()}
                horizontal // Make FlatList horizontal like a carousel
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
                style={styles.exploreContainer2}
                onScroll={onScroll}
              />
            </>
          )}
          <View style={styles.buttonContainer}>
            <View style={{ marginTop: 35, alignItems: "center" }}>
              {isVideo ? (
                <Entypo
                  name="video"
                  size={30}
                  color="white"
                  style={{ marginTop: 10 }}
                  onPress={() => setIsVideo(true)}
                />
              ) : (
                <Entypo
                  name="video"
                  size={20}
                  color="white"
                  style={{ marginTop: 10 }}
                  onPress={() => setIsVideo(true)}
                />
              )}
              {!isVideo ? (
                <Fontisto
                  name="picture"
                  size={24}
                  color="white"
                  style={{ marginTop: 10 }}
                  onPress={() => setIsVideo(false)}
                />
              ) : (
                <Fontisto
                  name="picture"
                  size={14}
                  color="white"
                  style={{ marginTop: 10 }}
                  onPress={() => setIsVideo(false)}
                />
              )}
            </View>
          </View>
        </View>
        <View style={{ position: "relative" }}>
          {!isVideo && renderDots1()}
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginHorizontal: 10,
            marginTop: 5,
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row", columnGap: 15 }}>
            <SimpleLineIcons name="bag" size={25} color="black" />
            <MaterialCommunityIcons
              name="heart-plus-outline"
              size={27}
              color="black"
            />
            <FontAwesome name="location-arrow" size={27} color="black" />
            <Ionicons name="arrow-redo-outline" size={27} color="black" />
          </View>
          <Entypo name="dots-three-vertical" size={21} color="black" />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "top",
            marginHorizontal: 10,
          }}
        >
          <View
            style={{
              width: 30,
              height: 30,
              backgroundColor: "#D9D9D9",
              // marginTop: 20,
              borderRadius: 20,
              marginRight: 5,
            }}
          ></View>
          <View>
            <Text>Nyati eerewrwe erw r we rewrew wer</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold", marginRight: 5, fontSize: 8 }}>
                Nyati
              </Text>
              <View
                style={{
                  width: 3,
                  height: 3,
                  backgroundColor: "#D9D9D9",
                  // marginTop: 20,
                  borderRadius: 20,
                  marginRight: 5,
                }}
              ></View>
              <Text style={{ fontWeight: "bold", marginRight: 5, fontSize: 8 }}>
                300k views
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  headerOuterContainer: { backgroundColor: "black" },
  headerInnerContainer1: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 17,
    paddingVertical: 13,
    backgroundColor: "white",
    position: "static",
    top: 0,
  },
  headerInnerContainer2: {
    paddingLeft: 20,
    // height: 160,
  },
  exploreContainer1: { flexDirection: "row", justifyContent: "space-between" },
  exploreContainer2: {
    // height: 90,
    borderRadius: 8,
  },
  explore: {
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 11,
    color: "black",
    alignSelf: "center",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  searchInput: {
    flex: 4,
  },
  scanner: {
    marginLeft: 17,
    alignSelf: "center",
  },
  carouselItem: {
    borderRadius: 10,
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Cover the item completely
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dotContainer1: {
    position: "absolute",
    left: 170,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  dot: {
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: "#595959",
    marginHorizontal: 5,
  },
  dot1: {
    height: 5,
    width: 7,
    borderRadius: 5,
    backgroundColor: "#595959",
    marginHorizontal: 8,
  },
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the icon is visible
    backgroundColor: "#E0E0E0",
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "gray",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the icon is visible
    backgroundColor: "#E0E0E0",
  },
  video: {
    width: width,
    height: 280,
  },
  buttonContainer: {
    position: "absolute",
    flexDirection: "column",
    justifyContent: "center",
    // marginTop: -100,
    right: 10,
    top: 25,
  },
});

export default Buy;
