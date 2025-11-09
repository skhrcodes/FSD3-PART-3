const { useMemo, useState } = React;

// --- Mock Product Data ---
const PRODUCTS = [
  {
    id: 1,
    name: "Aurora Wireless Headphones",
    price: 79.99,
    rating: 4.5,
    category: "Audio",
    img: "https://images.unsplash.com/photo-1518444028785-8f6f8f7c3e19?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Nebula Smartwatch",
    price: 129.0,
    rating: 4.2,
    category: "Wearables",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Orbit Bluetooth Speaker",
    price: 49.0,
    rating: 4.1,
    category: "Audio",
    img: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "Photon DSLR Camera",
    price: 699.0,
    rating: 4.8,
    category: "Cameras",
    img: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Quasar Mechanical Keyboard",
    price: 89.0,
    rating: 4.6,
    category: "Computers",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 6,
    name: "Lumen 4K Monitor (27\")",
    price: 279.0,
    rating: 4.3,
    category: "Computers",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 7,
    name: "Comet Action Camera",
    price: 199.0,
    rating: 4.0,
    category: "Cameras",
    img: "https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 8,
    name: "Flux Fitness Band",
    price: 39.0,
    rating: 3.9,
    category: "Wearables",
    img: "https://images.unsplash.com/photo-1558126319-c9feecbfefa7?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 9,
    name: "Horizon Noise Cancelling Buds",
    price: 59.0,
    rating: 4.4,
    category: "Audio",
    img: "https://images.unsplash.com/photo-1518444028785-8f6f8f7c3e19?q=80&w=1200&auto=format&fit=crop"
  },
  {
    id: 10,
    name: "Pulsar Gaming Mouse",
    price: 39.0,
    rating: 4.2,
    category: "Computers",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop"
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

function StarRating({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const stars = "★★★★★".split("").map((s, i) => {
    if (i < full) return "★";
    if (i === full && half) return "☆"; // half-style hint (simple)
    return "☆";
  });
  return (
    <span className="stars" aria-label={`Rating ${value} out of 5`}>
      {stars.join(" ")} <span className="muted">({value.toFixed(1)})</span>
    </span>
  );
}

function ProductCard({ product, onAdd }) {
  const { img, name, price, rating, category } = product;
  return (
    <article className="card" role="listitem">
      <img className="thumb" src={img} alt={name} loading="lazy" />
      <div className="content">
        <div className="name">{name}</div>
        <div className="price-row">
          <div className="price">₹{price.toFixed(2)}</div>
          <span className="badge">{category}</span>
        </div>
        <StarRating value={rating} />
        <button className="btn" onClick={() => onAdd(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}

function Toolbar({ query, setQuery, category, setCategory, sort, setSort }) {
  return (
    <div className="toolbar" role="group" aria-label="Filters">
      <input
        className="input"
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />
      <select
        className="select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Filter by category"
      >
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select
        className="select"
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        aria-label="Sort"
      >
        <option value="relevance">Sort: Relevance</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="rating-desc">Rating: High to Low</option>
        <option value="name-asc">Name: A → Z</option>
      </select>
    </div>
  );
}

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("relevance");
  const [cartCount, setCartCount] = useState(0);

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();

    if (category !== "All") {
      list = list.filter(p => p.category === category);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price); break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price); break;
      case "rating-desc":
        list.sort((a, b) => b.rating - a.rating); break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default:
        // relevance: keep insertion order (mock)
        break;
    }

    return list;
  }, [query, category, sort]);

  const handleAdd = () => {
    setCartCount(c => c + 1);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="title">🛒 Product Gallery</div>
        <div className="muted">Items in cart: <strong>{cartCount}</strong></div>
        <Toolbar
          query={query}
          setQuery={setQuery}
          category={category}
          setCategory={setCategory}
          sort={sort}
          setSort={setSort}
        />
      </header>

      {filtered.length === 0 ? (
        <div className="empty">
          No products match your filters. Try clearing the search or category.
        </div>
      ) : (
        <section className="grid" role="list" aria-label="Products">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </section>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
