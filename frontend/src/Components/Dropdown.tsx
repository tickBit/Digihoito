import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './../App.css';
import React from 'react';

export interface DropdownItem {
  label: string;
  href: string;
  onClick?: () => void;     // added optional onClick
}

export interface DropdownProps {
  label: string;
  href: string;
  items: DropdownItem[];
}

const Dropdown = ({ label, items, href = "#" }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="dropdown-wrapper" ref={dropdownRef} >
      <a className="nav-link" href={href} onClick={toggleDropdown}>{label}</a>
      {isOpen && (
        <nav className="dropdown-menu">
          <div className="dropdown-content">
            {items.map((item) => (
              <Link className='nav-link' key={item.href} to={item.href} onClick={item.onClick}>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Dropdown;