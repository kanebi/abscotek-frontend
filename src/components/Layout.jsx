import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 w-full max-w-7xl mx-auto">{children}</main>
    <Footer />
  </div>
);

export default Layout;
