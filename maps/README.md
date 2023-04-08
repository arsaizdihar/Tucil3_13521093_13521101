# Pemrosesan Data Peta

## Langkah pemrosesan

1. Download peta pulau jawa dari geofabrik. http://download.geofabrik.de/asia/indonesia/java.html. Simpan di folder ini.
2. Filter peta sehingga hanya mengandung data Kota Bandung saja.

`
osmosis --read-pbf file=java-latest.osm.pbf --bounding-box top=-6.87 left=107.57 bottom=-6.94 right=107.67 --write-pbf file=bandung.osm.pbf
`

Parameter top, left, bottom, dan right adalah batas-batas latitude dan longitude dari peta yang ingin kita filter. Silakan ubah batas bila ingin mengubah daerah yang ingin difilter. Bila belum menginstall osmosis, silakan install dengan perintah

`
sudo apt install osmosis
`

3. Jalankan processor ipynb