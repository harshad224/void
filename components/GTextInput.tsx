import React, { useState } from "react";
import { StyleSheet, TextInput, View, KeyboardTypeOptions } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

interface IGTextInput {
  onChange: (text: string) => void;
  onClear: () => void;
  value: string;
  placeholder: string;
  keyboardType: KeyboardTypeOptions;
}

const GTextInput = ({
  onChange,
  onClear,
  value,
  placeholder,
  keyboardType,
}: IGTextInput) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <View
      style={[
        styles.inputContainer,
        { borderColor: isFocus ? "black" : "rgb(207 207 207)" },
      ]}
    >
      <AntDesign
        name="search1"
        size={20}
        color="rgb(121 120 120)"
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder}
        keyboardType={keyboardType}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      {value.length > 0 && (
        <MaterialIcons name="close" size={24} color="black" onPress={onClear} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: "100%",
    // borderBottomWidth: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "rgb(121 120 120)",
    paddingVertical: 10,
  },
});

export default GTextInput;
