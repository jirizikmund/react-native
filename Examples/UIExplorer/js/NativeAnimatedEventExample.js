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

const HEADER_HEIGHT = 200;
const NAVBAR_HEIGHT = 56;

const styles = StyleSheet.create({
  row: {
    padding: 10,
    margin: 10,
    backgroundColor: '#eee',
  },
  fill: {
    flex: 1,
  },
  image: {
    height: HEADER_HEIGHT,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#008ca6',
    height: HEADER_HEIGHT,
  },
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarBackground: {
    backgroundColor: '#008ca6',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  profile: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 8,
    position: 'absolute',
    top: HEADER_HEIGHT - 30,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
  },
  content: {
    paddingTop: HEADER_HEIGHT,
  },
  name: {
    marginTop: 78,
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
  static title = 'Native Animated.Event';
  static description = '';
  state = {
    scrollY: new Animated.Value(0),
  };

  componentDidMount() {
    setInterval(() => {
      const start = Date.now();
      // console.warn('lagStart');
      setTimeout(() => {
        while (Date.now() - start < 2500) {}
        // console.warn('lagStop');
      }, 1);
    }, 5000);
  }

  _renderContent() {
    return Array.from({ length: 30 }).map((_, i) =>
      <View key={i} style={styles.row}>
        <Text>{i}</Text>
      </View>
    );
  }

  render() {
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT - NAVBAR_HEIGHT],
      outputRange: [1, 0],
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, 100],
    });
    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, -200],
    });
    const navBarBackgroundOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_HEIGHT - NAVBAR_HEIGHT - 1, HEADER_HEIGHT - NAVBAR_HEIGHT],
      outputRange: [0, 0, 1],
    });
    const profileTranslate = this.state.scrollY.interpolate({
      inputRange: [0, 150, 151],
      outputRange: [0, -140, -141],
    });
    const profileScale = this.state.scrollY.interpolate({
      inputRange: [0, 150],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });
    const titleOpacity = this.state.scrollY.interpolate({
      inputRange: [0, 220, 250],
      outputRange: [0, 0, 1],
    });
    const titleTranslate = this.state.scrollY.interpolate({
      inputRange: [0, 220, 250],
      outputRange: [20, 20, 0],
      extrapolate: 'clamp',
    });
    return (
      <View style={[styles.fill, { overflow: 'hidden' }]}>
        <Animated.ScrollView
          style={styles.fill}
          contentContainerStyle={styles.content}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          <Text style={styles.name}>Doogy</Text>
          {this._renderContent()}
        </Animated.ScrollView>
        <Animated.View style={[styles.header, { transform: [{ translateY: headerTranslate }] }]}>
          <Animated.Image
            style={[styles.image, { opacity: imageOpacity, transform: [{ translateY: imageTranslate }] }]}
            resizeMode="cover"
            source={{ uri: 'http://vignette4.wikia.nocookie.net/happypasta/images/6/6c/Anime-kittens-cats-praying-496315.jpg/revision/latest?cb=20130914024839' }}
          />
        </Animated.View>
        <Animated.View style={[
          styles.profile,
          { transform: [{ translateY: profileTranslate }, { scale: profileScale }], }
        ]}>
          <Image
            resizeMode="cover"
            style={styles.profileImage}
            source={{ uri: 'http://ghk.h-cdn.co/assets/16/09/980x490/landscape-1457107485-gettyimages-512366437.jpg' }}
          />
        </Animated.View>
        <View style={styles.navbar}>
          <Animated.View style={[styles.navbarBackground, { opacity: navBarBackgroundOpacity }]} />
          <Image
            style={styles.backButton}
            source={{ uri: 'https://www.android.com/static/img/map/back-arrow.png' }}
          />
          <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ translateY: titleTranslate }] }]}>
            Doogy
          </Animated.Text>
          <View style={styles.rightButton} />
        </View>
      </View>
    );
  }
}

module.exports = EventExample;
