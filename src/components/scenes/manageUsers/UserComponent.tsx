import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUser, createUser, getUserById } from '@/shared/services/UserService';
import ExcelDropdown from './ExcelDropdown';

const UserComponent = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [domain, setDomain] = useState('');
    const [age, setAge] = useState(0);
    const [experience, setExperience] = useState(0);
    const [salary, setSalary] = useState(0);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({ name: '', email: '' });

    const navigate = useNavigate();
    const { id } = useParams();

    const createOrUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            const user = { id: id ? Number(id) : undefined, name, email, domain, age, experience, salary };

            if (id) {
                updateUser(user)
                    .then(response => {
                        setMessage(response.data);
                    })
                    .catch(error => console.error(error));
            } else {
                createUser(user)
                    .then(response => {
                        setMessage(response.data);
                    })
                    .catch(error => console.error(error));
            }
        }
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (name.trim()) {
            errorsCopy.name = '';
        } else {
            errorsCopy.name = 'Name is required.';
            valid = false;
        }

        if (email.trim()) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (emailRegex.test(email)) {
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

    const viewUserList = () => navigate('/users');

    const getOperation = () => (id ? 'Update' : 'Register');

    useEffect(() => {
        if (id) {
            getUserById(Number(id)).then(response => {
                const { name, email, domain, age, experience, salary } = response.data;
                setName(name);
                setEmail(email);
                setDomain(domain);
                setAge(age);
                setExperience(experience);
                setSalary(salary);
            });
        }
    }, [id]);

    return (
        <div className="p-6">
            <h5 className="text-green-600">{message}</h5>
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-md rounded p-6">
                    <h2 className="text-center text-2xl font-bold mb-4">{getOperation()} User</h2>
                    <form onSubmit={createOrUpdateUser}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Name:</label>
                            <input
                                type="text"
                                placeholder="Enter User Name"
                                value={name}
                                className={`w-full px-4 py-2 border rounded ${
                                    errors.name ? 'border-red-500' : 'border-gray-300'
                                }`}
                                onChange={e => setName(e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Email:</label>
                            <input
                                type="email"
                                placeholder="Enter Email"
                                value={email}
                                className={`w-full px-4 py-2 border rounded ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                onChange={e => setEmail(e.target.value)}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Domain:</label>
                            <ExcelDropdown domain={domain} setDomain={setDomain} />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Age:</label>
                            <input
                                type="number"
                                placeholder="Enter Age"
                                value={age}
                                className="w-full px-4 py-2 border rounded"
                                onChange={e => setAge(Number(e.target.value))}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Experience:</label>
                            <input
                                type="number"
                                placeholder="Enter Experience"
                                value={experience}
                                className="w-full px-4 py-2 border rounded"
                                onChange={e => setExperience(Number(e.target.value))}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Salary:</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Enter Salary"
                                value={salary}
                                className="w-full px-4 py-2 border rounded"
                                onChange={e => setSalary(Number(parseFloat(e.target.value)))}
                            />
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={viewUserList}
                            >
                                View User List
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                {getOperation()}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserComponent;
