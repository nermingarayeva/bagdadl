import React, { useState } from 'react';
import '../assets/images/styles/global.css';
import { FaChevronDown } from 'react-icons/fa'; // Chevron işarəsini üçün import edirik

const CategoryPage = () => {
  const categories = [
    { name: 'Nuts', products: ['Almonds', 'Cashews', 'Pistachios'] },
    { name: 'Chocolates', products: ['Dark Chocolate', 'Milk Chocolate', 'White Chocolate'] },
    { name: 'Cookies', products: ['Chocolate Chip', 'Oatmeal', 'Peanut Butter'] },
    { name: 'Beverages', products: ['Tea', 'Coffee', 'Juice'] },
  ];

  const [openCategory, setOpenCategory] = useState(null);

  const handleCategoryClick = (category) => {
    // Əgər kateqoriya artıq açıqdırsa, onu bağla; əks halda, aç
    if (openCategory === category) {
      setOpenCategory(null);
    } else {
      setOpenCategory(category);
    }
  };

  return (
    <div className="category-page">
      <section className="category-header">
        <h1>Our Product Categories</h1>
        <p>Explore our wide variety of products</p>
      </section>

      <section className="category-list">
        {categories.map((category, index) => (
          <div
            key={index}
            className="category-item"
            onClick={() => handleCategoryClick(category.name)}  // Kliklənmə ilə açılıb bağlanma
          >
            <div className="category-name">
              <h3>{category.name}</h3>
              <FaChevronDown
                className={`chevron-icon ${openCategory === category.name ? 'rotate' : ''}`}
              />
            </div>

            {openCategory === category.name && (
              <div className="category-dropdown">
                <ul>
                  {category.products.map((product, i) => (
                    <li key={i}>{product}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default CategoryPage;
