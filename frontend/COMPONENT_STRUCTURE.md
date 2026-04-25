# NextMart Component Structure

src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Dropdown.jsx
│   │   ├── DataTable.jsx
│   │   ├── Pagination.jsx
│   │   ├── Badge.jsx
│   │   ├── Card.jsx
│   │   ├── SearchBar.jsx
│   │   ├── ConfirmDialog.jsx
│   │   └── Toast.jsx
│   ├── layout/
│   │   ├── AdminLayout.jsx
│   │   ├── DashboardLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── admin/
│   │   ├── AdminSidebar.jsx
│   │   ├── AdminHeader.jsx
│   │   └── StatCard.jsx
│   └── shared/
│       ├── ProductCard.jsx
│       ├── OrderCard.jsx
│       └── RatingStars.jsx
├── pages/
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── AdminProducts.jsx
│   │   ├── AdminOrders.jsx
│   │   ├── AdminCoupons.jsx
│   │   ├── AdminReturns.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── AdminReports.jsx
│   │   └── AdminInvoice.jsx
│   ├── user/
│   │   ├── Returns.jsx
│   │   ├── Invoices.jsx
│   │   └── Reviews.jsx
│   ├── Cart.jsx (exists)
│   ├── CheckOut.jsx (exists)
│   ├── Orders.jsx (exists)
│   ├── Profile.jsx (exists)
│   ├── Wishlist.jsx (exists)
│   └── ...
├── context/
│   ├── AdminContext.jsx
│   ├── ToastContext.jsx
│   └── ModalContext.jsx
├── hooks/
│   ├── useAdmin.js
│   ├── useOrders.js
│   └── useProducts.js
└── utils/
    ├── constants.js
    ├── formatters.js
    └── validators.js
