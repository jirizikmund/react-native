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
  Image,
} = ReactNative;

const NAVBAR_HEIGHT = 62;

const styles = StyleSheet.create({
  row: {
    padding: 10,
    margin: 10,
    backgroundColor: '#eee',
  },
  fill: {
    flex: 1,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008ca6',
  },
  content: {
    paddingTop: 54,
  },
  name: {
    marginTop: 8,
    marginBottom: 16,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    width: 20,
    height: 20,
    marginLeft: 16,
    tintColor: 'white',
  },
  rightButton: {
    width: 20,
    height: 20,
    marginRight: 16,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
});



class EventExample extends React.Component {
  static title = 'Collapsible Navbar';
  static description = '';
  state = {
    scrollY: new Animated.Value(0),
    showAnim: new Animated.Value(0),
  };

  _lastScrollYValue = 0;
  _scrollYValue = 0;
  _showAnimValue = 0;
  _scroll = 0;

  componentWillMount() {
    this.state.scrollY.addListener((ev) => {
      this._scroll = ev.value * -1;
      const value = this._scroll + this._showAnimValue;
      const diff = value - this._lastScrollYValue;
      this._lastScrollYValue = value;
      this._scrollYValue = Math.min(Math.max(this._scrollYValue + diff, -NAVBAR_HEIGHT), 0);
    });
    this.state.showAnim.addListener((ev) => {
      this._showAnimValue = ev.value;
      const value = this._scroll + this._showAnimValue;
      const diff = value - this._lastScrollYValue;
      this._lastScrollYValue = value;
      this._scrollYValue = Math.min(Math.max(this._scrollYValue + diff, -NAVBAR_HEIGHT), 0);
    });
  }

  _onScrollEnd = () => {
    const value = this._showAnimValue;
    const toValue = this._scrollYValue > -NAVBAR_HEIGHT / 2 || this._scroll > -NAVBAR_HEIGHT ?
      value + NAVBAR_HEIGHT :
      value - NAVBAR_HEIGHT;
    Animated.timing(this.state.showAnim, {
      toValue,
      duration: 200,
    }).start();
  };

  _renderContent() {
    return Array.from({ length: 30 }).map((_, i) =>
      <View key={i} style={styles.row}>
        <Text>{i}</Text>
      </View>
    );
  }

  render() {
    const navbarTranslate = Animated.clamp(
      Animated.add(
        this.state.showAnim,
        Animated.multiply(this.state.scrollY, -1),
      ),
      -NAVBAR_HEIGHT,
      0
    );
    return (
      <View style={[styles.fill, { overflow: 'hidden' }]}>
        <Animated.ScrollView
          style={styles.fill}
          contentContainerStyle={styles.content}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={this._onScrollEnd}
          onScrollEndDrag={this._onScrollEnd}
        >
          <Text style={styles.name}>Title</Text>
          {this._renderContent()}
        </Animated.ScrollView>
        <Animated.View style={[styles.navbar, { transform: [{ translateY: navbarTranslate }] }]}>
          <Image
            style={styles.backButton}
            source={{ uri: 'https://www.android.com/static/img/map/back-arrow.png' }}
          />
          <Text style={styles.title}>
            Doogy
          </Text>
          <View style={styles.rightButton} />
        </Animated.View>
      </View>
    );
  }
}

module.exports = EventExample;
