import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { Controller } from "react-hook-form";

import { Container,MyInput } from './styles';

export default function Input({ placeholder, icon, error, name, iconColor, control, ...rest }) {
  return (
      <Container error={error}>
          <Entypo style={{ color: iconColor}} name={icon} />
          <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value }}) => (
              <MyInput onChangeText={onChange} value={value} placeholder={placeholder} placeholderTextColor="#868686" {...rest} />
          )} />
      </Container>
  );
}