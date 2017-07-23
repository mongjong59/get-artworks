import React, { Component } from 'react';
import './App.css';

const HULU_ASSET_HOST = "http://assets.huluim.com"
const huluMovieArtworkUrl = title => {
  let processedTitle = title.replace(/:|'|,|\./g,"")
  processedTitle = processedTitle.toLowerCase().replace(/ /g,"_")
  const part = ('_' + processedTitle).repeat(2)
  return `${HULU_ASSET_HOST}/movies/movie${part}.jpg`
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { query: "" }
  }

  handleSubmit = e => {
    e.preventDefault()
    const query = document.getElementById("query").value
    this.setState({ query: query })
  }

  render() {
    return (
      <div className="App">
        <article>
      		<h3>Get Artwork</h3>
      		<form onSubmit={this.handleSubmit}>
            <div>
        			<select name="entity" id="entity">
                <option value="movie">Movie</option>
                {/*
        				  <option value="tvSeason">TV Show</option>
                  <option value="shortFilm">Short Film</option>
                  <option value="album">Album</option>
                  <option value="id">Apple ID (Movie)</option>
                  <option value="idAlbum">Apple ID (Album)</option>
                */}
                {/*
                  <option value="musicVideo">Music Video (may not work)</option>
                  <option value="ebook">iBook</option>
                  <option value="audiobook">Audiobook</option>
        				  <option value="software">App</option>
                  <option value="podcast">Podcast</option>
                */}
        			</select>
        			<select name="country" id="country">
        				<option value="us">USA</option>
        				{/* <option value='gb'>UK</option> */}
        			</select>
            </div>
            <div>
              <input type="text" id="query" />
              <input type="submit" value="Find" />
            </div>
      		</form>


          {
            this.state.query &&
              <div>
                <img
                  src={huluMovieArtworkUrl(this.state.query)}
                  alt={this.state.query} height="600"
                />
              </div>
          }

        </article>
      </div>
    );
  }
}

export default App;
