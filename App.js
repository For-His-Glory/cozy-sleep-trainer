// ----- Main Screen of the App ----- //
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  // ----- VARIABLE CREATION ----- //
    // ----- INTERVALS ----- //
    const intervals = [ 2, 5, 10, 15 ];

    // ----- TIMER STATE ----- //
    const [ currentInterval, setCurrentInterval ] = useState( 0 );
    const [ completedIntervals, setCompletedIntervals ] = useState( 0 );
    const [ timeLeft, setTimeLeft ] = useState( intervals[ 0 ]);
    const [ isRunning, setIsRunning ] = useState( false );

    // ----- SESSION TOTAL ----- //
    const [ sessionElapsed, setSessionElapsed ] = useState( 0 );

    // ----- HISTORY ----- //
    const [ history, setHistory ] = useState( [] );

  // ----- LOGIC ----- //
    // ----- LOAD HISTORY ----- //
    const loadHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem(
          'sessionHistory'
        );
        if ( storedHistory !== null ) {
          setHistory( JSON.parse( storedHistory ) );
        }
      }
      catch ( error ) {
        console.log( 'Load Error:', error );
      }
    };

      // ----- LOAD ON APP START ----- //
    useEffect( () => {
      loadHistory();
    }, [] );

    // ----- START ----- //
    const start = () => {
      setTimeLeft( intervals[ currentInterval ] );
      setIsRunning( true );
    };

    // ----- STOP ----- //
    const stop = async () => {
      setIsRunning( false );

      const newSession = {
        totalTime: sessionElapsed,
        date: new Date().toLocaleString(),
      };

      const updated = [ newSession, ...history ];

      setHistory( updated );

      await AsyncStorage.setItem(
        'sessionHistory',
        JSON.stringify( updated )
      );

      // ----- RESET ----- //
      setCurrentInterval( 0 );
      setTimeLeft( intervals[ 0 ] );
      setSessionElapsed( 0 );
      setCompletedIntervals( 0 );
    };

    // ----- TIMER LOGIC ----- //
    useEffect( () => {
      let interval = null;

      if ( isRunning && timeLeft > 0 ) {
        interval = setInterval( () => {
          setTimeLeft( prev => prev - 1 );
        }, 1000 );
      }

      // Interval Completed
      if ( isRunning && timeLeft === 0 ) {

        setCompletedIntervals( prev => prev + 1 );

        Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
        
        const nextTotal = sessionElapsed + intervals[ currentInterval ];
        
        // Stop Auto-Run, await User input
        setIsRunning( false );
        setSessionElapsed( nextTotal );

        // Next Interval
        if ( currentInterval < intervals.length - 1 ) {
          const next = currentInterval + 1;
          setCurrentInterval( next );
          setTimeLeft( intervals[ next ] );
        }
        else {
          // Stay on last Interval indefinitely
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          );
          const newTotal = sessionElapsed + intervals[ currentInterval ];
          setSessionElapsed( newTotal );

          // Keep user in last stage
          setTimeLeft( intervals[ currentInterval ] );
          setIsRunning( false );
        }
      }

      return () => clearInterval( interval );
    }, [ isRunning, timeLeft ] );

  // ----- UI ----- //
  return (
    <View style={styles.container}>

      {/* INTERVAL LABEL */}
      <Text style={styles.intervalText}>
        Interval {completedIntervals + 1}
      </Text>

      {/* TIMER */}
      <Text style={styles.timerText}>
        {timeLeft}
      </Text>

      {/* NEXT INTERVAL PREVIEW */}
      {!isRunning && currentInterval < intervals.length - 1 && (
        <Text style={styles.nextText}>
          Next: {intervals[ currentInterval + 1 ]} min  
        </Text>
      )}

      {/* BUTTONS */}
      <View style={styles.buttonContainer}>

        {!isRunning ? (
          <Button title="START" onPress={start} />
        ) : (
          <Button title="STOP" onPress={stop} />
        )}

      </View>

      {/* HISTORY */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>
          History
        </Text>

        {history.map( ( session, index ) => (
          <Text key={ index } style={styles.historyItem}>
            {session.totalTime} min | {session.date}
          </Text>
        ))}
      </View>

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
    paddingHorizontal: 20, 
  },

  intervalText: {
    fontSize: 22,
    color: '#aaa',
    marginBottom: 10,
  },

  timerText: {
    fontSize: 96,
    fontWeight: '300',
    color: '#fff',
  },

  nextText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },

  buttonContainer: {
    marginTop: 30,
  },

  historyContainer: {
    marginTop: 50,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 20,
  },

  historyTitle: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 10,
  },

  historyItem: {
    color: '#777',
    fontSize: 12,
    marginBottom: 5,
  },
});

// ----- TEST RESULTS ----- //
  // 06/03/2026 
    // PASS: Session History is functional, accurate, persistent (even upon app closure).
  // 06/05/2026
    // PASS 
      // UI is clean, "Interval Title" is present, "Counter" is present, "Next Interval" is present, "START Button" is present, "History" is present.
      // "STOP Button" functional mid-Interval. Ceases the countdown and immediately resets the "Interval Number (1)"", "Next (5min)", "START Button" appears, and "History" is updated.

    