import { parseISO, format } from "date-fns";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { capitalizeFirstLetter } from "../../global/functions/dashboard";
import theme from "../../global/styles/theme";
import { ClassesListItem } from "../ClassesList/styles";

import { Container } from './styles';

export default function ClassInfo({ periodClass, setClassInfo }) {
    return <Container>
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            presentationStyle="formSheet"
            onRequestClose={() => {
              setClassInfo(null);
            }}
        >
            <ScrollView>
            <ClassesListItem style={{ width: '90%',borderLeftColor: periodClass.periodColor, margin: 20 }}>      
                <View style={{ paddingLeft: 16 }}>
                    <Text style={{ width: 80, color: '#555' }}>
                    {format(parseISO(periodClass.classDate), "MMM, dd")}
                    </Text>
                    <Text style={{ width: 80, color: '#868686', fontSize: 12 }}>
                    {capitalizeFirstLetter(periodClass.weekDate)}
                    </Text>
                </View>
                <View style={{ width: 32, paddingVertical: 16, paddingHorizontal: 12, borderRadius: 32,backgroundColor: '#FFF', flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                    { periodClass.grades.length > 0 ? 
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                        <Text style={{ color: theme.colors.Present,fontSize: 13, fontWeight: 'bold' }}>{capitalizeFirstLetter(periodClass.grades[0].name)}</Text>
                        <Text style={{ color: theme.colors.Present }}>{periodClass.grades[0].score}%</Text>
                    </View>
                    : 
                    <>
                    <Text style={{ color: '#555',fontSize: 13, flex: 1, textAlign: 'right',paddingRight: 20 }}>{periodClass.presenceStatus}</Text>
                    {periodClass.icon}
                    </>
                    }
                </View>
            
            </ClassesListItem>
            <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Given Content</Text>
                { periodClass.program.length > 0 ? periodClass.program.map((content,index) => 
                  <Text key={index} style={styles.modalText}>✔️ {content.description}</Text>
                ) : <Text>In process...</Text> }
                {/* <Text style={[styles.modalTitle, { marginTop: 26 }]}>Teacher Notes</Text>
                <Text style={styles.modalNote}>{periodClass.notes || 'Nothing noted.'}</Text> */}
                <Pressable
                style={[styles.button, { backgroundColor: periodClass.periodColor, marginTop: 26 } ]}
                onPress={() => setClassInfo(null)}
                >
                <Text style={styles.textStyle}>Close</Text>
                </Pressable>
            </View>
            </ScrollView>
        </Modal>
    </Container>;
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
      backgroundColor: "#efefef"
    },
    modalView: {
      flex: 1,
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
      width: 120
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalTitle: {
      marginBottom: 15,
      textAlign: "center",
      fontWeight: 'bold',
      fontSize: 16
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center",
      width: '100%'
    },
    modalNote: {
        marginBottom: 15,
        textAlign: "justify",
        flex: 1
    }
  });