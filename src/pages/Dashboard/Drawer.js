import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useWindowDimensions } from "react-native";
import { Dashboard } from "./index";
import { AbsenseExcuse } from "../AbsenseExcuse";
import { useRegister } from "../../hooks/register";
import theme from "../../global/styles/theme";
import { Vacations } from "../Vacations";
import { CalendarThisYear } from "../CalendarThisYear";
import { CalendarNextYear } from "../CalendarNextYear";
import { StudentHandbook } from "../StudentHandbook";
import ProgressTest from "../ProgressTest";

// import { Container } from './styles';

const Drawer = createDrawerNavigator();

export default function DashboardDrawer({ navigation }) {
  const { student, params } = useRegister();
  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("tabPress", (e) => {
  // Prevent default behavior

  // e.preventDefault();
  // navigation.navigate("DashboardDrawer");
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  const dimensions = useWindowDimensions();
  return (
    <Drawer.Navigator
      id="LeftDrawer"
      initialRouteName="DashboardDrawer"
      backBehavior="none"
      defaultStatus="closed"
      detachInactiveScreens={false}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "#efefef",
          width: 240,
        },
        drawerPosition: "left",
        drawerType: dimensions.width >= 768 ? "permanent" : "front",
        swipeEnabled: false,
        headerShown: false,
        drawerActiveBackgroundColor: theme.colors.secondary,
        drawerActiveTintColor: "#FFF",
        drawerInactiveTintColor: theme.colors.secondary,
      }}
    >
      <Drawer.Screen
        name="DashboardDrawer"
        component={Dashboard}
        options={{ drawerLabel: "Dashboard" }}
      />
      {(params.allow_class_excuses.includes(
        student.registrationNumber.substring(0, 3)
      ) ||
        params.allowed_users.includes(student.registrationNumber.trim())) && (
        <Drawer.Screen
          name="MedicalExcusesDrawer"
          component={AbsenseExcuse}
          options={{ drawerLabel: "Absence Excuse" }}
        />
      )}
      {(params.allow_vacations.includes(
        student.registrationNumber.substring(0, 3)
      ) ||
        params.allowed_users.includes(student.registrationNumber.trim())) && (
        <Drawer.Screen
          name="VacationsDrawer"
          component={Vacations}
          options={{ drawerLabel: "Vacations" }}
        />
      )}
      {
        <Drawer.Screen
          name="CalendarThisYear"
          component={CalendarThisYear}
          options={{ drawerLabel: `Calendar ${new Date().getFullYear()}` }}
        />
      }
      {
        <Drawer.Screen
          name="CalendarNextYear"
          component={CalendarNextYear}
          options={{ drawerLabel: `Calendar ${new Date().getFullYear() + 1}` }}
        />
      }
      {
        <Drawer.Screen
          name="StudentHandbook"
          component={StudentHandbook}
          options={{ drawerLabel: `Student Handbook` }}
        />
      }
      {(params.allow_progress_tests.includes(
        student.registrationNumber.substring(0, 3)
      ) ||
        params.allowed_users.includes(student.registrationNumber.trim())) && (
        <Drawer.Screen
          name="ProgressTest"
          component={ProgressTest}
          options={{
            drawerLabel: `Progress Test`,
            headerShown: true,
          }}
        />
      )}
    </Drawer.Navigator>
  );
}
