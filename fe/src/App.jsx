import './App.scss'
import { ToastContainer } from 'react-toastify'
import Guest from './pages/Guest'
import { AuthContext } from './providers/AuthProvider'
import { useContext } from 'react'
import User from './pages/User'
import HomeLayout from './layouts/HomeLayout';
import {Worker} from '@react-pdf-viewer/core'
import Footer from './components/Footer'

function App() {
  const {authUser} = useContext(AuthContext);

  const items = [
    {name: 'Home', path: '/'},
    {name: 'Cá nhân', path: '/me'},
  ]

  return (
    <Worker workerUrl='https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js'>
      <HomeLayout items={items}>
        {authUser ? <User/> : <Guest/>}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          newestOnTop={true}
          closeOnClick
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          draggable
          style={{ textAlign: 'left' }}
        />
      </HomeLayout>
      <Footer/>
    </Worker>
  )
}

export default App
