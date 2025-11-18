import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom'; // Router burada olmalıdır
import AppRouter from './router/AppRouter';
import Header from './components/Header';
import { Provider } from 'react-redux';
import store from './redux/store';
import './assets/images/styles/global.css'; 

const App = () => {
  return (
    
    <Provider store={store}>
      <Router>
        <Header />
        <AppRouter />
      </Router>
    </Provider>
  );
};

export default App;
