import ReactDOM from 'react-dom/client';
import './index.scss';
import './flag.css'
import { Provider } from 'react-redux';
import ToasterProvider from './providers/ToasterProvider';
import App from './App';
import { store } from './app/store';
import { BrowserRouter } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import 'primereact/resources/themes/lara-light-indigo/theme.css';   // theme
// import 'primeflex/primeflex.css';                                   // css utility
import 'primeicons/primeicons.css';
// import 'primereact/resources/primereact.css'; 


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Provider store={store}>
      <ToasterProvider />
      <PrimeReactProvider>
        <App />
      </PrimeReactProvider>
    </Provider>
  </BrowserRouter>
);
