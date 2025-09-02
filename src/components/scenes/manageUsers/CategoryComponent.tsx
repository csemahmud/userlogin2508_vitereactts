import { useEffect, useState } from 'react';
import { createCategory, updateCategory, getCategoryById } from '@/shared/services/CategoryService';
import { ICategory } from '@/shared/types/interfaces/models/ICategory.type';

interface CategoryComponentProps {
    isOpen: boolean;
    toggle: () => void;
    categoryIdToEdit?: number | null;
    onSaved?: (category: ICategory) => void;
}

const CategoryComponent: React.FC<CategoryComponentProps> = ({
    isOpen,
    toggle,
    categoryIdToEdit,
    onSaved,
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({ name: '' });

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
            id: categoryIdToEdit ? Number(categoryIdToEdit) : undefined,
            name,
            description,
        };

        const action = categoryIdToEdit
            ? updateCategory(Number(categoryIdToEdit), category)
            : createCategory(category);

        action
            .then(res => {
                const data = res.data;
                if (data && typeof data === 'object' && 'id' in data) {
                    setMessage(`Category ${categoryIdToEdit ? 'updated' : 'created'} successfully`);
                    onSaved?.(data as ICategory);
                    toggle(); // close modal after save
                } else if (typeof data === 'string') {
                    setMessage(data);
                } else if ('error' in (data as any)) {
                    setMessage((data as any).error);
                }
            })
            .catch(err => setMessage('Unexpected error occurred'));
    };

    useEffect(() => {
        if (categoryIdToEdit) {
            getCategoryById(Number(categoryIdToEdit))
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
                .catch(() => setMessage('Unexpected error occurred'));
        } else {
            setName('');
            setDescription('');
        }
    }, [categoryIdToEdit, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        {categoryIdToEdit ? 'Update Category' : 'Create Category'}
                    </h2>
                    <button
                        onClick={toggle}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                {/* Message */}
                {message && <p className="text-green-600 mb-4">{message}</p>}

                {/* Form */}
                <form onSubmit={createOrUpdateCategory}>
                    {/* Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={`w-full px-4 py-2 border rounded ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Description:</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="w-full px-4 py-2 border rounded border-gray-300"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={toggle}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            {categoryIdToEdit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CategoryComponent;
