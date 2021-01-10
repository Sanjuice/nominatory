import "./App.css";
import "./components/app-header";
import Appheader from "./components/app-header";
import Search from "./components/search";
import 'animate.css';


function App() {
  return (
    <div className="App">
      <section className="hero has-background-black-bis is-fullheight animate__animated animate__fadeIn ">
        <div className="hero-head">
          <Appheader />
        </div>

          <Search />
        
      </section>
    </div>
  );
}

export default App;
