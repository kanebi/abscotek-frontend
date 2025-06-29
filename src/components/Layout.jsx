import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const Layout = ({ children }) => (
  <div className=".">
    <Header />
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8">{children}</main>
    <Footer />
  </div>
);

export default Layout;
