
function MainPage({navigate}: {navigate: (path: string) => void}) {
  return (
    <div className='flex flex-col max-w-sm mx-auto justify-center items-center h-screen w-full'>
      <h1 className="text-white text-xl font-bold">Tugas Kecil 3 Strategi Algoritma</h1>
      <p className="text-gray-200 text-lg font-medium mt-2">Algoritma UCS dan A*</p>
      <div className="mt-8 w-full max-w-xs space-y-4">
        <button onClick={() => navigate('normal')} className="btn btn-primary w-full">Normal</button>
        <button onClick={() => navigate('gmap')} className="btn btn-primary w-full">Google Map</button>
      </div>
    </div>
  )
}

export default MainPage