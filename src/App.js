import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
// Pages & components
import Layout from "./Layout/Layout";
import HomeLayout from "./Layout/HomeLayout";
import Home from "./Pages/Home/Home";
import OneTeacher from "./Pages/OneTeacher/OneTeacher";
import Tables from "./Pages/Tables/Tables";
import LogIn from "./Pages/LogIn/LogIn";
import DashLogIn from "./Pages/DashLogIn/DashLogIn";
import SignUp from "./Pages/SignUp/SignUp";
import VerifyEmail from "./Pages/VerifyEmail/VerifyEmail";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import Auth from "./Utils/Auth";
import NotAuth from "./Utils/NotAuth";
import DashboardLayout from "./Layout/DashboardLayout";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AddTeacher from "./Pages/Dashboard/AddTeacher/AddTeacher";
import EditTeacher from "./Pages/Dashboard/EditTeacher/EditTeacher";
import DeleteTeacher from "./Pages/Dashboard/DeleteTeacher/DeleteTeacher";

import DashTables from "./Pages/Dashboard/Tables/Tables";
import Profile from "./Pages/Dashboard/Profile/Profile";
import NotFound from "./Pages/NotFound/NotFound";
import OneTable from "./Pages/Dashboard/OneTable/OneTable";



export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>

        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="teacher/:id" element={<OneTeacher />} />
          <Route path="tables" element={<Tables />} />
        </Route>

        <Route element={<NotAuth />}>
        {/* Start Check if login */}
          <Route path="login" element={<LogIn />} />
          <Route path="dashboard-login" element={<DashLogIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        {/* End Check if login */}
        </Route>

        <Route element={<Auth />}>
        {/* Start protected route */}
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="delete-teacher" element={<DeleteTeacher />} />
            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="edit-teacher" element={<EditTeacher />} />

            <Route path="tables" element={<DashTables />} />
            <Route path="table/:tableId" element={<OneTable />} />

            <Route path="profile" element={<Profile />} />
          </Route>
        {/* End protected route */}
        </Route>

        {/* http://localhost:3000/verify-email?expires=XXX&hash=XXX&id=XXX&signature=XXX */}
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />

      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
