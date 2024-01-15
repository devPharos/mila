import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text  } from 'react-native';
import theme from '../../global/styles/theme';
import { CircularProgressBase } from 'react-native-circular-progress-indicator';
import Loading from '../../components/Loading';
import ClassesList from '../ClassesList';
import { Feather } from '@expo/vector-icons';
import { logOut, RegisterContext } from '../../hooks/register';

import { Container, Canvas } from './styles';
import ClassReportHeader from './ClassReportHeader';
import { format, parseISO } from 'date-fns';
import { capitalizeFirstLetter } from '../../global/functions/dashboard';

const ClassReport = () => {
    const { group, frequency, period } = useContext(RegisterContext);
    const [loading,setLoading] = useState(false);
    const [currentFrequency, setCurrentFrequency] = useState(frequency[frequency.length - 1])
    const props = {
        activeStrokeWidth: 10,
        inActiveStrokeWidth: 10,
        inActiveStrokeOpacity: 0.05
    };

    useEffect(() => {
        function load() {
            setCurrentFrequency(frequency[frequency.findIndex(freq => freq.period == period.period)])
        }
        if(currentFrequency.period !== period.period) {
            load()
        }
    },[period])

  return (
    <>
    <Container>
        <ClassReportHeader setLoading={setLoading} />
        { loading ? <Loading /> :
        <>
            {group.map((g,index) => {
                return (
                    <View key={index} style={{ width: '100%'}}>
                        { index == 0 ? 
                        <Container style={{ width: '100%', marginBottom: 16, height: 100  }}>
                            <View  style={{ width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ color: theme.colors.secondary, fontWeight: 'bold', fontSize: 14}}>Period Total Absences</Text>
                                <View style={{ backgroundColor: "#efefef", width: 60, height: 35, borderRadius: 15, alignItems: 'center',justifyContent: 'center'}}>
                                    <Text style={{ color: '#222', fontSize: 14}}>{currentFrequency.totalAbsences || 0}</Text>
                                </View>
                            </View>
                            <View  style={{ width: '100%', height: 50, marginTop: 6, backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ color: theme.colors.secondary, fontWeight: 'bold', fontSize: 14}}>Period Frequency</Text>
                                <View style={{ backgroundColor: "#efefef", width: 60, height: 35, borderRadius: 15, alignItems: 'center',justifyContent: 'center'}}>
                                    <Text style={{ color: '#222', fontSize: 14}}>{currentFrequency.percFrequency || 0} %</Text>
                                </View>
                            </View>
                        </Container>
                        : null }
                        <Canvas>
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 16}}>
                                <Text style={{ color: theme.colors.secondary, fontSize: 16,marginTop: 6, fontWeight: 'bold' }}>{capitalizeFirstLetter(g.level) } - Teacher { capitalizeFirstLetter(g.teacher) } </Text>
                                <Text style={{ color: '#868686', fontSize: 13}}>{g.groupID ? g.groupID + " - " : null}{g.name}</Text>
                                <Text style={{ color: '#868686', fontSize: 12}}>Class SD/ED {format(parseISO(g.groupStartDate), "MMM, do Y")} to {format(parseISO(g.groupEndDate), "MMM, do Y")}</Text>
                                <Text style={{ color: '#868686', fontSize: 12}}>Student SD/ED {format(parseISO(g.studentStartDate), "MMM, do Y")} {g.studentEndDate ? " to "+format(parseISO(g.studentEndDate), "MMM, do Y") : null }</Text>
                            </View>
                            <View style={{ flexDirection: 'row',alignItems: 'center', justifyContent: 'space-evenly'}}>
                                    <CircularProgressBase
                                        {...props}
                                        value={g.givenContentPercentage}
                                        radius={60}
                                        activeStrokeColor={theme.colors.primary}
                                        inActiveStrokeColor={theme.colors.primary}
                                        delay={250}
                                        >
                                        <CircularProgressBase
                                        {...props}
                                        value={g.givenClassPercentage}
                                        radius={50}
                                        activeStrokeColor={theme.colors.secondary}
                                        inActiveStrokeColor={theme.colors.secondary}
                                        delay={400}>
                                            { g.status == 'FINISHED' ? <Text style={{ fontSize: 11 }}>{g.result || 'Not Defined'}</Text> : <Text style={{ fontSize: 11 }}>In Progress</Text> }
                                        </CircularProgressBase>
                                    </CircularProgressBase>
                                <View>
                                    <Text style={{color: theme.colors.primary}}>{ g.givenContentPercentage}% Content given</Text>
                                    <Text style={{color: theme.colors.secondary}}>{ g.givenClassPercentage}% Class given</Text>
                                </View>
                            </View>
                            <View style={{ width: '100%',alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row' }}>
                                {/* <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ marginBottom: 16}}>Presence in Class</Text>
                                    <View style={{ backgroundColor: "#efefef", width: 50, height: 35, borderRadius: 15, alignItems: 'center',justifyContent: 'center'}}>
                                        <Text style={{color: theme.colors.secondary}}>{ ((g.otherClasses.length - g.otherAbsences.length) / (g.otherClasses.length) * 100).toFixed(0) }%</Text>
                                    </View>
                                </View> */}
                                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ marginBottom: 16}}>Final Average Grade</Text>
                                    {g.finalAverageGrade ?
                                    <View style={{ backgroundColor: "#efefef", width: 50, height: 35, borderRadius: 15, alignItems: 'center',justifyContent: 'center'}}>
                                        <Text style={{color: theme.colors.secondary}}>{ g.finalAverageGrade }%</Text>
                                    </View>
                                    : 
                                    <View style={{ backgroundColor: "#efefef", width: 130, height: 35, borderRadius: 15, alignItems: 'center',justifyContent: 'center'}}>
                                        <Text style={{color: theme.colors.secondary}}>In Progress...</Text>
                                    </View>
                                    }
                                </View>
                            </View>
                        </Canvas>
                        <ClassesList periodClasses={g.classes.filter(period => (period.presenceStatus !== ''))} group={g} />
                    </View>
                )
            })
            }
            {/* <TouchableOpacity style={theme.buttons.secondaryButton}>
                <MaterialIcons name="file-download" style={{ fontSize: 22,color: theme.colors.secondary }} />
                <Text style={{ color: theme.colors.secondary}}>Print Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={theme.buttons.secondaryButton}>
                <MaterialIcons name="file-download" style={{ fontSize: 22,color: theme.colors.secondary }} />
                <Text style={{ color: theme.colors.secondary}}>Print Evaluation Chart</Text>
            </TouchableOpacity> */}
                
            <TouchableOpacity style={theme.buttons.secondaryButtonSimple} onPress={() => { logOut(); }}>
                <Text style={{ color: '#868686'}}>Log Out</Text>
                <View style={{ backgroundColor: '#ccc', borderRadius: 6, marginLeft: 6,padding: 6 }}>
                <Feather name="log-out" style={{ fontSize: 16,color: '#fff' }} />
                </View>
            </TouchableOpacity>
        </>
        }
    </Container>
    </>
  );
}

export default ClassReport;