import React from 'react';

import { Container, Circle, CircleActive, Slash, SlashActive } from './styles';

export default function RegistrationStatus({ step }) {
  return (
  <Container>
    {
    step === '1' ?
      <>
        <CircleActive>
          <Circle />
        </CircleActive>
        <Slash />
        <Circle />
        <Slash />
        <Circle />
      </>
    : step === '2' ?
      <>
        <Circle />
        <SlashActive />
        <CircleActive>
          <Circle />
        </CircleActive>
        <Slash />
        <Circle />
      </>
    : step === '3' ?
      <>
        <Circle />
        <SlashActive />
        <Circle />
        <SlashActive />
        <CircleActive>
          <Circle />
        </CircleActive>
      </>
    : null
    }
  </Container>
  );
}