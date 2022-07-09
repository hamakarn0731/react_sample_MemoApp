/* ローディング状態の表示 */
import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { bool } from 'prop-types';

export default function Loading(props) {
  // ローディング状態
  const { isLoading } = props;
  if (!isLoading) {
    return null;
  }
  return (
    <View style={styles.container}>
      <View style={styles.inner}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    </View>
  );
}

// 変数の型の定義
Loading.propTypes = {
  isLoading: bool,
};

// 変数の初期値の定義
Loading.defaultProps = {
  isLoading: false,
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 5,
  },
  inner: {
    marginBottom: 80,
  },
});
