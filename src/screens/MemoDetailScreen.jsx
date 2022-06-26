import React from 'react';
import {
  View, ScrollView, Text, StyleSheet,
} from 'react-native';

import CircleButton from '../components/CircleButton';

export default function MemoDetailScreen(props) {
  const { navigation } = props;
  return (
    <View style={styles.container}>
      <View style={styles.memoHeader}>
        <Text style={styles.memoTitle}>買い物リスト</Text>
        <Text style={styles.memoDate}>2020年12月24日 10:00</Text>
      </View>
      <ScrollView style={styles.memoBody}>
        <Text style={styles.memoText}>
          買い物リスト
          ・キャベツ
          ・トマト
          ・きゅうり
          注意・・・スーパーは21時に閉まるので、それまでに行くこと
          お米は切らしているが、特売日に買うので買わなくて大丈夫。
        </Text>
      </ScrollView>
      <CircleButton
        style={{ top: 60, bottom: 'auto' }}
        name="edit-2"
        onPress={() => { navigation.navigate('MemoEdit'); }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  memoHeader: {
    backgroundColor: '#467FD3',
    height: 96,
    justifyContents: 'center',
    paddingVertical: 24,
    paddingHorizontal: 19,
  },
  memoTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  memoDate: {
    color: '#FFFFFF',
    fontSize: 12,
    lineHeight: 16,
  },
  memoBody: {
    paddingVertical: 32,
    paddingHorizontal: 27,
  },
  memoText: {
    fontSize: 16,
    lineHeight: 24,
  },
});
