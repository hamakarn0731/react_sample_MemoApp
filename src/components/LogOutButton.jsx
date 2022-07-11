/* ログアウトボタン */
import React from 'react';
import {
  TouchableOpacity, Text, StyleSheet, Alert,
} from 'react-native';
import firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import { func } from 'prop-types';

export default function LogOutButton(props) {
  // DBの監視を解除する関数
  const { unsubscribe } = props;
  // React Hooksはコンポーネント直下に記述
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text style={styles.label}>ログアウト</Text>
    </TouchableOpacity>
  );
  // ログアウト処理
  function handlePress() {
    // ログアウト前にDBの監視を解除
    unsubscribe();
    // ログアウト処理
    firebase.auth().signOut()
      .then(() => {
        // ログアウトしたらログイン画面へ遷移（戻るボタンなし）
        navigation.reset({
          index: 0,
          routes: [{ name: 'LogIn' }],
        });
      })
      // ログアウトに失敗したらアラートを表示
      .catch(() => {
        Alert.alert('ログアウトに失敗しました');
      });
  }
}

LogOutButton.propTypes = {
  unsubscribe: func,
};

LogOutButton.defaultProps = {
  unsubscribe: null,
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
