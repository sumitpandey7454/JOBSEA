import { Link } from 'react-router-dom'
import { MapPin, Calendar, ExternalLink, Building2 } from 'lucide-react'

export default function JobCard({ job }) {
  const isExpired = job.lastDate && new Date(job.lastDate) < new Date()

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
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
                Expired
              </span>
            )}
          </div>

          <Link
            to={`/jobs/${job.id}`}
            className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
          >
            {job.title}
          </Link>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-500">
            {job.organization && (
              <span className="flex items-center gap-1">
                <Building2 size={12} /> {job.organization}
              </span>
            )}
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {job.location}
              </span>
            )}
            {job.lastDate && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                Last date: {new Date(job.lastDate).toLocaleDateString('en-IN')}
              </span>
            )}
          </div>

          {job.qualification && (
            <div className="mt-1.5 text-xs text-gray-500">
              Qualification: <span className="font-medium text-gray-700">{job.qualification}</span>
            </div>
          )}
        </div>

        {/* Apply button */}
        <a
          href={job.applicationLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 flex items-center gap-1 btn-primary text-xs py-1.5 px-3"
        >
          Apply <ExternalLink size={12} />
        </a>
      </div>
    </div>
  )
}