import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

// import { Container } from './styles';

const Loading = ({ title }) => {
  return (
    <View>
      <ActivityIndicator size="small" color="#0000ff" />
      {title ? <Text>{ title }</Text> : null }
    </View>
  )
}

export default Loading;