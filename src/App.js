import TopBar from './views/TopBar';
import GridBoard from './views/GridBoard';

const App = () => {
  return <div>
    <header>
      <TopBar/>
    </header>
    <article>
      <GridBoard/>
   </article>
  </div>;
}
export default App;