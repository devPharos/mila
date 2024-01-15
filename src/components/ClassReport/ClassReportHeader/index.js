import React, { useContext, useState } from 'react';
import Animated, { useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { format, parseISO, subMonths } from 'date-fns';
import theme from '../../../global/styles/theme';
import { Feather } from '@expo/vector-icons';

import { ClassReportTitle } from './styles';
import { RegisterContext } from '../../../hooks/register';

const ClassReportHeader = ({ setLoading }) => {
    const { period, periodDates, periodDate, setPeriodDate, params } = useContext(RegisterContext);
    const [showPeriodOptions, setShowPeriodOptions] = useState(false);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            maxHeight: showPeriodOptions ? withTiming(1500, { duration: 1000, easing: Easing.linear }) : withTiming(0, { duration: 100, easing: Easing.linear }),
        }
    })

    function handlePeriodChange(item) {
        setLoading(true);
        period.date = item.date;
        setShowPeriodOptions(false);
        setPeriodDate(item);
        setTimeout(() => {
            setLoading(false);
        },1000)
    }

    if(!period) {
        return null;
    }

  return (
    
    <>
    { periodDate ? 
        <>
        <ClassReportTitle style={{ position: 'relative', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}></View>

            {/* Desativado conforme solicitado pelo Daniel */}
            <TouchableOpacity disabled={params.limit_periods_to_students < 1} onPress={ () => setShowPeriodOptions(!showPeriodOptions) } style={{ backgroundColor: '#fff',width: 165, height: 44, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly'}}>
                <Text style={{color: theme.colors.secondary}}>
                    {format(parseISO(periodDate), "MMMM, Y")}
                </Text>
                { params.limit_periods_to_students > 0 ?
                <Feather style={{ color: theme.colors.secondary, fontSize: 22}} name={`${showPeriodOptions ? 'chevron-up' : 'chevron-down'}`} />
                : null }
            </TouchableOpacity>
            
        </ClassReportTitle>

        <Animated.View style={[animatedStyle,styles.container]}>
            <View style={{ paddingVertical: 16 }}>
            { 
            periodDates.map((periodItem,index) => {
                if(periodItem <= format(new Date(), "Y-MM") && periodItem >= format(subMonths(new Date(),params.limit_periods_to_students), "Y-MM")) {
                    return <View key={index} style={{ width: '100%',borderBottomWidth: 1, borderBottomColor: '#efefef' }}>
                        <TouchableOpacity onPress={ () => handlePeriodChange(periodItem) } style={{ width: '100%',paddingVertical: 16}}>
                            <Text style={{ fontSize: 16, color: theme.colors.secondary, textAlign: 'center' }}>{format(parseISO(periodItem), "MMMM, Y")}</Text>
                        </TouchableOpacity>
                    </View>
                }
            } )}
            </View>
        </Animated.View>
        </>
    : null }
    </>
  );
}
const styles = StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: 32,
      borderTopRightRadius: 0,
      paddingHorizontal: 32,
      backgroundColor: '#fff',
      marginBottom: 8,
      marginTop: 8
    }
});

export default ClassReportHeader;