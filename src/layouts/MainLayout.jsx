import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import Slider from '../components/Slider';
import ServiceCard from '../components/ServiceCard';
import News from '../pages/News';

const MainLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Slider></Slider>
            <ServiceCard></ServiceCard>
            <Outlet></Outlet>
            <News></News>
            <Footer></Footer>
        </div>
    );
};

export default MainLayout;