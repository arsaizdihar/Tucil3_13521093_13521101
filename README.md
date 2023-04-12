# Tucil3_13521093_13521101

## Deployment URL
https://tucil3-stima.vercel.app/

## General Information
A program (website) to solve the shortest path problem using UCS and A* algorithm. This website has two options of input, which is a text file that contains the graph and its adjacency matrix and a UI that shows Google Maps and the shortest path between two locations.

## Contributors
- 13521093 - Akbar Maulana Ridho
- 13521101 - Arsa Izdihar Islam
  
## Programming Language Used
- Typescript
- Python

## Tols Used
- React with Vite
- TailwindCSS with DaisyUI
- Cytoscape
- Google Maps API

## Features
- Graph visualization using Cytoscape and shortest path.
- Google Maps API to show the shortest path between two locations.

## Structure
```
maps/
├── bandung.osm.pbf
├── processor.ipynb
└── README.md
public/
├── fonts/
└── bandung.json
src/
├── components/
│   ├── BackButton.tsx
│   └── PlaceSearch.tsx
├── models/
│   ├── coordinates.ts
│   ├── graph.ts
│   └── node.ts
├── pages/
│   ├── MainPage.tsx
│   ├── MapPage.tsx
│   └── NormalPage.tsx
├── solver/
│   ├── algorithm.ts
│   └── map-solver.ts
├── App.tsx
├── font.css
├── index.css
├── main.tsx
└── vite-end.d.ts
tests/
```

## How to Use
This program was developed using Node.js. To run this program, you need to install Node.js first. You can download it [here](https://nodejs.org/en/download/). But, if you want to see the website, you can go to the [deployment url](https://tucil3-stima.vercel.app/).

## Depedencies
- Node.js 18
- Python 3.8 (If you want to run the map generator)

## How to Build Program
1. Clone this repository
```shelll
git clone git@github.com:arsaizdihar/Tucil3_13521093_13521101.git
```
2. Install the Node.js libraries
```shell
npm install
```
3. Build the program
```shell
npm run build
```

4. Add Google Maps API key

- Copy .env.example to .env
- Fill VITE_GMAPS_API_KEY variable with your own Google Maps API key

5. Run the program
```shell
npm run preview
```
1. Open the browser and go to http://localhost:4173