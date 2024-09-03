import { Ionicons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import BottomSheetTransaction from "../components/BottomSheetAddTransaction";
import BottomSheetTransactionUpdate from "../components/BottomSheetUpdateTransaction";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [transactionUpdate, setTransactionUpdate] = useState({})

  const refRBSheetAdd = useRef(null)
  const refRBSheetUpdate = useRef(null)
  const navigate = useNavigation()

  const db = useSQLiteContext();

  const fetchData = async () => {
    try {
      const catStatement = await db.prepareAsync("SELECT * FROM category;");
      const execCat = await catStatement.executeAsync();
      const resCat = await execCat.getAllAsync();
      await catStatement.finalizeAsync();
      setCategories(resCat);

      const transStatement = await db.prepareAsync(`
        SELECT
          DATE(t.timestamps) AS transactionDate,
          strftime('%H:%M', t.timestamps) AS transactionTime, 
          t.id AS transactionId,
          t.categoryId,
          t.product,
          t.quantity,
          t.totalPrice,
          t.timestamps,
          c.name AS categoryName,
          c.icon AS categoryIcon,
          c.color AS categoryColor
        FROM
          transactions t
        JOIN
          category c
        ON
          t.categoryId = c.id
        ORDER BY
          transactionDate DESC, t.id DESC;
      `);
      const execTrans = await transStatement.executeAsync();
      const resTrans = await execTrans.getAllAsync();
      await transStatement.finalizeAsync();

      const groupedTransactions = resTrans.reduce((acc, trans) => {
        const date = trans.transactionDate;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(trans);
        return acc;
      }, {});

      setTransactions(groupedTransactions);
    } catch (error) {
      console.log("ERROR fetchData HomeScreen: ", error.message);

      await db.execAsync("ROLLBACK;");
    }
  };

  const handleSheetUpdate = (trans) => {
    setTransactionUpdate(trans)
    refRBSheetUpdate.current.open()
  }

  const handleClickCategory = async (cat) => {
    setSelectedCategory(cat);

    console.log("cat: ", cat);
    

    try {
      const catStatement = await db.prepareAsync("SELECT * FROM category;");
      const execCat = await catStatement.executeAsync();
      const resCat = await execCat.getAllAsync();
      await catStatement.finalizeAsync();
      setCategories(resCat);

      const transStatement = await db.prepareAsync(`
        SELECT
          DATE(t.timestamps) AS transactionDate,
          strftime('%H:%M', t.timestamps) AS transactionTime, 
          t.id AS transactionId,
          t.categoryId,
          t.product,
          t.quantity,
          t.totalPrice,
          t.timestamps,
          c.name AS categoryName,
          c.icon AS categoryIcon,
          c.color AS categoryColor
        FROM
          transactions t
        JOIN
          category c
        ON
          t.categoryId = c.id
        WHERE t.categoryId = ${cat.id}
        ORDER BY
          transactionDate DESC, t.id DESC;
      `);
      const execTrans = await transStatement.executeAsync();
      const resTrans = await execTrans.getAllAsync();
      await transStatement.finalizeAsync();

      const groupedTransactions = resTrans.reduce((acc, trans) => {
        const date = trans.transactionDate;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(trans);
        return acc;
      }, {});

      setTransactions(groupedTransactions);
    } catch (error) {
      console.log("ERROR fetchData HomeScreen: ", error.message);

      await db.execAsync("ROLLBACK;");
    }
  };

  const handleResetClickCategory = () => {
    setSelectedCategory(null)
    fetchData()
  }


  useEffect(() => {
    fetchData();
  }, []);

  console.log("transactions: ", transactions);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
      <View className="h-screen mt-12">
        <View className="px-3">
          <Animated.Text entering={FadeIn.delay(150)} className="text-2xl font-semibold mb-2">Selamat Datang!</Animated.Text>

          {/* CATEGORY */}
          <Animated.View entering={FadeIn.delay(250)} className="mb-4">
            <ScrollView
              className="pb-2"
              showsHorizontalScrollIndicator={false}
              horizontal
            >
              <TouchableOpacity
                    onPress={handleResetClickCategory}
                    className={`flex flex-row justify-center items-center mr-2.5 px-3 py-2 rounded-full mt-4`}
                    style={{ backgroundColor: selectedCategory === null ? "#2f3060" : "#f0efef" }}
                  >
                    <Icon
                      name={"albums-outline"}
                      color={selectedCategory === null ? "#fff" : "#262626"}
                      size={16}
                      className="mr-1"
                    />
                    <Text className={`font-semibold text-[16px] ${selectedCategory === null ? "text-white" : "text-neutral-700"}`}>
                      Semua Category
                    </Text>
                  </TouchableOpacity>
              {categories.map((cat, index) => {
                return (
                  <TouchableOpacity
                    key={cat.name}
                    onPress={() => handleClickCategory(cat)}
                    className={`flex flex-row justify-center items-center mr-2.5 px-3 py-2 rounded-full mt-4`}
                    style={{ backgroundColor: selectedCategory?.id === cat.id ? "#2f3060" : "#f0efef" }}
                  >
                    <Icon
                      name={cat.icon}
                      color={selectedCategory?.id === cat.id ? "white" : cat.color}
                      size={16}
                      className="mr-1"
                    />
                    <Text className={`font-semibold text-[16px] ${selectedCategory?.id === cat.id ? "text-white" : "text-neutral-700"}`}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(350)} className="flex flex-row justify-evenly items-center gap-2 mb-2">
            <TouchableOpacity onPress={() => navigate.navigate("Summary")} className="bg-orange-500 py-3 w-1/2 rounded-lg flex flex-row justify-center items-center gap-x-1">
              <Ionicons name="document" size={24} color="white" />
              <Text className="text-white font-semibold text-center">
                Ringkasan Catatan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => refRBSheetAdd.current.open()} className="bg-green-500 py-3 w-1/2 rounded-lg flex flex-row justify-center items-center gap-x-1">
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className="text-white font-semibold text-center">
                Tambah Catatan
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* HEADER PENGELUARAN */}
          <Animated.View entering={FadeIn.delay(400)} className="flex mb-2 flex-row justify-between items-center mt-5">
            <Text className="text-3xl font-bold text-neutral-700">
              Seluruh Pengeluaran
            </Text>
          </Animated.View>

          {/* BODY PENGELUARAN */}
          <View className=" h-[475px]">
            {Object.keys(transactions).length > 0 ? (
              <ScrollView
              contentContainerStyle={{
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 0,
              }}
              showsVerticalScrollIndicator={false}
            >
              {
              Object.keys(transactions).map((date, index) => (
                <Animated.View entering={FadeIn.delay(200)} key={index}>
                  <Text className="text-neutral-700 font-bold mb-4 text-[22px]">
                    {date}
                  </Text>
                  {transactions[date].map((trans, idx) => (
                    <TouchableOpacity onPress={() => handleSheetUpdate(trans)}
                      key={idx}
                      className={`bg-blue-500 w-full my-4 flex flex-row justify-start items-center gap-2 px-2 pt-1 pb-3 rounded-lg`}
                    >
                      <View>
                        <View className="mb-1 w-full pr-2 flex flex-row justify-between items-center">
                          <View className="flex-row justify-start items-center gap-x-1">
                            <Ionicons
                              name={trans.categoryIcon}
                              size={24}
                              color="white"
                            />
                            <Text className="text-white font-bold text-[16px]">
                              {trans.categoryName}
                            </Text>
                          </View>
                          <View className="flex flex-row justify-center items-center gap-x-1">
                            <Icon name="time-outline" size={22} color="white" />
                            <Text className="text-white font-bold text-[16px]">{trans.transactionTime}</Text>
                          </View>
                        </View>
                        <Text className="text-white font-bold text-lg">
                          {trans.product}
                        </Text>
                        <Text className="text-white font-semibold text-[17px]">
                          Rp {trans.totalPrice.toLocaleString("id-ID")} - (
                          {trans.quantity})
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              ))
              }
            </ScrollView>
            ) : (
              <Animated.View entering={FadeIn.delay(400)} className="pb-4 rounded-lg bg-white flex justify-center items-center">
                <Image source={require("../../assets/notFound.png")} alt="Tidak Ada Catatan" className="w-72 h-72" />
                <Text className="font-bold text-neutral-700 text-xl">Tidak Ada Catatan...</Text>
            </Animated.View>
            )
            }
          </View>
        </View>
      </View>

      <BottomSheetTransaction categories={categories} fetch={fetchData} db={db} refRBSheet={refRBSheetAdd} />
      <BottomSheetTransactionUpdate transaction={transactionUpdate} categories={categories} fetch={fetchData} db={db} refRBSheet={refRBSheetUpdate} />
    </View>
  );
}
