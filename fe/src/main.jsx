import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import AuthProvider from './providers/AuthProvider/index.jsx'
import { BrowserRouter } from 'react-router-dom'
import {registerLicense} from '@syncfusion/ej2-base'

registerLicense("Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCf1FpRmJGdld5fUVHYVZUTXxaS00DNHVRdkdnWXxecnZXRWJfUER2Xkc=")
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
)
