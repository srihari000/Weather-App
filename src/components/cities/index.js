import React, { useState, useMemo } from 'react';
import './index.css';
import { Link } from 'react-router-dom';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

function City({ cities, handleOffsetChange }) {
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
        filteredCities = filteredCities.filter(city =>
            Object.keys(filters).every(key =>
                filters[key] === '' ||
                (city[key] &&
                    city[key].toString().toLowerCase().includes(filters[key].toLowerCase()))
            )
        );

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
    function calculateRowHeight(index) {
        // Replace with actual calculation determining the row height.
        return 50;
    }
    return (
        <div style={{ height: '100vh' }}>
            <h2>Cities List</h2>
            <div className="city-table" style={{ height: '100vh', width: '100vh' }}>
                <div>
                    <div onClick={handleHeaderClick('name')}>
                        <span className="colomn_title">Name</span>
                        {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? ' ⬆️' : '⬇️ ') : ''}
                        <br />
                        <input
                            type="text"
                            placeholder="Filter"
                            value={filters.name}
                            onChange={handleFilterChange('name')}
                            className="filter-input"
                            onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking on the input
                        />
                    </div>
                    <div onClick={handleHeaderClick('country_code')}>
                        <span className="colomn_title">Country Name </span>
                        {sortConfig.key === 'country_code' ? (sortConfig.direction === 'ascending' ? ' ⬆️' : '⬇️ ') : ''}
                        <br />
                        <input
                            type="text"
                            placeholder="Filter"
                            value={filters.country_code}
                            onChange={handleFilterChange('country_code')}
                            className="filter-input"
                            onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking on the input
                        />
                    </div>
                    <div onClick={handleHeaderClick('population')}>
                        <span className="colomn_title">TimeZone</span>
                        {sortConfig.key === 'population' ? (sortConfig.direction === 'ascending' ? ' ⬆️' : '⬇️ ') : ''}
                        <br />
                        <input
                            type="text"
                            placeholder="Filter"
                            value={filters.population}
                            onChange={handleFilterChange('population')}
                            className="filter-input"
                            onClick={(e) => e.stopPropagation()} // Prevent sorting when clicking on the input
                        />
                    </div>
                </div>
                <div style={{ height: '100vh', width: '100vh' }}>
                    <AutoSizer>

                        {({ height, width }) => (
                            <List
                                className="List"
                                height={height}
                                itemCount={sortedAndFilteredCities.length}
                                itemSize={index => calculateRowHeight(index)} // Replace with logic to get dynamic height
                                width={width}
                                onItemsRendered={({ visibleStopIndex }) => {
                                    if (visibleStopIndex === cities.length - 1) {
                                        handleOffsetChange(prev => prev + 100)
                                    }
                                }}
                            >
                                {({ index, style }) => {
                                    const city = sortedAndFilteredCities[index];
                                    return (
                                        <div className="table_row" style={style} key={city.geoname_id}>
                                            <div className="table_data_name">
                                                <Link className="custom_link" to={`/weather?city_name=${city.name}`} >
                                                    {city.name}
                                                </Link>
                                            </div>
                                            <div className="table_data_country">{city.cou_name_en}</div>
                                            <div className="table_data_timezone">{city.timezone}</div>
                                        </div>
                                    );
                                }}
                            </List>
                        )}

                    </AutoSizer>
                </div>
            </div>
        </div>
    );


}

export default City;
