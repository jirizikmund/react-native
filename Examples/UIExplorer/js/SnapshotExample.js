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
 * @providesModule SnapshotExample
 */
'use strict';

const React = require('react');
const ReactNative = require('react-native');
const requireNativeComponent = require('requireNativeComponent');

const {
  Animated,
  Image,
  StyleSheet,
  Text,
  takeSnapshot,
  View,
  NativeModules,
  Snapshot,
  findNodeHandle,
} = ReactNative;

const AnimatedSnapshotView = Animated.createAnimatedComponent(Snapshot.View);

class SnapshotViewExample extends React.Component {
  state = {
    snapshot: null,
    position: null,
    anim: new Animated.Value(0),
  };

  componentWillUnmount() {
    Snapshot.dispose(this.state.snapshot);
  }

  _measure = async () => {
    const nodeHandle = findNodeHandle(this._ref);
    const overlayNodeHandle = findNodeHandle(this._overlayRef);
    return new Promise((resolve, reject) => {
      NativeModules.UIManager.measureLayout(
        nodeHandle,
        overlayNodeHandle,
        reject,
        (x, y) => {
          resolve({ x, y });
        },
      );
    });
  };

  _takeSnapshot = async () => {
    if (this.state.snapshot) {
      Snapshot.dispose(this.state.snapshot);
      this.setState({ snapshot: null, position: null });
      this.state.anim.setValue(0);
      return;
    }

    const [snapshot, position] = await Promise.all([
      this._ref.snapshot(),
      this._measure(),
    ]);
    this.setState({ snapshot, position }, () => {
      Animated.timing(this.state.anim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    });
  };

  render() {
    const translateX = this.state.anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 200],
    });
    const scale = this.state.anim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 2],
    });
    return (
      <View ref={ref => this._overlayRef = ref}>
        <Text onPress={this._takeSnapshot} style={style.button}>
          Click to take a snapshot
        </Text>
        <Snapshot.Snapshotable
          ref={ref => this._ref = ref}
          style={[
            { width: 100, height: 100, backgroundColor: 'blue' },
            this.state.snapshot !== null && { opacity: 0 },
          ]}
        >
          <Image
            source={{
              uri: 'https://static.pexels.com/photos/126407/pexels-photo-126407.jpeg',
              width: 50,
              height: 50,
            }}
            style={{ flex: 1 }}
          />
          <View style={{ width: 40, height: 40, backgroundColor: 'yellow' }} />
        </Snapshot.Snapshotable>
        <View style={StyleSheet.absoluteFill}>
          {this.state.snapshotId !== null && this.state.position !== null
            ? <AnimatedSnapshotView
                snapshot={this.state.snapshot}
                style={{
                  position: 'absolute',
                  top: this.state.position.y,
                  left: this.state.position.x,
                  width: this.state.snapshot.width,
                  height: this.state.snapshot.height,
                  transform: [{ translateX }, { scale }],
                }}
              />
            : null}
        </View>
      </View>
    );
  }

  takeScreenshot = () => {
    takeSnapshot('window', { format: 'jpeg', quality: 0.8 }) // See UIManager.js for options
      .then(uri => this.setState({ uri }))
      .catch(error => alert(error));
  };
}

class ScreenshotExample extends React.Component {
  state = {
    uri: undefined,
  };

  render() {
    return (
      <View>
        <Text onPress={this.takeScreenshot} style={style.button}>
          Click to take a screenshot
        </Text>
        <Image style={style.image} source={{ uri: this.state.uri }} />
      </View>
    );
  }

  takeScreenshot = () => {
    takeSnapshot('window', { format: 'jpeg', quality: 0.8 }) // See UIManager.js for options
      .then(uri => this.setState({ uri }))
      .catch(error => alert(error));
  };
}

var style = StyleSheet.create({
  button: {
    marginBottom: 10,
    fontWeight: '500',
  },
  image: {
    flex: 1,
    height: 300,
    resizeMode: 'contain',
    backgroundColor: 'black',
  },
});

exports.title = 'Snapshot / Screenshot';
exports.description = 'API to capture images from the screen.';
exports.examples = [
  {
    title: 'Snapshot View',
    render() {
      return <SnapshotViewExample />;
    },
  },
  {
    title: 'Take screenshot',
    platform: 'ios',
    render() {
      return <ScreenshotExample />;
    },
  },
];
