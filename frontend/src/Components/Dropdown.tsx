import { useState, useRef, useEffect } from 'react';

interface DropdownProps {
  label: string;
  items: Array<{ href: string; label: string }>;
  href?: string;
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
      <a href={href} onClick={toggleDropdown}>{label}</a>
      {isOpen && (
        <nav className="dropdown-menu">
          <div className="dropdown-content">
            {items.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Dropdown;