import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import youtubeSearch from 'youtube-search';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay';
import faPlus from '@fortawesome/fontawesome-free-solid/faPlus';
import { YOUTUBE_KEY } from './util/constants';
import PlayerPlayPauseButton from './PlayerPlayPauseButton';
import Button from './theme/Button';

const Tune = styled.div`
  display: flex;
  flex-wrap: none;
  align-items: center;
`;

const Text = styled.span`
  flex-grow: 1;
`;

const Buttons = styled.span`
  display: flex;
  margin-left: 0.5rem;
`;

class AnimeTune extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tune: null,
    };

    this.createTuneObject = this.createTuneObject.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handlePlayClick = this.handlePlayClick.bind(this);
  }

  componentDidMount() {
    const { title, anime, type, number } = this.props;
    const options = {
      key: YOUTUBE_KEY.replace('lol', ''),
      maxResults: 3,
      type: 'video',
      videoEmbeddable: true,
    };
    let strict = true;

    // Search for the specific track title with artist
    youtubeSearch(title, options)
      .then(result => {
        if (result.results.length) {
          return result;
        }

        strict = false;

        // Search for OP/ED
        return youtubeSearch(`"${anime.english}" ${type} ${number}`, options);
      })
      .then(result => result.results)
      .then(result => {
        if (!strict) {
          // Find video titles that contain the name of the specific anime
          const matched = result.filter(
            video =>
              video.title.toLowerCase().includes(anime.english.toLowerCase()) ||
              video.title.toLowerCase().includes(anime.japanese.toLowerCase()),
          );

          if (matched.length) {
            return matched;
          }

          return [result[0]];
        }

        return result;
      })
      .then(result => {
        // @Todo: Check that these words aren't actually in the anime title
        const banned = ['remix', 'cover'];

        return result.filter(
          video =>
            !banned.some(string => video.title.toLowerCase().includes(string)),
        );
      })
      .then(result => {
        this.setState({
          tune: result[0],
        });
      });
  }

  createTuneObject() {
    const { malId, image, anime, title } = this.props;
    const { tune } = this.state;

    return {
      youtubeId: tune.id,
      malId,
      image,
      anime: anime.english,
      title,
    };
  }

  handlePlayClick() {
    const { addTune } = this.props;

    addTune(this.createTuneObject(), true);
  }

  handleAddClick() {
    const { addTune } = this.props;

    addTune(this.createTuneObject());
  }

  render() {
    const {
      type,
      number,
      title,
      queue,
      loaded,
      playing,
      togglePlay,
    } = this.props;
    const { tune } = this.state;
    const text = `${type}${number}: ${title}`;

    if (!tune) {
      return text;
    }

    return (
      <Tune>
        <Text title={tune.title}>{text}</Text>
        <Buttons>
          {(queue[0] && queue[0].youtubeId) === tune.id ? (
            <PlayerPlayPauseButton
              loaded={loaded}
              playing={playing}
              togglePlay={togglePlay}
            />
          ) : (
            <Button aria-label="Play" onClick={this.handlePlayClick}>
              <FontAwesomeIcon icon={faPlay} />
            </Button>
          )}
          <Button onClick={this.handleAddClick}>
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </Buttons>
      </Tune>
    );
  }
}
AnimeTune.propTypes = {
  type: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  anime: PropTypes.shape().isRequired,
  image: PropTypes.string.isRequired,
  malId: PropTypes.number.isRequired,
  queue: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  loaded: PropTypes.bool.isRequired,
  playing: PropTypes.bool.isRequired,
  togglePlay: PropTypes.func.isRequired,
  addTune: PropTypes.func.isRequired,
};

export default AnimeTune;
