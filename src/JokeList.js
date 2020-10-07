import React, { Component } from 'react';
import Joke from './Joke';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLaughSquint } from '@fortawesome/free-regular-svg-icons';
import './JokeList.css';

class JokeList extends Component {
  static defaultProps = {
    numJokes: 10,
  };
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(localStorage.getItem('jokes') || '[]'),
      isLoading: false,
    };
    this.getMoreJokes = this.getMoreJokes.bind(this);
    this.handleScoreUp = this.handleScoreUp.bind(this);
    this.handleScoreDown = this.handleScoreDown.bind(this);
  }

  async fetchDadJokes() {
    // new array for new jokes
    const newJokes = [];
    this.setState({ isLoading: true });
    // fetch joke and return data
    async function fetchJoke() {
      const response = await fetch('https://icanhazdadjoke.com', {
        headers: {
          Accept: 'application/json',
        },
      });
      return await response.json();
    }
    // loop to desired amount of jokes
    while (newJokes.length < this.props.numJokes) {
      let data = await fetchJoke();
      // if duplicate joke, keep fetching
      if (this.state.jokes.some((joke) => joke.id === data.id)) {
        data = await fetchJoke();
        console.log('duplicate:', data.joke);
      } else {
        newJokes.push({ ...data, score: 0 }); // add jokes with score props to new array
      }
    }
    // add new jokes to state
    this.setState((prevState) => ({
      jokes: [...prevState.jokes, ...newJokes],
      isLoading: false,
    }));
    // if jokes local storage exists, add new ones to existing local storage
    if (localStorage.getItem('jokes')) {
      const newStorage = JSON.parse(localStorage.getItem('jokes'));
      newStorage.push(...newJokes);
      localStorage.setItem('jokes', JSON.stringify(newStorage));
    } else {
      localStorage.setItem('jokes', JSON.stringify(newJokes)); // add initial jokes to local storage;
    }
  }

  componentDidMount() {
    // if joke state length is less then 10 on page load, fetch jokes
    if (this.state.jokes.length < 10) {
      this.getMoreJokes();
    }
  }
  getMoreJokes() {
    this.fetchDadJokes();
  }
  handleScoreUp(id) {
    const updatedJokes = this.state.jokes.map((joke) => {
      if (joke.id === id) {
        return { ...joke, score: joke.score + 1 };
      }
      return joke;
    });
    this.setState({ jokes: updatedJokes }, () => {
      localStorage.setItem('jokes', JSON.stringify(updatedJokes));
    });
  }

  handleScoreDown(id) {
    const updatedJokes = this.state.jokes.map((joke) => {
      if (joke.id === id) {
        return { ...joke, score: joke.score - 1 };
      }
      return joke;
    });
    this.setState({ jokes: updatedJokes }, () => {
      localStorage.setItem('jokes', JSON.stringify(updatedJokes));
    });
  }

  render() {
    const newJokes = [...this.state.jokes];
    const sortedJokes = newJokes
      .sort((a, b) => b.score - a.score)
      .map((item) => (
        <Joke
          joke={item.joke}
          key={item.id}
          score={item.score}
          id={item.id}
          upVote={this.handleScoreUp}
          downVote={this.handleScoreDown}
        />
      ));

    const jokeList = this.state.isLoading ? (
      <div className='JokeList-loader'>
        <FontAwesomeIcon className='spinner' icon={faLaughSquint} />
        <p>Getting jokes!</p>
      </div>
    ) : (
      <div className='JokeList'>
        <div className='JokeList-sidebar'>
          <div>
            <h1 className='JokeList-title'>Dad Jokes</h1>
            <FontAwesomeIcon className='logo' icon={faLaughSquint} />
            <button onClick={this.getMoreJokes}>Get more jokes!</button>
            <p className='JokeList-counter'>
              Jokes Generated: {this.state.jokes.length}
            </p>
          </div>
        </div>
        <ul className='JokeList-list'>{sortedJokes}</ul>
      </div>
    );

    return jokeList;
  }
}

export default JokeList;
