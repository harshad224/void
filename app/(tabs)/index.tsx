import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
  Pressable,
  Modal,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { ResizeMode } from "expo-av";
import VideoPlayer from "expo-video-player";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get("window");

const Buy = () => {
  const scrollX: any = useRef(new Animated.Value(0)).current;
  const videoRef: any = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // State to control muting
  const [isVideo, setIsVideo] = useState(false); // State to control muting
  const [modalVisible, setModalVisible] = useState(false);

  const toggleMute = () => {
    setIsMuted((prevState) => !prevState); // Toggle mute state
  };

  const navigation: any = useNavigation();

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

  const propertyList: any = [
    {
      id: 1,
      image: "https://via.placeholder.com/100/FF0000",
      urlList: [],
      header: "Lorem ipsum",
      owner: "Nyati",
      views: "300k",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/100/00FF00",
      urlList: [],
      header: "Lorem ipsum",
      owner: "Nyati",
      views: "300k",
    },
    {
      id: 3,
      image: "https://via.placeholder.com/100/0000FF",
      urlList: [],
      header: "Lorem ipsum",
      owner: "Nyati",
      views: "300k",
    },
  ];
  const renderCarousolItem1 = (itemData: any) => {
    return (
      <View
        style={{
          width: width,
          height: 300,
          backgroundColor: "#D9D9D9",
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
        }}
      >
        {itemData?.urlList?.isVideo ? (
          <VideoPlayer
            videoProps={{
              shouldPlay: true,
              resizeMode: ResizeMode.CONTAIN,
              source: {
                uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
              },
              isMuted: isMuted,
            }}
            style={styles.video}
          />
        ) : (
          <Image
            source={{ uri: itemData.item.image }} // Use the image from the item data
          />
        )}
      </View>
    );
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderDots1 = () => {
    return (
      <View style={styles.dotContainer1}>
        {carousolList.map((_: any, i: any) => {
          const opacity = scrollX.interpolate({
            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i} style={[styles.dot1, { opacity }]} />;
        })}
      </View>
    );
  };

  const handleCategoryPress = (category: string) => {
    navigation.navigate(category);
  };

  const recentlyViewed = [
    {
      id: 1,
      url: "",
    },
    {
      id: 2,
      url: "",
    },
  ];

  const suggestedForYou = [
    {
      id: 1,
      url: "",
    },
    {
      id: 2,
      url: "",
    },
  ];

  const renderItem = ({ item }: { item: { type: string } }) => {
    switch (item.type) {
      case "carousel":
        return (
          <>
            <FlatList
              data={carousolList}
              renderItem={renderCarousolItem1}
              keyExtractor={(itemData: any) => itemData.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToAlignment="center"
              decelerationRate="fast"
              style={styles.exploreContainer2}
              onScroll={onScroll}
            />
            <View style={styles.dotContainer}>
              {carousolList.map((_: any, i: any) => {
                const opacity = scrollX.interpolate({
                  inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: "clamp",
                });
                return (
                  <Animated.View key={i} style={[styles.dot, { opacity }]} />
                );
              })}
            </View>
          </>
        );
      case "recentlyViewed":
        return (
          <>
            <Text style={{ fontWeight: "light", marginLeft: 10, marginTop: 0 }}>
              Recently Viewed
            </Text>
            <View
              style={{
                flexDirection: "row",
                columnGap: 9,
                marginLeft: 10,
                marginTop: 5,
              }}
            >
              {recentlyViewed.map((item: any) => {
                return (
                  <View
                    style={{
                      width: 180,
                      height: 210,
                      backgroundColor: "#D9D9D9",
                      borderRadius: 9,
                    }}
                    key={item?.id}
                  ></View>
                );
              })}
            </View>
          </>
        );
      case "suggestedForYou":
        return (
          <>
            <Text
              style={{ fontWeight: "light", marginLeft: 10, marginTop: 15 }}
            >
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
              {suggestedForYou.map((item: any) => {
                return (
                  <View
                    style={{
                      width: 180,
                      height: 210,
                      backgroundColor: "#D9D9D9",
                      borderRadius: 9,
                    }}
                    key={item?.id}
                  ></View>
                );
              })}
            </View>
          </>
        );
      case "videoCarousel":
        return (
          <>
            {propertyList.map((el: any) => {
              return (
                <>
                  <View
                    style={{
                      width: width,
                      height: 280,
                      backgroundColor: "#D9D9D9",
                      marginTop: 20,
                    }}
                  >
                    <FlatList
                      data={propertyList}
                      renderItem={renderCarousolItem2}
                      keyExtractor={(itemData: any) => itemData.id.toString()}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled
                      snapToAlignment="center"
                      decelerationRate="fast"
                      style={styles.exploreContainer2}
                      onScroll={onScroll}
                    />
                  </View>
                  <View style={{ position: "relative" }}>
                    <View style={styles.dotContainer1}>
                      {propertyList.map((_: any, i: any) => {
                        const opacity = scrollX.interpolate({
                          inputRange: [
                            (i - 1) * width,
                            i * width,
                            (i + 1) * width,
                          ],
                          outputRange: [0.3, 1, 0.3],
                          extrapolate: "clamp",
                        });
                        return (
                          <Animated.View
                            key={i}
                            style={[styles.dot1, { opacity }]}
                          />
                        );
                      })}
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
                      <FontAwesome
                        name="location-arrow"
                        size={27}
                        color="black"
                      />
                    </View>
                    <Entypo
                      name="dots-three-vertical"
                      size={24}
                      color="black"
                      onPress={() => setModalVisible(true)}
                    />
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
                        borderRadius: 20,
                        marginRight: 5,
                      }}
                    ></View>
                    <View>
                      <Text>{el?.header}</Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            marginRight: 5,
                            fontSize: 8,
                          }}
                        >
                          {el?.owner}
                        </Text>
                        <View
                          style={{
                            width: 3,
                            height: 3,
                            backgroundColor: "#D9D9D9",
                            borderRadius: 20,
                            marginRight: 5,
                          }}
                        ></View>
                        <Text
                          style={{
                            fontWeight: "bold",
                            marginRight: 5,
                            fontSize: 8,
                          }}
                        >
                          {el?.views} views
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              );
            })}
          </>
        );
      default:
        return null;
    }
  };

  const DATA = [
    { id: "carousel", type: "carousel" },
    { id: "recentlyViewed", type: "recentlyViewed" },
    { id: "suggestedForYou", type: "suggestedForYou" },
    { id: "videoSection", type: "video" },
    { id: "interactiveIcons", type: "interactiveIcons" },
    { id: "videoCarousel", type: "videoCarousel" },
  ];

  return (
    <GestureHandlerRootView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          position: "relative",
          zIndex: 999,
          backgroundColor: "unset",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 10,
            zIndex: 999,
            backgroundColor: "white",
            paddingHorizontal: 20,
            paddingTop: 3,
            paddingBottom: 4,
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
                        fontWeight: "bold",
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
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalWrapper}>
            <View style={{ alignItems: "flex-end" }}>
              <AntDesign
                name="close"
                size={24}
                color="black"
                onPress={() => setModalVisible(false)}
              />
            </View>
            <View style={styles.modalView}>
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 15,
                  padding: 10,
                  borderColor: "#E8E8E8",
                  borderBottomWidth: 1,
                }}
              >
                <AntDesign name="eyeo" size={20} color="black" />
                <Text style={styles.modalText}>View Details</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 15,
                  padding: 10,
                  borderColor: "#E8E8E8",
                  borderBottomWidth: 1,
                }}
              >
                <MaterialIcons name="compare" size={20} color="black" />
                <Text style={styles.modalText}>Add to compare</Text>
              </View>
              <View
                style={{ flexDirection: "row", columnGap: 15, padding: 10 }}
              >
                <Ionicons name="arrow-redo-outline" size={20} color="black" />
                <Text style={styles.modalText}>Share</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  exploreContainer1: { flexDirection: "row", justifyContent: "space-between" },
  exploreContainer2: {
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
    width: 5,
    borderRadius: 5,
    backgroundColor: "#595959",
    marginHorizontal: 5,
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
    right: 10,
    top: 25,
  },
  modalWrapper: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 2,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalBackground: {
    flex: 1,
    marginTop: -65,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dark semi-transparent background
  },
  modalView: {
    paddingTop: 0,
    paddingLeft: 5,
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  modalText: {
    textAlign: "center",
    alignSelf: "center",
    fontWeight: "500",
  },
});

export default Buy;
