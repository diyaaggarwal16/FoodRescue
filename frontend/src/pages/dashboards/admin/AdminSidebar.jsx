import { useLocation, useNavigate } from 'react-router-dom'

const adminLinks = [
  { label: 'Dashboard', path: '/admin', icon: '⌂' },
  { label: 'Users', path: '/admin/users', icon: '♧' },
  { label: 'Food Listings', path: '/admin/food-listings', icon: '▣' },
  { label: 'Reservations', path: '/admin/reservations', icon: '□' },
  { label: 'Donations', path: '/admin/donations', icon: '♡' },
  { label: 'Food Needs', path: '/admin/food-needs', icon: '▤' }
]

function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => path === '/admin'
    ? location.pathname === path
    : location.pathname.startsWith(path)

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-mark">F</div>
        <div>
          <strong>FoodRescue</strong>
          <span>Admin Panel</span>
        </div>
      </div>

      <div className="admin-nav-title">Main Menu</div>

      <nav className="admin-nav" aria-label="Admin navigation">
        {adminLinks.map(({ label, path, icon }) => (
          <button
            key={path}
            type="button"
            className={`admin-nav-item${isActive(path) ? ' active' : ''}`}
            aria-current={isActive(path) ? 'page' : undefined}
            onClick={() => navigate(path)}
          >
            <span className="nav-icon" aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </nav>

      <div className="admin-sidebar-bottom">
        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <span>System Admin</span>
          </div>
        </div>
        <button
          type="button"
          className="admin-logout"
          onClick={() => navigate('/')}
        >
          <span aria-hidden="true">↪</span>
          Back to Website
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
