/**
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
 */

'use strict';

var React = require('react-native');
var {
  Alert,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  TextInput,
} = React;

var UIExplorerBlock = require('./UIExplorerBlock');

// corporate ipsum > lorem ipsum
var alertMessage = 'Credibly reintermediate next-generation potentialities after goal-oriented ' +
                   'catalysts for change. Dynamically revolutionize.';

/**
 * Simple alert examples.
 */
var SimpleAlertExampleBlock = React.createClass({

  getInitialState() {
    return {
      dialog1Opened: false,
      dialog2Opened: false,
    };
  },

  render: function() {
    return (
      <View>
        {
          this.state.dialog1Opened ?
          <Alert
            title="Alert Title"
            message={alertMessage}
            onDismiss={() => this.setState({dialog1Opened: false})}
          >
            <TextInput value="hello" />
            <Alert.Button text="OK" onPress={() => this.setState({dialog1Opened: false})} />
          </Alert> :
          null
        }
        {
          this.state.dialog2Opened ?
          <Alert
            title="Alert Title 2"
            message={alertMessage}
            onDismiss={() => this.setState({dialog2Opened: false})}
          >
            <Alert.Button text="Cancel" onPress={() => this.setState({dialog2Opened: false})} />
            <Alert.Button text="OK" onPress={() => this.setState({dialog2Opened: false})} />
          </Alert> :
          null
        }
        <TouchableHighlight
          style={styles.wrapper}
          onPress={() => this.setState({dialog1Opened: true})}>
          <View style={styles.button}>
            <Text>Alert with message and default button</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.wrapper}
          onPress={() => Alert.alert(
            'Alert Title',
            alertMessage,
            [
              {text: 'OK', onPress: () => console.log('OK Pressed!')},
            ]
          )}>
          <View style={styles.button}>
            <Text>Alert with one button</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.wrapper}
          onPress={() => Alert.alert(
            'Alert Title',
            alertMessage,
            [
              {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
              {text: 'OK', onPress: () => console.log('OK Pressed!')},
            ]
          )}>
          <View style={styles.button}>
            <Text>Alert with two buttons</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.wrapper}
          onPress={() => Alert.alert(
            'Alert Title',
            null,
            [
              {text: 'Foo', onPress: () => console.log('Foo Pressed!')},
              {text: 'Bar', onPress: () => console.log('Bar Pressed!')},
              {text: 'Baz', onPress: () => console.log('Baz Pressed!')},
            ]
          )}>
          <View style={styles.button}>
            <Text>Alert with three buttons</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight style={styles.wrapper}
          onPress={() => Alert.alert(
            'Foo Title',
            alertMessage,
            '..............'.split('').map((dot, index) => ({
              text: 'Button ' + index,
              onPress: () => console.log('Pressed ' + index)
            }))
          )}>
          <View style={styles.button}>
            <Text>Alert with too many buttons</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  },
});

var AlertExample = React.createClass({
  statics: {
    title: '<Alert>',
    description: 'Alerts display a concise and informative message ' +
    'and prompt the user to make a decision.',
  },
  render: function() {
    return (
      <UIExplorerBlock title={'Alert'}>
        <SimpleAlertExampleBlock />
      </UIExplorerBlock>
    );
  }
});

var styles = StyleSheet.create({
  wrapper: {
    borderRadius: 5,
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#eeeeee',
    padding: 10,
  },
});

module.exports = {
  AlertExample,
  SimpleAlertExampleBlock,
};
