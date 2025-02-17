import { Provider } from 'react-redux';
import { store } from './store';
import RouterPage from './RouterPage';

function App() {
  return (
    <Provider store={store}>
      <RouterPage />
    </Provider>
  );
}

export default App; 