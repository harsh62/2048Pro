//
//  BaseViewController.h
//  JKExpandTableViewSamples
//
//  Created by Harsh on 08/04/14.
//  Copyright (c) 2014 Jack Kwok. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface BaseViewController : UIViewController<UIWebViewDelegate>

-(void)sideMenuClosed:(NSString *)withPathOfWebViewFile;

@end
