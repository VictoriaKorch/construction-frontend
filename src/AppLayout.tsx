import { FC, useState } from "react";
import { Outlet } from "react-router-dom";
import { type ConstructionResponseDto } from "./modules/construction_mock";
import { ConstructionTabBar } from "./components/ConstructionTabBar";

export interface AppOutletContext {
  cards: ConstructionResponseDto[];
  setCards: (cards: ConstructionResponseDto[]) => void;
}

export const AppLayout: FC = () => {
  const [cards, setCards] = useState<ConstructionResponseDto[]>([]);

  return (
    <div className="app-container">
      <main className="main-content">
        <Outlet context={{ cards, setCards }} />
      </main>
      <ConstructionTabBar />
    </div>
  );
};