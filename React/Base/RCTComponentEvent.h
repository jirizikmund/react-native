/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <React/RCTEventDispatcher.h>

/**
 * Dumb RCTEvent for input events.
 * Input events don't use RCTEvent but we have to create one to send to the
 * listeners.
 */
@interface RCTComponentEvent : NSObject<RCTEvent>

- (instancetype)initWithName:(NSString *)name body:(NSDictionary *)body;

@end
