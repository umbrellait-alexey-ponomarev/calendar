import React, { useRef, useState } from 'react';
import {
  Dimensions,
  View,
  Animated,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

const data = [
  '2022-01-01',
  '2022-02-01',
  '2022-03-01',
  '2022-04-01',
  '2022-05-01',
  '2022-06-01',
  '2022-07-01',
  '2022-08-01',
  '2022-09-01',
  '2022-10-01',
  '2022-11-01',
  '2021-12-01',
];
const months = [
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
const window = Dimensions.get('window');
const MAX_MONTH_COUNT = 3;
const indicatorWidth = window.width / MAX_MONTH_COUNT;

export const Calendar12 = () => {
  const [monthOffset, setMonthOffset] = useState(0);
  const [headerMonthsIndex, setHeaderMonthsIndex] = useState(0);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [isScrollable] = useState(true);

  const calendarRef = useRef<FlatList<any>>(null);
  const headerRef = useRef<FlatList<any>>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;

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
          setCurrentMonthIndex(index);
        }}>
        <Text style={styles.headerTabText}>{item}</Text>
      </TouchableOpacity>
    );
  };
  const toNext = () => {
    headerRef.current?.scrollToIndex({
      index: headerMonthsIndex + MAX_MONTH_COUNT,
      animated: true,
    });

    calendarRef.current?.scrollToIndex({
      index: currentMonthIndex + MAX_MONTH_COUNT,
      animated: true,
    });

    setCurrentMonthIndex(currentMonthIndex + MAX_MONTH_COUNT);
    setHeaderMonthsIndex(headerMonthsIndex + MAX_MONTH_COUNT);
    setMonthOffset(monthOffset + window.width);
  };
  const toPrev = () => {
    headerRef.current?.scrollToIndex({
      index: headerMonthsIndex - MAX_MONTH_COUNT,
      animated: true,
    });

    calendarRef.current?.scrollToIndex({
      index: currentMonthIndex - MAX_MONTH_COUNT,
      animated: true,
    });

    setCurrentMonthIndex(currentMonthIndex - MAX_MONTH_COUNT);
    setHeaderMonthsIndex(headerMonthsIndex - MAX_MONTH_COUNT);
    setMonthOffset(monthOffset - window.width);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerArrowPrev}>
          <Button
            title="<"
            onPress={toPrev}
            disabled={headerMonthsIndex === 0}
          />
        </View>
        <View style={styles.headerArrowNext}>
          <Button
            title=">"
            onPress={toNext}
            disabled={headerMonthsIndex === months.length - MAX_MONTH_COUNT}
          />
        </View>

        <FlatList
          ref={headerRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          data={months}
          renderItem={renderMonths}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, index) => ({
            length: months.length,
            offset: indicatorWidth * index,
            index,
          })}
        />
        <Animated.View
          style={[styles.headerIndicator, { left: animatedValue }]}
        />
      </View>

      <FlatList
        ref={calendarRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={isScrollable}
        data={data}
        renderItem={renderItem}
        onScroll={evt => {
          const { x } = evt.nativeEvent.contentOffset;
          animatedValue.setValue(x / MAX_MONTH_COUNT - monthOffset);
        }}
        onMomentumScrollBegin={() => {
          // setIsScrollable(false);
        }}
        onMomentumScrollEnd={evt => {
          const { x } = evt.nativeEvent.contentOffset;

          const offset = Math.round(x / MAX_MONTH_COUNT + indicatorWidth);

          const nextHeaderPage =
            offset ===
            Math.round(window.width + indicatorWidth * (headerMonthsIndex + 1));
          const prevHeaderPage = offset < monthOffset + indicatorWidth;

          if (nextHeaderPage) {
            Animated.spring(animatedValue, {
              toValue: 0,
              useNativeDriver: false,
            }).start();

            headerRef.current?.scrollToIndex({
              index: headerMonthsIndex + MAX_MONTH_COUNT,
              animated: true,
            });

            setMonthOffset(monthOffset + window.width);
            setHeaderMonthsIndex(headerMonthsIndex + MAX_MONTH_COUNT);
          }

          if (prevHeaderPage) {
            Animated.spring(animatedValue, {
              toValue: indicatorWidth * 2,
              useNativeDriver: false,
            }).start();

            headerRef.current?.scrollToIndex({
              index: headerMonthsIndex - MAX_MONTH_COUNT,
              animated: true,
            });

            setMonthOffset(monthOffset - window.width);
            setHeaderMonthsIndex(headerMonthsIndex - MAX_MONTH_COUNT);
          }

          setCurrentMonthIndex(x / window.width);
          // setIsScrollable(true);
        }}
        getItemLayout={(_, index) => ({
          length: months.length,
          offset: window.width * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
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
    height: 1,
    backgroundColor: '#0096FF',
  },
  headerArrowPrev: { position: 'absolute', left: 0, zIndex: 1, elevation: 2 },
  headerArrowNext: { position: 'absolute', right: 0, zIndex: 1, elevation: 2 },
});
