// src/components/ChatWindow.jsx
// Template in use
// Purpose: Display Navigation Bar
// Props: 
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Math Tutor</div>

      <ul className="navbar-links">
        <li><a href="#">Help</a></li>
        <li><a href="#">Chat</a></li>
      </ul>
    </nav>
  );
}