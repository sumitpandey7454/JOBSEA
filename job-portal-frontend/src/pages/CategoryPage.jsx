import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { categoryApi, jobApi } from '../services/api'
import JobCard from '../components/jobs/JobCard'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [jobsPage, setJobsPage] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    categoryApi.getBySlug(slug)
      .then((res) => {
        setCategory(res.data)
        return jobApi.getByCategory(res.data.id, page, 10)
      })
      .then((res) => setJobsPage(res.data))
      .finally(() => setLoading(false))
  }, [slug, page])

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="card h-24 animate-pulse bg-gray-100" />
      ))}
    </div>
  )

  if (!category) return (
    <div className="text-center py-20 text-gray-500">Category not found.</div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link to="/" className="text-sm text-blue-600 hover:underline mb-2 inline-block">
          ← Back to Home
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-sm text-gray-500">
              {category.jobCount} active {category.jobCount === 1 ? 'job' : 'jobs'}
            </p>
          </div>
        </div>
      </div>

      {/* Jobs list */}
      {jobsPage?.content?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">{category.icon}</div>
          <p className="font-medium">No jobs posted in this category yet.</p>
          <p className="text-sm mt-1">Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobsPage?.content?.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {jobsPage && jobsPage.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="btn-secondary py-1.5 px-3 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-600">
            Page {page + 1} of {jobsPage.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= jobsPage.totalPages}
            className="btn-secondary py-1.5 px-3 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}