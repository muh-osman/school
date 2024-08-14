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
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
// import About from "./Pages/About/About";
import OneTeacher from "./Pages/OneTeacher/OneTeacher";
import CarouselPage from "./Pages/CarouselPage/CarouselPage";
import Tables from "./Pages/Tables/Tables";
import Dox from "./Pages/Dox/Dox";
import OneDox from "./Pages/OneDox/OneDox";
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
import Album from "./Pages/Dashboard/Album/Album";
import DeleteTeacher from "./Pages/Dashboard/DeleteTeacher/DeleteTeacher";

import DashTables from "./Pages/Dashboard/Tables/Tables";
import AddTable from "./Pages/Dashboard/AddTable/AddTable";
import EditTable from "./Pages/Dashboard/EditTable/EditTable";
import EditOneTable from "./Pages/Dashboard/EditOneTable/EditOneTable";
import DeleteTable from "./Pages/Dashboard/DeleteTable/DeleteTable";

import DashDox from "./Pages/Dashboard/Dox/Dox";
import AddDox from "./Pages/Dashboard/AddDox/AddDox";
import EditDox from "./Pages/Dashboard/EditDox/EditDox";
import EditOneDox from "./Pages/Dashboard/EditOneDox/EditOneDox";
import DeleteDox from "./Pages/Dashboard/DeleteDox/DeleteDox";

import Profile from "./Pages/Dashboard/Profile/Profile";
import NotFound from "./Pages/NotFound/NotFound";
import OneTable from "./Pages/OneTable/OneTable";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route element={<HomeLayout />}>
          <Route index element={<Home />} />
          <Route path="teacher/:id" element={<OneTeacher />} />
          <Route
            path="carousel/:teacherId/:imageId"
            element={<CarouselPage />}
          />

          <Route path="tables" element={<Tables />} />
          <Route path="table/:id" element={<OneTable />} />

          <Route path="dox" element={<Dox />} />
          <Route path="dox/:id" element={<OneDox />} />

          <Route path="privacy-policy" element={<PrivacyPolicy />} />
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

            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="edit-teacher" element={<EditTeacher />} />
            <Route path="delete-teacher" element={<DeleteTeacher />} />
            <Route path="edit-teacher/album/:id" element={<Album />} />

            <Route path="tables" element={<DashTables />} />
            <Route path="add-table" element={<AddTable />} />
            <Route path="edit-table" element={<EditTable />} />
            <Route path="edit-table/:id" element={<EditOneTable />} />
            <Route path="delete-table" element={<DeleteTable />} />

            <Route path="dox" element={<DashDox />} />
            <Route path="add-dox" element={<AddDox />} />
            <Route path="edit-dox" element={<EditDox />} />
            <Route path="edit-dox/:id" element={<EditOneDox />} />
            <Route path="delete-dox" element={<DeleteDox />} />

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
