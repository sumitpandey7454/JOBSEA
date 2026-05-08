import { Link } from 'react-router-dom'
import { Heart, Send, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { contactApi } from '../../services/api'
import toast from 'react-hot-toast'

export default function Footer() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.message) {
      toast.error('Name and message are required!')
      return
    }
    setLoading(true)
    try {
      await contactApi.send(form)
      toast.success('Message sent successfully!')
      setForm({ name: '', email: '', message: '' })
    } catch {
      toast.error('Failed to send message. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center mb-3">
              <span className="text-2xl font-black text-blue-400">JOB</span>
              <span className="text-2xl font-black text-white">SEA</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your one-stop destination for jobs in Education, IT, Sales,
              and Government sectors across India.
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <a href="mailto:sumitpandey7454@gmail.com"
                className="block hover:text-blue-400 transition-colors">
                📧 sumitpandey7454@gmail.com
              </a>
              <a href="https://linkedin.com/in/sumit-pandey"
                target="_blank" rel="noopener noreferrer"
                className="block hover:text-blue-400 transition-colors">
                🔗 linkedin.com/in/sumit-pandey
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Browse Jobs
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/education"
                  className="hover:text-blue-400 transition-colors">
                  🎓 Education Jobs
                </Link>
              </li>
              <li>
                <Link to="/category/it-jobs"
                  className="hover:text-blue-400 transition-colors">
                  💻 IT Jobs
                </Link>
              </li>
              <li>
                <Link to="/category/sales-jobs"
                  className="hover:text-blue-400 transition-colors">
                  💼 Sales Jobs
                </Link>
              </li>
              <li>
                <Link to="/category/govt-jobs"
                  className="hover:text-blue-400 transition-colors">
                  🏛️ Govt Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                placeholder="Your name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Your email (optional)"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Your message *"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors disabled:opacity-50"
              >
                {loading
                  ? <Loader2 size={15} className="animate-spin" />
                  : <Send size={15} />
                }
                Send Message
              </button>
            </form>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} JOBSEA. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with
            <Heart size={12} className="text-red-400 fill-red-400 mx-1" />
            in India by Sumit Pandey
          </p>
        </div>
      </div>
    </footer>
  )
}