//
//  JKAppDelegate.m
//  ExpandTableView
//
//  Created by Jack Kwok on 7/5/13.
//  Copyright (c) 2013 Jack Kwok. All rights reserved.
//

#import "JKAppDelegate.h"
#import "SimpleExampleViewController.h"
#import "BaseViewController.h"
#import "MVYSideMenuController.h"


@implementation JKAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    // Override point for customization after application launch.
    SimpleExampleViewController * tableController = nil;
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
         tableController =  [[SimpleExampleViewController alloc] initWithNibName:@"SimpleExampleViewControllerPad" bundle:nil];
    } else {
         tableController =  [[SimpleExampleViewController alloc] initWithNibName:@"SimpleExampleViewController" bundle:nil];
    }

    BaseViewController *baseViewController = nil;
        if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
             baseViewController =  [[BaseViewController alloc] initWithNibName:@"BaseViewControllerPad" bundle:nil];
        } else {
             baseViewController =  [[BaseViewController alloc] initWithNibName:@"BaseViewController" bundle:nil];
       }
    
	MVYSideMenuOptions *options = [[MVYSideMenuOptions alloc] init];
	options.contentViewScale = 1.0;
	options.contentViewOpacity = 0.05;
	options.shadowOpacity = 0.0;
	MVYSideMenuController *sideMenuController = [[MVYSideMenuController alloc] initWithMenuViewController:tableController
																					contentViewController:baseViewController
																								  options:options];
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {

	sideMenuController.menuFrame = CGRectMake(0, 0, self.window.bounds.size.width/2, self.window.bounds.size.height);
    }
    
    
    
    self.window.rootViewController = sideMenuController;
    
    [self.window makeKeyAndVisible];
    NSSetUncaughtExceptionHandler(&uncaughtExceptionHandler);
    return YES;
}

void uncaughtExceptionHandler(NSException *exception) {
    NSLog(@"CRASH: %@", exception);
    NSLog(@"Stack Trace: %@", [exception callStackSymbols]);
    // Internal error reporting
}

- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
