export default function GeneralError() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="text-gray-600 mt-2">Algo salió mal. Por favor, intenta de nuevo.</p>
      </div>
    </div>
  )
}
