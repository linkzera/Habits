import "./styles/global.css";
import { Header } from "./components/header";
import { SummaryTable } from "./components/summaryTable";

export function App() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-16">
        <Header />
        <SummaryTable />
      </div>
    </div>
  );
}
