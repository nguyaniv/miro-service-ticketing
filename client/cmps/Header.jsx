import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from './Navbar/Navbar';
const Header = ({ currentUser }) => {
  return (
    <header className="header">
      <div className="header__content">
        <h1>Get Your tickets</h1>
        <h3>On MyTix</h3>
      </div>
      <div className="bg-video">
        <video
          className="bg-video__content"
          autoPlay={true}
          loop={true}
          muted
          preload=""
          playsInline={true}
        >
          <source src="images/bg-video.mp4" type="video/mp4" />
        </video>
      </div>
    </header>
  );
};

export default Header;
