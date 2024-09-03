import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

export default function BottomSheetTransactionDelete({ transactionId, fetch, db, refRBSheet, refRBSheetUpdate }) {
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
            height: "30%",
          },
        }}
        customModalProps={{
          animationType: "slide",
        }}
        height={500}
        openDuration={250}
      >
        <TransactionComp transactionId={transactionId} fetch={fetch} db={db} refRBSheet={refRBSheet} refRBSheetUpdate={refRBSheetUpdate} />
      </RBSheet>
    </View>
  )
}



const TransactionComp = ({ transactionId, fetch, db, refRBSheet, refRBSheetUpdate }) => {
    

    const submit = async () => {
          try {
            await db.execAsync("BEGIN TRANSACTION;");

            await db.execAsync(`
              DELETE FROM transactions WHERE id = ${transactionId};
            `)

          await db.execAsync("COMMIT;");     
          refRBSheet.current.close()
          refRBSheetUpdate.current.close()
          fetch()
          } catch (error) {
            console.log("ERROR TransactionComp: ", error.message);
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
        <View className="px-6 mb-4">
            <Text
            className="font-semibold text-lg text-neutral-800"
            >
              Apakah Kamu Yakin Akan Menghapus Catatan Dengan ID <Text className="text-red-500 font-bold">{transactionId}</Text>?
            </Text>
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
              style={{
                backgroundColor: "#f6f6f6",
                flex: 1,
                paddingVertical: 14,
                borderRadius: 999,
              }}
              onPress={() => refRBSheet.current.close()}
            >
              <Text
                style={{
                  color: "#ef4444",
                  fontWeight: 600,
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submit}
              style={{
                backgroundColor: "#ef4444",
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
                Ya, Hapus
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };
