import React from 'react';

function ListItemButton({ text, onClick, selected, component: Component, ref, to, className }) {
  return (
    <li className='ListItemButtonList'>
      <Component onClick={onClick} className={`list-item-button ${selected ? 'selected' : ''} ${className}`} ref={ref} to={to}>
        {text}
      </Component>
    </li>
  );
}

export default ListItemButton;
