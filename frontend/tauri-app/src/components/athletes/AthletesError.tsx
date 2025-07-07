interface AthletesErrorProps {
    error: Error;
}
const AthletesError = ({ error }: AthletesErrorProps) => {
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error al cargar los atletas</p>
            <p>{error.message || 'Error desconocido'}</p>
            <p className="mt-2 text-sm">
                Asegúrate de que el servidor backend esté en ejecución y accesible en {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}
            </p>
            <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-red-700"
            >
                Reintentar
            </button>
        </div>
    )
}

export default AthletesError