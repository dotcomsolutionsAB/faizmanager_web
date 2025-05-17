import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation } from 'react-router-dom'; // Import useLocation from react-router-dom

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation(); // Get the current location
  const pathnames = location.pathname.split('/').filter((x) => x); // Split the pathname and filter out empty parts

  // Map route paths to breadcrumb labels
  const breadcrumbNameMap = {
    '/dashboard': 'Dashboard',
    // '/thali-information': 'Thali Information',
    '/mumeneen': 'Mumeneen',
    '/payments': 'Payments',
    '/receipts': 'Receipts',
    '/expenses': 'Expenses',
    '/sector': 'Sector',
    '/sub_sector': 'Sub Sector',
    '/transfers': 'Transfers',
    '/zabihat': 'Zabihat',
    '/salawat_fateha': 'Salawat/Fateha',
    '/niyaz_date': 'Niyaz Date',
    '/feedback': 'Feedback',
    '/notifications': 'Notifications',
    '/settings': 'Settings',
    '/roles': 'Roles',
    '/user_access': 'User Access',
    '/niyaz': 'Niyaz',
    '/menu': 'Menu',
    // Add more paths and labels as needed
  };

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {pathnames.length === 0 ? (
        <Typography variant="body1" sx={{ pl: 2 }}>
          {breadcrumbNameMap['/']}
        </Typography>
      ) : (
        pathnames.map((value, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return isLast ? (
            <Typography
              key={routeTo}
              variant="body1"
              sx={{ color: 'text.primary', fontWeight: 600 }}
            >
              {breadcrumbNameMap[routeTo]}
            </Typography>
          ) : (
            <Typography
              key={routeTo}
              variant="body1"
              sx={{ pl: 2, cursor: 'pointer' }}
              onClick={() => window.location.assign(routeTo)} // Navigate to the route when clicked
            >
              {breadcrumbNameMap[routeTo]}
            </Typography>
          );
        })
      )}
    </StyledBreadcrumbs>
  );
}
