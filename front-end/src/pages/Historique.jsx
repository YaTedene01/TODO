// import React, { useEffect, useState } from 'react';
// import { apiRequest } from '../utils/api';

// const Historique = () => {
//   const [historique, setHistorique] = useState([]);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     apiRequest('/api/historique')
//       .then(setHistorique)
//       .catch(() => setError('Erreur lors du chargement de l\'historique'));
//   }, []);

//   return (
//     <div className="p-8">
//       <h2 className="text-2xl font-bold mb-4">Historique</h2>
//       {error && <div className="text-red-500 mb-2">{error}</div>}
//       {/* <ul>
//         {historique.map(item => (
//           <li key={item.id} className="border-b py-2">
//             <span>{item.action}</span> <span className="text-gray-500">utilisateur({item.userId})</span>
//           </li>
//         ))} */}
//       {/* </ul> */}
//     </div>
//   );
// };

// export default Historique;
