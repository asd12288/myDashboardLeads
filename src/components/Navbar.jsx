import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'; // or "./Navbar.css" if you keep it separate
import accountImage from '../assets/account.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>
        Welcome Back{' '}
        {localStorage.getItem('user').charAt(0).toUpperCase() +
          localStorage.getItem('user').slice(1) || 'user'}
        !
      </h1>
      <p className='white'>
        The data refrash every 8 Hours
      </p>

      <div className="header-right">
        <img className="icon-account" src={accountImage} alt="account" />
        <span className="username">
          {localStorage.getItem('user').toUpperCase() || 'user'}
        </span>
        <button className="logout" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
