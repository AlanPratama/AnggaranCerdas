import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from "react-native-reanimated";
import Img from "../../assets/splash.png";
import { useSQLiteContext } from 'expo-sqlite';

export default function WelcomeScreen() {

    const navigate = useNavigation()

    const db = useSQLiteContext();

    const isCategory = async () => {
        try {

            const catStatement = await db.prepareAsync("SELECT * FROM category LIMIT 3;");
            const execCat = await catStatement.executeAsync();
            const resCat = await execCat.getAllAsync();
            await catStatement.finalizeAsync();

            console.log("resCat: ", resCat.length);

            if(resCat.length <= 0) {
                const seedStatement = await db.prepareAsync(`
                    INSERT INTO category (name, icon, color) VALUES
                        ('Makanan & Minuman', 'fast-food-outline', '#FF6347'),   
                        ('Transportasi', 'car-outline', '#4682B4'),              
                        ('Perumahan', 'home-outline', '#8A2BE2'),               
                        ('Utilitas', 'flash-outline', '#FFD700'),               
                        ('Asuransi', 'shield-checkmark-outline', '#32CD32'),    
                        ('Kesehatan', 'medkit-outline', '#FF4500'),             
                        ('Hiburan', 'tv-outline', '#DA70D6'),                   
                        ('Belanja', 'cart-outline', '#FF1493'),                 
                        ('Pendidikan', 'school-outline', '#1E90FF'),            
                        ('Investasi', 'trending-up-outline', '#228B22'),        
                        ('Pendapatan', 'wallet-outline', '#2E8B57'),            
                        ('Tabungan', 'cash-outline', '#6A5ACD'),                
                        ('Hadiah', 'gift-outline', '#FF69B4'),                  
                        ('Donasi', 'heart-outline', '#DC143C'),                 
                        ('Pajak', 'calculator-outline', '#B22222'),
                        ('Lain-lain', 'options-outline', '#696969');            
                `)

                await seedStatement.executeAsync();
                await seedStatement.finalizeAsync();
                console.log("Seeded Category Successfully!");
                
            }
        } catch (error) {
            console.log("ERROR WelcomeScreen: ", error.message);
        }
    }

    useEffect(() => {
        isCategory()
        setTimeout(() => {
            navigate.navigate('Home')
        }, 3000)
    }, [])

  return (
    <View className="flex-1 bg-white">
        <StatusBar style='auto' />

        <View className="h-screen bg-white flex justify-center items-center">
            <View className="px-5 w-full flex justify-center items-center">
                <Animated.Image entering={FadeIn} source={Img} className="w-72  h-72" />
                <Animated.Text entering={FadeIn.delay(200)} className="text-4xl mt-4 font-bold text-[#2f3060]">Anggaran Cerdas</Animated.Text>
                <Animated.Text entering={FadeIn.delay(350)} className="capitalize my-4 text-justify text-lg font-semibold text-[#2f3060]">Dikelola dengan bijak, keuangan semakin mantap!</Animated.Text>
                <Animated.View entering={FadeIn.delay(500)}>
                    <TouchableOpacity onPress={() => navigate.navigate('Home')} className="bg-[#fc6c5c] px-3 py-2 rounded-lg mt-4"><Text className="text-white text-center text-lg font-bold">Mulai Sekarang</Text></TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    </View>
  )
}