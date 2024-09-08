import React, { useState, useMemo } from 'react';
import './index.css';

function City({ cities }) {
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [filters, setFilters] = useState({
        name: '',
        country_code: '',
        population: '',
        elevation: ''
    });

    const sortedAndFilteredCities = useMemo(() => {
        let filteredCities = [...cities];
        // Apply filtering based on column values
        console.log('111111111111111111', filteredCities, filters)
        filteredCities = filteredCities.filter(city =>
            Object.keys(filters).every(key =>
                filters[key] === '' ||
                (city[key] &&
                    city[key].toString().toLowerCase().includes(filters[key].toLowerCase()))
            )
        );

        console.log('FFFFFFFFFFFFFFFF', filteredCities)

        // Apply sorting
        if (sortConfig !== null) {
            filteredCities.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filteredCities;
    }, [cities, sortConfig, filters]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const handleFilterChange = (key) => (event) => {
        const value = event.target.value;
        console.log('Filtering by', key, ':', value); // Debugging output
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value
        }));
    };

    // Helper function to handle header click and prevent propagation
    const handleHeaderClick = (key) => (event) => {
        event.stopPropagation(); // Prevents the click event from reaching the filter inputs
        requestSort(key);
    };

    return (
        <div>
            <h2>City List</h2>
            <table className="city-table">
                <thead>
                    <tr>
                        <th onClick={handleHeaderClick('name')}>
                            Name
                            {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽') : ''}
                            <br />
                            <input
                                type="text"
                                placeholder="Filter"
                                value={filters.name}
                                onChange={handleFilterChange('name')}
                                className="filter-input"
                                onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking on the input
                            />
                        </th>
                        <th onClick={handleHeaderClick('country_code')}>
                            Country Code
                            {sortConfig.key === 'country_code' ? (sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽') : ''}
                            <br />
                            <input
                                type="text"
                                placeholder="Filter"
                                value={filters.country_code}
                                onChange={handleFilterChange('country_code')}
                                className="filter-input"
                                onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking on the input
                            />
                        </th>
                        <th onClick={handleHeaderClick('population')}>
                            Population
                            {sortConfig.key === 'population' ? (sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽') : ''}
                            <br />
                            <input
                                type="text"
                                placeholder="Filter"
                                value={filters.population}
                                onChange={handleFilterChange('population')}
                                className="filter-input"
                                onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking on the input
                            />
                        </th>
                        <th onClick={handleHeaderClick('elevation')}>
                            Elevation
                            {sortConfig.key === 'elevation' ? (sortConfig.direction === 'ascending' ? ' 🔼' : ' 🔽') : ''}
                            <br />
                            <input
                                type="text"
                                placeholder="Filter"
                                value={filters.elevation}
                                onChange={handleFilterChange('elevation')}
                                className="filter-input"
                                onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking on the input
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedAndFilteredCities.map(city => (
                        <tr key={city.geoname_id}>
                            <td>{city.name}</td>
                            <td>{city.country_code}</td>
                            <td>{city.population}</td>
                            <td>{city.elevation || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default City;
