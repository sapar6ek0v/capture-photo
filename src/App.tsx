import './App.css';
import WebcamCapture from "./components/WebcamCapture.tsx";

function App() {
  return (
    <section className="relative w-full h-full min-h-[100vh] flex flex-col items-center justify-center gap-[20px]">
      <WebcamCapture />
    </section>
  );
}

export default App;
