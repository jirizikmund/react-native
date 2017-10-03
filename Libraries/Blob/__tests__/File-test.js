/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @format
 */
'use strict';

jest
  .unmock('File')
  .unmock('Blob')
  .unmock('BlobManager')
  .unmock('../__mocks__/BlobModule')
  .setMock('NativeModules', {
    BlobModule: require('../__mocks__/BlobModule'),
  });

var File = require('File');

describe('File', function() {
  it('should create empty file', () => {
    const file = new File();
    expect(file).toBeInstanceOf(File);
    expect(file.data.offset).toBe(0);
    expect(file.data.size).toBe(0);
    expect(file.size).toBe(0);
    expect(file.type).toBe('');
    expect(file.name).toBe('');
    expect(file.lastModified).toBe(0);
  });

  it('should create empty file with type', () => {
    const file = new File([], {type: 'image/jpeg'});
    expect(file.type).toBe('image/jpeg');
  });
});
