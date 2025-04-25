import './App.css';
import Carousel from './components/Carousel';
import Header from './components/Header';
import './css/base.css'
import './css/embla.css'
import './css/sandbox.css'


const OPTIONS = { dragFree: true, loop: true }
const SLIDE_COUNT = 5
const SLIDES = Array.from(Array(SLIDE_COUNT).keys())


function App() {
  return (
    <>
    <Header />
    <Carousel slides={SLIDES} options={OPTIONS} />
 
  </>
  );
}

export default App;
