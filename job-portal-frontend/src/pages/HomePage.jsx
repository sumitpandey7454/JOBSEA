import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, TrendingUp, Briefcase, Users, Award, Sparkles, ChevronDown } from 'lucide-react'
import { categoryApi, jobApi } from '../services/api'
import JobCard from '../components/jobs/JobCard'

// Animated counter
function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    const step = Math.ceil(target / 50)
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev + step >= target) { clearInterval(timer); return target }
        return prev + step
      })
    }, 30)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count}{suffix}</span>
}

// Floating pill badge
function FloatingPill({ text, style }) {
  return (
    <div
      className="absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-3 py-1.5 text-white text-xs font-medium shadow-lg hidden lg:flex items-center gap-1.5"
      style={style}
    >
      {text}
    </div>
  )
}

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  useEffect(() => {
    Promise.all([categoryApi.getAll(), jobApi.getFeatured()])
      .then(([catRes, jobRes]) => {
        setCategories(catRes.data)
        setFeaturedJobs(jobRes.data)
      })
      .finally(() => setLoading(false))
  }, [])

  // Mouse parallax
  useEffect(() => {
    const handleMouse = (e) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  const totalJobs = categories.reduce((sum, c) => sum + (c.jobCount || 0), 0)

  return (
    <div>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(12px); }
        }
        @keyframes orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #93c5fd 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        .slide-up { animation: slideUp 0.6s ease forwards; }
        .slide-up-2 { animation: slideUp 0.6s ease 0.15s both; }
        .slide-up-3 { animation: slideUp 0.6s ease 0.3s both; }
        .slide-up-4 { animation: slideUp 0.6s ease 0.45s both; }
        .card-3d {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-3d:hover {
          transform: translateY(-10px) rotateX(4deg);
          box-shadow: 0 24px 48px rgba(0,0,0,0.12);
        }
        .orb {
          animation: orb 8s ease-in-out infinite;
          filter: blur(70px);
        }
        .orb2 {
          animation: orb 11s ease-in-out infinite reverse;
          filter: blur(90px);
        }
        .pill1 { animation: float 3s ease-in-out infinite; }
        .pill2 { animation: floatReverse 4s ease-in-out infinite; }
        .pill3 { animation: float 3.5s ease-in-out infinite 1s; }
        .pill4 { animation: floatReverse 3s ease-in-out infinite 0.5s; }
        .glow-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .glow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        .why-card {
          transition: all 0.3s ease;
        }
        .why-card:hover {
          transform: translateY(-8px);
          background: rgba(255,255,255,0.2);
        }
      `}</style>

      {/* ===== HERO ===== */}
      <div
        ref={heroRef}
        className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white overflow-hidden"
        style={{ minHeight: '88vh' }}
      >
        {/* Animated background orbs */}
        <div className="orb absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full opacity-30" />
        <div className="orb2 absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full opacity-25" />
        <div className="orb absolute top-1/2 right-1/4 w-48 h-48 bg-cyan-300 rounded-full opacity-20" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Floating pills */}
        <FloatingPill text="💻 New IT Jobs" style={{ top: '18%', left: '4%', animation: 'float 3s ease-in-out infinite' }} />
        <FloatingPill text="🏛️ Govt Vacancy" style={{ top: '28%', right: '4%', animation: 'floatReverse 4s ease-in-out infinite' }} />
        <FloatingPill text="🎓 Teaching Jobs" style={{ bottom: '32%', left: '3%', animation: 'float 3.5s ease-in-out infinite 1s' }} />
        <FloatingPill text="💼 Sales Roles" style={{ bottom: '22%', right: '3%', animation: 'floatReverse 3s ease-in-out infinite 0.5s' }} />

        

        

        {/* Hero content */}
        <div className="relative max-w-6xl mx-auto px-4 flex flex-col items-center justify-center text-center"
          style={{ minHeight: '88vh' }}>

          <div className="slide-up inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6 backdrop-blur-sm">
            <Sparkles size={14} className="text-yellow-300" />
            <span className="text-blue-100">
              {totalJobs} Active Jobs — Updated Daily
            </span>
          </div>

          <h1 className="slide-up-2 text-5xl sm:text-7xl font-black tracking-tight mb-5 leading-tight">
            Find Your Dream Job<br />
            <span className="shimmer-text">on JOBSEA</span>
          </h1>

          <p className="slide-up-3 text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse jobs across Education, IT, Sales, and Government sectors.
            Your next opportunity is just one click away.
          </p>

          <div className="slide-up-4 flex flex-wrap gap-4 justify-center">
            <Link to="/category/govt-jobs"
              className="glow-btn bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl shadow-lg">
              Browse Govt Jobs 🏛️
            </Link>
            <Link to="/category/it-jobs"
              className="glow-btn bg-white/15 backdrop-blur-sm border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl">
              Explore IT Jobs 💻
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50">
          <span className="text-xs text-blue-200">Scroll to explore</span>
          <ChevronDown size={16} className="text-blue-200 animate-bounce" />
        </div>
      </div>

      {/* ===== STATS BAR ===== */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-7 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: totalJobs, suffix: '+', label: 'Active Jobs' },
            { value: 4, suffix: '', label: 'Job Categories' },
            { value: 100, suffix: '%', label: 'Free to Apply' },
            { value: 24, suffix: '/7', label: 'Updated' },
          ].map((stat, i) => (
            <div key={i} className="group cursor-default">
              <div className="text-3xl font-black text-blue-600 group-hover:scale-110 transition-transform duration-200">
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-16">

        {/* ===== CATEGORIES ===== */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900">Browse by Category</h2>
            <p className="text-gray-500 mt-2">Pick a sector that matches your career goals</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-44 rounded-2xl animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="card-3d bg-white border border-gray-100 rounded-2xl p-6 cursor-pointer group shadow-sm"
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors text-lg">
                    {cat.name}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {cat.jobCount} jobs available
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-blue-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    View all <ArrowRight size={14} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* ===== FEATURED JOBS ===== */}
        {featuredJobs.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp size={18} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">Featured Jobs</h2>
                <p className="text-sm text-gray-500">Hand-picked opportunities</p>
              </div>
            </div>
            <div className="space-y-3">
              {featuredJobs.map((job) => <JobCard key={job.id} job={job} />)}
            </div>
          </section>
        )}

        {/* ===== WHY JOBSEA ===== */}
        <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative text-center mb-10">
            <h2 className="text-3xl font-black text-white">Why JOBSEA?</h2>
            <p className="text-blue-200 mt-2">Simple, fast and completely free</p>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: <Briefcase size={24} />, title: 'Verified Listings', desc: 'All jobs manually reviewed before posting' },
              { icon: <Users size={24} />, title: 'Direct Apply', desc: 'Click apply and go directly to the official page' },
              { icon: <Award size={24} />, title: '100% Free', desc: 'No hidden charges, no subscriptions ever' },
            ].map((item, i) => (
              <div key={i} className="why-card bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 text-white">
                  {item.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-blue-200">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== ALL CATEGORIES ===== */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6">Explore All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </span>
                  <div>
                    <div className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {cat.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{cat.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">
                    {cat.jobCount} jobs
                  </span>
                  <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}