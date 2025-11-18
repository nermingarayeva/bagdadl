import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, selectProducts } from '../redux/productSlice';
import axios from 'axios';
import SEO from '../components/SEO';
import HeroSection from '../../sections/HeroSection';
import AboutUsSection from '../../sections/AboutUsSection';
import ServicesSection from '../../sections/ServicesSection';
import TestimonialsSection from '../../sections/TestimonialsSection';
import Footer from '../../sections/Footer';

const HomePage = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        dispatch(setProducts(response.data));
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <>
      <SEO 
        titleAz="Ana Səhifə - Bağdad AzərbaycanRəsmi Sayt"
        titleEn="Home Page - Baghdad Azerbaijan"
        titleRu="Главная страница - Багдад Азербайджан"
        descriptionAz="Bağdad Azərbaycan - Keyfiyyətli məhsul və xidmətlər"
        descriptionEn="Baghdad Azerbaijan - Quality products and services"
        descriptionRu="Багдад Азербайджан - Качественные товары и услуги"
        path=""
      />
      <div>
        <HeroSection />
        <AboutUsSection />
        <ServicesSection />
        <TestimonialsSection />
        <Footer />
      </div>
    </>
  );
};

export default HomePage;