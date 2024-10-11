import { NavLink, Outlet } from "react-router-dom";
import { FaHome, FaChild, FaClipboardList, FaBoxes } from "react-icons/fa";
import { useState } from "react";
import "./Layout.scss";

const Layout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  return (
    <div className="layout">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h1 className="logo">{collapsed ? "M" : "Sunshine"}</h1>
          <button className="collapse-btn" onClick={toggleSidebar}>
            {collapsed ? "☰" : "✕"}
          </button>
        </div>
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaHome />
              </span>{" "}
              {/* Koristi ikonu za Dashboard */}
              <span className="menu-text">Početna stranica</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/baby"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaChild />
              </span>{" "}
              <span className="menu-text">Bebe</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/service-package"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaBoxes />
              </span>{" "}
              <span className="menu-text">Paketi usluga</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/arrangement"
              className={({ isActive }) =>
                isActive ? "menu-link active" : "menu-link"
              }
            >
              <span className="menu-icon">
                <FaClipboardList />
              </span>{" "}
              <span className="menu-text">Aranžmani</span>
            </NavLink>
          </li>
        </ul>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
