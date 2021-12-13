import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  StyleSheet,
  Alert,
} from 'react-native';
import { CalendarList } from 'react-native-calendars';

const window = Dimensions.get('window');

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
const selectDateObj = {
  selected: true,
  marked: false,
  selectedColor: 'blue',
};

export const MyCalendar = () => {
  const [showModal, setShowModal] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<number>(1);
  const [markedDates, setMarkedDates] = useState({
    '2021-12-15': { selected: false, marked: true, selectedColor: 'blue' },
  });
  const calendarRef = useRef<CalendarList>(null);

  const renderMonths = ({ item, index }: { item: string; index: number }) => {
    const month = index + 1 < 10 ? '0' + (index + 1) : index + 1;
    const date = `2021-${monthNumbers[item]}-${month}`;

    return (
      <TouchableOpacity
        style={styles.modalItem}
        onPress={() => {
          setShowModal(false);
          calendarRef?.current?.scrollToMonth(date);
        }}>
        <Text style={styles.modalItemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setShowModal(true)}>
        <Text style={styles.headerTitle}>{months[visibleMonth - 1]}</Text>
      </TouchableOpacity>
      <CalendarList
        ref={calendarRef}
        horizontal
        pagingEnabled
        renderHeader={() => <></>}
        markedDates={markedDates}
        onVisibleMonthsChange={date => {
          const { month } = date[0];
          setVisibleMonth(month);
        }}
        onDayPress={date => {
          setMarkedDates(prev => {
            if (prev[date.dateString]?.marked) {
              Alert.alert('дата уже занята, выберите другую');
              return prev;
            }

            if (prev[date.dateString]?.selected) {
              return { ...prev, [date.dateString]: {} };
            } else {
              console.log(1);
              return { ...prev, [date.dateString]: selectDateObj };
            }
          });
        }}
      />
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowModal(false)}>
          <TouchableWithoutFeedback>
            <View style={styles.modal}>
              <FlatList data={months} renderItem={renderMonths} />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: window.width,
  },
  headerTitle: {
    textAlign: 'center',
  },
  overlay: {
    flex: 1,
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    height: 200,
    paddingVertical: 30,

    backgroundColor: 'gray',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalItem: {
    width: window.width,
    padding: 5,
  },
  modalItemText: {
    textAlign: 'center',
  },
});
