//
//  SimpleExampleViewController.m
//  ExpandTableView
//
//  Created by Jack Kwok on 7/6/13.
//  Copyright (c) 2013 Jack Kwok. All rights reserved.
//

#import "SimpleExampleViewController.h"
#import "MVYSideMenuController.h"
#import "BaseViewController.h"

@interface SimpleExampleViewController ()

@end

@implementation SimpleExampleViewController
@synthesize expandTableView, dataModelArray;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        [self initializeSampleDataModel];
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [self.expandTableView setDataSourceDelegate:self];
    [self.expandTableView setTableViewDelegate:self];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void) initializeSampleDataModel {
    NSString *path = [[NSBundle mainBundle] pathForResource:@"dataPropertyList" ofType:@"plist"];
    self.dataModelArray = [[NSMutableArray alloc] initWithContentsOfFile:path];

}

#pragma mark - JKExpandTableViewDelegate
// return YES if more than one child under this parent can be selected at the same time.  Otherwise, return NO.
// it is permissible to have a mix of multi-selectables and non-multi-selectables.
- (BOOL) shouldSupportMultipleSelectableChildrenAtParentIndex:(NSInteger) parentIndex {
    return NO;
}

- (void) tableView:(UITableView *)tableView didSelectCellAtChildIndex:(NSInteger) childIndex withInParentCellIndex:(NSInteger) parentIndex {
    //[[self.dataModelArray objectAtIndex:parentIndex] setObject:[NSNumber numberWithBool:YES] atIndex:childIndex];
    //NSLog(@"data array: %@", self.dataModelArray);
    
    
    
    MVYSideMenuController *sideMenuController = [self sideMenuController];
	if (sideMenuController) {
		[sideMenuController closeMenu];
	}
    
    NSString *stringOfPath = [[[self.dataModelArray objectAtIndex:parentIndex] objectForKey:@"pathOfFile" ] objectAtIndex:childIndex];
    
    [[NSNotificationCenter defaultCenter]
     postNotificationName:@"slideMenuChildClicked"
     object:stringOfPath];
//    BaseViewController *baseController = [[BaseViewController alloc] init];
//    [baseController sideMenuClosed:[[[self.dataModelArray objectAtIndex:parentIndex] objectForKey:@"pathOfFile" ] objectAtIndex:childIndex]];
    
}

//- (void) tableView:(UITableView *)tableView didDeselectCellAtChildIndex:(NSInteger) childIndex withInParentCellIndex:(NSInteger) parentIndex {
//    [[self.dataModelArray objectAtIndex:parentIndex] setObject:[NSNumber numberWithBool:NO] atIndex:childIndex];
//    NSLog(@"data array: %@", self.dataModelArray);
//}
/*
- (UIColor *) foregroundColor {
    return [UIColor darkTextColor];
}

- (UIColor *) backgroundColor {
    return [UIColor grayColor];
}
*/
- (UIFont *) fontForParents {
    return [UIFont fontWithName:@"American Typewriter" size:16];
}

- (UIFont *) fontForChildren {
    return [UIFont fontWithName:@"American Typewriter" size:14];
}

/*
- (UIImage *) selectionIndicatorIcon {
    return [UIImage imageNamed:@"green_checkmark"];
}
*/
#pragma mark - JKExpandTableViewDataSource
- (NSInteger) numberOfParentCells {
    return [self.dataModelArray count];
}

- (NSInteger) numberOfChildCellsUnderParentIndex:(NSInteger) parentIndex {
    NSMutableArray *childArray = [[self.dataModelArray objectAtIndex:parentIndex] objectForKey:@"childrenName"];
    return [childArray count];
}

- (NSString *) labelForParentCellAtIndex:(NSInteger) parentIndex {
    return [[self.dataModelArray objectAtIndex:parentIndex] valueForKey:@"parentName"];
}

- (NSString *) labelForCellAtChildIndex:(NSInteger) childIndex withinParentCellIndex:(NSInteger) parentIndex {
    return [[[self.dataModelArray objectAtIndex:parentIndex] objectForKey:@"childrenName" ] objectAtIndex:childIndex];

}

- (BOOL) shouldDisplaySelectedStateForCellAtChildIndex:(NSInteger) childIndex withinParentCellIndex:(NSInteger) parentIndex {
    return NO;
}

- (UIImage *) iconForParentCellAtIndex:(NSInteger) parentIndex {
    return [UIImage imageNamed:@"arrow-icon"];
}

- (UIImage *) iconForCellAtChildIndex:(NSInteger) childIndex withinParentCellIndex:(NSInteger) parentIndex {
    return nil;
}

- (BOOL) shouldRotateIconForParentOnToggle {
    return YES;
}

@end
