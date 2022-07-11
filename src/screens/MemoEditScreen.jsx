/* メモの編集画面 */
import React, { useState } from 'react';
import {
  View, TextInput, StyleSheet, Alert,
} from 'react-native';
import { shape, string } from 'prop-types';
import firebase from 'firebase';

import KeyboardSafeView from '../components/KeyboardSafeView';
import CircleButton from '../components/CircleButton';
import { translateErrors } from '../utils';

export default function MemoEditScreen(props) {
  const { navigation, route } = props;
  // 前画面から受け取った値
  const { id, bodyText } = route.params;
  // bodyTextを初期値として一時的にbodyに代入。この値はsetBodyを使って編集可
  const [body, setBody] = useState(bodyText);

  return (
    <KeyboardSafeView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={body}
          multiline
          style={styles.input}
          onChangeText={(text) => { setBody(text); }}
        />
      </View>
      <CircleButton
        name="check"
        onPress={handlePress}
      />
    </KeyboardSafeView>
  );

  // チェックボタン押下時にDBを更新する処理
  function handlePress() {
    const { currentUser } = firebase.auth();
    if (currentUser) {
      const db = firebase.firestore();
      const ref = db.collection(`users/${currentUser.uid}/memos`).doc(id);
      // bodyText（メモの一覧画面の値）をbody（メモの編集画面で入力した値）に更新
      ref.set({
        bodyText: body,
        updatedAt: new Date(),
        // 更新対象でない値を残す
      }, { merge: true })
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          // エラーメッセージの翻訳
          const errorMsg = translateErrors.apply(error.code);
          // エラーメッセージのポップアップ
          Alert.alert(errorMsg.title, errorMsg.description);
        });
    }
  }
}

MemoEditScreen.propTypes = {
  route: shape({
    params: shape({ id: string, bodyText: string }),
  }).isRequired,
};

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
