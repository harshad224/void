import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  GestureHandlerRootView,
  NativeViewGestureHandler,
  TextInput,
} from "react-native-gesture-handler";
import GTextInput from "@/components/GTextInput";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch } from "react-redux";
import { mapSearch } from "@/redux/map/mapSlice";

const regionData = [
  {
    name: "Amonora Mall",
    city: "Pune",
    latitude: 18.5204,
    longitude: 73.9399,
  },
];

const Search = () => {
  const navigation: any = useNavigation();
  const [text, setText] = useState("");
  const [regionList, setRegionList] = useState<any>([]);
  const dispatch = useDispatch();
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleTextChange = (text: string) => {
    setText(text);
    let regionList: any = [];
    if (text !== "") {
      regionList = regionData.filter((item: any) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
    }

    setRegionList(regionList);
  };

  const handleTextClear = () => {
    setText("");
  };
  console.log("regionList", regionList);
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      {/* <GooglePlacesAutocomplete
          placeholder="Search for a place"
          fetchDetails={true}
          onPress={(data, details: any) => {
            const { lat, lng } = details?.geometry?.location;
            setRegion({
              ...region,
              latitude: lat,
              longitude: lng,
            });
          }}
          query={{
            key: "YOUR_GOOGLE_API_KEY",
            language: "en",
          }}
          styles={{
            container: {
              flex: 1,
              zIndex: 1,
              marginTop: 8,
            },
            listView: { backgroundColor: "white", height: 100 },
            textInput: {
              borderBottomColor: "grey",
              borderBottomWidth: 1,
            },
          }}
          textInputProps={{
            placeholderTextColor: "#888",
            clearButtonMode: "while-editing",
          }}
            
        /> */}

      <View
        style={{
          zIndex: 1000,
          paddingHorizontal: 20,
          position: "relative",
          marginTop: 5,
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
          value={text}
          onChangeText={handleTextChange}
        />
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={regionList}
            renderItem={(item: any) => (
              <TouchableOpacity
                style={{
                  zIndex: 1000,
                  marginTop: 10,
                  borderBottomWidth: 0.5,
                  borderBlockColor: "grey",
                  paddingHorizontal: 5,
                  paddingVertical: 12,
                  flexDirection: "row",
                  columnGap: 15,
                }}
                onPress={() => {
                  navigation.goBack();
                  dispatch(mapSearch(item?.item));
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    rowGap: 3,
                  }}
                >
                  <Ionicons name="location-outline" size={24} color="grey" />
                  <Text style={{ fontSize: 10, color: "grey" }}>125 km</Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignSelf: "center",
                  }}
                >
                  <Text style={{ fontSize: 16 }}>{item?.item?.name}</Text>
                  <Text style={{ fontSize: 12, color: "grey" }}>
                    {item?.item?.city}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default Search;
