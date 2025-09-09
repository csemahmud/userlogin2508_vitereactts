import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUser, createUser, getUserById } from '@/shared/services/UserService';
import ExcelDropdown from './ExcelDropdown';
import CategoryDropdown from './CategoryDropdown';
import type { IUser } from '@/shared/types/interfaces/models/IUser.type';
import type { ICategory } from '@/shared/types/interfaces/models/ICategory.type';
import Swal from 'sweetalert2';

// -----------------------------
// Helper Components
// -----------------------------
const TextInput = ({
  label,
  value,
  setter,
  type = 'text',
  error,
  placeholder,
}: {
  label: string;
  value: string;
  setter: (v: string) => void;
  type?: string;
  error?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}:</label>
    <input
      type={type}
      value={value}
      onChange={e => setter(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);

const NumberInput = ({
  label,
  value,
  setter,
  step = 1,
}: {
  label: string;
  value: number | undefined;
  setter: (v: number | undefined) => void;
  step?: number;
}) => (
  <div>
    <label className="block text-gray-700 font-medium">{label}:</label>
    <input
      type="number"
      step={step}
      value={value ?? ''}
      onChange={e => setter(e.target.value ? Number(e.target.value) : undefined)}
      className="w-full px-4 py-2 border rounded"
    />
  </div>
);

// -----------------------------
// Main Component
// -----------------------------
const UserComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // -----------------------------
  // State
  // -----------------------------
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rawPassword, setRawPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [age, setAge] = useState<number | undefined>();
  const [experience, setExperience] = useState<number | undefined>();
  const [salary, setSalary] = useState<number | undefined>();
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [imagePath, setImagePath] = useState('');
  const [imageName, setImageName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    rawPassword: '',
    confirmPassword: '',
    category: '',
  });

  // -----------------------------
  // Validation
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
      newErrors.email = 'Invalid email format.';
      valid = false;
    } else newErrors.email = '';

    if (!rawPassword.trim()) {
      newErrors.rawPassword = 'Password is required.';
      valid = false;
    } else newErrors.rawPassword = '';

    if (rawPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    } else newErrors.confirmPassword = '';

    if (!categoryId || categoryId <= 0) {
      newErrors.category = 'Category is required.';
      valid = false;
    } else newErrors.category = '';

    setErrors(newErrors);
    return valid;
  };

  // -----------------------------
  // Load User Data
  // -----------------------------
  useEffect(() => {
    if (!id) return;
    getUserById(Number(id))
      .then(res => {
        const user = res.data as IUser;
        if (user?.name) {
          setName(user.name);
          setEmail(user.email);
          setDomain(user.domain || '');
          setAge(user.age);
          setExperience(user.experience);
          setSalary(user.salary);
          setCategoryId(user.category?.id ?? null);
          setImagePath(user.imagePath || '');
          setImageName(user.imageName || '');
        } else setMessage(res.data as string);
      })
      .catch(() => setMessage('Unexpected error occurred'));
  }, [id]);

  // -----------------------------
  // Submit Handler
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
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
      category: { id: categoryId! } as ICategory,
      categoryId: categoryId!,
      imagePath,
      imageName,
    };

    try {
      const response = id ? await updateUser(Number(id), user) : await createUser(user);
      const data = response.data;

      const msg =
        typeof data === 'string'
          ? data
          : 'error' in data && typeof data.error === 'string'
          ? data.error
          : `User ${id ? 'updated' : 'created'} successfully`;

      setMessage(msg);
      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: msg,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#f3f4f6',
      });
    } catch (err: any) {
      const msg = err.response?.data?.error ?? 'Unexpected error occurred';
      setMessage(msg);
      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: msg,
        showConfirmButton: false,
        timer: 2000,
        background: '#1f2937',
        color: '#f3f4f6',
      });
    }
  };

  // -----------------------------
  // Navigation Helpers
  // -----------------------------
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput label="Name" value={name} setter={setName} error={errors.name} />
            <TextInput label="Email" value={email} setter={setEmail} type="email" error={errors.email} />
            <TextInput label="Password" value={rawPassword} setter={setRawPassword} type="password" error={errors.rawPassword} placeholder="Enter Password" />
            <TextInput label="Confirm Password" value={confirmPassword} setter={setConfirmPassword} type="password" error={errors.confirmPassword} placeholder="Confirm Password" />

            <div>
              <label className="block text-gray-700 font-medium">Category:</label>
              <CategoryDropdown
                categoryId={categoryId}
                setCategoryId={setCategoryId as React.Dispatch<React.SetStateAction<number | null>>}
                setMessage={setMessage}
                onSaved={newCategory => {
                  if (newCategory.id) setCategoryId(newCategory.id);
                  setErrors(prev => ({ ...prev, category: '' }));
                }}
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              <p>Selected Category Id: {categoryId}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Domain:</label>
              <ExcelDropdown domain={domain} setDomain={setDomain} />
              <p>Selected Domain: {domain}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <NumberInput label="Age" value={age} setter={setAge} />
              <NumberInput label="Experience" value={experience} setter={setExperience} />
              <NumberInput label="Salary" value={salary} setter={setSalary} step={0.01} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Image Path" value={imagePath} setter={setImagePath} />
              <TextInput label="Image Name" value={imageName} setter={setImageName} />
            </div>

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
