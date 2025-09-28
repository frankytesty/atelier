export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-ivory-50 to-sage-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-2xl flex items-center justify-center mx-auto mb-6 loading-spinner">
          <div className="w-8 h-8 border-4 border-gold-300 border-t-gold-600 rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-display text-charcoal-900 mb-2">Laden...</h2>
        <p className="text-sage-600">Bitte warten Sie einen Moment</p>
      </div>
    </div>
  )
}
