import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from "react-native-vector-icons/Ionicons";

export default function BottomSheetTransaction({ categories, fetch, db, refRBSheet }) {
  return (
    <View>
        <RBSheet
        ref={refRBSheet}
        useNativeDriver={false}
        draggable={true}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          draggableIcon: {
            backgroundColor: "gray",
            width: 100,
            height: 5,
            borderRadius: 5,
            marginVertical: 10,
          },
          container: {
            height: "75%",
          },
        }}
        customModalProps={{
          animationType: "slide",
        }}
        height={500}
        openDuration={250}
      >
        <AddTransactionComp categories={categories} fetch={fetch} db={db} refRBSheet={refRBSheet} />
      </RBSheet>
    </View>
  )
}



const AddTransactionComp = ({ categories, fetch, db, refRBSheet }) => {
    const [name, setName] = useState("")
    const [totalPrice, setTotalPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [selectedCategory, setSelectedCategory] = useState(null)

    const [nameErr, setNameErr] = useState("")
    const [totalPriceErr, setTotalPriceErr] = useState("")
    const [quantityErr, setQuantityErr] = useState("")

    const submit = async () => {
        if(!name) {
            setNameErr("Produk Wajib Diisi")
            return
        } else {
            setNameErr("")
        }

        if(!quantity) {
            setQuantityErr("Jumlah Wajib Diisi")
            return
        } else {
            setQuantityErr("")
        }

        if(!totalPrice) {   
            setTotalPriceErr("Total Harga Wajib Diisi")
            return
        } else {
            setTotalPriceErr("")
        }

        if(!selectedCategory) {
            setSelectedCategory(categories[categories.length - 1])
            return
        }

          try {
            await db.execAsync("BEGIN TRANSACTION;");

          await db.execAsync(`
            INSERT INTO transactions (categoryId, product, quantity, totalPrice) VALUES (${selectedCategory.id}, '${name}', ${quantity}, ${totalPrice});
          `)

          await db.execAsync("COMMIT;");     
          refRBSheet.current.close()
          fetch()
          } catch (error) {
            console.log("ERROR AddTransactionComp: ", error.message);
            await db.execAsync("ROLLBACK;");
          }
    }

    return (
      <ScrollView
        style={{
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          height: "100%",
          backgroundColor: "white",
        }}
      >
        <View style={{ marginTop: 26 }}>
          <View style={{ paddingHorizontal: 18, marginBottom: 25 }}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
              Nama Produk
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Masukkan Nama Product...."
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
            {nameErr && <Text className="text-red-500">{nameErr}</Text>}
          </View>

          <View style={{ paddingHorizontal: 18, marginBottom: 25 }}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
              Jumlah Produk
            </Text>
            <TextInput
                value={quantity}
                onChangeText={setQuantity}
              placeholder="Masukkan Jumlah Product...."
              keyboardType='numeric'
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
            {quantityErr && <Text className="text-red-500">{quantityErr}</Text>}
          </View>

          <View style={{ paddingHorizontal: 18, marginBottom: 25 }}>
            <Text style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
              Total Harga
            </Text>
            <TextInput
              value={totalPrice}
              onChangeText={setTotalPrice}
              placeholder="Masukkan Total Harga...."
              keyboardType='numeric'
              style={{
                padding: 10,
                paddingHorizontal: 16,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />
            {totalPriceErr && <Text className="text-red-500">{totalPriceErr}</Text>}
          </View>

          <Text className="px-[20px]" style={{ fontWeight: "600", fontSize: 16, marginBottom: 8 }}>
            Pilih Kategori
            </Text>
            <View className="flex flex-row justify-center items-center mb-[25px]">
            <View className="border border-gray-500 rounded-[10px] w-[90%]">
            <SelectDropdown
                  data={categories}
                  search={true}
                  defaultValue={selectedCategory}
                  onSelect={(selectedItem, index) => {
                    setSelectedCategory(selectedItem);
                    console.log(selectedItem, index);
                  }}
                  renderButton={(selectedItem, isOpened) => {
                    return (
                      <View style={styles.dropdownButtonStyle}>
                        <Text style={styles.dropdownButtonTxtStyle}>
                          {(selectedCategory && selectedItem?.name) ||
                            "Pilih kategori"}
                        </Text>
                        <Icon
                          name={isOpened ? "chevron-up" : "chevron-down"}
                          style={styles.dropdownButtonArrowStyle}
                        />
                      </View>
                    );
                  }}
                  renderItem={(item, index, isSelected) => {
                    return (
                      <View
                        key={index}
                        style={{
                          ...styles.dropdownItemStyle,
                          ...(isSelected && { backgroundColor: "#E9ECEF" }),
                        }}
                      >
                        <View className="flex flex-row justify-start items-center">
                            <Icon name={item.icon} color={item.color} size={16} className="mr-1" />
                            <Text style={styles.dropdownItemTxtStyle}>
                          {item.name}
                        </Text>
                        </View>
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                  dropdownStyle={styles.dropdownMenuStyle}
                />
            </View>
            </View>
  
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              gap: 8,
              paddingHorizontal: 18,
              paddingBottom: 25,
            }}
          >
            <TouchableOpacity
              onPress={submit}
              style={{
                backgroundColor: "#3b82f6",
                flex: 1,
                paddingVertical: 14,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Simpan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };
  


const styles = StyleSheet.create({
    dropdownButtonStyle: {
      width: "100%",
      height: 50,
      backgroundColor: "transparent",
      borderRadius: 10,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "400",
      color: "#262626",
    },
    dropdownButtonArrowStyle: {
      fontSize: 28,
    },
    dropdownButtonIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
    dropdownMenuStyle: {
      backgroundColor: "#fff",
      borderRadius: 8,
    },
    dropdownItemStyle: {
      width: "100%",
      flexDirection: "row",
      paddingHorizontal: 12,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
      flex: 1,
      fontSize: 18,
      fontWeight: "500",
      color: "#151E26",
    },
    dropdownItemIconStyle: {
      fontSize: 28,
      marginRight: 8,
    },
  });
  