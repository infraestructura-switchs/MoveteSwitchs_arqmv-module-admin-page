import React from "react";
import { Clock, DollarSign } from "lucide-react";
import { statusTable } from "../../utils/mesaUtils"; 
import { TableProps } from "../../types/TableType"; 

type Props = {
  table: TableProps;
  onClick: (tableNumber: string) => void;  
};

const mesero = "/assets/img/mesero.png";
const pagar_cuenta = "/assets/img/pagar_cuenta.png";

const UprightChair: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`absolute bg-white w-4 h-9 rounded-xl shadow-sm ${className}`} />
);

const HorizontalChair: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`absolute bg-white w-10 h-6 rounded-xl shadow-sm ${className}`} />
);
export const Table: React.FC<Props> = ({ table, onClick }) => {
  const time = table.timeOccupied ?? "0:00h";
  const bill = typeof table.currentBill === "number" ? table.currentBill : 0;
  const mesa = `M${table.number}`;

  const ui = statusTable[table.status] ?? statusTable[1]; 
  const label = table.statusLabel ?? ui.label;
  const ringColor = table.statusBorder ? table.statusBorder.replace("border", "ring") : ui.ring;
  const textColor = table.statusText ?? ui.text;

  return (
    <div className="relative" onClick={() => onClick(table.number)}>
      <HorizontalChair className="-top-3 left-1/2 -translate-x-1/2" />                  
      <UprightChair className="-right-3 top-1/2 -translate-y-1/2" />    
      <HorizontalChair className="bottom-[-13px] left-1/2 -translate-x-1/2" />       
      <UprightChair className="-left-3 top-1/2 -translate-y-1/2" />                  

      {table.orders && table.orders > 0 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold z-10">
          +{table.orders}
        </div>
      )}

      <div className={`relative bg-white rounded-[16px] shadow-sm border border-gray-100 ring-4 ring-offset-2 ring-offset-white ${ringColor} p-2`}>
        {table.status >= 2 && (
          <div className="pointer-events-none absolute inset-0 rounded-[16px] ring-4 ring-orange-300/60" />
        )}

        <div className="text-center relative z-10">
          <div className="text-xs font-semibold text-gray-600 mb-1">{mesa}</div>

          <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-1">
            <Clock size={14} />
            <span>{time}</span>
          </div>

          <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-2">
            <DollarSign size={14} />
            <span>{bill.toLocaleString()}</span>
          </div>

          <div className={`text-sm font-medium ${textColor}`}>{label}</div>
        </div>

        {table.status === 3 && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 translate-y-[-50%] bg-white rounded-full p-1">
            <img src={mesero} alt="Mesero" className="w-9 h-9" />
          </div>
        )}
          {table.status === 5 && (
          <div className="absolute top-0 right-0 transform translate-x-1/2 translate-y-[-50%] bg-white rounded-full p-1">
            <img src={pagar_cuenta} alt="Mesero" className="w-9 h-9" />
          </div>
        )}
      </div>
    </div>
  );
};