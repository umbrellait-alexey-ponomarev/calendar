import React, { useRef } from 'react';
import {
  Dimensions,
  View,
  Animated,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const data = ['2021-12-01', '2022-01-01', '2022-02-01'];
const months = ['Декабрь', 'Январь', 'Февраль'];
const window = Dimensions.get('window');
const animatedValue = new Animated.ValueXY();
const indicatorWidth = window.width / data.length;

export const ThreeMonthCalendar = () => {
  const calendarRef = useRef<FlatList<any>>(null);

  const renderItem = ({ item }: { item: string }) => {
    return (
      <Calendar
        style={{ width: window.width }}
        current={item}
        renderHeader={() => <></>}
        hideArrows={true}
      />
    );
  };

  const renderMonths = ({ item, index }: { item: string; index: number }) => {
    return (
      <TouchableOpacity
        style={styles.headerTab}
        onPress={() => {
          calendarRef?.current?.scrollToIndex({
            index,
            animated: true,
          });
        }}>
        <Text style={styles.headerTabText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FlatList horizontal data={months} renderItem={renderMonths} />
        <Animated.View
          style={[styles.headerIndicator, { left: animatedValue.x }]}
        />
      </View>
      <FlatList
        ref={calendarRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        onScroll={evt => {
          const { x } = evt.nativeEvent.contentOffset;
          animatedValue.setValue({
            x: x / data.length,
            y: 0,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: window.width,
    flexShrink: 1,
  },
  headerTabWrapper: {
    flexDirection: 'row',
  },
  headerTab: {
    width: indicatorWidth,
    padding: 10,
  },
  headerTabText: {
    textAlign: 'center',
  },
  headerIndicator: {
    top: 0,
    zIndex: 99,
    width: indicatorWidth,
    height: 2,
    backgroundColor: 'blue',
  },
});
