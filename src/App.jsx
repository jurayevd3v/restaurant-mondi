import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AppLayout from "./layouts/AppLayout";
import MainLayout from "./layouts/MainLayout";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminCategory from "./Pages/AdminCategory";
import AdminMenu from "./Pages/AdminMenu";
import AdminBg from "./Pages/AdminBg";
import AdminEmployee from "./Pages/AdminEmployee";
import AdminEmployeeComments from "./Pages/AdminEmployeeComments";
import AdminComment from "./Pages/AdminComment";
import Menu from "./Pages/Menu";
import ProtectedRoute from "./Components/ProtectedRoute"; // Импорт компонента защиты маршрутов

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="admin/category" element={<AdminCategory />} />
            <Route path="admin/menu/:ID" element={<AdminMenu />} />
            <Route path="admin/bg" element={<AdminBg />} />
            <Route path="admin/employee" element={<AdminEmployee />} />
            <Route
              path="/admin/employee/:id"
              element={<AdminEmployeeComments />}
            />
            <Route path="admin/comments" element={<AdminComment />} />
          </Route>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="/category/:ID" element={<Menu />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
