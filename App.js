// ----- Main Screen of the App ----- //
import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from "react-native";

export default function App() {
  // ----- TIMER STATE ----- //
  const [ timeLeft, setTimeLeft ] = useState( 10 );
  const [ isRunning, setIsRunning ] = useState( false );

  // ----- TIMER LOGIC ----- //
  useEffect( () => {
    let interval;

    if ( isRunning && timeLeft > 0 ) {
      interval = setInterval( () => {
        setTimeLeft( ( previousTime ) => previousTime - 1 );
      }, 1000 );
    }
    if ( timeLeft === 0 ) {
      setIsRunning( false );
    }
    return () => clearInterval( interval );
  }, [ isRunning, timeLeft ] );

  // ----- RESET FUNCTION ----- //
  const resetTimer = () => {
    setIsRunning( false );
    setTimeLeft( 10 );
  };

  // ----- UI ----- //
  return (
    <View style={ styles.container }>
      <Text style={ styles.timerText }>
        { timeLeft }
      </Text>

      <View style={ styles.buttonContainer }>
        <Button
          title="Start"
          onPress={ () => setIsRunning( true ) }
        />

        <Button
          title="Reset"
          onPress={ resetTimer }
        />
      </View>

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