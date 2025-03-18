import styled from "styled-components/native";
import { RFPercentage } from "react-native-responsive-fontsize";

export const Page = styled.View`
  display: flex;
  flex: 1;
  background: ${({ theme }) => theme.colors.background};
`;

export const Container = styled.View`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
`;

export const Main = styled.View`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-around;
  flex: 1;
  gap: 12;
`;

export const BtnText = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 16px;
  font-weight: bold;
`;
