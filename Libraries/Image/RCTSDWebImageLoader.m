//
//  RCTSDWebImageLoader.m
//  RCTImage
//
//  Created by Janic Duplessis on 2017-10-12.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "RCTSDWebImageLoader.h"

#import <stdatomic.h>
#import <SDWebImage/SDWebImageManager.h>

#import <React/RCTUtils.h>

@implementation RCTSDWebImageLoader

RCT_EXPORT_MODULE()

- (BOOL)canLoadImageURL:(NSURL *)requestURL
{
  return (
    [requestURL.scheme isEqualToString:@"http"] ||
    [requestURL.scheme isEqualToString:@"https"]
  // SDWebImage doesn't load gifs properly so use RN default image loader.
  ) && ![requestURL.pathExtension isEqualToString:@"gif"];
}

- (BOOL)requiresScheduling
{
  // Don't schedule this loader on the URL queue so we can load the
  // local assets synchronously to avoid flickers.
  return NO;
}

- (BOOL)shouldCacheLoadedImages
{
  // UIImage imageNamed handles the caching automatically so we don't want
  // to add it to the image cache.
  return NO;
}

- (RCTImageLoaderCancellationBlock)loadImageForURL:(NSURL *)imageURL
                                              size:(CGSize)size
                                             scale:(CGFloat)scale
                                        resizeMode:(RCTResizeMode)resizeMode
                                   progressHandler:(RCTImageLoaderProgressBlock)progressHandler
                                partialLoadHandler:(RCTImageLoaderPartialLoadBlock)partialLoadHandler
                                 completionHandler:(RCTImageLoaderCompletionBlock)completionHandler
{
  __block atomic_bool cancelled = ATOMIC_VAR_INIT(NO);
  [SDWebImageManager.sharedManager loadImageWithURL:imageURL options:SDWebImageCacheMemoryOnly progress:^(NSInteger receivedSize, NSInteger expectedSize, NSURL * _Nullable targetURL) {
    if (progressHandler) {
      progressHandler(receivedSize, expectedSize);
    }
  } completed:^(UIImage * _Nullable image, NSData * _Nullable data, NSError * _Nullable error, SDImageCacheType cacheType, BOOL finished, NSURL * _Nullable url) {
    RCTExecuteOnMainQueue(^{
      if (error) {
        completionHandler(error, nil);
        return;
      }
      
      if (finished) {
        completionHandler(nil, image);
      }
    });
  }];
  
  return ^{
    atomic_store(&cancelled, YES);
  };
}

@end
