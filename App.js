// ----- Main Screen of the App ----- //
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';

export default function App() {
  // ----- TIMER CONSTS ----- //
    // ----- INTERVALS LIST ----- //
    const intervals = [ 2, 5, 10 ];
    // ----- STATE ----- //
    const [ currentInterval, setCurrentInterval ] = useState( 0 );
    const [ timeLeft, setTimeLeft ] = useState( intervals [ 0 ] );
    const [ isRunning, setIsRunning ] = useState( false );
    const [ isDone, setIsDone ] = useState( false );

  // ----- START TIMER ----- //
  const startTimer = () => {
    setIsRunning( true );
    setIsDone( false );
    setTimeLeft( intervals[ currentInterval ] );
  };

  // ----- RESET TIMER ----- //
  const resetTimer = () => {
    setIsRunning( false );
    setIsDone( false );
    setCurrentInterval( 0 );
    setTimeLeft( intervals[ 0 ] );
    
  };

    // ------ NEXT INTERVAL ----- //
    const nextInterval = () => {
      // ------ CHECK IF MORE INTERVALS EXIST ----- //
      if ( currentInterval < intervals.length - 1 ) {
        const nextIndex = currentIntervals + 1;
        setCurrentIntervals( nextIndex );
        setTimeLeft( intervals[ nextIndex ] );
        setIsDone( false );
      }
    }

  // ----- TIMER LOGIC ----- //
  useEffect( () => {
    let interval = null;

    if ( isRunning && timeLeft > 0 ) {
      interval = setInterval( () => {
        setTimeLeft( ( previousTime ) => previousTime - 1 );
      }, 1000 );
    }
    // ----- TIMER COMPLETE ----- //
      if ( timeLeft === 0 && isRunning ) {
        setIsRunning( false );
        setIsDone( true );

      // ----- HAPTIC STATUS ----- //
      Haptics.notificationAsync( 
        Haptics.NotificationFeedbackType.Success
      );
    }

    return () => clearInterval( interval );
  }, [ isRunning, timeLeft ] );

  // ----- UI (HTML) ----- //
  return (
    <View style={ styles.container }>
      <Text style={ styles.intervalText }>
        Interval { currentInterval + 1 }
      </Text>

      <Text style={ styles.timerText }>
        { timeLeft }
      </Text>

      <View style={ styles.buttonContainer }>
        <Button
          title="Start"
          onPress={ startTimer }
        />

        <Button
          title="Reset"
          onPress={ resetTimer }
        />

        <Button
          title="Next Interval"
          onPress={ nextInterval }
        />
      </View>

      { isDone && ( 
        <Text style={ { marginTop: 30, fontSize: 16 } }>
          Session Complete!  Now Sleep :)
        </Text>
      ) }
    </View>
  );
}

// ----- STYLES ----- //
const styles = StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  intervalText: {
    fontSize: 24,
    marginBottom: 10,
  },

  timerText: {
    fontSize: 72,
    marginBottom: 40,
  },

  buttonContainer: {
    width: 200,
    gap: 20,
  },

  doneText: {
    marginTop: 30,
    fontSize: 16,
  },
} );