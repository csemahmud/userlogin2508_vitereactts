import { SelectedPage } from "@/shared/types/enums/SelectedPage.type";
import { motion } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ListUserComponent from "./ListUserComponent";
import UserComponent from "./UserComponent";

type Props = {
    setSelectedPage: (value: SelectedPage) => void;
  };

  const ManageUsers = ({ setSelectedPage }: Props) => {
    
  return (
    <section id="manageusers" className="mx-auto w-5/6 pt-24 pb-32">
      <motion.div
        onViewportEnter={() => setSelectedPage(SelectedPage.ManageUsers)}
      >
        <BrowserRouter>
            <div className="overflow-x-auto overflow-y-hidden p-6 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">Manage Users</h1>
                <Routes>
                    {/* Home Route */}
                    <Route path="/" element={<ListUserComponent />} />
                    
                    {/* Users List Route */}
                    <Route path="/users" element={<ListUserComponent />} />
                    
                    {/* Add User Route */}
                    <Route path="/add-user" element={<UserComponent />} />
                    
                    {/* Edit User Route */}
                    <Route path="/edit-user/:id" element={<UserComponent />} />
                </Routes>
            </div>
        </BrowserRouter>
     </motion.div>
    </section>
  )
}

export default ManageUsers
