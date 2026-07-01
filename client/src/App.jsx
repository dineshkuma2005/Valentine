import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import CreatorFlow from './pages/CreatorFlow';
import ReceiverView from './pages/ReceiverView';
import SharePage from './pages/SharePage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-sans antialiased overflow-hidden">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/create" element={<CreatorFlow />} />
          <Route path="/share/:id" element={<SharePage />} />
          <Route path="/valentine/:id" element={<ReceiverView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
