import TopBar from './components/TopBar';
import GridBoard from './components/GridBoard';
import Controller from './components/Controller';

const App = () => {
  return (
    <div>
      <header>
        <TopBar />
      </header>
      <main>
        <article>
          <Controller />
          <GridBoard />
        </article>
      </main>
    </div>
  );
}
export default App;