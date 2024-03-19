import { RouterProvider } from 'react-router-dom'
import router from './router'
import './App.css'
import { useEffect } from 'react'
import axios from 'axios'

function App() {
  useEffect(() => {
    const controller = new AbortController()
    const access_token = localStorage.getItem('access_token')
    // Test rate limit
    // for (let i = 0; i < 5; i++) {
    axios
      .get('/users/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        baseURL: import.meta.env.VITE_API_URL,
        signal: controller.signal,
      })
      .then((res) => {
        localStorage.setItem('profile', JSON.stringify(res.data.result))
      })
    // }
    return () => {
      controller.abort()
    }
  }, [])
  return <RouterProvider router={router} />
}

export default App
