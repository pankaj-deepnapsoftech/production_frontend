import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Layout from "./pages/Layout";
import routes from "./routes/routes";
import { useSelector } from "react-redux";
import NotFound from "./pages/NotFound";
import Main from "./pages";
import Home from "./components/Authentication/Home";
import Contact from "./components/Authentication/Contact";
import About from "./components/Authentication/About";
import MainContent from "./components/UserDashboard/MainContent";
import Overview from "./components/UserDashboard/Overview";
import PurchaseHistory from "./components/UserDashboard/PurchaseHistory";
import TrackProduction from "./components/UserDashboard/TrackProduction";
import Settings from "./components/UserDashboard/Settings";
import Entries from "./components/UserDashboard/Entries";
import NewEntry from "./components/UserDashboard/NewEntry";

const App: React.FC = () => {

  const { allowedroutes, isSuper } = useSelector((state: any) => state.auth);

  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route element={<MainContent />} >
            <Route path="/userbord" element={<Overview />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/track-production" element={<TrackProduction />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/entries" element={<Entries />} />
            <Route path="/new-entry" element={<NewEntry />} />

          </Route>
          <Route element={<Main />} >
            <Route path="/home" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            {routes.map((route, ind) => {
              const isAllowed = isSuper || allowedroutes.includes(route.path.replaceAll('/', ''));
              if (route.isSublink) {
                return (
                  <Route key={ind} path={route.path} element={route.element}>
                    {route.sublink &&
                      route.sublink.map((sublink, index) => {
                        return (
                          <Route
                            key={index}
                            path={sublink.path}
                            element={sublink.element}
                          ></Route>
                        );
                      })}
                  </Route>
                );
              } else {
                return (
                  <Route
                    index={route.name === "Dashboard" ? true : false}
                    key={ind}
                    path={route.path}
                    element={route.element}
                  ></Route>
                );
              }
            })}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
