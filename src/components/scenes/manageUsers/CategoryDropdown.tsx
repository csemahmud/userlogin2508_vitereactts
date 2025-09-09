import React, { useEffect, useRef, useState } from 'react';
import { ICategory } from '@/shared/types/interfaces/models/ICategory.type';
import { deleteCategory, listCategories } from '@/shared/services/CategoryService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import CategoryComponent from './CategoryComponent';
import Swal from 'sweetalert2';

interface CategoryDropdownProps {
  categoryId: number | null;
  setCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
  setMessage?: (msg: string) => void;
  variant?: 'default' | 'list';
  onSaved?: (category: ICategory) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categoryId,
  setCategoryId,
  setMessage = console.log,
  variant = 'default',
  onSaved,
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryIdToEdit, setCategoryIdToEdit] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await listCategories();
      const data = response.data;

      if (Array.isArray(data) && data.length > 0 && 'name' in data[0]) {
        setCategories(data as ICategory[]);
        setMessage('');
      } else if (typeof data === 'string') {
        setCategories([]);
        setMessage(data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setMessage('Failed to fetch categories');
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => setIsOpen(prev => !prev);
  const toggleCategoryModal = () => setIsCategoryModalOpen(prev => !prev);

  const displayedCategories =
    variant === 'list'
      ? [{ id: 0, name: 'All Categories', description: '' }, ...categories]
      : categories;

  const handleAddCategory = () => {
    setCategoryIdToEdit(null);
    setIsOpen(false);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: ICategory) => {
    setCategoryIdToEdit(category.id ?? null);
    setIsOpen(false);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySaved = (savedCategory: ICategory) => {
    fetchCategories();
    if (savedCategory.id !== undefined && savedCategory.id !== null) {
      setCategoryId(savedCategory.id);
    }
    onSaved?.(savedCategory);
  };

  const getCategoryLabel = (catId: number | null) => {
    if (variant === 'list' && (catId === 0 || catId === null)) return 'All Categories';
    return categories.find(cat => cat.id === catId)?.name || 'Select a Category';
  };

  const handleSelectCategory = (id: number | undefined) => {
    const selectedId = id ?? 0;
    const newValue = variant === 'list' ? (selectedId !== 0 ? selectedId : null) : selectedId;
    setCategoryId(newValue);
    setIsOpen(false);
  };

  const handleDeleteCategory = async (category: ICategory) => {
    if (!category.id) return;

    const result = await Swal.fire({
      title: 'Confirm Delete:',
      text: `Are you sure you want to DELETE this category?\n${JSON.stringify(category, null, 2)}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#f3f4f6',
      customClass: {
        confirmButton: 'px-4 py-2 bg-red-600 text-white rounded',
        cancelButton: 'px-4 py-2 bg-blue-600 text-white rounded',
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteCategory(category.id);
      const msg =
        typeof res.data === 'string'
          ? res.data
          : res.data?.message ?? res.data?.error ?? '';
      setMessage(msg);
      await Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'info',
        title: msg,
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        background: '#1f2937',
        color: '#f3f4f6',
      });

      if (categoryId === category.id) setCategoryId(null);
      fetchCategories();
    } catch (err: any) {
      const msg = err.response?.data?.error ?? 'Unexpected error';
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

  return (
    <div className="relative w-64" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        className="w-full px-4 py-2 border border-gray-300 rounded flex justify-between items-center bg-white"
      >
        {getCategoryLabel(categoryId)}
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
          />
        </svg>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          {displayedCategories.map(category => (
            <div
              key={category.id}
              className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                variant === 'list' && category.id === (categoryId ?? 0) ? 'bg-blue-100 font-semibold' : ''
              }`}
              onClick={() => handleSelectCategory(category.id)}
            >
              <span>{category.name}</span>

              {category.id !== 0 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5 text-yellow-500" />
                  </button>

                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleDeleteCategory(category);
                    }}
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add New Category */}
          <div
            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
            onClick={handleAddCategory}
          >
            <PlusIcon className="h-5 w-5 text-green-500 mr-2" />
            <span>Add New Category</span>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <CategoryComponent
        isOpen={isCategoryModalOpen}
        toggle={toggleCategoryModal}
        categoryIdToEdit={categoryIdToEdit}
        onSaved={handleCategorySaved}
      />
    </div>
  );
};

export default CategoryDropdown;
