import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { jobApi, categoryApi, contactApi } from '../services/api'

const EMPTY_FORM = {
  title: '', organization: '', location: '', description: '',
  applicationLink: '', qualification: '', salary: '',
  lastDate: '', categoryId: '', featured: false, status: 'ACTIVE',
}

export default function AdminPage() {
  const [jobs, setJobs] = useState([])
  const [categories, setCategories] = useState([])
  const [messages, setMessages] = useState([])
  const [activeTab, setActiveTab] = useState('jobs')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const loadJobs = () => {
    setLoading(true)
    jobApi.getAll(page, 10)
      .then((res) => {
        setJobs(res.data.content)
        setTotalPages(res.data.totalPages)
      })
      .finally(() => setLoading(false))
  }

  const loadMessages = () => {
    contactApi.getAll()
      .then((res) => setMessages(res.data))
      .catch(() => {})
  }

  useEffect(() => {
    categoryApi.getAll().then((res) => setCategories(res.data))
    loadMessages()
  }, [])

  useEffect(() => { loadJobs() }, [page])

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setShowForm(true)
  }

  const openEdit = (job) => {
    setEditingId(job.id)
    setForm({
      title: job.title || '',
      organization: job.organization || '',
      location: job.location || '',
      description: job.description || '',
      applicationLink: job.applicationLink || '',
      qualification: job.qualification || '',
      salary: job.salary || '',
      lastDate: job.lastDate || '',
      categoryId: job.category?.id || '',
      featured: job.featured || false,
      status: job.status || 'ACTIVE',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.applicationLink) { toast.error('Application link is required'); return }
    setSaving(true)
    try {
      if (editingId) {
        await jobApi.update(editingId, { ...form, categoryId: Number(form.categoryId) })
        toast.success('Job updated!')
      } else {
        await jobApi.create({ ...form, categoryId: Number(form.categoryId) })
        toast.success('Job created!')
      }
      setShowForm(false)
      loadJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return
    try {
      await jobApi.delete(id)
      toast.success('Job deleted.')
      loadJobs()
    } catch {
      toast.error('Delete failed.')
    }
  }

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [field]: val }))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        {activeTab === 'jobs' && (
          <button onClick={openNew} className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={16} /> Add Job
          </button>
        )}
      </div>

      {/* Tab switcher */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === 'jobs'
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          💼 Jobs
        </button>
        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 ${
            activeTab === 'messages'
              ? 'bg-white shadow-sm text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📩 Messages
          {messages.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {messages.length}
            </span>
          )}
        </button>
      </div>

      {/* ===== JOBS TAB ===== */}
      {activeTab === 'jobs' && (
        <>
          {/* Form modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b">
                  <h2 className="font-semibold text-gray-900">
                    {editingId ? 'Edit Job' : 'Add New Job'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Job Title *</label>
                      <input className="input" value={form.title} onChange={set('title')}
                        placeholder="e.g. Software Engineer" required />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Organization</label>
                      <input className="input" value={form.organization} onChange={set('organization')}
                        placeholder="Company / Department" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Location</label>
                      <input className="input" value={form.location} onChange={set('location')}
                        placeholder="Delhi / Remote" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Category *</label>
                      <select className="input" value={form.categoryId} onChange={set('categoryId')} required>
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Status</label>
                      <select className="input" value={form.status} onChange={set('status')}>
                        <option value="ACTIVE">Active</option>
                        <option value="CLOSED">Closed</option>
                        <option value="DRAFT">Draft</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Application Link *</label>
                      <input className="input" value={form.applicationLink}
                        onChange={set('applicationLink')}
                        placeholder="https://example.com/apply" type="url" required />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Qualification</label>
                      <input className="input" value={form.qualification} onChange={set('qualification')}
                        placeholder="B.Tech / Graduation" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Salary</label>
                      <input className="input" value={form.salary} onChange={set('salary')}
                        placeholder="₹30,000 - ₹50,000" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Last Date</label>
                      <input className="input" type="date" value={form.lastDate} onChange={set('lastDate')} />
                    </div>
                    <div className="flex items-center gap-2 pt-5">
                      <input type="checkbox" id="featured" checked={form.featured}
                        onChange={set('featured')} className="w-4 h-4 accent-blue-600" />
                      <label htmlFor="featured" className="text-sm text-gray-600">Mark as Featured</label>
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-600 mb-1 block">Description</label>
                      <textarea className="input resize-none" rows={4} value={form.description}
                        onChange={set('description')}
                        placeholder="Job description, eligibility, how to apply..." />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="btn-secondary flex-1">Cancel</button>
                    <button type="submit" disabled={saving}
                      className="btn-primary flex-1 flex items-center justify-center gap-2">
                      {saving && <Loader2 size={15} className="animate-spin" />}
                      {editingId ? 'Update Job' : 'Create Job'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Jobs list */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="card h-16 animate-pulse bg-gray-100" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No jobs yet. Click "Add Job" to get started.
            </div>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div key={job.id} className="card flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 truncate">{job.title}</div>
                    <div className="text-xs text-gray-400 flex gap-2 mt-0.5">
                      <span>{job.category?.icon} {job.category?.name}</span>
                      {job.organization && <span>· {job.organization}</span>}
                      <span className={`font-medium ${
                        job.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'
                      }`}>· {job.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openEdit(job)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(job.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0}
                className="btn-secondary py-1 px-3 text-sm disabled:opacity-40">Prev</button>
              <span className="text-sm text-gray-500 py-1">
                Page {page + 1} / {totalPages}
              </span>
              <button onClick={() => setPage(p => p + 1)} disabled={page + 1 >= totalPages}
                className="btn-secondary py-1 px-3 text-sm disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      )}

      {/* ===== MESSAGES TAB ===== */}
      {activeTab === 'messages' && (
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <div className="text-4xl mb-3">📩</div>
              <p className="font-medium">No messages yet.</p>
              <p className="text-sm mt-1">Messages from users will appear here.</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="card border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold text-gray-900">{msg.name}</div>
                      {!msg.read && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          New
                        </span>
                      )}
                    </div>
                    {msg.email && (
                      <a href={`mailto:${msg.email}`}
                        className="text-xs text-blue-500 hover:underline block mb-2">
                        📧 {msg.email}
                      </a>
                    )}
                    <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3">
                      {msg.message}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}