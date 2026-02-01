export default function Header() {
  return (
    <header className="newspaper-border-b bg-white newspaper-shadow">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-serif font-bold tracking-tight">
              The Daily Dispatch
            </h1>
            <p className="text-muted mt-1 text-sm tracking-wide uppercase">
              Mission Control — AI Squad Operations
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-xs text-muted mt-1">Real-time • Live Updates</p>
          </div>
        </div>
      </div>
    </header>
  )
}