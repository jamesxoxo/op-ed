import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import PlayerAudio from './PlayerAudio';
import PlayerButtons from './PlayerButtons';
import PlayerTimeline from './PlayerTimeline';
import PlayerVolume from './PlayerVolume';
import Queue from './Queue';
import QueueItem from './QueueItem';

const PlayerControls = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: #fff;
  border-top: 1px solid ${props => props.theme.primary};
`;

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progress: {
        timePassed: 0,
        seek: false,
      },
      duration: null,
      volume: 100,
      prevVolume: null,
    };

    this.setDuration = this.setDuration.bind(this);
    this.setProgress = this.setProgress.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.rewind = this.rewind.bind(this);
  }

  setDuration(duration) {
    this.setState({
      duration,
    });
  }

  setProgress(timePassed = 0, seek = false) {
    this.setState({
      progress: {
        timePassed,
        seek,
      },
    });
  }

  setVolume(volume) {
    this.setState({
      prevVolume: this.state.volume,
    });
    this.setState({
      volume,
    });
  }

  rewind() {
    if (this.state.progress.timePassed > 5 || !this.props.history.length) {
      this.setState({
        progress: {
          timePassed: 0,
          seek: true,
        },
      });
    } else {
      this.props.previousTune();
    }
  }

  render() {
    const tune = this.props.queue[0];

    return (
      <PlayerControls>
        {tune && (
          <PlayerAudio
            tune={tune}
            progress={this.state.progress}
            volume={this.state.volume}
            playing={this.props.playing}
            pauseTune={this.props.pauseTune}
            nextTune={this.props.nextTune}
            audioReady={this.audioReady}
            setDuration={this.setDuration}
            setProgress={this.setProgress}
          />
        )}
        <PlayerButtons
          playing={this.props.playing}
          progress={this.state.progress}
          audioReady={this.audioReady}
          previousTune={this.rewind}
          playTune={this.props.playTune}
          pauseTune={this.props.pauseTune}
          nextTune={this.props.nextTune}
        />
        <PlayerTimeline
          progress={this.state.progress}
          duration={this.state.duration}
          setProgress={this.setProgress}
        />
        <PlayerVolume
          volume={this.state.volume}
          prevVolume={this.state.prevVolume}
          setVolume={this.setVolume}
        />
        <QueueItem tune={tune} />
        <Queue
          queue={this.props.queue}
          removeTune={this.props.removeTune}
          skipToTune={this.props.skipToTune}
        />
      </PlayerControls>
    );
  }
}

Player.propTypes = {
  queue: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  playing: PropTypes.bool.isRequired,
  history: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  removeTune: PropTypes.func.isRequired,
  playTune: PropTypes.func.isRequired,
  pauseTune: PropTypes.func.isRequired,
  skipToTune: PropTypes.func.isRequired,
  previousTune: PropTypes.func.isRequired,
  nextTune: PropTypes.func.isRequired,
};

export default Player;
