/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * The examples provided by Facebook are for non-commercial testing and
 * evaluation purposes only.
 *
 * Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  View,
  Text,
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
} = ReactNative;

const styles = StyleSheet.create({
  row: {
    padding: 10,
    zIndex: 1,
  },
  block: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
  },
});

class EventExample extends React.Component {
  static title = '<ScrollView>';
  static description = 'Component that enables scrolling through child components.';
  state = {
    scrollY: new Animated.Value(0),
  };

  componentDidMount() {
    setInterval(() => {
      const start = Date.now();
      console.warn('lagStart');
      setTimeout(() => {
        while(Date.now() - start < 2500) {}
        console.warn('lagStop');
      }, 1);
    }, 5000);
  }

  render() {
    const testOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 300],
      outputRange: [1, 0.5],
    });
    return (
      <Animated.ScrollView
        style={{ flex: 1, backgroundColor: 'blue' }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={{ height: 5000 }}>
          <Animated.View
            style={{
              opacity: testOpacity,
              width: 400,
              height: 400,
              backgroundColor: 'red',
            }}
          />
        </View>
      </Animated.ScrollView>
    );
  }
}

module.exports = EventExample;
