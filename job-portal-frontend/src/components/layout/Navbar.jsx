import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Search, Briefcase, LogOut, Menu, X, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, isLoggedIn, isAdmin, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg shrink-0">
          <Briefcase size={20} />
          <span>JobSea</span>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm hidden sm:flex">
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs..."
              className="input pl-9 py-1.5 text-sm"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 ml-auto">
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-medium px-3 py-1.5 rounded-lg hover:bg-purple-50"
                >
                  <Shield size={15} />
                  Admin
                </Link>
              )}
              <span className="hidden sm:block text-sm text-gray-600">
                Hi, {user?.name?.split(' ')[0]}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                <span className="hidden sm:block">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-1.5 px-4">
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden p-1.5 rounded-lg hover:bg-gray-100"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile search */}
      {mobileOpen && (
        <div className="sm:hidden px-4 pb-3 border-t border-gray-100">
          <form onSubmit={handleSearch} className="mt-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs..."
                className="input pl-9 py-2 text-sm"
              />
            </div>
          </form>
        </div>
      )}
    </nav>
  )
}