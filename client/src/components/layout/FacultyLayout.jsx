import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { FacultySidebar } from './FacultySidebar';

export const FacultyLayout = () => {
  return (
    <div className="app-container">
      <FacultySidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-wrapper">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
