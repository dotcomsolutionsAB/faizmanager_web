// // SectorContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';

// const FilterContext = createContext();

// export const useFilters = () => {
//   return useContext(FilterContext);
// };

// export const FilterProvider = ({ children }) => {
//   const [sectors, setSectors] = useState([]);
//   const [subSectors, setSubSectors] = useState([]);
//   const [years, setYears] = useState([]);
//   const [loadingSectors, setLoadingSectors] = useState(false);
//   const [loadingSubSectors, setLoadingSubSectors] = useState(false);
//   const [loadingYears, setLoadingYears] = useState(false);

//   // Fetch sectors
//   const fetchSectors = async (token) => {
//     setLoadingSectors(true);
//     try {
//       const response = await fetch('https://api.fmb52.com/api/sector', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       if (data?.data) {
//         const filteredSectors = data.data.filter((sector) => sector.name !== 'Annual Report');
//         setSectors(filteredSectors);
//       }
//     } catch (error) {
//       console.error('Error fetching sectors:', error);
//     } finally {
//       setLoadingSectors(false);
//     }
//   };

//   // Fetch sub-sectors based on selected sector
//  // Fetch sub-sectors based on selected sector
//  const fetchSubSectors = async (token, selectedSector) => {
//     if (!selectedSector.length) return;
//     setLoadingSubSectors(true);
//     try {
//       const sectorToFetch = selectedSector[0];
//       const response = await fetch(`https://api.fmb52.com/api/sub_sector?sector=${sectorToFetch}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error('Failed to fetch sub-sectors');
//       }

//       const data = await response.json();

//       if (data?.data) {
//         // Filter sub-sectors by selected sector
//         const filteredSubSectors = data.data.filter((subSector) => 
//           selectedSector.some(sector => subSector.sector.toUpperCase() === sector.toUpperCase())
//         );
//         setSubSectors(filteredSubSectors);
//       } else {
//         setSubSectors([]);
//       }
//     } catch (error) {
//       console.error('Error fetching sub-sectors:', error);
//       setSubSectors([]);
//     } finally {
//       setLoadingSubSectors(false);
//     }
//   };

  

//   // Fetch years
//   const fetchYears = async (token) => {
//     setLoadingYears(true);
//     try {
//       const response = await fetch('https://api.fmb52.com/api/year', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await response.json();
//       setYears(data?.data || []);
//     } catch (error) {
//       console.error('Error fetching years:', error);
//     } finally {
//       setLoadingYears(false);
//     }
//   };

//   return (
//     <FilterContext.Provider
//       value={{
//         sectors,
//         setSectors,
//         subSectors,
//         setSubSectors,
//         years,
//         setYears,
//         fetchSectors,
//         fetchSubSectors,
//         fetchYears,
//         loadingSectors,
//         loadingSubSectors,
//         loadingYears,
//       }}
//     >
//       {children}
//     </FilterContext.Provider>
//   );
// };
