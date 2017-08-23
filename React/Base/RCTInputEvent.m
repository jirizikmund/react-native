/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "RCTInputEvent.h"

@implementation RCTInputEvent
{
  NSArray *_arguments;
}

@synthesize eventName = _eventName;
@synthesize viewTag = _viewTag;
@synthesize coalescingKey = _coalescingKey;

- (instancetype)initWithName:(NSString *)name viewTag:(NSNumber *)viewTag arguments:(NSArray *)arguments
{
  if (self = [super init]) {
    _eventName = name;
    _viewTag = viewTag;
    _arguments = arguments;
  }
  return self;
}

- (NSArray *)arguments
{
  return _arguments;
}

- (BOOL)canCoalesce
{
  return NO;
}

RCT_NOT_IMPLEMENTED(+ (NSString *)moduleDotMethod);
RCT_NOT_IMPLEMENTED(- (id<RCTEvent>)coalesceWithEvent:(id<RCTEvent>)newEvent);

@end
