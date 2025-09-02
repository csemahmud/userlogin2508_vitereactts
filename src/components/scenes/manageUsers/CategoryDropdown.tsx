import React, { useEffect, useState } from 'react';
import { ICategory } from '@/shared/types/interfaces/models/ICategory.type';
import { listCategories } from '@/shared/services/CategoryService';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import CategoryComponent from './CategoryComponent';

interface CategoryDropdownProps {
  categoryId: number | null;
  setCategoryId: React.Dispatch<React.SetStateAction<number | null>>;
  onEdit?: (category: ICategory) => void;
  onDelete?: (category: ICategory) => void;
  onAdd?: () => void;
  setMessage?: (msg: string) => void;
  variant?: 'default' | 'list';
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categoryId,
  setCategoryId,
  onEdit,
  onDelete,
  onAdd,
  setMessage = (message) => { console.log(message); },
  variant = 'default'
}) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Modal states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryIdToEdit, setCategoryIdToEdit] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const response = await listCategories();
      const data = response.data;
      if (data && Array.isArray(data) && data.length > 0 && 'name' in data[0]) {
        setCategories(data as ICategory[]);
        setMessage('');
      } else if (typeof data === 'string') {
        setMessage(data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const toggleCategoryModal = () => setIsCategoryModalOpen(!isCategoryModalOpen);

  const displayedCategories =
    variant === 'list'
      ? [{ id: 0, name: 'All Categories', description: '' }, ...categories]
      : categories;

  const handleAddCategory = () => {
    setCategoryIdToEdit(null); // create
    setIsOpen(false);          // close dropdown
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (category: ICategory) => {
    setCategoryIdToEdit(category.id ? category.id : null); // edit
    setIsOpen(false);                 // close dropdown
    setIsCategoryModalOpen(true);
  };

  const handleCategorySaved = (savedCategory: ICategory) => {
    // Refresh category list automatically
    fetchCategories();

    // Optionally select the saved category
    setCategoryId(savedCategory.id ? savedCategory.id : null);
  };

  return (
    <div className="relative w-64">
      <button
        onClick={toggleDropdown}
        className="w-full px-4 py-2 border border-gray-300 rounded flex justify-between items-center bg-white"
      >
        {variant === 'list'
          ? categoryId === 0 || categoryId === null
            ? 'All Categories'
            : categories.find(cat => cat.id === categoryId)?.name || 'Select a Category'
          : categories.find(cat => cat.id === categoryId)?.name || 'Select a Category'}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          {displayedCategories.map(category => (
            <div
              key={category.id}
              className={`flex justify-between items-center px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                variant === 'list' && category.id === (categoryId ?? 0)
                  ? 'bg-blue-100 font-semibold'
                  : ''
              }`}
              onClick={() => {
                const id = category.id ?? 0;
                setCategoryId(variant === 'list' ? (id !== 0 ? id : null) : id);
                setIsOpen(false);
              }}
            >
              <span>{category.name}</span>
              {category.id !== 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); handleEditCategory(category); }}
                    title="Edit"
                  >
                    <PencilIcon className="h-5 w-5 text-yellow-500" />
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onDelete?.(category); }}
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          ))}

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
