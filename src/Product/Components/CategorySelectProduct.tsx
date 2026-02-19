import React from 'react';
import GenericSelect from '../../GeneralComponents/GeneralCrud/SelectGeneral';
import { CategoryTypes } from '../../Category/Types/CategoryTypes';
import { GetAllCategoryNoPage } from '../../Category/API/Category';

const fetchCategorys = async (): Promise<CategoryTypes[]> => {
  const CategoryData = await GetAllCategoryNoPage();
  return CategoryData || [];
};

const CategorySelect: React.FC<{ selectedValue: number, onChange: (newValue: number) => void }> = ({ selectedValue, onChange }) => {
  return (
    <GenericSelect
      fetchData={fetchCategorys} 
      selectedValue={selectedValue}
      onChange={onChange}
      labelKey="categoryType" 
      valueKey="id"             
      placeholder="Seleccione una categoría"
    />
  );
};

export default CategorySelect;
