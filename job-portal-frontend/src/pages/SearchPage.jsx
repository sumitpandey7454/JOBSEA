import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { jobApi } from '../services/api'
import JobCard from '../components/jobs/JobCard'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const keyword = searchParams.get('q') || ''
  const [jobsPage, setJobsPage] = useState(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setPage(0)
  }, [keyword])

  useEffect(() => {
    if (!keyword) return
    setLoading(true)
    jobApi.search(keyword, page, 10)
      .then((res) => setJobsPage(res.data))
      .finally(() => setLoading(false))
  }, [keyword, page])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-sm text-blue-600 hover:underline mb-2 inline-block">← Home</Link>
        <div className="flex items-center gap-2">
          <Search size={18} className="text-gray-400" />
          <h1 className="text-xl font-bold text-gray-900">
            Results for "<span className="text-blue-600">{keyword}</span>"
          </h1>
        </div>
        {jobsPage && (
          <p className="text-sm text-gray-500 mt-1">{jobsPage.totalElements} jobs found</p>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="card h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : jobsPage?.content?.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">No jobs found for "{keyword}"</p>
          <p className="text-sm mt-1">Try different keywords or browse categories.</p>
          <Link to="/" className="btn-primary inline-block mt-4 text-sm">Browse Categories</Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {jobsPage.content.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>

          {jobsPage.totalPages > 1 && (
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
        </>
      )}
    </div>
  )
}