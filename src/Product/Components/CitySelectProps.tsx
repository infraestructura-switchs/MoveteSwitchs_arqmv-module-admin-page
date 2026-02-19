import React, { useEffect, useState } from "react";
import { GetAllCitiesNoPage } from "../API/ProductAPI";
import { CityType } from "../Types/CityType";

interface CitySelectProps {
  value: string;
  onChange: (cityId: string) => void;
}

const CitySelect: React.FC<CitySelectProps> = ({ value, onChange }) => {
  const [cities, setCities] = useState<CityType[]>([]);

  useEffect(() => {
    GetAllCitiesNoPage().then(setCities);
  }, []);

  return (
    <select
      className="block w-full border rounded px-2 py-1"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Seleccione una ciudad</option>
      {cities.map((city) => (
        <option key={city.id} value={city.id}>
          {city.name}
        </option>
      ))}
    </select>
  );
};

export default CitySelect;