import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import toast from 'react-hot-toast'
import { Phone, ArrowRight, Loader2 } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState('google')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)

  if (isLoggedIn) return <Navigate to="/" replace />

  // ---- Google Login ----
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true)
    try {
      const res = await authApi.googleLogin(credentialResponse.credential)
      login(res.data)
      toast.success(`Welcome${res.data.isNewUser ? '' : ' back'}, ${res.data.name}!`)
      navigate('/')
    } catch (err) {
      toast.error('Google login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ---- Phone OTP ----
  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!phone.match(/^\+?[1-9]\d{9,14}$/)) {
      toast.error('Enter a valid phone number with country code e.g. +919876543210')
      return
    }
    setLoading(true)
    try {
      await authApi.sendOtp(phone)
      setOtpSent(true)
      toast.success('OTP sent! Check your phone.')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error('Enter the 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.verifyOtp(phone, otp)
      login(res.data)
      toast.success(`Welcome${res.data.isNewUser ? '' : ' back'}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sign in to JOBSEA</h1>
          <p className="text-sm text-gray-500 mt-1">Find your next opportunity</p>
        </div>

        <div className="card">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setTab('google')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === 'google' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Google
            </button>
            <button
              onClick={() => setTab('phone')}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${
                tab === 'phone' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
              }`}
            >
              Phone / OTP
            </button>
          </div>

          {/* Google login */}
          {tab === 'google' && (
            <div>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Sign in with your Google account — quick and secure.
              </p>
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 size={24} className="animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error('Google login failed.')}
                    useOneTap={false}
                    width="368"
                    text="continue_with"
                    shape="rectangular"
                  />
                </div>
              )}
            </div>
          )}

          {/* Phone OTP login */}
          {tab === 'phone' && (
            <div>
              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="input pl-9"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Include country code e.g. +91 for India</p>
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-sm text-gray-600">
                    OTP sent to <strong>{phone}</strong>
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter 6-digit OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="input tracking-widest text-center text-lg font-mono"
                      maxLength={6}
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading && <Loader2 size={15} className="animate-spin" />}
                    Verify & Sign In
                  </button>
                  <button type="button" onClick={() => { setOtpSent(false); setOtp('') }}
                    className="text-sm text-blue-600 hover:underline w-full text-center">
                    Change number
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By signing in, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  )
}