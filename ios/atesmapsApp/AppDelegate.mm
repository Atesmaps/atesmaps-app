#import "AppDelegate.h"

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <GoogleMaps/GoogleMaps.h>
//#import <Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{

  //[FIRApp configure];
  
  [GMSServices provideAPIKey:@"AIzaSyDjc5LqCFtdMBxEmDPtMNmK9g1SB1e4pRA"];
  self.moduleName = @"atesmapsApp";

  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};


  // RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  // RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
  //                                                  moduleName:@"atesmapsApp"
  //                                           initialProperties:nil];

  // if (@available(iOS 13.0, *)) {
  //     rootView.backgroundColor = [UIColor systemBackgroundColor];
  // } else {
  //     rootView.backgroundColor = [UIColor whiteColor];
  // }

  // self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  // UIViewController *rootViewController = [UIViewController new];
  // rootViewController.view = rootView;
  // self.window.rootViewController = rootViewController;
  // [self.window makeKeyAndVisible];
  // return YES;
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}
- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
