import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  deleteUser,
  getUserByEmail,
  listUsers,
  getUsersByCategoryId,
} from '@/shared/services/UserService';
import { IUser } from '@/shared/types/interfaces';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/solid';
import CategoryDropdown from './CategoryDropdown';

const ListUserComponent = () => {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<IUser[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null); // null = All Categories
  const [errors, setErrors] = useState({ email: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch users whenever category changes
  useEffect(() => {
    if (categoryId === null) {
      fetchUsers();
    } else {
      fetchUsersByCategory(categoryId);
    }
  }, [categoryId]);

  const fetchUsers = () => {
    setLoading(true);
    listUsers()
      .then(res => {
        setUsers(res.data.data || []);
        setMessage(res.data.message ?? '');
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchUsersByCategory = (id: number) => {
    setLoading(true);
    getUsersByCategoryId(id)
      .then(res => {
        setUsers(res.data.data || []);
        setMessage(res.data.message ?? '');
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleAddUser = () => navigate('/add-user');

  const handleEditUser = (user: IUser) => {
    if (user.id !== undefined && user.id !== null) {
      navigate(`/edit-user/${user.id}`);
    }
  };

  const handleDeleteUser = (user: IUser) => {
    if (user.id === undefined || user.id === null) return;

    const confirmed = confirm(
      `Are you sure you want to DELETE the following user?\n${JSON.stringify(
        user,
        null,
        2
      )}`
    );
    if (!confirmed) return;

    // helper (place near top of the component or in a shared util)
    const extractAxiosErrorMessage = (err: any): string => {
      return (
        err?.response?.data?.message ??
        err?.response?.data?.error ?? // sometimes backend returns { error: '...' }
        err?.message ??
        'Unexpected error'
      );
    };

    // usage in handleDeleteUser
    deleteUser(user.id)
      .then(res => {
        // res.data is IApiResponse<IUser>
        const successMsg = res.data?.message ?? '';
        setMessage(successMsg);

        // refetch current view
        if (categoryId === null) fetchUsers();
        else fetchUsersByCategory(categoryId);

        setEmail('');
      })
      .catch(err => {
        const msg = extractAxiosErrorMessage(err);
        console.error('Delete failed:', err);
        setMessage(msg);
      });
  };

  const validateEmail = (): boolean => {
    const trimmedEmail = email.trim();
    const errorsCopy = { ...errors };
    let isValid = true;

    if (!trimmedEmail) {
      errorsCopy.email = 'Email is required.';
      isValid = false;
    } else {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!regex.test(trimmedEmail)) {
        errorsCopy.email = 'Invalid Email Format!';
        isValid = false;
      } else {
        errorsCopy.email = '';
      }
    }

    setErrors(errorsCopy);
    return isValid;
  };

  const handleSearchByEmail = () => {
    if (!validateEmail()) return;

    setLoading(true);
    getUserByEmail(email.trim())
      .then(res => {
        const response = res.data;
        if (response.data) {
          setUsers([response.data]);
          setMessage('');
        } else {
          setUsers([]);
          setMessage(response.message ?? 'No user found.');
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="p-4">
      {message && <h5 className="text-green-600">{message}</h5>}
      <h2 className="text-center text-2xl font-bold mb-4">List Of Users</h2>

      {/* Search & Filter */}
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
          onClick={handleSearchByEmail}
        >
          <MagnifyingGlassIcon className="h-6 w-6 text-cyan-500" />
        </button>

        <CategoryDropdown
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          setMessage={setMessage}
          variant="list"
          onSaved={() => {}}
        />
      </div>

      {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}

      {/* Add User */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2"
          onClick={handleAddUser}
        >
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
          {loading ? (
            <tr>
              <td colSpan={9} className="text-center py-4">
                <div className="flex justify-center items-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id ?? index} className="hover:bg-gray-100">
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
                    onClick={() => handleEditUser(user)}
                  >
                    <PencilIcon className="h-6 w-6 text-yellow-500" />
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDeleteUser(user)}
                  >
                    <TrashIcon className="h-6 w-6 text-cyan-500" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListUserComponent;
