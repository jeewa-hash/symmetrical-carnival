import React from 'react';

function FinanceUserInterface() {
  return (
    <div style={styles.financeInterface}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div style={styles.logo}>
            <img src="path/to/logo.png" alt="Bear Works Lanka Logo" style={styles.logoImage} />
            <h1 style={styles.logoText}>Bear Works Lanka</h1>
          </div>
          <nav style={styles.navigation}>
            <ul style={styles.navList}>
              <li><a href="#home" style={styles.navLink}>Home</a></li>
              <li><a href="#users" style={styles.navLink}>Users</a></li>
              <li><a href="#events" style={styles.navLink}>Events</a></li>
              <li><a href="#finance" style={styles.navLink}>Finance</a></li>
              <li><a href="#feedbacks" style={styles.navLink}>Feedbacks</a></li>
            </ul>
          </nav>
          <div style={styles.login}>
            <button style={styles.loginButton}>Log In</button>
          </div>
        </div>
        <div style={styles.banner}>
          <h2>Welcome to Bear Works Lanka</h2>
        </div>
      </header>

      {/* Scrollable Body */}
      <div style={styles.scrollableBody}>
        <div style={styles.content}>
          <h1 style={styles.title}>Finance Management</h1>
          <p style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget libero feugiat, faucibus libero id, scelerisque quam.
          </p>
          <button style={styles.ctaButton}>Button 1</button><br></br><br></br>
          <button style={styles.ctaButton}>Button 2</button>
        </div>
        <div style={styles.illustration}>
          <img src="path_to_your_image.jpg" alt="Finance Illustration" style={styles.illustrationImage} />
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div style={styles.footerSection}>
            <img src="path/to/logo.png" alt="Bear Works Lanka Logo" style={styles.footerLogo} />
            <address>
              15 Schofield Pl, Colombo 09892 <br />
              bearworkslanka@gmail.com
            </address>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Company</h3>
            <ul style={styles.footerList}>
              <li><a href="#about" style={styles.footerLink}>About Us</a></li>
              <li><a href="#location" style={styles.footerLink}>Location</a></li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Resources</h3>
            <ul style={styles.footerList}>
              <li><a href="#faq" style={styles.footerLink}>FAQ</a></li>
              <li><a href="#blog" style={styles.footerLink}>Blog</a></li>
              <li><a href="#news" style={styles.footerLink}>News</a></li>
            </ul>
          </div>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>Follow</h3>
            <ul style={styles.footerList}>
              <li><a href="#facebook" style={styles.footerLink}>Facebook</a></li>
              <li><a href="#instagram" style={styles.footerLink}>Instagram</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  financeInterface: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    backgroundColor: '#fff',
    padding: '10px 20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    flexShrink: 0,
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImage: {
    width: '50px',
    height: '50px',
    marginRight: '10px',
  },
  logoText: {
    fontSize: '24px',
    color: '#f47e5f',
  },
  navigation: {},
  navList: {
    display: 'flex',
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navLink: {
    margin: '0 15px',
    textDecoration: 'none',
    color: '#555',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  login: {},
  loginButton: {
    padding: '10px 20px',
    backgroundColor: '#f4a261',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  banner: {
    backgroundColor: '#f4a261',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    marginTop: '10px',
  },
  scrollableBody: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    color: '#333',
  },
  description: {
    fontSize: '18px',
    color: '#777',
    margin: '20px 0',
  },
  ctaButton: {
    padding: '10px 20px',
    backgroundColor: '#f47e5f',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    margin: '10px',
  },
  illustration: {
    marginTop: '40px',
    textAlign: 'center',
  },
  illustrationImage: {
    maxWidth: '100%',
    height: 'auto',
  },
  footer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderTop: '1px solid #ddd',
    flexShrink: 0,
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '20px',
  },
  footerSection: {
    flex: 1,
    padding: '0 15px',
  },
  footerLogo: {
    width: '50px',
    height: '50px',
    marginBottom: '10px',
  },
  footerTitle: {
    fontSize: '16px',
    marginBottom: '10px',
    color: '#f47e5f',
  }, 
  footerList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  footerLink: {
    textDecoration: 'none',
    color: '#555',
  },
};

export default FinanceUserInterface;
