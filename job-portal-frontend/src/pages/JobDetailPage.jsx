import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Calendar, Building2, ExternalLink, GraduationCap, IndianRupee } from 'lucide-react'
import { jobApi } from '../services/api'

export default function JobDetailPage() {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    jobApi.getById(id)
      .then((res) => setJob(res.data))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="card h-48 bg-gray-100" />
    </div>
  )

  if (!job) return (
    <div className="text-center py-20 text-gray-400">Job not found.</div>
  )

  const isExpired = job.lastDate && new Date(job.lastDate) < new Date()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to={`/category/${job.category?.slug}`}
        className="text-sm text-blue-600 hover:underline mb-4 inline-block"
      >
        ← {job.category?.name}
      </Link>

      <div className="card mb-4">
        {/* Title & badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                {job.category?.icon} {job.category?.name}
              </span>
              {job.featured && (
                <span className="text-xs bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                  ⭐ Featured
                </span>
              )}
              {isExpired && (
                <span className="text-xs bg-red-50 text-red-600 font-medium px-2 py-0.5 rounded-full">
                  Applications Closed
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
          </div>
        </div>

        {/* Meta info grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
          {job.organization && (
            <div className="flex items-center gap-2 text-gray-600">
              <Building2 size={15} className="text-gray-400 shrink-0" />
              <span>{job.organization}</span>
            </div>
          )}
          {job.location && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={15} className="text-gray-400 shrink-0" />
              <span>{job.location}</span>
            </div>
          )}
          {job.qualification && (
            <div className="flex items-center gap-2 text-gray-600">
              <GraduationCap size={15} className="text-gray-400 shrink-0" />
              <span>{job.qualification}</span>
            </div>
          )}
          {job.salary && (
            <div className="flex items-center gap-2 text-gray-600">
              <IndianRupee size={15} className="text-gray-400 shrink-0" />
              <span>{job.salary}</span>
            </div>
          )}
          {job.lastDate && (
            <div className="flex items-center gap-2 text-gray-600 col-span-2">
              <Calendar size={15} className="text-gray-400 shrink-0" />
              <span>
                Last date to apply:{' '}
                <strong className={isExpired ? 'text-red-500' : 'text-gray-800'}>
                  {new Date(job.lastDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </strong>
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">About this Job</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
              {job.description}
            </p>
          </div>
        )}

        {/* Apply button */}
        <a
          href={job.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full flex items-center justify-center gap-2 py-3"
        >
          Apply Now <ExternalLink size={16} />
        </a>
        <p className="text-xs text-center text-gray-400 mt-2">
          You'll be redirected to the official application page.
        </p>
      </div>

      <div className="text-xs text-gray-400 text-center">
        Posted on {new Date(job.createdAt).toLocaleDateString('en-IN')}
      </div>
    </div>
  )
}