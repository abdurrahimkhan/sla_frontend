// import Link from 'next/link';
import React from 'react'

export default function NavItem({
  children,
  href = "/",
  classes = "",
}) {
  return (
    <li className={`nav-item list-none text-xl ${classes}`}>
      <a href={href} className="nav-link">
        {children}
      </a>
    </li>
  );
}
