//
//  BaseViewController.m
//  JKExpandTableViewSamples
//
//  Created by Harsh on 08/04/14.
//  Copyright (c) 2014 Jack Kwok. All rights reserved.
//

#import "BaseViewController.h"
#import "MVYSideMenuController.h"

@interface BaseViewController ()
- (IBAction)openMenu:(id)sender;

@end

@implementation BaseViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)openMenu:(id)sender {
    
	MVYSideMenuController *sideMenuController = [self sideMenuController];
	if (sideMenuController) {
		[sideMenuController openMenu];
	}
}
@end
