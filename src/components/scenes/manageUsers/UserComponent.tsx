import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUser, createUser, getUserById } from '@/shared/services/UserService';
import ExcelDropdown from './ExcelDropdown';
import CategoryDropdown from './CategoryDropdown';
import type { IUser, ICategory } from '@/shared/types/interfaces';
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
  const [loading, setLoading] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);

  // -----------------------------
  // Load User Data
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    getUserById(Number(id))
      .then(res => {
        const user = res.data.data;
        if (user) {
          setName(user.name);
          setEmail(user.email);
          setDomain(user.domain || '');
          setAge(user.age);
          setExperience(user.experience);
          setSalary(user.salary);
          setCategoryId(user.categoryId ?? null);
          setImagePath(user.imagePath || '');
          setImageName(user.imageName || '');
        } else {
          setMessage(res.data.message ?? 'User not found');
        }
      })
      .catch(() => setMessage('Unexpected error occurred'))
      .finally(() => setLoading(false));
  }, [id]);

  // -----------------------------
  // Real-time Password Validation
  // -----------------------------
  useEffect(() => {
    if (!confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
      setPasswordMatch(false);
    } else if (rawPassword !== confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
      setPasswordMatch(false);
    } else {
      setErrors(prev => ({ ...prev, confirmPassword: '' }));
      setPasswordMatch(true);
    }
  }, [rawPassword, confirmPassword]);

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
      newErrors.email = 'Invalid email format.';
      valid = false;
    } else newErrors.email = '';

    if (id === undefined) {
      if (!rawPassword.trim()) {
        newErrors.rawPassword = 'Password is required.';
        valid = false;
      } else newErrors.rawPassword = '';

      if (!confirmPassword.trim()) {
        newErrors.confirmPassword = 'Please confirm your password.';
        valid = false;
      } else if (!passwordMatch) {
        newErrors.confirmPassword = 'Passwords do not match.';
        valid = false;
      }
    }

    if (!categoryId || categoryId <= 0) {
      newErrors.category = 'Category is required.';
      valid = false;
    } else newErrors.category = '';

    setErrors(newErrors);
    return valid;
  };

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

    setLoading(true);
    try {
      const response = id ? await updateUser(Number(id), user) : await createUser(user);
      const msg = response.data.message ?? `User ${id ? 'updated' : 'created'} successfully`;
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

      // Reset form if creating a new user
      if (!id) {
        setName('');
        setEmail('');
        setRawPassword('');
        setConfirmPassword('');
        setDomain('');
        setAge(undefined);
        setExperience(undefined);
        setSalary(undefined);
        setCategoryId(null);
        setImagePath('');
        setImageName('');
        setErrors({
          name: '',
          email: '',
          rawPassword: '',
          confirmPassword: '',
          category: '',
        });
        setPasswordMatch(false);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Unexpected error occurred';
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
    } finally {
      setLoading(false);
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
      {loading && <div className="text-center mb-2">Loading...</div>}
      {message && <h5 className="text-green-600 mb-2">{message}</h5>}

      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-center text-2xl font-bold mb-4">{getOperation()} User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextInput label="Name" value={name} setter={setName} error={errors.name} />
            <TextInput label="Email" value={email} setter={setEmail} type="email" error={errors.email} />

            {/* Password fields only for new user */}
            {id === undefined && (
              <>
                <TextInput
                  label="Password"
                  value={rawPassword}
                  setter={setRawPassword}
                  type="password"
                  error={errors.rawPassword}
                  placeholder="Enter Password"
                />
                <div>
                  <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    setter={setConfirmPassword}
                    type="password"
                    error={errors.confirmPassword}
                    placeholder="Confirm Password"
                  />
                  {passwordMatch && <p className="text-green-500 text-sm mt-1">Password has matched</p>}
                </div>
              </>
            )}

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium">Category:</label>
              <CategoryDropdown
                categoryId={categoryId ?? 0}
                setCategoryId={setCategoryId}
                setMessage={setMessage}
                onSaved={newCategory => {
                  if (newCategory.id) setCategoryId(newCategory.id);
                  setErrors(prev => ({ ...prev, category: '' }));
                }}
              />
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            {/* Domain */}
            <div>
              <label className="block text-gray-700 font-medium">Domain:</label>
              <ExcelDropdown domain={domain} setDomain={setDomain} />
            </div>

            {/* Numbers */}
            <div className="grid grid-cols-3 gap-4">
              <NumberInput label="Age" value={age} setter={setAge} />
              <NumberInput label="Experience" value={experience} setter={setExperience} />
              <NumberInput label="Salary" value={salary} setter={setSalary} step={0.01} />
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <TextInput label="Image Path" value={imagePath} setter={setImagePath} />
              <TextInput label="Image Name" value={imageName} setter={setImageName} />
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
