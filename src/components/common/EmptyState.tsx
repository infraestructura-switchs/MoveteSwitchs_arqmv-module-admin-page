import React from "react";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onAction: () => void;
}

export function EmptyState({
  title,
  subtitle,
  buttonText,
  onAction,
}: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-6 px-4 border border-dashed border-gray-400 rounded-lg"
      style={{ backgroundColor: "#EAEAEA" }}
    >
      <div className="text-center max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{subtitle}</p>
        <button
          onClick={onAction}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#F72E41] text-white rounded-full font-medium hover:bg-opacity-90 transition-colors"
        >
          <Plus size={20} />
          <span>{buttonText}</span>
        </button>
      </div>
    </div>
  );
}
