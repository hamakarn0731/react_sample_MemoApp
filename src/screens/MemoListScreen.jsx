import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, Alert, Text,
} from 'react-native';
import firebase from 'firebase';

import MemoList from '../components/MemoList';
import CircleButton from '../components/CircleButton';
import LogOutButton from '../components/LogOutButton';
import Button from '../components/Button';
import Loading from '../components/Loading';

export default function MemoListScreen(props) {
  const { navigation } = props;
  // 入力したメモのデータを保持（React Hooks）
  const [memos, setMemos] = useState([]);
  // ローディング状態
  const [isLoading, setLoading] = useState(false);

  // 画面を表示した時に処理を実行（React Hooks）
  useEffect(() => {
    // firebaseのDBを取得
    const db = firebase.firestore();
    // ログインユーザを取得
    const { currentUser } = firebase.auth();
    // DBの監視状態を保持するための変数を用意
    let unsubscribe = () => {};
    // ユーザがログインしている場合のみ処理を実行
    if (currentUser) {
      // ロードの開始
      setLoading(true);
      // ログインユーザのコレクションの参照を日付の降順作成
      const ref = db.collection(`users/${currentUser.uid}/memos`).orderBy('updatedAt', 'desc');
      // メモのリストから1つ1つのメモを取り出す
      unsubscribe = ref.onSnapshot((snapshot) => {
        // メモの値を一時的に保持する配列
        const userMemos = [];
        // 配列に値を格納
        snapshot.forEach((doc) => {
          const data = doc.data();
          userMemos.push({
            id: doc.id,
            bodyText: data.bodyText,
            updatedAt: data.updatedAt.toDate(),
          });
        });
        // メモのリストをセット
        setMemos(userMemos);
        // ロードの終了
        setLoading(false);
        // リストの読み込みに失敗した場合の処理
      }, () => {
        // ロードの終了
        setLoading(false);
        Alert.alert('データの読み込みに失敗しました。');
      });
      navigation.setOptions({
        // AppBarにログアウトボタンを設置
        headerRight: () => <LogOutButton unsubscribe={unsubscribe} />,
      });
    }
    // コンポーネントがアンマウントされる直前にDBの監視を終了
    return unsubscribe;
    // コンポーネントが最初にマウントされたときだけ処理を実行
  }, []);

  // メモが0件の場合のUI
  if (memos.length === 0) {
    return (
      <View style={emptyStyles.container}>
        <Loading isLoading={isLoading} />
        <View style={emptyStyles.inner}>
          <Text style={emptyStyles.title}>最初のメモを作成しよう！</Text>
          <Button
            style={emptyStyles.button}
            label="作成する"
            onPress={() => { navigation.navigate('MemoCreate'); }}
          />
        </View>
      </View>
    );
  }

  // UI
  return (
    <View style={styles.container}>
      <MemoList memos={memos} />
      <CircleButton
        name="plus"
        onPress={() => { navigation.navigate('MemoCreate'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
});

// メモが0件の場合のStyleSheet
const emptyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    marginBottom: 24,
  },
  button: {
    alignSelf: 'center',
  },
});
