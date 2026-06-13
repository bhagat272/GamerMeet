/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  Dimensions,
  Image,
  ImageStyle,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { ChatList, Connection, Explore, Home, Profile } from '../screens';
import imagePath from '../theme/imagePath';

const Tabs = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const DeviceW = Dimensions.get('screen').width;

interface RenderTabIconsProps {
  icon: any;
  activeIcon: any;
  isFocused: boolean;
  name: string;
  isImage?: boolean;
}
function getTabIconSize() {
  if (DeviceW <= 340) {
    return 40;
  }
  if (DeviceW <= 375) {
    return 45;
  }
  if (Platform.OS === 'android' && Platform.Version >= 35) {
    return 50;
  }
  return 45;
}

const getBottomIconStyle = (size: number): ImageStyle => ({
  height: size,
  width: size,
  justifyContent: 'center',
  alignItems: 'center',
  top:
    Platform.OS === 'android' && Platform.Version >= 35
      ? 0
      : -Math.floor(size / 3),
});
const RenderTabIcons: React.FC<RenderTabIconsProps> = ({
  isFocused,
  icon,
  activeIcon,
  name,
}) => {
  const iconSize = getTabIconSize();
  return (
    <View>
      <Image
        source={isFocused ? activeIcon : icon}
        resizeMode="contain"
        style={
          Platform.OS === 'android'
            ? getBottomIconStyle(iconSize)
            : styles.bottomIcons
        }
      />
      {Platform.OS === 'android' && Platform.Version >= 35 && (
        <View style={{height: 30}} />
      )}
    </View>
  );
};

// Stack Navigators
function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeTab"
        component={Home}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ExploreStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ExploreTab"
        component={Explore}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ConnectionStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ConnectionTab"
        component={Connection}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChatTab"
        component={ChatList}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileTab"
        component={Profile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

// ✅ BottomTab with keyboard fix
const BottomTab: React.FC = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 80,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: '#32377D',
          borderRadius: 50,
          marginHorizontal: 35,
          paddingHorizontal: 12,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowOffset: {width: 0, height: 3},
          shadowRadius: 6,
          elevation: 5,
          position: 'absolute',
          bottom: Platform.OS === 'ios' ? 30 : 20,
          // bottom: Platform.OS === 'ios' ? 40 : 20,
          borderColor: 'rgb(112, 120, 230)',
          borderTopWidth: 3,
          borderLeftWidth: 3,
          borderRightWidth: 3,
          borderBottomWidth: 3,
          opacity: 0.85,
        },
      }}
      initialRouteName="Home">
      <Tabs.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <RenderTabIcons
              icon={imagePath.home_icon}
              activeIcon={imagePath.active_home_icon}
              name=""
              isFocused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Explore"
        component={ExploreStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <RenderTabIcons
              icon={imagePath.explore_tab_icon}
              activeIcon={imagePath.active_explore_tab_icon}
              name=""
              isFocused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Connection"
        component={ConnectionStackNavigator}
        options={{
          tabBarLabel: '',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({focused}) => (
            <RenderTabIcons
              icon={imagePath.connection_tab}
              activeIcon={imagePath.connection_active_tab}
              name=""
              isFocused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <RenderTabIcons
              icon={imagePath.chat_tab}
              activeIcon={imagePath.active_chat_tab}
              name=""
              isFocused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({focused}) => (
            <RenderTabIcons
              icon={imagePath.profile_tab}
              activeIcon={imagePath.profile_tab_active}
              name=""
              isFocused={focused}
            />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default BottomTab;

const styles = StyleSheet.create({
  bottomIcons: {
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
});
