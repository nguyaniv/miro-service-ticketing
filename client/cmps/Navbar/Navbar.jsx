import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({ currentUser }) => {
  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    !currentUser && { label: 'Sign Up', href: '/auth/signup' },
    !currentUser && { label: 'Sign In', href: '/auth/signin' },
    currentUser && { label: 'Sell Tickets', href: '/tickets/new' },
    currentUser && { label: 'My orders', href: '/orders/' },
    currentUser && { label: 'Sign Out', href: '/auth/signout' },
  ]
    .filter((linkConfing) => linkConfing)
    .map(({ label, href }) => {
      return (
        <li className="navbar__item" key={href}>
          <Link href={href}>
            <a className="navbar__link">{label}</a>
          </Link>
        </li>
      );
    });

  const handleScroll = () => {
    window.pageYOffset > 100 ? setFixed(true) : setFixed(false);
  };

  return (
    <div className={fixed ? `navbar active` : `navbar`}>
      <Link href="/">
        <a className="navbar__logo">MyTix</a>
      </Link>
      <ul className="navbar__catagories">
        <li className="navbar__item">
          <Link href={'/'}>
            <a className="navbar__link">Tickets</a>
          </Link>
        </li>
      </ul>
      <ul className="navbar__cta"> {links}</ul>

      <div className="menu">
        <FontAwesomeIcon icon={faBars} />
      </div>
    </div>
  );
};

export default Navbar;
