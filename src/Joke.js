import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import './Joke.css';
class Joke extends Component {
  constructor(props) {
    super(props);

    this.handleUpVote = this.handleUpVote.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
  }

  handleUpVote() {
    this.props.upVote(this.props.id);
  }
  handleDownVote() {
    this.props.downVote(this.props.id);
  }
  getColor() {
    if (this.props.score >= 15) {
      return '#4CAF50';
    } else if (this.props.score >= 12) {
      return '#8BC34A';
    } else if (this.props.score >= 9) {
      return '#CDDC39';
    } else if (this.props.score >= 6) {
      return '#FFEB3B';
    } else if (this.props.score >= 3) {
      return '#FFC107';
    } else if (this.props.score >= 0) {
      return '#FF9800';
    } else {
      return '#f44336';
    }
  }

  getEmoji() {
    if (this.props.score >= 15) {
      return 'em em-rolling_on_the_floor_laughing';
    } else if (this.props.score >= 12) {
      return 'em em-laughing';
    } else if (this.props.score >= 9) {
      return 'em em-smiley';
    } else if (this.props.score >= 6) {
      return 'em em-slightly_smiling_face';
    } else if (this.props.score >= 3) {
      return 'em em-neutral_face';
    } else if (this.props.score >= 0) {
      return 'em em-confused';
    } else {
      return 'em em-angry';
    }
  }

  render() {
    return (
      <motion.li
        className='Joke'
        layout
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
      >
        <div className='Joke-controls'>
          <button className='up' onClick={this.handleUpVote}>
            <FontAwesomeIcon icon={faThumbsUp} />
          </button>
          <span
            className='Joke-score'
            style={{ border: `solid 3px ${this.getColor()}` }}
          >
            {this.props.score}
          </span>
          <button className='down' onClick={this.handleDownVote}>
            <FontAwesomeIcon icon={faThumbsDown} />
          </button>
        </div>
        <p className='Joke-text'>{this.props.joke}</p>
        <div className='Joke-emoji'>
          <i
            className={this.getEmoji()}
            aria-label='ROLLING ON THE FLOOR LAUGHING'
          ></i>
        </div>
      </motion.li>
    );
  }
}
export default Joke;
