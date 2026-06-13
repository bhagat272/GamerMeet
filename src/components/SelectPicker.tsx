import React from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../theme/colors';
import fonts from '../theme/fonts';
import imagePath from '../theme/imagePath';

interface SelectPickerProps {
  items: {id: string | number; name: string}[];
  onValueChange: (item: {id: string | number; name: string}) => void;
  modalVisible: boolean;
  onClose: () => void;
  title?: string;
}

const SelectPicker: React.FC<SelectPickerProps> = ({
  items,
  onValueChange,
  modalVisible,
  onClose,
  title,
}) => {
  const handleSelect = (item: {id: string | number; name: string}) => {
    onValueChange(item);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header Row with Centered Title */}
          <View style={styles.headerRow}>
            <View style={styles.iconPlaceholder} />
            {title ? <Text style={styles.titleText}>{title}</Text> : null}
            <TouchableOpacity onPress={onClose}>
              <Image
                style={styles.doneIcon}
                source={imagePath.close_circle_line}
              />
            </TouchableOpacity>
          </View>

          {/* Items List */}
          <FlatList
            data={items}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={[
                  styles.itemContainer,
                  // eslint-disable-next-line react-native/no-inline-styles
                  {borderBottomWidth: index === items.length - 1 ? 0 : 1},
                ]}
                onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContent: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    maxHeight: '50%',
    overflow: 'hidden',
    backgroundColor: Colors.secondary.CHIP_COLOR,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconPlaceholder: {
    width: 30,
    height: 30,
  },
  titleText: {
    flex: 1,
    fontSize: 18,
    fontFamily: fonts.Poppins_SemiBold,
    color: Colors.primary.WHITE,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary.LIGHT_GREY,
  },
  itemText: {
    fontSize: 16,
    color: Colors.primary.WHITE,
    fontFamily: fonts.Poppins_Regular,
  },
  doneIcon: {
    width: 25,
    height: 25,
  },
});

export default SelectPicker;
