import { FC } from "react";
import { Outlet } from "react-router-dom";
import { ConstructionTabBar } from "./components/ConstructionTabBar";

export const AppLayout: FC = () => {
  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet />
      </main>
      <ConstructionTabBar />
    </div>
  );
};