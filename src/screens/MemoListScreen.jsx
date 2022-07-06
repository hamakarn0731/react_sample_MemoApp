import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import firebase from 'firebase';

import MemoList from '../components/MemoList';
import CircleButton from '../components/CircleButton';
import LogOutButton from '../components/LogOutButton';

export default function MemoListScreen(props) {
  const { navigation } = props;
  // 入力したメモのデータを保持（React Hooks）
  const [memos, setMemos] = useState([]);
  useEffect(() => {
    navigation.setOptions({
      // AppBarにログアウトボタンを設置
      headerRight: () => <LogOutButton />,
    });
  }, []);

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
      // ログインユーザのコレクションの参照を日付の降順作成
      const ref = db.collection(`users/${currentUser.uid}/memos`).orderBy('updatedAt', 'desc');
      // メモのリストから1つ1つのメモを取り出す
      unsubscribe = ref.onSnapshot((snapshot) => {
        // メモの値を一時的に保持する配列
        const userMemos = [];
        // 配列に値を格納
        snapshot.forEach((doc) => {
          console.log(doc.id, doc.data());
          const data = doc.data();
          userMemos.push({
            id: doc.id,
            bodyText: data.bodyText,
            updatedAt: data.updatedAt.toDate(),
          });
        });
        // メモのリストをセット
        setMemos(userMemos);
        // リストの読み込みに失敗した場合の処理
      }, (error) => {
        console.log(error);
        Alert.alert('データの読み込みに失敗しました。');
      });
    }
    // コンポーネントがアンマウントされる直前にDBの監視を終了
    return unsubscribe;
    // コンポーネントが最初にマウントされたときだけ処理を実行
  }, []);

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
