import { useEffect, useState } from 'react';
import {
  createCategory,
  updateCategory,
  getCategoryById,
} from '@/shared/services/CategoryService';
import { ICategory, IApiResponse } from '@/shared/types/interfaces';
import Swal from 'sweetalert2';

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

  const createOrUpdateCategory = async () => {
    if (!validateForm()) return;

    const category: ICategory = {
      id: categoryIdToEdit ?? undefined,
      name,
      description,
    };

    try {
      const res = categoryIdToEdit
        ? await updateCategory(categoryIdToEdit, category)
        : await createCategory(category);

      const apiResponse: IApiResponse<ICategory> = res.data;
      const savedCategory = apiResponse.data;
      const msg = apiResponse.message || 'Operation successful';

      if (savedCategory) {
        setMessage(msg);
        onSaved?.(savedCategory);
        toggle(); // close modal
      } else {
        setMessage(msg);
      }

      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: savedCategory ? 'success' : 'info',
        title: msg,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#f3f4f6',
      });
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Unexpected error';
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

  useEffect(() => {
    if (!isOpen) return;

    if (categoryIdToEdit) {
      getCategoryById(categoryIdToEdit)
        .then((res) => {
          const apiResponse: IApiResponse<ICategory | null> = res.data;
          const category = apiResponse.data;
          setMessage(apiResponse.message);

          if (category) {
            setName(category.name);
            setDescription(category.description || '');
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onKeyDown={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {categoryIdToEdit ? 'Update Category' : 'Create Category'}
          </h2>
          <button
            type="button"
            onClick={toggle}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        {/* Message */}
        {message && <p className="text-green-600 mb-4">{message}</p>}

        {/* Form Content */}
        <div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
              className={`w-full px-4 py-2 border rounded ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
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
              type="button"
              onClick={createOrUpdateCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {categoryIdToEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryComponent;
