import React from "react";
import axios from "axios";
import Nominees from "./nominees";
import * as bulmaToast from "bulma-toast";

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      movieData: {},
      search: "hugo",
      movieList: [],
      nomineeList: [],
    };

    this.removalMovie = {};

    window.addEventListener('resize', this.paddingChange);
  }

  componentDidMount() {
    this.fetchMovies();
  }

  fetchMovies() {
    axios
      .get(
        `http://www.omdbapi.com/?i=tt3896198&apikey=c7f6062c&s=${this.state.search}&plot=full`
      )
      .then((res) => res.data)
      .then((res) => {
        this.setState({ movieData: res, movieList: res.Search }, () => {
          this.setNomination();
        });
      });
  }

  setMovieName(event) {
    const name = event.target.value;
    this.setState({ search: name }, () => {
      this.fetchMovies();
    });
  }

  setNomination() {
    if (this.state.movieList != undefined) {
      const movies = this.state.movieList.map((movie) => {
        if (
          this.state.nomineeList.findIndex(
            (element) => element.Title === movie.Title
          ) === -1
        ) {
          movie.nomination = false;
        } else {
          movie.nomination = true;
        }

        return movie;
      });
      this.setState({ movieList: movies });
    }
  }

  addNominee(event, movie) {
    const updatenom = [...this.state.nomineeList, movie];
    const updatemovies = this.state.movieList.map((element) => {
      if (movie.Title === element.Title) {
        element.nomination = true;
      }
      return element;
    });

    this.setState({ nomineeList: updatenom, movieList: updatemovies }, () => {
      this.paddingChange();
      
      if (this.state.nomineeList.length === 5) {
        bulmaToast.toast({
          message: "You have reached the 5 nominee limit",
          type: "is-danger",
        });

        
      }
    });

    event.target.disabled = true;
  }


  paddingChange() {
    const styles = window.getComputedStyle(document.querySelector('footer'));
      document.getElementById('searchContainer').style.marginBottom = styles.getPropertyValue('height');

  }





  removeNominee = (movie) => {
    const updatenom = this.state.nomineeList.filter(
      (element) => element.Title !== movie.Title
    );
    const updatemovies = this.state.movieList.map((element) => {
      if (movie.Title === element.Title) {
        element.nomination = false;
      }
      return element;
    });

    this.setState(
      { nomineeList: updatenom, movieList: updatemovies },
      () => {}
    );
  };

  render() {
    return (
      <div>
        <div class="hero-body" id="searchContainer">
          <div class="container">
            <h2 class="title has-text-white-ter">Search for a movie to nominate</h2>
            <div class="field">
              <div class="control">
                <input
                  class="input is-large is-rounded"
                  type="text"
                  placeholder="Search for movies..."
                  onKeyUp={(e) => this.setMovieName(e)}
                />
              </div>
            </div>

            <div class="columns is-mobile is-multiline pb-5 mb-5">
              {this.state.movieList === undefined ? (
                <p>
                  Couldn't find any movie. Please search again using another
                  search criteria.
                </p>
              ) : (
                this.state.movieList.map((movie) => {
                  return (
                    <div class="column is-mobile">
                      <div className="card">
                        <div class="card-image">
                          <figure class="image is-4by3">
                            <img src={movie.Poster} alt="Placeholder" />
                          </figure>
                        </div>

                        <div class="card-content">
                          <div class="media">
                            <div class="media-content has-text-centered">
                              <h4 class="title is-4 has-text-black">
                                {movie.Title}
                              </h4>
                              <h4 class="subtitle is-6 has-text-black">
                                {movie.Year}
                              </h4>
                              <button
                                className="button"
                                onClick={(e) => this.addNominee(e, movie)}
                                disabled={movie.nomination}
                              >
                                {" "}
                                Nominate{" "}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div class="hero-foot">
          <footer className="stickyFooter">
            <div class="columns is-fullwidth has-background-black">
              <div className="column is-one-quarter">
                <h1 className="title has-text-white-ter">Nominees</h1>
              </div>


              <div className="column is-three-quarter">

              {this.state.nomineeList.length > 0 ? (
                <Nominees
                  movie={this.state.nomineeList}
                  delete={this.removeNominee}
                />
              ) : (
                <p> No nominations yet </p>
              )}

              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default Search;
