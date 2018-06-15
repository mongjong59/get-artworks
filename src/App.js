import React, { Component } from "react"
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
import getMuiTheme from "material-ui/styles/getMuiTheme"
import { amber500 } from "material-ui/styles/colors"
import RaisedButton from "material-ui/RaisedButton"
import TextField from "material-ui/TextField"
import LazyLoad from "react-lazyload"
import "./App.css"

const HULU_ASSET_HOST = "http://assets.huluim.com"
const huluMovieArtworkUrl = title => {
  let processedTitle = title.replace(/:|'|,|\./g,"")
  processedTitle = processedTitle.toLowerCase().replace(/ /g,"_")
  const part = ('_' + processedTitle).repeat(2)
  return `${HULU_ASSET_HOST}/movies/movie${part}.jpg`
}

const ITUNES_SEARCH_API_BASE = "https://itunes.apple.com/search"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { entries: [] }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({ entries: [] })
    const input = document.getElementById("input").value

    if (input.startsWith("http")) {
      const matchResults = input.match(/(^https?:\/\/.+)?(https?:\/\/.+.(jpg|png))/)
      if (matchResults) {
        let artworkUrl = matchResults[2]
        const extentions = ["jpg", "png"]
        extentions.forEach((e) => {
          let regExp = new RegExp(`(_w\\d{3}|_SL1500_).${e}$`)
          artworkUrl = artworkUrl.replace(regExp, `_original.${e}`)
          regExp = new RegExp(`_small.${e}$`)
          artworkUrl = artworkUrl.replace(regExp, `_large.${e}`)
        })
        this.setState({ entries: [{ artworkUrl }] })
      } else { alert("Invalid URL") }
    } else {
      const capitalize = str => (str.charAt(0).toUpperCase() + str.slice(1))
      const titleCase = str => {
        let words = str.split(" ")
        const nonPrincipalWords = [
          "a", "an", "the",
          "and", "or", "but", "nor", "yet", "so",
          "as", "at", "by", "for", "in", "mid", "of", "off", "on", "per", "pro", "qua", "to", "via", "vs."
        ]
        words = words.map((word, i) => (
          i === 0 || nonPrincipalWords.indexOf(word) > 0 ? word :capitalize(word)
        ))
        return capitalize(words.join(" "))
      }
      const huluEntry = {
        title: titleCase(input), artworkUrl: huluMovieArtworkUrl(input)
      }
      let iTunesURL = new URL(ITUNES_SEARCH_API_BASE)
      const searchParams = { "term": input, media: "movie" }
      Object.keys(searchParams).forEach(key => {
        iTunesURL.searchParams.append(key, searchParams[key])
      })
      fetch(iTunesURL).then((res) => {
        console.log(res)
        res.json().then((json) => {
          console.log(json)
          const entries = json.results.map((result => {
            const title = result.trackName
            const artist = result.artistName
            const year = result.releaseDate.slice(0, 4)
            const artworkUrl = result.artworkUrl100.replace(
              /100x100bb\.jpg$/, "100000x100000-999.jpg"
            )
            return { title, artist, year, artworkUrl }
          }))
          entries.unshift(huluEntry)
          this.setState({ entries })
        })
      })
    }
  }

  render() {
    const muiTheme = getMuiTheme({
      fontFamily: "inherit",
      palette: {
        primary1Color: amber500
      },
      raisedButton: {
        color: "rgba(158, 158, 158, 0.2)",
        fontSize: "1.3rem",
        fontWeight: "600"
      }
    })

    return (
      <MuiThemeProvider {...{ muiTheme }}>
        <div className="app">
          <nav>
        		<form onSubmit={this.handleSubmit}>
              <TextField id="input" style={{ width: 800 }} />
              <RaisedButton label="Get" type="submit" />
        		</form>
          </nav>
          <div className="results">
            {
              this.state.entries.map((entry, i) => (
                <div style={{ display: "inline-block", width: "30%", overflow: "hidden", verticalAlign: "top" }} key={i}>
                  <div className="line-1">
                    <a href={entry.artworkUrl}>{entry.title}</a>
                  </div>
                  <div className="line-2">
                    {entry.artist} {entry.year && `(${entry.year})`}
                  </div>
                  <LazyLoad height={600} >
                    <img src={entry.artworkUrl} alt={entry.title} height="600" />
                  </LazyLoad>
                </div>
              ))
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
