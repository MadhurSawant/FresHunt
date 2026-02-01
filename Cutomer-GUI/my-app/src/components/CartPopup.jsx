import React from "react";
import { Offcanvas, Button } from "react-bootstrap";

function CartPopup({
  show,
  handleClose,
  cartItems = [], // ✅ default to empty array
  onIncrease = () => {},
  onDecrease = () => {},
}) {
  const deliveryCharge = 39;
  const freeDeliveryAbove = 499;

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal >= freeDeliveryAbove ? subtotal : subtotal + deliveryCharge;

  return (
    <Offcanvas show={show} onHide={handleClose} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Order Summary</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="p-2 bg-success text-white text-center rounded mb-3">
          Free delivery on all orders above ₹{freeDeliveryAbove}
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center text-muted my-5">🛒 Your cart is empty</div>
        ) : (
          <>
            {/* Cart Items */}
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
              >
                <div>
                  <strong>{item.name}</strong>
                  <div className="text-muted small">{item.qtyLabel}</div>
                  <div>
                    <span className="fw-bold">₹{item.price}</span>{" "}
                    {item.oldPrice && (
                      <span className="text-decoration-line-through text-muted">
                        ₹{item.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => onDecrease(item.id)}
                  >
                    -
                  </Button>
                  <span>{item.qty}</span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onIncrease(item.id)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}

            {/* Bill Details */}
            <div className="border rounded p-3 mt-3">
              <h6>Bill Details</h6>
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {subtotal < freeDeliveryAbove && (
                <div className="d-flex justify-content-between">
                  <span>Delivery Charge</span>
                  <span>₹{deliveryCharge}</span>
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            {/* Checkout button */}
            <div className="fixed-bottom bg-white p-3 border-top d-flex justify-content-between align-items-center">
              <strong>Total : ₹{total}</strong>
              <Button variant="danger">Proceed to Checkout</Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default CartPopup;
