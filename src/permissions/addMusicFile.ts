import React, {useState} from 'react';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {galleryPermissions} from './appPermissions';

const AddMusicFile = (cb: any) => {
  try {
    // Use pickSingle for a single file selection
    galleryPermissions(async (status: boolean) => {
      if (!status) {
        return cb(false);
      }
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.audio],
        mode: 'open',
        copyTo: 'cachesDirectory',
      });
      cb(res);
    });
  } catch (err: any) {
    cb(false);
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled document picker');
    } else {
      console.error('DocumentPicker Error: ', err);
    }
  }
};

export default AddMusicFile;
