import { useState } from 'react'
import axios from 'axios'

interface PriceHistoryItem {
  tarih?: string
  date?: string
  fiyat?: string
  price?: string
  degisim?: string
  change?: string
}

interface ApiResponse {
  success: boolean
  data?: PriceHistoryItem[]
  message?: string
}

export default function Home() {
  const [ilanNo, setIlanNo] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!ilanNo.trim()) {
      setError('Lütfen bir ilan numarası girin')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post(`${API_URL}/api/price-history`, {
        ilanNo: ilanNo.trim()
      })

      setResult(response.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}/${month}/${year}`
    } catch {
      return dateString
    }
  }

  const formatPrice = (price: string | undefined) => {
    if (!price) return 'N/A'
    const numPrice = parseInt(price.replace(/\D/g, ''))
    if (isNaN(numPrice)) return price
    return numPrice.toLocaleString('tr-TR') + ' TL'
  }

  const calculatePriceChange = (currentPrice: string | undefined, previousPrice: string | undefined) => {
    if (!currentPrice || !previousPrice) return { text: 'İlk kayıt', type: 'neutral' }
    
    const current = parseInt(currentPrice.replace(/\D/g, ''))
    const previous = parseInt(previousPrice.replace(/\D/g, ''))
    
    if (isNaN(current) || isNaN(previous)) return { text: 'İlk kayıt', type: 'neutral' }
    
    const difference = current - previous
    
    if (difference === 0) {
      return { text: 'Değişiklik yok', type: 'neutral' }
    } else if (difference > 0) {
      return { 
        text: `↑ ${Math.abs(difference).toLocaleString('tr-TR')} TL`, 
        type: 'increase' 
      }
    } else {
      return { 
        text: `↓ ${Math.abs(difference).toLocaleString('tr-TR')} TL`, 
        type: 'decrease' 
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-light-blue via-white to-light-green">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            İlan Fiyat Geçmişi
          </h1>
          <p className="text-gray-600 text-lg">
            İlan numarasını girerek fiyat geçmişini görüntüleyin
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="ilanNo"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  İlan Numarası
                </label>
                <input
                  type="text"
                  id="ilanNo"
                  value={ilanNo}
                  onChange={(e) => setIlanNo(e.target.value)}
                  placeholder="Örn: 1283653757"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 transition-colors text-lg"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sorgulanıyor...
                  </div>
                ) : (
                  'Sorgula'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Results */}
          {result && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {result.success && result.data && result.data.length > 0 ? (
                <>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-4">
                    <h2 className="text-2xl font-bold text-white">
                      Fiyat Geçmişi ({result.data.length} kayıt)
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b-2 border-gray-200">
                            <th className="text-left py-4 px-4 font-semibold text-gray-700">Tarih</th>
                            <th className="text-right py-4 px-4 font-semibold text-gray-700">Fiyat</th>
                            <th className="text-right py-4 px-4 font-semibold text-gray-700">Değişim</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.data.map((item, index) => {
                            const priceChange = index > 0 
                              ? calculatePriceChange(
                                  item.fiyat || item.price,
                                  result.data![index - 1].fiyat || result.data![index - 1].price
                                )
                              : { text: 'İlk kayıt (Baz fiyat)', type: 'neutral' }
                            
                            return (
                              <tr
                                key={index}
                                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                  index % 2 === 0 ? 'bg-white' : 'bg-light-blue'
                                }`}
                              >
                                <td className="py-4 px-4 text-gray-800">
                                  {formatDate(item.tarih || item.date)}
                                </td>
                                <td className="py-4 px-4 text-gray-800 font-semibold text-right">
                                  {formatPrice(item.fiyat || item.price)}
                                </td>
                                <td className="py-4 px-4 text-right">
                                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                    priceChange.type === 'increase'
                                      ? 'bg-light-orange text-orange-800'
                                      : priceChange.type === 'decrease'
                                      ? 'bg-light-green text-green-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {priceChange.text}
                                  </span>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-600 text-lg">Veri bulunamadı</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>by yclpl PriceHistory</p>
        </div>
      </div>
    </div>
  )
}
