import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Board from './pages/Board'
import Home from './pages/Home'
import './assets/styles/custom-scrollbar.css'
import AppLayout from './components/layout/AppLayout.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/boards" element={<Home />} />
          <Route path="/boards/:boardId" element={<Board />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
