import AccountPage from "./AccountPage";
import OrdersPage from "./OrdersPage";
import AddressPage from "./AddressPage";
import LoyaltyPage from "./LoyaltyPage";
import SettingsPage from "./SettingsPage";
import { Link } from "react-router-dom";


export default function Categories() {
  return (<>
  
  <h2>Categories Page</h2>;
    <nav style={{ padding: "10px", background: "#f4f4f4" }}>
          <Link to="/account" style={{ margin: "0 10px" }}>Account</Link>
          <Link to="/orders" style={{ margin: "0 10px" }}>My Orders</Link>
          <Link to="/address" style={{ margin: "0 10px" }}>My Address</Link>
          <Link to="/loyalty" style={{ margin: "0 10px" }}>Loyalty Program</Link>
          <Link to="/settings" style={{ margin: "0 10px" }}>Settings</Link>
        </nav>
  </>
  
)
}
