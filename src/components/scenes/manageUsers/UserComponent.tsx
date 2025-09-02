import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUser, createUser, getUserById } from '@/shared/services/UserService';
import ExcelDropdown from './ExcelDropdown';
import CategoryDropdown from './CategoryDropdown';
import { ICategory } from '@/shared/types/interfaces/models/ICategory.type';
import type { IUser } from '@/shared/types/interfaces/models/IUser.type';

const UserComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rawPassword, setRawPassword] = useState('');
    const [domain, setDomain] = useState('');
    const [age, setAge] = useState<number | undefined>();
    const [experience, setExperience] = useState<number | undefined>();
    const [salary, setSalary] = useState<number | undefined>();
    const [category, setCategory] = useState<ICategory>({ id: 0, name: '', description: '' });
    const [imagePath, setImagePath] = useState('');
    const [imageName, setImageName] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({
        name: '', email: '', rawPassword: '', category: ''
    });

    const navigate = useNavigate();
    const { id } = useParams();

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (!name.trim()) { errorsCopy.name = 'Name is required.'; valid = false; } else { errorsCopy.name = ''; }
        if (!email.trim()) { errorsCopy.email = 'Email is required.'; valid = false; }
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) { errorsCopy.email = 'Invalid Email Format!'; valid = false; } else { errorsCopy.email = ''; }

        if (!category) { errorsCopy.category = 'Category is required.'; valid = false; } else { errorsCopy.category = ''; }

        setErrors(errorsCopy);
        return valid;
    };

    const createOrUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const user = {
            id: id ? Number(id) : undefined,
            name,
            email,
            rawPassword,
            domain,
            age,
            experience,
            salary,
            category,
            imagePath,
            imageName
        };

        const action = id ? updateUser(Number(id), user) : createUser(user);
        action
        .then(res => {
            const data = res.data;
            if (typeof data === 'string') {
                setMessage(data); // backend returned a string message
            } else if ('name' in data) {
                // backend returned a user object
                setMessage(`User ${id ? 'updated' : 'created'} successfully`);
            } else if ('error' in (data as any)) {
                setMessage((data as any).error);
            }
        })
        .catch(err => {
            console.error(err);
            setMessage('Unexpected error occurred');
        });
    };

    const viewUserList = () => navigate('/users');
    const getOperation = () => (id ? 'Update' : 'Register');

    useEffect(() => {
        if (id) {
            getUserById(Number(id))
                .then(response => {
                    const data = response.data;
                    
                    // Runtime check: if data has 'name' property, treat it as IUser
                    if (data && typeof data === 'object' && 'name' in data) {
                        const user = data as IUser;
                        setName(user.name);
                        setEmail(user.email);
                        setDomain(user.domain || '');
                        setAge(user.age);
                        setExperience(user.experience);
                        setSalary(user.salary);
                        setCategory(user.category || null);
                        setImagePath(user.imagePath || '');
                        setImageName(user.imageName || '');
                    } else {
                        // data is string (error message)
                        setMessage(data as string);
                    }
                })
                .catch(err => setMessage('Unexpected error occurred'));
        }
    }, [id]);

    return (
        <div className="p-6">
            <h5 className="text-green-600">{message}</h5>
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-md rounded p-6">
                    <h2 className="text-center text-2xl font-bold mb-4">{getOperation()} User</h2>
                    <form onSubmit={createOrUpdateUser}>
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Name:</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)}
                                className={`w-full px-4 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Email:</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                className={`w-full px-4 py-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Password:</label>
                            <input type="password" value={rawPassword} onChange={e => setRawPassword(e.target.value)}
                                className="w-full px-4 py-2 border rounded" placeholder="Enter Password" />
                        </div>

                        {/* Category */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Category:</label>
                            <CategoryDropdown
                                categoryId={category?.id || null}
                                setCategoryId={(id) => setCategory(categories => ({ id: id || 0, name: '', description: '' }))}
                                onEdit={() => {}}
                                onDelete={() => {}}
                                onAdd={() => {}}
                                setMessage={setMessage}
                            />
                            {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                        </div>

                        {/* Domain */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Domain:</label>
                            <ExcelDropdown domain={domain} setDomain={setDomain} />
                        </div>

                        {/* Age, Experience, Salary */}
                        <div className="mb-4 grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Age:</label>
                                <input type="number" value={age} onChange={e => setAge(Number(e.target.value))}
                                    className="w-full px-4 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Experience:</label>
                                <input type="number" value={experience} onChange={e => setExperience(Number(e.target.value))}
                                    className="w-full px-4 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Salary:</label>
                                <input type="number" step="0.01" value={salary} onChange={e => setSalary(Number(parseFloat(e.target.value)))}
                                    className="w-full px-4 py-2 border rounded" />
                            </div>
                        </div>

                        {/* Image */}
                        <div className="mb-4 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Image Path:</label>
                                <input type="text" value={imagePath} onChange={e => setImagePath(e.target.value)}
                                    className="w-full px-4 py-2 border rounded" />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-medium">Image Name:</label>
                                <input type="text" value={imageName} onChange={e => setImageName(e.target.value)}
                                    className="w-full px-4 py-2 border rounded" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between items-center mt-4">
                            <button type="button" onClick={viewUserList} className="bg-blue-500 text-white px-4 py-2 rounded">View User List</button>
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">{getOperation()}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserComponent;
