import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Chatbot } from './components/Chatbot';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Chatbot />
    </>
  );
}

export default App;
