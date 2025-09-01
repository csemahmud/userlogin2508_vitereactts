import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteUser, getUserByEmail, listUsers, getUsersByCategoryId } from '@/shared/services/UserService';
import { IUser } from '@/shared/types/interfaces/models/IUser.type';
import { MagnifyingGlassIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import CategoryDropdown from './CategoryDropdown';

const ListUserComponent = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [users, setUsers] = useState<IUser[]>([]);
    const [categoryId, setCategoryId] = useState<number | null>(0); // 0 = All Categories
    const navigate = useNavigate();
    const [errors, setErrors] = useState({ email: '' });

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        if (categoryId === 0 || categoryId === null) {
            getAllUsers();
        } else {
            getUsersByCategoryId(categoryId)
                .then(response => setUsers(response.data))
                .catch(error => console.error(error));
        }
    }, [categoryId]);

    const getAllUsers = () => {
        listUsers()
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    };

    const AddNewUser = () => navigate('/add-user');

    const editUser = (user: IUser) => {
        if (user.id) navigate(`/edit-user/${user.id}`);
    };

    const removeUser = (user: IUser) => {
        if (
            confirm(
                `Are you sure you want to DELETE the following user?\n${JSON.stringify(user, undefined, 4)}`
            )
        ) {
            if (user.id) {
                deleteUser(user.id)
                    .then(response => {
                        getAllUsers();
                        setMessage(response.data.message ? response.data.message : response.data.error ? response.data.error : "");
                        setEmail('');
                    })
                    .catch(error => console.error(error));
            }
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (email.trim()) {
            const regexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (regexp.test(email)) {
                errorsCopy.email = '';
            } else {
                errorsCopy.email = 'Invalid Email Format!';
                valid = false;
            }
        } else {
            errorsCopy.email = 'Email is required.';
            valid = false;
        }

        setErrors(errorsCopy);
        return valid;
    };

    const findUserByEmailId = () => {
        if (validateForm()) {
            getUserByEmail(email)
                .then(response => setUsers([response.data]))
                .catch(error => console.error(error));
        }
    };

    return (
        <div className="p-4">
            <h5 className="text-green-600">{message}</h5>
            <h2 className="text-center text-2xl font-bold mb-4">List Of Users</h2>

            {/* Search & Filter Box */}
            <div className="flex justify-center mb-4 gap-4 flex-wrap">
                <input
                    type="email"
                    className="border rounded p-2 w-full max-w-md"
                    placeholder="Search With Email Address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <button
                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
                    onClick={findUserByEmailId} 
                    data-toggle="tooltip" data-placement="top" title="Search"
                >
                    <MagnifyingGlassIcon className="h-6 w-6 text-cyan-500" />
                </button>

                {/* Category Filter */}
                <CategoryDropdown
                    categoryId={categoryId}
                    setCategoryId={setCategoryId}
                    variant="list"
                />
            </div>
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

            {/* Add User Button */}
            <div className="flex justify-end mb-4">
                <button className="bg-black text-white px-4 py-2 rounded" onClick={AddNewUser} 
                    data-toggle="tooltip" data-placement="top" title="Add User">
                    <PlusIcon className="h-6 w-6 text-green-50" /> User
                </button>
            </div>

            {/* Users Table */}
            <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-700 text-white">
                        <th className="border border-gray-300 px-2 py-1">Index</th>
                        <th className="border border-gray-300 px-2 py-1">Id</th>
                        <th className="border border-gray-300 px-2 py-1">Name</th>
                        <th className="border border-gray-300 px-2 py-1">Email</th>
                        <th className="border border-gray-300 px-2 py-1">Domain</th>
                        <th className="border border-gray-300 px-2 py-1">Age</th>
                        <th className="border border-gray-300 px-2 py-1">Experience</th>
                        <th className="border border-gray-300 px-2 py-1">Salary</th>
                        <th className="border border-gray-300 px-2 py-1">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id} className="hover:bg-gray-100">
                            <td className="border border-gray-300 px-2 py-1">{index}</td>
                            <td className="border border-gray-300 px-2 py-1">{user.id}</td>
                            <td className="border border-gray-300 px-2 py-1">{user.name}</td>
                            <td className="border border-gray-300 px-2 py-1">{user.email}</td>
                            <td className="border border-gray-300 px-2 py-1">{user.domain}</td>
                            <td className="border border-gray-300 px-2 py-1">{user.age}</td>
                            <td className="border border-gray-300 px-2 py-1">{user.experience}</td>
                            <td className="border border-gray-300 px-2 py-1">{user.salary}</td>
                            <td className="border border-gray-300 px-2 py-1 flex gap-2">
                                <button
                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                    onClick={() => editUser(user)}  
                                    data-toggle="tooltip" data-placement="top" title="Edit"
                                >
                                    <PencilIcon className="h-6 w-6 text-yellow-500" />
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => removeUser(user)} 
                                    data-toggle="tooltip" data-placement="top" title="Delete"
                                >
                                    <TrashIcon className="h-6 w-6 text-cyan-500" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListUserComponent;
