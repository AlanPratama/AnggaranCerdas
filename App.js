import { SQLiteProvider } from 'expo-sqlite';
import AppNavigation from './src/navigation/AppNavigation';
import * as SQLite from "expo-sqlite";
import { useEffect } from 'react';

export default function App() {

  const initialize = async () => {
    const db = await SQLite.openDatabaseAsync("anggaranCerdas.db")

    try {
      await db.execAsync("BEGIN TRANSACTION;")  
      
            // await db.execAsync(`
            //   INSERT INTO category (name, icon, color) VALUES
            //     ('Makanan & Minuman', 'fast-food-outline', '#FF6347'),   
            //     ('Transportasi', 'car-outline', '#4682B4'),              
            //     ('Perumahan', 'home-outline', '#8A2BE2'),               
            //     ('Utilitas', 'flash-outline', '#FFD700'),               
            //     ('Asuransi', 'shield-checkmark-outline', '#32CD32'),    
            //     ('Kesehatan', 'medkit-outline', '#FF4500'),             
            //     ('Hiburan', 'tv-outline', '#DA70D6'),                   
            //     ('Belanja', 'cart-outline', '#FF1493'),                 
            //     ('Pendidikan', 'school-outline', '#1E90FF'),            
            //     ('Investasi', 'trending-up-outline', '#228B22'),        
            //     ('Pendapatan', 'wallet-outline', '#2E8B57'),            
            //     ('Tabungan', 'cash-outline', '#6A5ACD'),                
            //     ('Hadiah', 'gift-outline', '#FF69B4'),                  
            //     ('Donasi', 'heart-outline', '#DC143C'),                 
            //     ('Pajak', 'calculator-outline', '#B22222'),
            //     ('Lain-lain', 'options-outline', '#696969');            
            // `)

          //   await db.execAsync(`
          //     INSERT INTO transactions (categoryId, product, quantity, totalPrice, timestamps) VALUES
          //     (1, 'Nasi Goreng', 2, 40000, datetime('now', '-2 days')), 
          //     (2, 'Tiket Bus', 1, 15000, datetime('now', '-1 day')),    
          //     (3, 'Sewa Rumah', 1, 3000000, datetime('now', '-1 month')),  
          //     (4, 'Tagihan Listrik', 1, 500000, datetime('now', '-10 days')),  
          //     (5, 'Asuransi Kesehatan', 1, 1200000, datetime('now', '-15 days')),  
          //     (6, 'Obat Flu', 1, 25000, datetime('now', '-7 days')),    
          //     (7, 'Langganan Netflix', 1, 150000, datetime('now', '-3 days')),  
          //     (8, 'Baju Baru', 3, 450000, datetime('now', '-5 days')),  
          //     (9, 'Buku Pelajaran', 2, 80000, datetime('now', '-20 days')),  
          //     (10, 'Pembelian Saham', 5, 5000000, datetime('now', '-1 month')),  
          //     (11, 'Biaya Tak Terduga', 1, 100000, datetime('now', '-8 days')),  
          //     (12, 'Gaji Bulanan', 1, 10000000, datetime('now', '-15 days')),  
          //     (13, 'Setoran Tabungan', 1, 2000000, datetime('now', '-2 months')),  
          //     (14, 'Hadiah Pernikahan', 1, 500000, datetime('now', '-3 months')),  
          //     (15, 'Sumbangan Panti Asuhan', 1, 300000, datetime('now', '-1 month')),  
          //     (16, 'Pajak Penghasilan', 1, 2000000, datetime('now', '-2 months'));  
          // `)

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS category (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR NOT NULL UNIQUE,
          icon VARCHAR NOT NULL,
          color VARCHAR NOT NULL
        );
      `)

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          categoryId INTEGER NOT NULL,
          product VARCHAR NOT NULL,
          quantity INTEGER NOT NULL DEFAULT 1,
          totalPrice INTEGER NOT NULL,
          timestamps DATETIME DEFAULT (datetime('now', 'localtime')),
          FOREIGN KEY(categoryId) REFERENCES category(id)
        );
      `)

      

      await db.execAsync("COMMIT;")
      console.log("Database Initialized Successfully!");
    } catch (error) {
      await db.execAsync("ROLLBACK;")
      console.log("ERROR IN APP.JS: ", error);
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <SQLiteProvider 
      databaseName='anggaranCerdas.db'
      assetSource={{ assetId: require("./anggaranCerdas.db") }}
    >
      <AppNavigation/>
    </SQLiteProvider>
  )
}