// ----- Main Screen of the App ----- //
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';

export default function App() {
  // ----- INTERVALS ----- //
  const intervals = [5, 10, 15];

  // ----- TIMER STATE ----- //
  const [currentInterval, setCurrentInterval] = useState(0);
  const [timeLeft, setTimeLeft] = useState(intervals[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // ----- SESSION TOTAL ----- //
  const [sessionElapsed, setSessionElapsed] = useState(0);

  // ----- START ----- //
  const startTimer = () => {
    setIsRunning(true);
    setIsDone(false);
    setTimeLeft(intervals[currentInterval]);
  };

  // ----- RESET ----- //
  const resetTimer = () => {
    setIsRunning(false);
    setIsDone(false);
    setCurrentInterval(0);
    setTimeLeft(intervals[0]);
    setSessionElapsed(0);
  };

  // ----- NEXT INTERVAL (USER CONTROLLED) ----- //
  const nextInterval = () => {
    if (currentInterval < intervals.length - 1) {
      const nextIndex = currentInterval + 1;
      setCurrentInterval(nextIndex);
      setTimeLeft(intervals[nextIndex]);
      setIsRunning(false); // IMPORTANT: user must press Start again
    }
  };

  // ----- TIMER LOGIC ----- //
  useEffect(() => {
    let interval = null;

    // countdown
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    // when interval finishes
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);

      // add interval to total session time
      setSessionElapsed(prev => prev + intervals[currentInterval]);

      // if last interval → finish session
      if (currentInterval === intervals.length - 1) {
        setIsDone(true);

        Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, currentInterval]);

  // ----- UI ----- //
  return (
    <View style={styles.container}>
      <Text style={styles.intervalText}>
        Interval {currentInterval + 1}
      </Text>

      <Text style={styles.timerText}>
        {timeLeft}
      </Text>

      <View style={styles.buttonContainer}>
        <Button title="Start" onPress={startTimer} />
        <Button title="Reset" onPress={resetTimer} />
        <Button title="Next Interval" onPress={nextInterval} />
      </View>

      {isDone && (
        <View style={{ marginTop: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 18 }}>
            Session Complete 💤
          </Text>

          <Text style={{ fontSize: 16, marginTop: 10 }}>
            Total Time: {sessionElapsed} seconds
          </Text>
        </View>
      )}
    </View>
  );
}

// ----- STYLES ----- //
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    alignItems: 'center',
    justifyContent: 'center',
  },

  intervalText: {
    fontSize: 24,
    marginBottom: 10,
    color: '#fff',
  },

  timerText: {
    fontSize: 72,
    marginBottom: 40,
    color: '#fff',
  },

  buttonContainer: {
    width: 200,
    gap: 20,
  },
});

// ----- TO DOs ----- //
  // 1. Change Button font color
  // 2. Update actual time [5min, 10min, 15min, 15min etc.], allowing for indefinite intervals [Index 3, Index 4, Index n]
  // 3. Clicking "Next Interval" automatically begins the timer, as opposed to having to click "Start"
  // 4. Add a "Stop" Button so the User can stop mid-session
  // 5. Remove the summary "Total Time: " text and allow that to exist somewhere else in the UI
  // 6. Add haptic feedback upon completion of each session