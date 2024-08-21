import '@/index.css'

import EntryPage from '@/pages/EntryPage/EntryPage'
import ErrorPage from '@/pages/ErrorPage/ErrorPage'
import LazyHostPage from '@/pages/HostPage/HostPage.lazy'
import LazyJoinPage from '@/pages/JoinPage/JoinPage.lazy'
import Lobby from '@/pages/Lobby/Lobby'
import PageLoadingScreen from '@/pages/PageLoadingScreen/PageLoadingScreen'
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LazyApp from './App.lazy'
import { store } from './store'

const root = document.getElementById('root')

if (!root) {
  throw new Error('root not found')
}

const container = createRoot(root)

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoadingScreen />}>
        <LazyApp />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: <EntryPage />,
        children: [
          {
            path: '/host',
            element: <LazyHostPage />,
          },
          {
            path: '/join',
            element: <LazyJoinPage />,
          },
        ],
      },
      {
        path: '/lobby',
        element: <Lobby />,
      },
    ],
    errorElement: <ErrorPage />,
  },
])

container.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
