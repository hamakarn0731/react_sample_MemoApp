import { format } from 'date-fns';

// 日付を成形して返す関数
export function dateToString(date) {
  if (!date) { return ''; }
  return format(date, 'yyyy年M月d日 HH時mm分');
}
