import React, {useMemo} from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {reportUserAction} from '../../../redux/actions/userSessionAction';
import Colors from '../../../theme/colors';
import fonts from '../../../theme/fonts';
import {showToastMessage} from '../../../utils/toast';

const MoreOptions = (props: any) => {
  const {cb, status, type, other_user_id} = props?.route?.params ?? {};
  const dispatch = useDispatch();

  const usePlatformEdges = (): Edge[] =>
    useMemo(
      () =>
        Platform.OS === 'android'
          ? ['bottom', 'left', 'right']
          : ['left', 'right'],
      [],
    );

  const edges = usePlatformEdges();

  return (
    <SafeAreaView style={{flex: 1}} edges={edges}>
      <View style={styles.container}>
        <View style={styles.modal_view}>
          {/* Block / Unblock */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.goBack();
              cb && cb('block');
            }}
            style={[
              styles.row_view,
              {display: type === 'GROUP' ? 'none' : 'flex'},
            ]}>
            <Text style={styles.text_style}>{status}</Text>
          </TouchableOpacity>

          {/* Report User */}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.goBack();
              cb && cb('report');
            }}
            style={styles.row_view}>
            <Text style={styles.text_style}>Report user</Text>
          </TouchableOpacity>

          {/* Delete Chat */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              props.navigation.goBack();
              cb && cb('delete');
            }}
            style={styles.row_view}>
            <Text style={styles.text_style}>Delete chat</Text>
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => props.navigation.goBack()}
            style={styles.row_view_cancel}>
            <Text style={styles.text_style}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MoreOptions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.BLACK_FADE,
    justifyContent: 'flex-end',
    alignItems: 'center',
   
  },
  modal_view: {
    backgroundColor: '#32377D',
    minHeight: 200,
    width: Dimensions.get('window').width,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  row_view: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.primary.WHITE,
    borderBottomWidth: 1,
  },
  row_view_cancel: {
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_style: {
    fontFamily: fonts.Poppins_Medium,
    fontSize: fonts.SIZE_16,
    color: Colors.primary.WHITE,
  },
});
