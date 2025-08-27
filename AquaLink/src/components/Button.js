import * as React from 'react';
import { Button } from 'react-native-paper';

const ButtonComponent = () => (
  <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}/>

);

export default ButtonComponent;