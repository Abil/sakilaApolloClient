import { NavLink } from "react-router-dom";

const Menu = () => {
  return (
    <>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/film">Film</NavLink>
        </li>
      </ul>
    </>
  );
};

export default Menu;
