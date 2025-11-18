import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, selectProducts } from "../redux/productSlice";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import "../assets/images/styles/global.css"; // CSS-i daxil et

const ProductsPage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, [dispatch]);

  //  Scroll animation
  useEffect(() => {
    const cards = document.querySelectorAll(".card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
  }, [products]);

  return (
    <section style={{ padding: "20px 75px" }}>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {products.map((product, index) => (
          <div key={product._id} className="card">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsPage;
