/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { FlatList } from 'react-native-gesture-handler';

const window = Dimensions.get('window');

const monthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

const initialMonths = [
  { month: 'Январь', checked: false },
  { month: 'Февраль', checked: false },
  { month: 'Март', checked: false },
  { month: 'Апрель', checked: false },
  { month: 'Май', checked: false },
  { month: 'Июнь', checked: false },
  { month: 'Июль', checked: false },
  { month: 'Август', checked: false },
  { month: 'Сентябрь', checked: false },
  { month: 'Октябрь', checked: false },
  { month: 'Ноябрь', checked: false },
  { month: 'Декабрь', checked: false },
];

const monthNumbers = {
  Январь: '01',
  Февраль: '02',
  Март: '03',
  Апрель: '04',
  Май: '05',
  Июнь: '06',
  Июль: '07',
  Август: '08',
  Сентябрь: '09',
  Октябрь: '10',
  Ноябрь: '11',
  Декабрь: '12',
};

LocaleConfig.locales.ru = {
  formatAccessibilityLabel: "dddd d 'of' MMMM 'of' yyyy",
  monthNames,
  monthNamesShort: [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ],
  dayNames: [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ],
  dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
};
LocaleConfig.defaultLocale = 'ru';

const MyCalendar = () => {
  const [months, setMonths] = useState(initialMonths);
  const [visibleYear, setVisibleYear] = useState('2021');
  const calendarRef = useRef<any>(null);
  const tabRef = useRef<FlatList<any>>(null);

  const renderItem = ({ item }: any) => {
    const dateString = `${visibleYear}-${monthNumbers[item.month]}-01`;
    return (
      <TouchableOpacity
        onPress={() => calendarRef.current.scrollToMonth(dateString)}>
        <View
          style={[
            styles.tab,
            { borderColor: item.checked ? 'blue' : 'transparent' },
          ]}>
          <Text
            style={[
              styles.tabText,
              { color: item.checked ? 'black' : 'gray' },
            ]}>
            {item.month + ' ' + visibleYear}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabWrapper}>
        <FlatList
          ref={tabRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          data={months}
          renderItem={renderItem}
          onScrollToIndexFailed={error => console.log(error)}
        />
      </View>
      <CalendarList
        horizontal
        pagingEnabled
        style={{ width: window.width }}
        ref={calendarRef}
        onVisibleMonthsChange={(date: any) => {
          const { month, year } = date[0];

          if (+year !== +visibleYear) {
            setVisibleYear(year);
          }

          tabRef.current?.scrollToIndex({ index: month - 1, animated: true });
          setMonths(prev => {
            const newMonths = prev.map((item, index) => {
              index + 1 === month
                ? (item.checked = true)
                : (item.checked = false);
              return item;
            });
            return newMonths;
          });
        }}
        renderHeader={() => <></>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabWrapper: {
    height: 30,
    paddingHorizontal: 16,
  },
  tab: {
    width: (window.width - 32) / 3,
    height: 30,
    borderBottomWidth: 2,
  },
  tabText: {
    width: '100%',
    textAlign: 'center',
  },
});

export default MyCalendar;
