/* 新規メモ作成画面 */
import React, { useState } from 'react';
import {
  View, TextInput, StyleSheet, Alert,
} from 'react-native';

import firebase from 'firebase';

import KeyboardSafeView from '../components/KeyboardSafeView';
import CircleButton from '../components/CircleButton';
import { translateErrors } from '../utils';

export default function MemoCreateScreen(props) {
  const { navigation } = props;
  // ユーザが入力した情報を取得
  const [bodyText, setBodyText] = useState('');
  return (
    <KeyboardSafeView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={bodyText}
          multiline
          style={styles.input}
          onChangeText={(text) => { setBodyText(text); }}
          // 画面が開いた瞬間にキーボードが起動する
          autoFocus
        />
      </View>
      <CircleButton
        name="check"
        onPress={handlePress}
      />
    </KeyboardSafeView>
  );

  // チェックボタン押下時に実行される処理
  function handlePress() {
    // ログインユーザを取得
    const { currentUser } = firebase.auth();
    // DB
    const db = firebase.firestore();
    // ログインユーザごとにコレクションを作成
    const ref = db.collection(`users/${currentUser.uid}/memos`);
    // コレクションにユーザが入力した値と更新日をドキュメントとして追加
    ref.add({
      bodyText,
      updatedAt: new Date(),
    })
    // 追加に成功した場合、ドキュメントへの参照からidを取得して前画面に戻る
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        const errorMsg = translateErrors(error.code);
        Alert.alert(errorMsg.title, errorMsg.description);
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 27,
    paddingVertical: 32,
    flex: 1,
  },
  input: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 16,
    lineHeight: 24,
  },
});
