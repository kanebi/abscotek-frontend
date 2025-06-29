import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const Layout = ({ children }) => (
  <div>
    <Header />
    <main className=" w-full max-w-7xl mx-auto">{children}</main>
    <Footer />
  </div>
);

export default Layout;
