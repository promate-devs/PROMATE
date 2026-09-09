import React, { lazy, Suspense, useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Sidebar from "./components/SideBar/Sidebar";
import Header from "./components/Header/Header";

const ComingSoonPage = lazy(() => import("./pages/ComingSoonPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage/LoginPage.jsx"));
const AuthCallbackPage = lazy(() => import("./pages/AuthCallbackPage/AuthCallbackPage.jsx"));
const TeamCreatePage = lazy(() => import("./pages/TeamCreatePage/TeamCreatePage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage/DashboardPage.jsx"));
const ApplicantPage = lazy(() => import("./pages/ApplicantPage/ApplicantList.jsx"));
const ApplicantDetail = lazy(() => import("./pages/ApplicantPage/ApplicantDetail.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage.jsx"));
const FindTeamPage = lazy(() => import("./pages/FindTeamPage/FindTeamPage.jsx"));
const ProjectPage = lazy(() => import("./pages/ProjectPage/ProjectPage.jsx"));
const TeamPage = lazy(() => import("./pages/TeamPage/TeamPage.jsx"));
const TaskBoardPage = lazy(() => import("./pages/TaskBoardPage/TaskBoardPage.jsx"));
const BoardPage = lazy(() => import("./pages/BoardPage/BoardPage.jsx"));
const BoardDetailPage = lazy(() => import("./pages/BoardDetailPage/BoardDetailPage.jsx"));
const MemberReviewPage = lazy(() => import("./pages/MemberReviewPage/MemberReviewPage.jsx"));
const ProjectReadMePage = lazy(() => import("./pages/ProjectReadMePage/ProjectReadMePage.jsx"));

function AppLayout({ isMenuOpen, toggleMenu, closeMenu }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header onMenuClick={toggleMenu} />
      <div style={{ display: "flex", flex: 1, backgroundColor: "#F8F9FA" }}>
        <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
        <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1, padding: "0px", boxSizing: "border-box" }}>
            <Suspense fallback={<div className="route-loading route-loading--content">페이지를 불러오는 중...</div>}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="route-loading">페이지를 불러오는 중...</div>}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/kakao/callback" element={<AuthCallbackPage />} />

        <Route
          element={
            <AppLayout
              isMenuOpen={isMenuOpen}
              toggleMenu={toggleMenu}
              closeMenu={closeMenu}
            />
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/teamCreate" element={<TeamCreatePage />} />
          <Route path="/readme/:postId" element={<ProjectReadMePage />} />
          <Route path="/applicant" element={<ApplicantPage/>} />
          <Route path="/applicant/detail" element={<ApplicantDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/findTeam" element={<FindTeamPage />} />
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/project/:projectId" element={<TeamPage />} />
          <Route path="/task-board" element={<TaskBoardPage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/board/:postId" element={<BoardDetailPage />} />
          <Route path="/memberReview" element={<MemberReviewPage />} />
          <Route path="*" element={<ComingSoonPage />} />
        </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
