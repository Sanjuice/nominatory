import "./App.css";
import "./components/app-header";
import Appheader from "./components/app-header";
import Search from "./components/search";

function App() {
  return (
    <div className="App">
      <section class="hero has-background-black-bis is-fullheight mb-4">
        <div class="hero-head">
          <Appheader />
        </div>

          <Search />
        
      </section>
    </div>
  );
}

export default App;
