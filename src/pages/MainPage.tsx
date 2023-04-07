
function MainPage({navigate}: {navigate: (path: string) => void}) {
  return (
    <div className='flex flex-col'>
      <h1 className="">Tugas Kecil 3 Strategi Algoritma</h1>
      <p>Algoritma UCS dan A*</p>
      <button onClick={() => navigate('normal')}>Normal</button>
      <button onClick={() => navigate('gmap')}>Google Map</button>
    </div>
  )
}

export default MainPage