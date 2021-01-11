import React from "react";
import axios from "axios";
import Nominees from "./nominees";

import * as bulmaToast from "bulma-toast";

//component to search for movies, display results and nomination list
class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      movieData: {}, //stores the json object provided by the omdb api
      search: "little women", //stores the search term inputed by the user, default: little women
      movieList: [], //stores the movies recieved from omdb api with nomination data 
      nomineeList: [], //stores the nominations made by the user
    };

    //event listener to change results padding based on window sizing changes
    window.addEventListener("resize", this.paddingChange);
  }

  componentDidMount() {
    this.fetchMovies();

    if(JSON.parse(localStorage.getItem('nominees')) !== null) {
      const updatenom = JSON.parse(localStorage.getItem('nominees')).map((el) => {return el;});
      this.setState({nomineeList: updatenom});
    }


  }

  //fetch movies based on user input
  fetchMovies() {
    axios
      .get(
        `https://www.omdbapi.com/?i=tt3896198&apikey=c7f6062c&s=${this.state.search}&type=movie`
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

  //set nomination based on user input on the search results
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

  //add nominations to the nomination list and update the movielist to show nomination changes
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
            duration: 4000,
            animate: { in: 'fadeInDownBig', out: 'fadeOutUpBig' }
          });
        }
      });
  
      event.target.disabled = true;
      
    }
  }

  //Change padding of the results based on the footer of the webpage
  paddingChange() {
    const styles = window.getComputedStyle(document.querySelector("footer"));
    document.getElementById(
      "searchContainer"
    ).style.marginBottom = styles.getPropertyValue("height");
  }

  //remove nominee from the nomination list based on the user input from the nominee component
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
            <label className="label is-large has-text-white-ter" htmlFor="searchField">
              Search for a movie to nominate
            </label>
            <div className="field">
              <div className="control">
                <input
                  id="searchField"
                  className="input is-large is-rounded"
                  type="text"
                  placeholder="Search for movies..."
                  onKeyUp={(e) => this.setMovieName(e)}
                />
              </div>
            </div>

            <div className="columns is-mobile is-multiline">
              {this.state.movieList === undefined ? (
                <div className="column">
                  Couldn't find any movie with that title.
                </div>
              ) : (
                this.state.movieList.map((movie, i) => {
                  return (
                    <div className="column is-one-fifth-desktop animate__animated animate__fadeIn" key={i}>
                      <div className="card has-background-dark">
                        <div className="card-image">
                          <figure className="image is-3by4">
                            <img src={movie.Poster} alt="Placeholder" />
                          </figure>
                        </div>

                        <div className="card-content">
                          <div className="media">
                            <div className="media-content has-text-centered">
                              <h4 className="title is-4 has-text-white-bis">
                                {movie.Title}
                              </h4>
                              <h4 className="subtitle is-6 has-text-white-bis">
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
