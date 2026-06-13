import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Firebase
import UserNotifications

@main
// class AppDelegate: RCTAppDelegate {
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    self.moduleName = "GamerMeet"
    self.dependencyProvider = RCTAppDependencyProvider()

    // You can add your custom initial props in the dictionary below.
    // They will be passed down to the ViewController used by React Native.
    self.initialProps = [:]
    
    FirebaseApp.configure()

     // ✅ UserNotification setup
     let center = UNUserNotificationCenter.current()
     center.delegate = self
     center.requestAuthorization(options: [.alert, .sound, .badge]) { granted, error in
       if let error = error {
         print("Notification authorization error: \(error.localizedDescription)")
       }
     }

     // ✅ Register for APNs
     application.registerForRemoteNotifications()

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  // ✅ Override this to link APNs token to FCM (required for token generation)
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
      let tokenParts = deviceToken.map { String(format: "%02.2hhx", $0) }
      let token = tokenParts.joined()
      print("✅ APNs token registered: \(token)")  // Log APNs token
      Messaging.messaging().apnsToken = deviceToken  // Link to FCM
      //super.application(application, didRegisterForRemoteNotificationsWithDeviceToken: deviceToken)
  }

  // ✅ Implement this to get FCM token (prints to console and can send to your server/JS)
   func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
     print("✅ FCM Token generated: \(fcmToken ?? "No token")")
     // TODO: Send this token to your React Native JS side via a bridge or RNFirebase's getToken()
     // In JS: import messaging from '@react-native-firebase/messaging'; messaging.getToken();
   }
  override func applicationDidBecomeActive(_ application: UIApplication) {
      UIApplication.shared.applicationIconBadgeNumber = 0
    }
  
  override func application(
    _ application: UIApplication,
    didFailToRegisterForRemoteNotificationsWithError error: Error
  ) {
    print("didFailToRegisterForRemoteNotificationsWithError -------- \(error.localizedDescription)")
  }
 
   
    

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}
