import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./src/components/Login";
import Register from "./src/components/Register";
import ViewAdmin from "./src/components/Admin/ViewAdmin";
import ViewManager from "./src/components/Manager/ViewManager";
import ViewStaff from "./src/components/Staff/ViewStaff";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ViewAdmin" component={ViewAdmin} options={{ headerShown: false }}/>
        <Stack.Screen name="ViewManager" component={ViewManager} options={{ headerShown: false }}/>
        <Stack.Screen name="ViewStaff" component={ViewStaff} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
