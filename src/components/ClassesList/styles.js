import styled from 'styled-components/native';
// import { RFPercentage } from 'react-native-responsive-fontsize';

export const Container = styled.View`
    overflow: hidden;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    align-items: center;
`;

export const ClassesListItem = styled.View`
    flex-direction: row;
    border-left-width: 2px;
    border-left-style: solid;
    border-left-color: ${(props) => props.type == 'Sick' || props.type == 'Absent' ? ({theme}) => theme.colors.primary : ({theme}) => theme.colors.secondary };
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    padding: 8px 0;
`;