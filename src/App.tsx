import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage'
import { ProfilePage } from '@/pages/ProfilePage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <a href="/" className="font-mono text-sm font-medium tracking-tight text-fg/80 transition-colors hover:text-fg">
            cf.analytics
          </a>
          <span className="hidden text-xs text-muted sm:block">codeforces.com/api</span>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:handle" element={<ProfilePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
