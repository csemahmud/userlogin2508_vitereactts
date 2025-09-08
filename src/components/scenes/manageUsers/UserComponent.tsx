import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUser, createUser, getUserById } from '@/shared/services/UserService';
import ExcelDropdown from './ExcelDropdown';
import CategoryDropdown from './CategoryDropdown';
import type { IUser } from '@/shared/types/interfaces/models/IUser.type';
import type { ICategory } from '@/shared/types/interfaces/models/ICategory.type';

const UserComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPassword, setRawPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [age, setAge] = useState<number | undefined>();
  const [experience, setExperience] = useState<number | undefined>();
  const [salary, setSalary] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<number>(0); // always non-null
  const [imagePath, setImagePath] = useState('');
  const [imageName, setImageName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', rawPassword: '', category: '' });

  const navigate = useNavigate();
  const { id } = useParams();

  // -----------------------------
  // Form Validation
  // -----------------------------
  const validateForm = (): boolean => {
    const newErrors = { ...errors };
    let valid = true;

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
      valid = false;
    } else newErrors.name = '';

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
      valid = false;
    } else if (!/^[\w.%+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) {
      newErrors.email = 'Invalid Email Format!';
      valid = false;
    } else newErrors.email = '';

    if (categoryId <= 0) {
      newErrors.category = 'Category is required.';
      valid = false;
    } else newErrors.category = '';

    setErrors(newErrors);
    return valid;
  };

  // -----------------------------
  // Create or Update User
  // -----------------------------
  const createOrUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const user: IUser = {
      id: id ? Number(id) : undefined,
      name,
      email,
      rawPassword,
      domain,
      age,
      experience,
      salary,
      category: { id: categoryId } as ICategory,
      imagePath,
      imageName,
    };

    const action = id ? updateUser(Number(id), user) : createUser(user);

    action
      .then(res => {
        const data = res.data;
        if (typeof data === 'string') setMessage(data);
        else if ('name' in data) setMessage(`User ${id ? 'updated' : 'created'} successfully`);
        else if ('error' in (data as any)) setMessage((data as any).error);
      })
      .catch(() => setMessage('Unexpected error occurred'));
  };

  // -----------------------------
  // Load User if Editing
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    getUserById(Number(id))
      .then(res => {
        const user = res.data as IUser;
        if (user && typeof user === 'object' && 'name' in user) {
          setName(user.name);
          setEmail(user.email);
          setDomain(user.domain || '');
          setAge(user.age);
          setExperience(user.experience);
          setSalary(user.salary);
          setCategoryId(user.category?.id ?? 0);
          setImagePath(user.imagePath || '');
          setImageName(user.imageName || '');
        } else {
          setMessage(res.data as string);
        }
      })
      .catch(() => setMessage('Unexpected error occurred'));
  }, [id]);

  // -----------------------------
  // Helpers
  // -----------------------------
  const renderNumberInput = (
    label: string,
    value: number | undefined,
    setter: (v: number | undefined) => void
  ) => (
    <div>
      <label className="block text-gray-700 font-medium">{label}:</label>
      <input
        type="number"
        value={value ?? ''}
        onChange={e => setter(e.target.value ? Number(e.target.value) : undefined)}
        className="w-full px-4 py-2 border rounded"
      />
    </div>
  );

  const viewUserList = () => navigate('/users');
  const getOperation = () => (id ? 'Update' : 'Register');

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="p-6">
      {message && <h5 className="text-green-600 mb-2">{message}</h5>}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-center text-2xl font-bold mb-4">{getOperation()} User</h2>
          <form onSubmit={createOrUpdateUser} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium">Name:</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={`w-full px-4 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium">Email:</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full px-4 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium">Password:</label>
              <input
                type="password"
                value={rawPassword}
                onChange={e => setRawPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                placeholder="Enter Password"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium">Category:</label>
              <CategoryDropdown
                categoryId={categoryId}
                setCategoryId={setCategoryId as React.Dispatch<React.SetStateAction<number | null>>}
                setMessage={setMessage}
                onSaved={newCategory => {
                  if (newCategory.id !== undefined) {
                    setCategoryId(newCategory.id); // assign immediately
                    setErrors(prev => ({ ...prev, category: '' })); // clear error
                  }
                }}
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            {/* Domain */}
            <div>
              <label className="block text-gray-700 font-medium">Domain:</label>
              <ExcelDropdown domain={domain} setDomain={setDomain} />
            </div>

            {/* Age, Experience, Salary */}
            <div className="grid grid-cols-3 gap-4">
              {renderNumberInput('Age', age, setAge)}
              {renderNumberInput('Experience', experience, setExperience)}
              <div>
                <label className="block text-gray-700 font-medium">Salary:</label>
                <input
                  type="number"
                  step="0.01"
                  value={salary ?? ''}
                  onChange={e => setSalary(e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
            </div>

            {/* Image */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium">Image Path:</label>
                <input
                  type="text"
                  value={imagePath}
                  onChange={e => setImagePath(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">Image Name:</label>
                <input
                  type="text"
                  value={imageName}
                  onChange={e => setImageName(e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between items-center mt-4">
              <button type="button" onClick={viewUserList} className="bg-blue-500 text-white px-4 py-2 rounded">
                View User List
              </button>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">{getOperation()}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserComponent;
