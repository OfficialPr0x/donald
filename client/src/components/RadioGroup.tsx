import React from 'react';

export interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (name: string, value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  onChange,
  columns = 2,
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(name, e.target.value);
  };

  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }[columns];

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className={`grid ${gridClass} gap-3`}>
        {options.map(option => (
          <label
            key={option.value}
            className="flex items-center p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup; 