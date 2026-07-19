import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";

export default function QuantityInput({
  quantity,
  setQuantity,
}) {
  const decrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increase = () => {
    setQuantity((prev) => prev + 1);
  };

  const onChange = (text) => {
    const numeric = text.replace(/[^0-9]/g, "");

    if (!numeric) {
      setQuantity(1);
      return;
    }

    setQuantity(Number(numeric));
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        height: 48,
        backgroundColor: "#fafafa",
        borderWidth: 0.5,
        borderColor: "#d4d4d4",
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <TouchableOpacity
        onPress={decrease}
        activeOpacity={0.7}
        style={{
          width: 38,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#525252",
            fontWeight: "600",
          }}
        >
          −
        </Text>
      </TouchableOpacity>

      <TextInput
        value={String(quantity)}
        onChangeText={onChange}
        keyboardType="number-pad"
        textAlign="center"
        style={{
          flex: 1,
          height: "100%",
          fontSize: 15,
          color: "#262626",
        }}
      />

      <TouchableOpacity
        onPress={increase}
        activeOpacity={0.7}
        style={{
          width: 38,
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "#525252",
            fontWeight: "600",
          }}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
}