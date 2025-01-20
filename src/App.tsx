import Navbar from "@/components/scenes/navbar";
import Home from "@/components/scenes/home";
import OurClasses from "@/components/scenes/ourClasses";
import Benefits from "@/components/scenes/benefits";
import ContactUs from "@/components/scenes/contactUs";
import Footer from "@/components/scenes/footer";
import { useEffect, useState } from "react";
import { SelectedPage } from "@/shared/types/enums/SelectedPage.type";
import ManageUsers from "./components/scenes/manageUsers";
import WebGL from "./components/scenes/webGL";

function App() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.Home
  );
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app bg-gray-20">
      <Navbar
        isTopOfPage={isTopOfPage}
        selectedPage={selectedPage}
        setSelectedPage={setSelectedPage}
      />
      <Home setSelectedPage={setSelectedPage} />
      <Benefits setSelectedPage={setSelectedPage} />
      <OurClasses setSelectedPage={setSelectedPage} />
      <ContactUs setSelectedPage={setSelectedPage} />
      <ManageUsers setSelectedPage={setSelectedPage} />
      <WebGL setSelectedPage={setSelectedPage} />
      <Footer />
    </div>
  );
}

export default App;
