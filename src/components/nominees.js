import React from "react";

class Nominees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nominee: [],
    };
  }

  handleChange(el) {
    this.props.delete(el);
  }

  componentDidMount() {
    const arr = [];
    arr.push(this.props);
    this.setState({
      nominee: arr,
    });
  }

  render() {
    const noms = this.props.movie.map((el) => {
      return (
          <div className="column is-one-quarter">
        <div class="notification is-warning is-light">
          <span class="has-text-black"> <strong>  {el.Title} </strong> </span>{" "}
          <button class="delete is-medium" onClick={(e) => this.handleChange(el)}>
            {" "}
          </button>{" "}
        </div>
        </div>
      );
    });
    return <div className="columns is-multiline"> {noms}</div>;
  }
}

export default Nominees;
