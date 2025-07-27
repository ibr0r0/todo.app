import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  I18nManager,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function HomeScreen() {
  const [task, setTask] = useState('');
  const [time, setTime] = useState(new Date());
  const [color, setColor] = useState('#8e44ad');
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const animatedHeight = useState(new Animated.Value(60))[0];
  const navigation = useNavigation();

  const addTask = () => {
    if (task.trim() === '') return;
    const newTask = {
      id: Date.now().toString(),
      text: task,
      time: time.toISOString(),
      color,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTask('');
  };

  const toggleComplete = (id) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find((t) => t.id === id);
    if (taskToEdit) {
      setTask(taskToEdit.text);
      setTime(new Date());
      deleteTask(id);
    }
  };

  const getRemainingTime = (due) => {
    const diff = new Date(due) - new Date();
    if (diff <= 0) return '⏱️ انتهت';
  
    const totalMins = Math.floor(diff / 60000);
    const totalHours = Math.floor(totalMins / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const mins = totalMins % 60;
  
    if (days > 0) {
      return `تبقى: ${days} يوم${days > 1 ? 'اً' : ''} و ${hours} ساعة`;
    } else {
      return `تبقى: ${hours} ساعة و ${mins} دقيقة`;
    }
  };
  

  return (
    
    <ScrollView style={styles.container}>
        <StatusBar style="light" />

      <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.topBar}>
        <Ionicons name="information-circle-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>عندك {tasks.length} مهام اليوم ✍🏼</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            placeholder="ابحث عن مهمة..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={{ position: 'absolute', left: 10, top: 14 }}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>مهام اليوم</Text>
        <Text style={styles.progressText}>
          أنجزت {tasks.filter((t) => t.completed).length}/{tasks.length} من المهام
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(tasks.filter(t => t.completed).length / (tasks.length || 1)) * 100}%` }]} />
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          Animated.timing(animatedHeight, {
            toValue: expanded ? 0 : 300,
            duration: 300,
            easing: Easing.out(Easing.exp),
            useNativeDriver: false,
          }).start();
          setExpanded(!expanded);
        }}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>➕ إضافة مهمة</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.animatedBox, { height: animatedHeight }]}> 
        {expanded && (
          <>
            <TextInput
              placeholder="اكتب عنوان المهمة"
              placeholderTextColor="#aaa"
              value={task}
              onChangeText={setTask}
              style={styles.input}
            />
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <DateTimePicker
                value={time}
                mode="datetime"
                is24Hour={true}
                display="default"
                onChange={(e, d) => d && setTime(d)}
                themeVariant="dark"
                style={{ backgroundColor: '#1e1e1e', borderRadius: 10, width: '100%' }}
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                {["#e67e22", "#2980b9", "#2ecc71", "#9b59b6", "#f39c12", "#1abc9c", "#d35400", "#c0392b", "#7f8c8d", "#34495e", "#e84393", "#00cec9"].map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.colorBox, { backgroundColor: c, borderWidth: color === c ? 2 : 0 }]}
                    onPress={() => setColor(c)}
                  />
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={() => {
                addTask();
                Animated.timing(animatedHeight, { toValue: 0, duration: 300, useNativeDriver: false }).start();
                setExpanded(false);
              }}
              style={styles.confirmButton}
            >
              <Text style={styles.addButtonText}>✅ تأكيد</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>

      <FlatList
        style={{ marginTop: 20 }}
        data={tasks.filter(t => t.text.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.taskCard, { backgroundColor: item.color, opacity: item.completed ? 0.5 : 1 }]}>
            <TouchableOpacity onPress={() => toggleComplete(item.id)}>
              <Text style={[styles.taskText, item.completed && { textDecorationLine: 'line-through' }]}>✅ {item.text}</Text>
            </TouchableOpacity>
            <Text style={styles.taskTime}>🕐 {item.time}</Text>
            <Text style={styles.remainingText}>{getRemainingTime(item.time)}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 }}>
              <TouchableOpacity onPress={() => editTask(item.id)} style={{ marginLeft: 10 }}>
                <Text style={{ color: '#fff' }}>✏️</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Text style={{ color: '#fff' }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 100, backgroundColor: '#121212' },
  topBar: { position: 'absolute', top: -10, left: 20, zIndex: 10 },
  header: { marginBottom: 20 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'right' },
  searchInput: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    color: '#fff',
    textAlign: 'right',
  },
  progressCard: { backgroundColor: '#1e1e1e', padding: 15, borderRadius: 10, marginBottom: 20 },
  progressTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
  progressText: { color: '#aaa', marginTop: 5, textAlign: 'right' },
  progressBar: { height: 10, backgroundColor: '#333', borderRadius: 5, marginTop: 10, overflow: 'hidden' },
  progressFill: { height: 10, backgroundColor: '#a29bfe' },
  addButton: { backgroundColor: '#636e72', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  animatedBox: { overflow: 'hidden', backgroundColor: '#1e1e1e', borderRadius: 10, marginVertical: 10, padding: 10, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#444', padding: 10, color: '#fff', marginBottom: 10, borderRadius: 5, backgroundColor: '#1e1e1e', textAlign: 'right' },
  colorBox: { width: 30, height: 30, marginLeft: 10, borderRadius: 5, borderColor: '#fff' },
  confirmButton: { backgroundColor: '#27ae60', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 10 },
  taskCard: { padding: 15, borderRadius: 10, marginBottom: 10 },
  taskText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'right' },
  taskTime: { color: '#eee', fontSize: 14, textAlign: 'right', marginTop: 5 },
  remainingText: { color: '#eee', fontSize: 12, textAlign: 'right', marginTop: 5 },
});