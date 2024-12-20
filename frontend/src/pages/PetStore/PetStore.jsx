import React, { useState } from 'react';
import './PetStore.css';
import { FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';

const PetStore = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Sample product data (in a real app, this would come from an API)
  const products = [
    { id: 1, name: 'Premium Dog Food', category: 'food', price: 290, image: 'data:image/jpeg;base64,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', description: 'High-quality nutrition for your furry friend' },
    { id: 2, name: 'Interactive Cat Toy', category: 'toys', price: 350, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrspjXtqch9LElwGx2cXywzIJzeEOND9u68Q&s', description: 'Keep your cat entertained for hours' },
    { id: 3, name: 'Stylish Pet Collar', category: 'accessories', price: 650, image: 'https://www.kalpane.in/media/catalog/product/cache/213ef150b29400babbdbda2b5022e12e/c/o/collar_lead_22.jpg', description: 'Comfortable and fashionable collar' },
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'food', name: 'Pet Food' },
    { id: 'toys', name: 'Toys' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const toggleWishlist = (product) => {
    if (wishlist.find(item => item.id === product.id)) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }
  };

  return (
    <div className="pet-store">
      <header className="store-header">
        <h1>Pet Store</h1>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="header-icons">
          <div className="wishlist-icon">
            <FaHeart />
            <span className="badge">{wishlist.length}</span>
          </div>
          <div className="cart-icon">
            <FaShoppingCart />
            <span className="badge">{cart.length}</span>
          </div>
        </div>
      </header>

      <nav className="categories">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </nav>

      <main className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
              <button
                className={`wishlist-btn ${wishlist.find(item => item.id === product.id) ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                <FaHeart />
              </button>
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-footer">
                <span className="price">Rs.{product.price}</span>
                <button className="add-to-cart" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default PetStore;