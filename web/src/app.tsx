import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LinkShortener } from './components/LinkShortener'
import { RedirectPage } from './components/RedirectPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <main className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
            <div className="max-w-6xl mx-auto px-4 md:px-0">
              <header className="mb-8">
                <img src="/logo.png" alt="brev.ly logo" className="h-10 w-auto" />
              </header>
              <LinkShortener />
            </div>
          </main>
        } />
        <Route path=":shortUrl" element={<RedirectPage />} />
      </Routes>
    </BrowserRouter>
  )
}
