import React from 'react';
import { Text, Modal, TouchableOpacity, View, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import theme from '../../global/styles/theme';
import { useRegister } from '../../hooks/register';
import { BtnText } from '../../pages/Profile/styles';
import { LinearGradient } from 'expo-linear-gradient';

// import { Container } from './styles';

export default function Birthday({ setOpenBirthdayModal }) {
  const student = useRegister();
  return  (
      <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        presentationStyle="overFullScreen"
        onRequestClose={() => {
          setOpenBirthdayModal(false);
        }}
          >
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ fontSize: 25 }}>🎈 🎁 🎉 🎂</Text>
            <Text style={{ fontWeight: 'bold', textAlign: 'center', color: theme.colors.secondary , fontSize: 18, paddingVertical: 20 }}>Happy Birthday!!!</Text>
            <View style={{ backgroundColor: '#fff', flexDirection: 'column', alignItems: 'center' }}>
              <Text style={{ textAlign: 'justify', marginHorizontal: 16, marginBottom: 32 }}>Enjoy your day with your friends and know that we are rooting for your success!</Text>
              
              <TouchableOpacity style={theme.buttons.secondaryButtonSimple} onPress={() => setOpenBirthdayModal(false)}>
                <BtnText>Close</BtnText>
              </TouchableOpacity>
            </View>
          </View>
          </View>
          
    </Modal>
    <ConfettiCannon count={100} origin={{x: -20, y: 0}} autoStart={true} fadeOut={false} fallSpeed={2000} />
  </View>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
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
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});