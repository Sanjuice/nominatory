import React from "react";
import axios from "axios";
import Nominees from "./nominees";
import * as bulmaToast from "bulma-toast";

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      movieData: {},
      search: "little women",
      movieList: [],
      nomineeList: [],
    };

    this.removalMovie = {};

    window.addEventListener("resize", this.paddingChange);
  }

  componentDidMount() {
    this.fetchMovies();

    if(JSON.parse(localStorage.getItem('nominees')) !== null) {
      const updatenom = JSON.parse(localStorage.getItem('nominees')).map((el) => {return el;});
      this.setState({nomineeList: updatenom});
    }


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
    if (this.state.movieList !== undefined) {
      const movies = this.state.movieList.map((movie) => {
        if (
          this.state.nomineeList.findIndex(
            (element) => element.Title === movie.Title && element.Year === movie.Year
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
      if (movie.Title === element.Title && movie.Year === element.Year) {
        element.nomination = true;
      }
      return element;
    });
    
    if(this.state.nomineeList.length < 5)
    {
      this.setState({ nomineeList: updatenom, movieList: updatemovies }, () => {
        this.paddingChange();
        localStorage.setItem('nominees', JSON.stringify(this.state.nomineeList));
  
        if (this.state.nomineeList.length === 5) {
          bulmaToast.toast({
            message: "You have reached the 5 nominee limit, thank you for your nominations",
            type: "is-danger",
            duration: 6000,
            animate: { in: 'fadeInDownBig', out: 'fadeOutUpBig' }
          });
        }
      });
  
      event.target.disabled = true;
      
    }
    
  }

  paddingChange() {
    const styles = window.getComputedStyle(document.querySelector("footer"));
    document.getElementById(
      "searchContainer"
    ).style.marginBottom = styles.getPropertyValue("height");
  }

  removeNominee = (movie) => {
    const updatenom = this.state.nomineeList.filter(
      (element) => (element.Title !== movie.Title || movie.Year !== element.Year)
    );
    const updatemovies = this.state.movieList.map((element) => {
      if (movie.Title === element.Title && movie.Year === element.Year) {
        element.nomination = false;
      }
      return element;
    });

    this.setState(
      { nomineeList: updatenom, movieList: updatemovies },
      () => {
        this.paddingChange();
        localStorage.setItem('nominees', JSON.stringify(this.state.nomineeList));


      }
    );
  };

  render() {
    return (
      <div>
        <div className="hero-body" id="searchContainer">
          <div className="container">
            <h2 className="title has-text-white-ter">
              Search for a movie to nominate
            </h2>
            <div className="field">
              <div className="control">
                <input
                  className="input is-large is-rounded"
                  type="text"
                  placeholder="Search for movies..."
                  onKeyUp={(e) => this.setMovieName(e)}
                />
              </div>
            </div>

            <div className="columns is-mobile is-multiline">
              {this.state.movieList === undefined ? (
                <p>
                  Couldn't find any movie. Please search again using another
                  search criteria.
                </p>
              ) : (
                this.state.movieList.map((movie, i) => {
                  return (
                    <div className="column is-one-fifth-desktop" key={i}>
                      <div className="card">
                        <div className="card-image">
                          <figure className="image is-3by4">
                            <img src={movie.Poster} alt="Placeholder" />
                          </figure>
                        </div>

                        <div className="card-content">
                          <div className="media">
                            <div className="media-content has-text-centered">
                              <h4 className="title is-4 has-text-black">
                                {movie.Title}
                              </h4>
                              <h4 className="subtitle is-6 has-text-black">
                                {movie.Year}
                              </h4>
                              <button
                                className="button is-warning is-light is-outlined"
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

        <div className="hero-foot">
          <footer className="stickyFooter">
            <div className="columns is-fullwidth has-background-black">
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
