import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import utilitiesFile from '@/docs/Utilities.xlsx';

interface ExcelDropdownProps {
  domain: string; // Current selected domain
  setDomain: React.Dispatch<React.SetStateAction<string>>; // Setter function for domain
}

const ExcelDropdown: React.FC<ExcelDropdownProps> = ({ domain, setDomain }) => {
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);
  
  useEffect(() => {
    const loadExcelData = async () => {
      const response = await fetch(utilitiesFile);
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
      const headerRow = jsonData[3]; // Assuming the header is in the 4th row
      const domainIndex = headerRow.indexOf('Domains');

      if (domainIndex === -1) {
        console.error('Domains column not found in the Excel sheet');
        return;
      }

      const domainData = jsonData
        .slice(4) // Skip header rows
        .map((row) => row[domainIndex])
        .filter((item): item is string => typeof item === 'string' && item.trim() !== '');

      const uniqueDomains = Array.from(new Set(domainData)); // Remove duplicates
      setDropdownItems(uniqueDomains);
    };

    loadExcelData();
  }, []);

  return (
    <div>
    <select
        value={domain}
        onChange={(e) => setDomain(e.target.value)} // Update domain value in the parent form
        className="w-full px-4 py-2 border border-gray-300 rounded"
      >
        <option value="" disabled>
          Select a Domain
        </option>
        {dropdownItems.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ExcelDropdown;
