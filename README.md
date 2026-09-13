# TM. — Frontend

React + Vite frontend for the TMBRAND backend. Connects to your .NET API at
`http://localhost:5224`.

## Setup

1. Unzip this folder somewhere, e.g. `C:\Users\LAPTOP\Desktop\TMBRAND\tm-frontend`
2. Open a terminal inside the folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open the printed URL (usually `http://localhost:3000`)
4. **Keep your backend running too** (`dotnet run` in the `backend` project) —
   this site fetches products/categories live from it.

## If products don't load

Open `src/api.js` and check two things:
- `BASE_URL` matches the port your backend prints in the terminal
  (e.g. `Now listening on: http://localhost:5224`)
- The route names (`/products`, `/products/{id}`, `/categories`) match what
  your `ProductsController` / `CategoriesController` actually expose. If your
  routes differ, edit `src/api.js` accordingly.

## Changing prices, images, colors

All product data (price, images, color, size, stock) comes straight from your
database via the API — edit it there (SQL Server / your backend) and it will
show up automatically here. No frontend code changes needed for that.

## Where things live

- `src/index.css` — all design tokens & styling (colors, fonts, layout)
- `src/pages/` — Home, Products (shop), ProductDetail, Cart
- `src/components/` — Navbar, Footer, ProductCard, Hero
- `src/context/CartContext.jsx` — cart state, saved in the browser
