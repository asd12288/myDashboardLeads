import "../styles/styles.css"; // or "./Navbar.css" if you keep it separate

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <p>Loading, please wait...</p>
    </div>
  );
};

export default LoadingScreen;
