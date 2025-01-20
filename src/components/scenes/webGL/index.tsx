import { SelectedPage } from '@/shared/types/enums/SelectedPage.type';
import { motion } from 'framer-motion';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import AboutWebGL from './pages/AboutWebGL';
import WebGLHome from './pages/WebGLHome';
import NotFound from './pages/NotFound';
import ViewThree from './pages/ViewThree';
import View02Three from './pages/View02Three';

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
}

const WebGL = ({ setSelectedPage }: Props) => {
  return (
    <section id="webgl" className="mx-auto w-5/6 pt-24 pb-32">
      <motion.div
        onViewportEnter={() => setSelectedPage(SelectedPage.WebGL)}
      >
        <BrowserRouter>
            <div className="overflow-x-scroll overflow-y-hidden p-6 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">WebGL Demo</h1>
                <div className=" bg-gray-20">
                  <nav className="p-4 bg-gray-800 text-white">
                    <Link to="/" className="mr-4">Home</Link>
                    <Link to="/about-webgl" className="mr-1">About</Link>
                    <Link to="/view-three" className="mr-1">Three.js</Link>
                    <Link to="/test02" className="mr-1">Test 02</Link>
                  </nav>
                  <Routes>
                    <Route path="/" element={<WebGLHome />} />
                    <Route path="/about-webgl" element={<AboutWebGL />} />
                    <Route path="/view-three" element={<ViewThree />} />
                    <Route path="/test02" element={<View02Three />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
              </div>
            </div>
        </BrowserRouter>
     </motion.div>
    </section>
  )
}

export default WebGL