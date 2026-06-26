import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ExamPortal from './components/ExamPortal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ExamPortal />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}
