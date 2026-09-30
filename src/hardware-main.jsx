import './styles/global.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import HardwarePage from './pages/HardwarePage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <HardwarePage />
    </MotionConfig>
  </React.StrictMode>
);
