import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

// Prevent zooming using JavaScript
function preventZoom() {
  document.getElementById('aside')?.addEventListener('wheel', function(event) {
        event.preventDefault();
    })
 
}

function App() {
  useEffect(()=>{
    preventZoom();

  },[])
  return (
    <>
    <div>
      <Toaster position='top-center' toastOptions={{
        success:{
          theme:{
            primary:"#4aed88"
          }
        }
      }} />
    </div>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='editor/:RoomId' element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
