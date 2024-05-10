import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../../global/styles/theme';
import { format, parseISO } from 'date-fns';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

import { Container, ClassesListItem } from './styles';
import { capitalizeFirstLetter } from '../../global/functions/dashboard';
import ClassInfo from '../ClassInfo';

const ClassesList = ({ periodClasses, group }) => {
  const [showPeriodOptions, setShowPeriodOptions] = useState(false);
  const [classInfo, setClassInfo] = useState(null);

  const animatedStyle = useAnimatedStyle(() => {
      return {
          maxHeight: showPeriodOptions ? withTiming(2000, { duration: 1000, easing: Easing.linear }) : withTiming(0, { duration: 100, easing: Easing.linear }),
          height: showPeriodOptions ? 'auto' : 0,
      }
  })

  return (
      <>
      <Container style={{ width: '100%', marginBottom: 48, marginTop: 8, height: showPeriodOptions ? 'auto' : 75, padding: 0  }}>
          <TouchableOpacity onPress={ () => setShowPeriodOptions(!showPeriodOptions) } style={{ width: '100%', height: 75, marginBottom: 8, backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.secondary }}>
            <View>
              <Text style={{ fontSize: 16,color: theme.colors.secondary,fontWeight: 'bold' }}>{periodClasses.length} Classes</Text>
              <Text style={{ color: '#868686', fontSize: 12}}>{group.workload}</Text>
              
            </View>
            <Feather style={{ color: theme.colors.secondary, fontSize: 22}} name={`${showPeriodOptions ? 'chevron-up' : 'chevron-down'}`} />
          </TouchableOpacity>
          <Animated.View style={[animatedStyle,styles.container]}>
          { periodClasses.map((periodClass,index) => {
            const icon = periodClass.presenceStatus === 'Sick' ? theme.icons.Sick
                        : periodClass.presenceStatus === 'Absent' ? theme.icons.Absent 
                        : periodClass.presenceStatus === 'Transfer' ? theme.icons.Transfer 
                        : periodClass.presenceStatus === 'Vacation' ? theme.icons.Vacation
                        : periodClass.presenceStatus === 'Half Present' ? theme.icons.Halfpresent
                        : theme.icons.Present;
            const periodColor = periodClass.presenceStatus === 'Sick' ? theme.colors.Sick 
                        : periodClass.presenceStatus === 'Absent' ? theme.colors.Absent 
                        : periodClass.presenceStatus === 'Transfer' ? theme.colors.Transfer 
                        : periodClass.presenceStatus === 'Vacation' ? theme.colors.Vacation 
                        : periodClass.presenceStatus === 'Half Present' ? theme.colors.Halfpresent
                        : theme.colors.Present
            periodClass.icon = icon;
            periodClass.periodColor = periodColor;
            return (
              <View style={{ width: '100%' }} key={index}>
              <TouchableOpacity onPress={() => setClassInfo(periodClass)} >
                <ClassesListItem style={{ width: '100%',borderLeftColor: periodClass.periodColor }}>
                
                  <View style={{ paddingLeft: 16 }}>
                    <Text style={{ width: 80, color: '#555' }}>
                      {format(parseISO(periodClass.classDate), "MMM, dd")}
                    </Text>
                    <Text style={{ width: 80, color: '#868686', fontSize: 12 }}>
                      {capitalizeFirstLetter(periodClass.weekDate)}
                    </Text>
                  </View>
                  <View style={{ width: 32, paddingVertical: 16, paddingHorizontal: 12, borderRadius: 32,backgroundColor: '#FFF', flex: 1,flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between'}}>
                    { periodClass.grades.length > 0 ? 
                    <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                      <Text style={{ color: theme.colors.Present,fontSize: 13, fontWeight: 'bold' }}>{capitalizeFirstLetter(periodClass.grades[0].name)}</Text>
                      <Text style={{ color: theme.colors.Present }}>{periodClass.grades[0].score}%</Text>
                    </View>
                    : 
                    <>
                    <Text style={{ color: '#555',fontSize: 13 }}>{periodClass.presenceStatus}</Text>
                    {periodClass.icon}
                    </>
                    }
                    
                  </View>
                
                </ClassesListItem>
              </TouchableOpacity>
              </View>
            );
          }
          )}
          </Animated.View>
          { classInfo ?
            <ClassInfo periodClass={classInfo} setClassInfo={setClassInfo} />
          : null }
          
      </Container>
      </>
  );
}
const styles = StyleSheet.create({
    container: {
      padding: 0,
      margin: 0,
      width: '90%'
    }
});

export default ClassesList;