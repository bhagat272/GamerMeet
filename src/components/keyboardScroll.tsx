import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const KeyboardScroll = (props: any) => {
  return (
    // eslint-disable-next-line react/self-closing-comp
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'handled'}
      bounces={false}
      enableAutomaticScroll={true}
      {...props}></KeyboardAwareScrollView>
  );
};

export default KeyboardScroll;
