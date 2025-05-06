import { LinkShortener } from './components/LinkShortener'

export function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-200">
      <div className="max-w-6xl mx-auto px-4 md:px-0">
        <header className="mb-8">
          <img src="/logo.png" alt="brev.ly logo" className="h-10 w-auto" />
        </header>
        <LinkShortener />
      </div>
    </main>
  )
}
