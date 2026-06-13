import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  ChangePassword,
  CmsScreen,
  CreateProfile,
  DeleteAccount,
  EditProfile,
  ForgotPassword,
  Home,
  Login,
  Profile,
  ResetPassword,
  Signup,
  Splash,
  Verification,
  ChatScreen,
  MoreOptions,
  CreateGroup,
  GroupChatScreen,
  Settings,
  GamerDetail,
  ProfilSetup,
  ProfileSetupStepTwo,
  ProfileStepThree,
  Subscription,
  IntroScreen,
  BlockedUser,
  WelcomeScreen,
  Notification,
  GamingPreferences,
  ChangeEmail,
} from '../screens';
import BottomTab from './bottomTab';
import ImageController from '../permissions/imageController';

const Stack = createNativeStackNavigator();

function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerTitleAlign: 'center',
          fullScreenGestureEnabled: true,
        }}
        initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="BottomTab"
          component={BottomTab}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GamerDetail"
          component={GamerDetail}
          options={{
            headerShown: false,
            headerTitleAlign: 'center',
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="BlockedUser"
          component={BlockedUser}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Verification"
          component={Verification}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChangeEmail"
          component={ChangeEmail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ResetPassword"
          component={ResetPassword}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerShown: true,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="CreateProfile"
          component={CreateProfile}
          options={{
            headerShown: true,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="GamingPreferences"
          component={GamingPreferences}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />

        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="CmsScreen"
          component={CmsScreen}
          options={{
            headerShown: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="DeleteAccount"
          component={DeleteAccount}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GroupChatScreen"
          component={GroupChatScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CreateGroup"
          component={CreateGroup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Subscription"
          component={Subscription}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="IntroScreen"
          component={IntroScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProfileSetup"
          component={ProfilSetup}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Notification"
          component={Notification}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ProfileSetupTwo"
          component={ProfileSetupStepTwo}
          options={{
            headerShown: false,
            // gestureEnabled:false
          }}
        />
        <Stack.Screen
          name="ProfileStepThree"
          component={ProfileStepThree}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen
            name="ImageController"
            component={ImageController}
            options={{headerShown: false, presentation: 'transparentModal'}}
          />
          <Stack.Screen
            name="MoreOptions"
            component={MoreOptions}
            options={{headerShown: false, presentation: 'transparentModal'}}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Routes;
