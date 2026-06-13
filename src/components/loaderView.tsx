import React from 'react';
import {Dimensions, Modal, Platform, StyleSheet, View} from 'react-native';
import {Fold} from 'react-native-animated-spinkit';
import {useSelector} from 'react-redux';
import Colors from '../theme/colors';
const LoaderView = (props: any) => {
  const {show} = useSelector((state: any) => state.loading);

  return show ? (
    <>
      {Platform.OS == 'ios' ? (
        <View style={style.foldStyle}>
          <Fold color={Colors.secondary.MONSOON} size={60} />
        </View>
      ) : (
        <Modal
          animationType="fade"
          transparent={true}
          visible={show}
          onRequestClose={() => {}}>
          <View style={style.modalStyle}>
            <Fold color={Colors.secondary.MONSOON} size={60} />
          </View>
        </Modal>
      )}
    </>
  ) : null;
};

const style = StyleSheet.create({
  foldStyle: {
    position: 'absolute',
    zIndex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
});

export default LoaderView;
