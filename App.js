// ----- Main Screen of the App ----- //
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";
import * as Haptics from 'expo-haptics';

export default function App() {
  // ----- TIMER STATE ----- //
  const [ timeLeft, setTimeLeft ] = useState( 10 );
  const [ isRunning, setIsRunning ] = useState( false );
  const [ isDone, setIsDone ] = useState( false );

  // ----- START TIMER ----- //
  const startTimer = () => {
    setIsRunning( true );
    setIsDone( false );
    setTimeLeft( 10 );
  };

  // ----- RESET FUNCTION ----- //
  const resetTimer = () => {
    setIsRunning( false );
    setIsDone( false );
    setTimeLeft( 10 );
  };

  // ----- TIMER LOGIC ----- //
  useEffect( () => {
    let interval = null;

    if ( isRunning && timeLeft > 0 ) {
      interval = setInterval( () => {
        setTimeLeft( ( previousTime ) => previousTime - 1 );
      }, 1000 );
    }
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

  // ----- UI ----- //
  return (
    <View style={ styles.container }>
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
  
  timerText: {
    fontSize: 72,
    marginBottom: 40,
  },

  buttonContainer: {
    width: 200,
    gap: 20,
  },
} );