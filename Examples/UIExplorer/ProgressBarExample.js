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
 * @flow
 */
'use strict';

const ProgressBar = require('ProgressBar');
const React = require('React');
const UIExplorerBlock = require('UIExplorerBlock');
const UIExplorerPage = require('UIExplorerPage');

const TimerMixin = require('react-timer-mixin');

const MovingBar = React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    return {
      progress: 0,
    };
  },

  componentDidMount() {
    this.setInterval(
      () => {
        const progress = (this.state.progress + 0.02) % 1;
        this.setState({progress});
      }, 50
    );
  },

  render() {
    return <ProgressBar progress={this.state.progress} {...this.props} />;
  },
});

exports.title = '<ProgressBar>';
exports.description = 'Horizontal bar to show the progress of some operation.';
exports.displayName = 'ProgressBarExample';
exports.examples = [{
  title: 'ProgressBar',
  render() {
    return <MovingBar />;
  },
}, {
  title: 'Blue ProgressBar',
  render() {
    return <MovingBar color="blue" />;
  },
}, {
  title: 'Indeterminate',
  render() {
    return <ProgressBar indeterminate />;
  },
  platform: 'android',
}];
