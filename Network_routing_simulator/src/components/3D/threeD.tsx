import Earth from "../Earth/Earth";

import { MyProvider } from "../../Context/ContextProvider";
export default function threeD() {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
        })
        .catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => {
          })
          .catch((err) => {
            console.error("Error attempting to exit full-screen mode:", err);
          });
      }
    }
  };

  return (
    <MyProvider>
      <button
        className="absolute top-3 left-3 my-2 z-10 bg-white rounded-xl"
        onClick={toggleFullscreen}
      >
        <img src="./images/fullscreen.png" width={30}/>
      </button>
      <Earth />
    </MyProvider>
  );
}
