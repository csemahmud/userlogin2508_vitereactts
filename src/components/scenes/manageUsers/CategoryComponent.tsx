import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, updateCategory, getCategoryById } from '@/shared/services/CategoryService';
import { ICategory } from '@/shared/types/interfaces/models/ICategory.type';

const CategoryComponent = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({ name: '' });

    const navigate = useNavigate();
    const { id } = useParams();

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors };

        if (!name.trim()) {
            errorsCopy.name = 'Name is required.';
            valid = false;
        } else {
            errorsCopy.name = '';
        }

        setErrors(errorsCopy);
        return valid;
    };

    const createOrUpdateCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const category: ICategory = {
            id: id ? Number(id) : undefined,
            name,
            description,
        };

        const action = id ? updateCategory(Number(id), category) : createCategory(category);
        action
            .then(res => {
                const data = res.data;
                if (data && typeof data === 'object' && 'id' in data) {
                    setMessage(`Category ${id ? 'updated' : 'created'} successfully`);
                } else if (typeof data === 'string') {
                    setMessage(data);
                } else if ('error' in (data as any)) {
                    setMessage((data as any).error);
                }
            })
            .catch(err => setMessage('Unexpected error occurred'));
    };

    const viewCategoryList = () => navigate('/categories');
    const getOperation = () => (id ? 'Update' : 'Create');

    useEffect(() => {
        if (id) {
            getCategoryById(Number(id))
                .then(response => {
                    const data = response.data;
                    if (data && typeof data === 'object' && 'name' in data) {
                        const category = data as ICategory;
                        setName(category.name);
                        setDescription(category.description || '');
                    } else if (typeof data === 'string') {
                        setMessage(data);
                    } else if ('error' in (data as any)) {
                        setMessage((data as any).error);
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
                    <h2 className="text-center text-2xl font-bold mb-4">{getOperation()} Category</h2>
                    <form onSubmit={createOrUpdateCategory}>
                        {/* Name */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Name:</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className={`w-full px-4 py-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium">Description:</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-between items-center mt-4">
                            <button type="button" onClick={viewCategoryList} className="bg-blue-500 text-white px-4 py-2 rounded">
                                View Category List
                            </button>
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                                {getOperation()}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryComponent;
