import React, { useState, useMemo } from 'react';
import { TableData, TableColumn } from '../../types/dashboard';
import './DataTable.css';

interface DataTableProps {
  title: string;
  data: TableData[];
  columns: TableColumn[];
  maxRows?: number;
  pageSize?: number;
  searchable?: boolean;
  sortable?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

const DataTable: React.FC<DataTableProps> = ({ 
  title, 
  data, 
  columns, 
  maxRows, 
  pageSize = 10,
  searchable = true,
  sortable = true
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const hasData = data && data.length > 0;

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!hasData || !searchTerm.trim()) return data;
    
    const term = searchTerm.toLowerCase().trim();
    return data.filter((row) => {
      return columns.some((column) => {
        const value = row[column.key];
        if (value === undefined || value === null) return false;
        
        // Handle render functions - try to get the raw value
        const stringValue = String(value).toLowerCase();
        return stringValue.includes(term);
      });
    });
  }, [data, searchTerm, columns, hasData]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      // Handle null/undefined values
      if (aValue === undefined || aValue === null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === undefined || bValue === null) return sortDirection === 'asc' ? 1 : -1;
      
      // Numeric comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // String comparison
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr, 'es', { numeric: true });
      } else {
        return bStr.localeCompare(aStr, 'es', { numeric: true });
      }
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Reset to first page when search term changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Handle sort
  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const formatValue = (value: any, type?: string): string => {
    if (type === 'currency') {
      return `$${value.toFixed(1)}M`;
    }
    if (type === 'number') {
      return value.toLocaleString('es-ES');
    }
    return value;
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortable || sortColumn !== columnKey) {
      return (
        <span className="sort-icon" style={{ opacity: 0.3 }}>
          ↕
        </span>
      );
    }
    
    if (sortDirection === 'asc') {
      return <span className="sort-icon">↑</span>;
    } else if (sortDirection === 'desc') {
      return <span className="sort-icon">↓</span>;
    }
    
    return (
      <span className="sort-icon" style={{ opacity: 0.3 }}>
        ↕
      </span>
    );
  };

  return (
    <div className="data-table-card card">
      <div className="table-header-section">
        <h3 className="table-title">{title}</h3>
        {hasData && (
          <div className="table-info">
            <span className="table-count">
              Mostrando {paginatedData.length} de {sortedData.length} {sortedData.length === 1 ? 'registro' : 'registros'}
              {searchTerm && sortedData.length !== data.length && (
                <span className="table-filtered"> (filtrado de {data.length})</span>
              )}
            </span>
          </div>
        )}
      </div>

      {searchable && hasData && (
        <div className="table-search-container">
          <div className="table-search-wrapper">
            <svg
              className="table-search-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.5 10.5L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="table-search-input"
              placeholder="Buscar en la tabla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="table-search-clear"
                onClick={() => setSearchTerm('')}
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      <div className="table-container">
        {hasData && paginatedData.length > 0 ? (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.key} 
                      className={`table-header ${sortable ? 'sortable' : ''}`}
                      onClick={() => handleSort(column.key)}
                      style={sortable ? { cursor: 'pointer', userSelect: 'none' } : {}}
                    >
                      <div className="table-header-content">
                        <span>{column.title}</span>
                        {sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index} className="table-row">
                    {columns.map((column) => (
                      <td key={column.key} className="table-cell">
                        {column.render 
                          ? column.render(row[column.key], row)
                          : formatValue(row[column.key])
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="table-pagination">
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                >
                  ← Anterior
                </button>
                
                <div className="pagination-info">
                  Página {currentPage} de {totalPages}
                </div>
                
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="table-empty-state">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="table-empty-icon">
              <circle cx="32" cy="32" r="30" stroke="#E5E7EB" strokeWidth="2"/>
              <path d="M32 20V32M32 32L26 26M32 32L38 26" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p className="table-empty-text">
              {searchTerm ? 'No se encontraron resultados' : 'No hay datos disponibles'}
            </p>
            <p className="table-empty-subtext">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : 'Los datos aparecerán aquí cuando estén disponibles'}
            </p>
            {searchTerm && (
              <button
                className="table-search-clear-button"
                onClick={() => setSearchTerm('')}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
