import React from "react";
import { Box, Typography, Chip, IconButton, Stack, Divider } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";

const data = [
  {
    name: "Saifuddin Bhai Kohdawala",
    its: "20364379",
    sector: "BURHANI",
    folio: "B-G06",
    mode: "Cash",
    receiptNo: "150",
    date: "2018-06-10",
    year: "2018",
    amount: "₹1,000",
  },
  {
    name: "Saifuddin Bhai Kohdawala",
    its: "20364379",
    sector: "BURHANI",
    folio: "B-G06",
    mode: "Cash",
    receiptNo: "60",
    date: "2018-05-20",
    year: "2018",
    amount: "₹10,000",
  },
];

const ReceiptCard = ({ receipt }) => {
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        p: 2,
        mb: 2,
        backgroundColor: "#f9f9f9",
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h6">{receipt.name}</Typography>
        <Divider />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`ITS: ${receipt.its}`} variant="outlined" />
          <Chip label={`Sector: ${receipt.sector}`} color="primary" />
          <Chip label={`Folio: ${receipt.folio}`} variant="outlined" />
        </Stack>
        <Divider />
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={`Mode: ${receipt.mode}`} color="secondary" />
          <Chip label={`Receipt No: ${receipt.receiptNo}`} variant="outlined" />
          <Chip label={`Date: ${receipt.date}`} variant="outlined" />
          <Chip label={`Year: ${receipt.year}`} variant="outlined" />
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#4caf50" }}>
            {receipt.amount}
          </Typography>
          <IconButton color="primary">
            <PrintIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

const ThaliDetails = () => {
  return (
    <Box sx={{ p: 4 }}>
      {data.map((receipt, index) => (
        <ReceiptCard key={index} receipt={receipt} />
      ))}
    </Box>
  );
};

export default ThaliDetails;

// import React from "react";
// import { Box, Typography, Tooltip, Stack, IconButton } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";

// const data = [
//   {
//     name: "Saifuddin Bhai Kohdawala",
//     its: "20364379",
//     sector: "BURHANI",
//     folio: "B-G06",
//     mode: "Cash",
//     receiptNo: "150",
//     date: "2018-06-10",
//     year: "2018",
//     comments: "Jfk",
//     amount: "1000",
//   },
//   {
//     name: "Saifuddin Bhai Kohdawala",
//     its: "20364379",
//     sector: "BURHANI",
//     folio: "B-G06",
//     mode: "NEFT",
//     receiptNo: "60",
//     date: "2018-05-20",
//     year: "2018",
//     comments: "Jfk",
//     amount: "10000",
//   },
// ];

// const ReceiptRow = ({ receipt }) => (
//   <Box
//     sx={{
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       mb: 2,
//       p: 1,
//       borderRadius: "8px",
//       border: "1px solid #ddd",
//       backgroundColor: "#f9f9f9",
//     }}
//   >
//     <Tooltip
//       title={
//         <Box sx={{ textAlign: "left", p: 1 }}>
//           <Typography variant="body2">
//             <strong>Sector:</strong> {receipt.sector}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Folio No:</strong> {receipt.folio}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Receipt No:</strong> {receipt.receiptNo}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Year:</strong> {receipt.year}
//           </Typography>
//           <Typography variant="body2">
//             <strong>Comments:</strong> {receipt.comments}
//           </Typography>
//         </Box>
//       }
//       arrow
//     >
//       <Box>
//         <Typography variant="body2" sx={{ fontWeight: "bold" }}>
//           {receipt.name} | ITS: {receipt.its} | Date: {receipt.date}
//         </Typography>
//         <Typography variant="body2" sx={{ color: "#4caf50", fontWeight: "bold" }}>
//           ₹{receipt.amount} | {receipt.mode}
//         </Typography>
//       </Box>
//     </Tooltip>
//     <IconButton color="primary">
//       <PrintIcon />
//     </IconButton>
//   </Box>
// );

// const ThaliDetails = () => {
//   return (
//     <Box sx={{ p: 4 }}>
//       {data.map((receipt, index) => (
//         <ReceiptRow key={index} receipt={receipt} />
//       ))}
//     </Box>
//   );
// };

// export default ThaliDetails;



// import React from "react";
// import Masonry from "react-masonry-css";
// import { Box, Typography, Stack, IconButton } from "@mui/material";
// import PrintIcon from "@mui/icons-material/Print";

// // Sample Data
// const data = [
//   {
//     name: "Saifuddin Bhai Kohdawala",
//     its: "20364379",
//     sector: "BURHANI",
//     folio: "B-G06",
//     mode: "Cash",
//     receiptNo: "150",
//     date: "2018-06-10",
//     year: "2018",
//     comments: "Jfk",
//     amount: "1000",
//   },
//   {
//     name: "Saifuddin Bhai Kohdawala",
//     its: "20364379",
//     sector: "BURHANI",
//     folio: "B-G06",
//     mode: "Cash",
//     receiptNo: "60",
//     date: "2018-05-20",
//     year: "2018",
//     comments: "Jfk",
//     amount: "10000",
//   },
//   // Add more receipts here...
// ];

// const ThaliDetails = () => {
//   // Breakpoint Configuration for Masonry
//   const breakpoints = {
//     default: 3, // Default to 3 columns
//     1100: 2,    // 2 columns for screen widths <= 1100px
//     700: 1,     // 1 column for screen widths <= 700px
//   };

//   return (
//     <Box sx={{ p: 4 }}>
//       <Typography variant="h6" sx={{ mb: 2 }}>
//         Receipt Masonry Layout
//       </Typography>
//       <Masonry
//         breakpointCols={breakpoints}
//         className="masonry-grid"
//         columnClassName="masonry-grid-column"
//       >
//         {data.map((receipt, index) => (
//           <Box
//             key={index}
//             sx={{
//               p: 2,
//               mb: 2,
//               border: "1px solid #ddd",
//               borderRadius: "8px",
//               backgroundColor: "#f9f9f9",
//               boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
//             }}
//           >
//             <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
//               {receipt.date}
//             </Typography>
//             <Stack spacing={1} mt={1}>
//               <Typography variant="body2">
//                 <strong>Name:</strong> {receipt.name}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>ITS:</strong> {receipt.its}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Sector:</strong> {receipt.sector}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Folio No:</strong> {receipt.folio}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Mode:</strong> {receipt.mode}
//               </Typography>
//               <Typography variant="body2">
//                 <strong>Receipt No:</strong> {receipt.receiptNo}
//               </Typography>
//               <Typography
//                 variant="body2"
//                 sx={{ fontWeight: "bold", color: "#4caf50" }}
//               >
//                 <strong>Amount:</strong> ₹{receipt.amount}
//               </Typography>
//             </Stack>
//             <Stack direction="row" justifyContent="flex-end" mt={2}>
//               <IconButton color="primary">
//                 <PrintIcon />
//               </IconButton>
//             </Stack>
//           </Box>
//         ))}
//       </Masonry>
//     </Box>
//   );
// };

// export default ThaliDetails;
