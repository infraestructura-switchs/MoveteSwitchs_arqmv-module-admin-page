import React from 'react';

interface EditFormProps<T> {
  currentItem: T | null;
  showModal: boolean;
  handleCloseModal: () => void;
  handleSave: () => void;
  columns: { key: keyof T; label: string; hiddenInCreate?: boolean; hiddenInEdit?: boolean }[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  renderCustomFormField?: (colKey: keyof T, value: unknown, onChange: (newValue: unknown) => void) => React.ReactNode;
  isEditMode: boolean;
}

const EditForm = <T extends { id: number }>({
  currentItem,
  showModal,
  handleCloseModal,
  handleSave,
  columns,
  handleChange,
  renderCustomFormField,
  isEditMode,
}: EditFormProps<T>) => {

  const editableColumns = columns.filter(col => {
    if (isEditMode && col.hiddenInEdit) return false; 
    if (!isEditMode && col.hiddenInCreate) return false;
    return true; 
  });

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{isEditMode ? 'Editar' : 'Añadir'}</h2>
          <button
            className="text-gray-400 hover:text-gray-600 text-xl"
            onClick={handleCloseModal}
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-4 overflow-y-auto flex-1">
          {currentItem && (
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {editableColumns.map((col) => (
                  <div key={String(col.key)}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{col.label}</label>
                    {renderCustomFormField && renderCustomFormField(col.key, currentItem[col.key], (newValue) => handleChange({ target: { name: String(col.key), value: newValue } } as React.ChangeEvent<HTMLInputElement>))}
                    {(!renderCustomFormField || !renderCustomFormField(col.key, currentItem[col.key], () => {})) && (
                      <input
                        type="text"
                        name={String(col.key)}
                        placeholder={col.label}
                        value={String(currentItem[col.key]) || ''}
                        onChange={handleChange}
                        aria-label={col.label}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
                  onClick={handleSave}
                >
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditForm;
