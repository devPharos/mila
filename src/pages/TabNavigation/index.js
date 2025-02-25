import React, { useEffect, useState } from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Profile } from "../Profile";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import myTheme from "../../global/styles/theme";
import { useRegister } from "../../hooks/register";
import { Image, Platform } from "react-native";
import appJson from "../../../app.json";
import DifferentVersion from "../DifferentVersion";
import DashboardDrawer from "../Dashboard/Drawer";
import Partners from "../Partners";
import { PaperProvider, useTheme } from "react-native-paper";

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigation() {
  const { student, params } = useRegister();
  const [differentVersion, setDifferentVersion] = useState(null);

  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent";

  useEffect(() => {
    if (params.version_android && !differentVersion) {
      if (Platform.OS === "android") {
        if (appJson.expo.version < params.version_android) {
          setDifferentVersion({
            appVersion: appJson.expo.version,
            currentVersion: params.version_android,
            store:
              "https://play.google.com/store/apps/details?id=com.mila.studentdashboard",
          });
        }
      } else {
        if (appJson.expo.version < params.version_ios) {
          setDifferentVersion({
            appVersion: appJson.expo.version,
            currentVersion: params.version_ios,
            store:
              "https://apps.apple.com/br/app/student-dashboard/id6443608497",
          });
        }
      }
    }
  }, [params]);

  if (differentVersion) {
    return <DifferentVersion data={differentVersion} />;
  }

  if (!student.registrationNumber) {
    return null;
  }

  return (
    <PaperProvider>
      <Tab.Navigator
        theme={theme}
        initialRouteName="Dashboard"
        activeColor={myTheme.colors.Present}
        inactiveColor={myTheme.colors.grayOpacity2}
        labeled={true}
        shifting={true}
        backBehavior="initialRoute"
        tabBarBadge={false}
        barStyle={{
          backgroundColor: "#f7f7f7",
          borderTopWidth: 1,
          borderTopColor: "#ccc",
        }}
      >
        {params.allow_partners.includes(
          student.registrationNumber.substring(0, 3)
        ) && (
          <Tab.Screen
            name="Partners"
            component={Partners}
            options={{
              tabBarLabel: "Partners",
              tabBarIcon: ({ color }) => (
                <Ionicons name="pricetags" color={color} size={22} />
              ),
            }}
          />
        )}
        <Tab.Screen
          name="Dashboard"
          component={DashboardDrawer}
          options={{
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="view-dashboard-outline"
                color={color}
                size={22}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarLabel: "Profile",
            tabBarColor: "rgb(0,255,0)",
            tabBarIcon: () =>
              student.imageUrl ? (
                <Image
                  source={{ uri: student.imageUrl }}
                  style={{ width: 28, height: 28, borderRadius: 28 }}
                />
              ) : (
                <Image
                  source={require("../../global/images/no-pic.png")}
                  style={{ width: 28, height: 28, borderRadius: 28 }}
                />
              ),
          }}
        />
      </Tab.Navigator>
    </PaperProvider>
  );
}
