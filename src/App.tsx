import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import AdminLayout from "./components/layout/AdminLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import Categories from "./pages/products/Categories";
import Brands from "./pages/products/Brands";
import SalesList from "./pages/sales/SalesList";
import AddSale from "./pages/sales/AddSale";
import PurchaseList from "./pages/purchases/PurchaseList";
import AddPurchase from "./pages/purchases/AddPurchase";
import CustomerList from "./pages/people/CustomerList";
import SupplierList from "./pages/people/SupplierList";
import StoreList from "./pages/people/StoreList";
import ExpenseList from "./pages/expenses/ExpenseList";
import AddExpense from "./pages/expenses/AddExpense";
import ExpenseCategories from "./pages/expenses/ExpenseCategories";
import AdjustmentList from "./pages/adjustments/AdjustmentList";
import AddAdjustment from "./pages/adjustments/AddAdjustment";
import SalesReport from "./pages/reports/SalesReport";
import InventoryReport from "./pages/reports/InventoryReport";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/categories" element={<Categories />} />
            <Route path="products/brands" element={<Brands />} />
            <Route path="sales" element={<SalesList />} />
            <Route path="sales/add" element={<AddSale />} />
            <Route path="purchases" element={<PurchaseList />} />
            <Route path="purchases/add" element={<AddPurchase />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="stores" element={<StoreList />} />
            <Route path="expenses" element={<ExpenseList />} />
            <Route path="expenses/add" element={<AddExpense />} />
            <Route path="expenses/categories" element={<ExpenseCategories />} />
            <Route path="adjustments" element={<AdjustmentList />} />
            <Route path="adjustments/add" element={<AddAdjustment />} />
            <Route path="reports/sales" element={<SalesReport />} />
            <Route path="reports/inventory" element={<InventoryReport />} />
            <Route path="reports/purchase" element={<SalesReport />} />
            <Route path="reports/supplier" element={<SalesReport />} />
            <Route path="reports/customer" element={<SalesReport />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
