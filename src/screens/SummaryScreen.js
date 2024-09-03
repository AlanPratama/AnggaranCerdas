import { View, Text, StatusBar, Dimensions, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { useSQLiteContext } from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";

function formatDate(dateString) {
  const options = { weekday: "short", day: "numeric", month: "short" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}

export default function SummaryScreen() {
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState([]);
  const [weeklyExpenseData, setWeeklyExpenseData] = useState([]);
  const [twoWeeksExpenseData, setTwoWeeksExpenseData] = useState([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState([]);
  const [threeMonthsExpenseData, setThreeMonthsExpenseData] = useState([]);
  const [sixMonthsExpenseData, setSixMonthsExpenseData] = useState([]);
  const [yearlyExpenseData, setYearlyExpenseData] = useState([]);

  const navigate = useNavigation()
  const db = useSQLiteContext();

  const fetchExpenseData = async () => {
    const expenseStatement = await db.prepareAsync(`
          SELECT
            DATE(t.timestamps) AS date,  
            SUM(t.totalPrice) AS totalExpense  
          FROM
            transactions t
          WHERE
            t.timestamps >= DATE('now', '-5 days')  -- Hanya ambil data selama 5 hari terakhir
          GROUP BY
            DATE(t.timestamps)  -- Mengelompokkan berdasarkan tanggal
          ORDER BY
            DATE(t.timestamps) ASC;  -- Mengurutkan berdasarkan tanggal (terlama ke terbaru)
        `);

    const execExpense = await expenseStatement.executeAsync();
    const data = await execExpense.getAllAsync();
    await expenseStatement.finalizeAsync();
    setExpenseData(data);

    const weeklyExpenseStatement = await db.prepareAsync(`
          SELECT
            DATE(t.timestamps) AS date,  
            SUM(t.totalPrice) AS totalExpense  
          FROM
            transactions t
          WHERE
            t.timestamps >= DATE('now', '-7 days')  -- Hanya ambil data selama 7 hari terakhir
          GROUP BY
            DATE(t.timestamps)  -- Mengelompokkan berdasarkan tanggal
          ORDER BY
            DATE(t.timestamps) ASC;  -- Mengurutkan berdasarkan tanggal (terlama ke terbaru)
        `);

    const execWeeklyExpense = await weeklyExpenseStatement.executeAsync();
    const weeklyData = await execWeeklyExpense.getAllAsync();
    await weeklyExpenseStatement.finalizeAsync();
    setWeeklyExpenseData(weeklyData);

    const twoWeeksExpenseStatement = await db.prepareAsync(`
          SELECT
            DATE(t.timestamps) AS date,  
            SUM(t.totalPrice) AS totalExpense
          FROM
            transactions t
          WHERE
            t.timestamps >= DATE('now', '-14 days')  -- Hanya ambil data selama 14 hari terakhir
          GROUP BY
            DATE(t.timestamps)  -- Mengelompokkan berdasarkan tanggal
          ORDER BY
            DATE(t.timestamps) ASC;  -- Mengurutkan berdasarkan tanggal (terlama ke terbaru)
        `);

    const execTwoWeeksExpense = await twoWeeksExpenseStatement.executeAsync();
    const twoWeeksData = await execTwoWeeksExpense.getAllAsync();
    await twoWeeksExpenseStatement.finalizeAsync();
    setTwoWeeksExpenseData(twoWeeksData);

    const monthlyExpenseStatement = await db.prepareAsync(`
          SELECT 
            DATE(t.timestamps) AS date,  
            SUM(t.totalPrice) AS totalExpense
          FROM
            transactions t
          WHERE
            t.timestamps >= DATE('now', '-30 days')  -- Hanya ambil data selama 30 hari terakhir
          GROUP BY
            DATE(t.timestamps)  -- Mengelompokkan berdasarkan tanggal
          ORDER BY
            DATE(t.timestamps) ASC;  -- Mengurutkan berdasarkan tanggal (terlama ke terbaru)
        `);

    const execMonthlyExpense = await monthlyExpenseStatement.executeAsync();
    const monthlyData = await execMonthlyExpense.getAllAsync();
    await monthlyExpenseStatement.finalizeAsync();
    setMonthlyExpenseData(monthlyData);

    const threeMonthsExpenseStatement = await db.prepareAsync(`
          SELECT
            DATE(t.timestamps) AS date,  
            SUM(t.totalPrice) AS totalExpense
          FROM
            transactions t
          WHERE
            t.timestamps >= DATE('now', '-90 days')  -- Hanya ambil data selama 90 hari terakhir
          GROUP BY
            DATE(t.timestamps)  -- Mengelompokkan berdasarkan tanggal
          ORDER BY
            DATE(t.timestamps) ASC;  -- Mengurutkan berdasarkan tanggal (terlama ke terbaru)
        `);

    const execThreeMonthsExpense = await threeMonthsExpenseStatement.executeAsync();
    const threeMonthsData = await execThreeMonthsExpense.getAllAsync();
    await threeMonthsExpenseStatement.finalizeAsync();
    setThreeMonthsExpenseData(threeMonthsData);

    const sixMonthsExpenseStatement = await db.prepareAsync(`
          SELECT
            DATE(t.timestamps) AS date,  
            SUM(t.totalPrice) AS totalExpense
          FROM
            transactions t
          WHERE
            t.timestamps >= DATE('now', '-180 days')  -- Hanya ambil data selama 180 hari terakhir
          GROUP BY
            DATE(t.timestamps)  -- Mengelompokkan berdasarkan tanggal
          ORDER BY
            DATE(t.timestamps) ASC;  -- Mengurutkan berdasarkan tanggal (terlama ke terbaru)
        `);

    const execSixMonthsExpense = await sixMonthsExpenseStatement.executeAsync();
    const sixMonthsData = await execSixMonthsExpense.getAllAsync();
    await sixMonthsExpenseStatement.finalizeAsync();
    setSixMonthsExpenseData(sixMonthsData);

    const yearlyExpenseStatement = await db.prepareAsync(`
          SELECT
            DATE(t.timestamps) AS date,  
            SUM(t.totalPrice) AS totalExpense
          FROM
            transactions t
          WHERE
            t.timestamps >= DATE('now', '-365 days')  -- Hanya ambil data selama 365 hari terakhir
          GROUP BY
            DATE(t.timestamps)  -- Mengelompokkan berdasarkan tanggal
          ORDER BY
            DATE(t.timestamps) ASC;  -- Mengurutkan berdasarkan tanggal (terlama ke terbaru)
        `);

    const execYearlyExpense = await yearlyExpenseStatement.executeAsync();
    const yearlyData = await execYearlyExpense.getAllAsync();
    await yearlyExpenseStatement.finalizeAsync();
    setYearlyExpenseData(yearlyData);

    setLoading(false);
  };

  useEffect(() => {
    fetchExpenseData();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      {
        loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#262626" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} className="mt-12">
        <Animated.View entering={FadeIn.delay(200)} className="flex flex-row justify-start items-center px-3">
          <TouchableOpacity onPress={() => navigate.goBack()}>
          <Ionicons
            name="chevron-back-circle-outline"
            size={38}
            color="black"
          />
          </TouchableOpacity>
          <Text className="font-bold text-2xl text-neutral-700 ml-1.5">
            Ringkasan Catatan
          </Text>
        </Animated.View>

        {/* HARI INI || HARI INI || HARI INI || HARI INI */}
        <Animated.View entering={FadeIn.delay(400)} className="px-4 mt-4">
          <View className="mb-2">
            <Text className="text-neutral-700 font-bold text-2xl">
              Hari Ini
            </Text>
            <Text className="text-neutral-700 font-bold text-xl">
              Rp. {expenseData.length > 0 ? expenseData.reduce((acc, item) => acc + item.totalExpense, 0).toLocaleString("id-ID") : 0}
            </Text>
          </View>
          {expenseData.length > 0 && (
            <View className="flex justify-center items-center">
            <LineChart
              data={{
                // labels: expenseData.map((item) => formatDate(item.date)), // Label untuk chart
                datasets: [
                  {
                    data: expenseData.map((item) => item.totalExpense), // Data pengeluaran per hari
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20} // Menggunakan lebar penuh layar
              height={220}
              yAxisSuffix=""
              yAxisInterval={1} // interval pada Y axis
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 0, // angka desimal
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            </View>

          )}
        </Animated.View>

        {/* WEEKLY EXPENSE || WEEKLY EXPENSE || WEEKLY EXPENSE */}
        <Animated.View entering={FadeIn.delay(550)} className="px-4 mt-4">
          <View className="mb-2">
            <Text className="text-neutral-700 font-bold text-2xl">
              1 Minggu Ini
            </Text>
            <Text className="text-neutral-700 font-bold text-xl">
              Rp. {weeklyExpenseData.length > 0 ? weeklyExpenseData.reduce((acc, item) => acc + item.totalExpense, 0).toLocaleString("id-ID") : 0}
            </Text>
          </View>
          {weeklyExpenseData.length > 0 && (
            <View className="flex justify-center items-center">
            <LineChart
              data={{
                // labels: weeklyExpenseData.map((item) => formatDate(item.date)), // Label untuk chart
                datasets: [
                  {
                    data: weeklyExpenseData.map((item) => item.totalExpense), // Data pengeluaran per hari
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20} // Menggunakan lebar penuh layar
              height={220}
              yAxisSuffix=""
              yAxisInterval={1} // interval pada Y axis
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#FF5F00",
                backgroundGradientTo: "#FF5F00",
                decimalPlaces: 0, // angka desimal
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            </View>

          )}
        </Animated.View>

        {/* 2 WEEKS EXPENSE || 2 WEEKS EXPENSE || 2 WEEKS EXPENSE */}
        <Animated.View entering={FadeIn.delay(700)} className="px-4 mt-4">
          <View className="mb-2">
            <Text className="text-neutral-700 font-bold text-2xl">
              2 Minggu Ini
            </Text>
            <Text className="text-neutral-700 font-bold text-xl">
              Rp. {twoWeeksExpenseData.length > 0 ? twoWeeksExpenseData.reduce((acc, item) => acc + item.totalExpense, 0).toLocaleString("id-ID") : 0}
            </Text>
          </View>
          {twoWeeksExpenseData.length > 0 && (
            <View className="flex justify-center items-center">
            <LineChart
              data={{
                // labels: twoWeeksExpenseData.map((item) => formatDate(item.date)), // Label untuk chart
                datasets: [
                  {
                    data: twoWeeksExpenseData.map((item) => item.totalExpense), // Data pengeluaran per hari
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20} // Menggunakan lebar penuh layar
              height={220}
              yAxisSuffix=""
              yAxisInterval={1} // interval pada Y axis
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#EB3678",
                backgroundGradientTo: "#EB3678",
                decimalPlaces: 0, // angka desimal
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            </View>

          )}
        </Animated.View>

        {/* MONTHLY EXPENSE || MONTHLY EXPENSE || MONTHLY EXPENSE */}
        <Animated.View entering={FadeIn.delay(900)} className="px-4 mt-4">
          <View className="mb-2">
            <Text className="text-neutral-700 font-bold text-2xl">
              1 Bulan Ini
            </Text>
            <Text className="text-neutral-700 font-bold text-xl">
              Rp. {monthlyExpenseData.length > 0 ? monthlyExpenseData.reduce((acc, item) => acc + item.totalExpense, 0).toLocaleString("id-ID") : 0}
            </Text>
          </View>
          {monthlyExpenseData.length > 0 && (
            <View className="flex justify-center items-center">
            <LineChart
              data={{
                // labels: monthlyExpenseData.map((item) => formatDate(item.date)), // Label untuk chart
                datasets: [
                  {
                    data: monthlyExpenseData.map((item) => item.totalExpense), // Data pengeluaran per hari
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20} // Menggunakan lebar penuh layar
              height={220}
              yAxisSuffix=""
              yAxisInterval={1} // interval pada Y axis
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#16325B",
                backgroundGradientTo: "#16325B",
                decimalPlaces: 0, // angka desimal
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            </View>

          )}
        </Animated.View>

        {/* 3 MONTHS EXPENSE || 3 MONTHS EXPENSE || 3 MONTHS EXPENSE */}
        <Animated.View entering={FadeIn.delay(1000)} className="px-4 mt-4">
          <View className="mb-2">
            <Text className="text-neutral-700 font-bold text-2xl">
              3 Bulan Ini
            </Text>
            <Text className="text-neutral-700 font-bold text-xl">
              Rp. {threeMonthsExpenseData.length > 0 ? threeMonthsExpenseData.reduce((acc, item) => acc + item.totalExpense, 0).toLocaleString("id-ID") : 0}
            </Text>
          </View>
          {threeMonthsExpenseData.length > 0 && (
            <View className="flex justify-center items-center">
            <LineChart
              data={{
                // labels: threeMonthsExpenseData.map((item) => formatDate(item.date)), // Label untuk chart
                datasets: [
                  {
                    data: threeMonthsExpenseData.map((item) => item.totalExpense), // Data pengeluaran per hari
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20} // Menggunakan lebar penuh layar
              height={220}
              yAxisSuffix=""
              yAxisInterval={1} // interval pada Y axis
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#0B2F9F",
                backgroundGradientTo: "#0B2F9F",
                decimalPlaces: 0, // angka desimal
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            </View>

          )}
        </Animated.View>

        {/* 6 MONTHS EXPENSE || 6 MONTHS EXPENSE || 6 MONTHS EXPENSE */}
        <Animated.View entering={FadeIn.delay(1100)}ew className="px-4 mt-4">
          <View className="mb-2">
            <Text className="text-neutral-700 font-bold text-2xl">
              6 Bulan Ini
            </Text>
            <Text className="text-neutral-700 font-bold text-xl">
              Rp. {sixMonthsExpenseData.length > 0 ? sixMonthsExpenseData.reduce((acc, item) => acc + item.totalExpense, 0).toLocaleString("id-ID") : 0}
            </Text>
          </View>
          {sixMonthsExpenseData.length > 0 && (
            <View className="flex justify-center items-center">
            <LineChart
              data={{
                // labels: sixMonthsExpenseData.map((item) => formatDate(item.date)), // Label untuk chart
                datasets: [
                  {
                    data: sixMonthsExpenseData.map((item) => item.totalExpense), // Data pengeluaran per hari
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20} // Menggunakan lebar penuh layar
              height={220}
              yAxisSuffix=""
              yAxisInterval={1} // interval pada Y axis
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#27005D",
                backgroundGradientTo: "#27005D",
                decimalPlaces: 0, // angka desimal
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            </View>

          )}
        </Animated.View>

        {/* 1 YEAR EXPENSE || 1 YEAR EXPENSE || 1 YEAR EXPENSE */}
        <Animated.View entering={FadeIn.delay(1200)} className="px-4 mt-4">
          <View className="mb-2">
            <Text className="text-neutral-700 font-bold text-2xl">
              1 Tahun Ini
            </Text>
            <Text className="text-neutral-700 font-bold text-xl">
              Rp. {yearlyExpenseData.length > 0 ? yearlyExpenseData.reduce((acc, item) => acc + item.totalExpense, 0).toLocaleString("id-ID") : 0}
            </Text>
          </View>
          {yearlyExpenseData.length > 0 && (
            <View className="flex justify-center items-center">
            <LineChart
              data={{
                // labels: yearlyExpenseData.map((item) => formatDate(item.date)), // Label untuk chart
                datasets: [
                  {
                    data: yearlyExpenseData.map((item) => item.totalExpense), // Data pengeluaran per hari
                  },
                ],
              }}
              width={Dimensions.get("window").width - 20} // Menggunakan lebar penuh layar
              height={220}
              yAxisSuffix=""
              yAxisInterval={1} // interval pada Y axis
              chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#262626",
                backgroundGradientTo: "#262626",
                decimalPlaces: 0, // angka desimal
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726",
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
            </View>

          )}
        </Animated.View>

      </ScrollView>
        )
      }
    </View>
  );
}
