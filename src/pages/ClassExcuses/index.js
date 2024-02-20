import React from 'react';
import { Page, Main } from './styles';
import { ScrollView } from 'react-native';
import Header from '../../components/Header';

export function ClassExcuses({ navigation }) {
   return (
      <Page>
         <Header showLogo={true} navigation={navigation} drawer='Class Excuses' />
         <ScrollView>
            <Main>
            
            </Main>
         </ScrollView>
   </Page>);
}