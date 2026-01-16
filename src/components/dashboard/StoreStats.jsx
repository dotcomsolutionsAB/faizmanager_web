import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { PieChart } from "@mui/x-charts/PieChart";
import RefreshIcon from "@mui/icons-material/Refresh";
import CircularProgress from "@mui/material/CircularProgress";
import { useUser } from "../../contexts/UserContext";
import { useEffect, useMemo, useState } from "react";
import divider from "../../assets/divider.png";

export default function StoreStats() {
    const { token } = useUser();
    const base = process.env.REACT_APP_API_BASE || "https://api.fmb52.com/api";

    const [stats, setStats] = useState({
        vendors: 0,
        items: 0,
        dishes: 0,
    });
    const [loading, setLoading] = useState(false);

    const headers = useMemo(
        () => ({
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
        }),
        [token]
    );

    const fetchStats = async () => {
        setLoading(true);
        try {
            const resp = await fetch(`${base}/store/dashboard`, {
                method: "GET",
                headers,
            });

            if (!resp.ok) throw new Error("Error fetching store stats");
            const json = await resp.json();

            const d = json?.data ?? {};
            setStats({
                vendors: Number(d?.vendors) || 0,
                items: Number(d?.items) || 0,
                dishes: Number(d?.dishes) || 0,
            });
        } catch (error) {
            console.error("Error fetching Store stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, base]);

    const total = Number(stats.vendors) + Number(stats.items) + Number(stats.dishes) || 1;

    const chartData = [
        {
            name: "Vendors",
            value: Number(stats.vendors) || 0,
            color: "#14213d",
            percentage: (((Number(stats.vendors) || 0) / total) * 100).toFixed(2),
        },
        {
            name: "Items",
            value: Number(stats.items) || 0,
            color: "#fca311",
            percentage: (((Number(stats.items) || 0) / total) * 100).toFixed(2),
        },
        {
            name: "Dishes",
            value: Number(stats.dishes) || 0,
            color: "#e07a5f",
            percentage: (((Number(stats.dishes) || 0) / total) * 100).toFixed(2),
        },
    ];

    const valueFormatter = (value) => {
        if (!value || !value.value) return "0%";
        const pct = value.percentage || ((value.value / total) * 100).toFixed(2);
        return `${pct}%`;
    };

    // Reusable hover animation style (like your AccountStats vibe)
    const hoverCardSx = {
        borderRadius: 2,
        transition: "all 0.25s ease",
        "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
        },
    };

    return (
        <Card
            sx={{
                minWidth: { xs: 250, sm: 350, md: 500 },
                width: "100%",
                height: { xs: "auto", md: 500 },
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                borderRadius: 2,
                backgroundColor: "#FAFAFA",
                padding: { xs: 1, sm: 2, md: 2 },
            }}
        >
            {/* Heading + Refresh */}
            <Box sx={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, // Stack for small screens
                gap: { xs: 2, sm: 0 }, // Add gap for smaller screens
            }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", textAlign: { xs: "center", sm: "left" } }}>
                    Store Stats
                </Typography>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={fetchStats}
                    disabled={loading}
                    sx={{
                        borderRadius: "50%",
                        padding: 1.5,
                        minWidth: "auto",
                        height: { xs: 35, sm: 40, md: 40 },
                        width: { xs: 35, sm: 40, md: 40 },
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                </Button>
            </Box>

            {/* Divider (same as AccountStats) */}
            <Box
                sx={{
                    width: '100vw', // Full screen width
                    position: 'relative',
                    left: 'calc(-50vw + 50%)', // Align with the screen edges
                    height: {
                        xs: 10, // Height for extra-small screens
                        sm: 15, // Height for small screens
                        md: 15, // Height for medium screens
                        lg: 15, // Height for large screens
                        xl: 15, // Height for extra-large screens
                    },
                    backgroundImage: `url(${divider})`, // Replace with your image path
                    backgroundSize: 'contain', // Ensure the divider image scales correctly
                    backgroundRepeat: 'repeat-x', // Repeat horizontally
                    backgroundPosition: 'center',
                    // my: { xs: 1.5, sm: 2, md: 2.5 }, // Vertical margin adjusted for different screen sizes
                }}
            />

            {/* Main Content */}
            <Grid container sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Left: Chart */}
                <Grid item xs={12} sm={6} md={8} sx={{ order: { xs: 2, sm: 1 } }}>
                    <Card
                        sx={{
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 2,
                        }}
                    >
                        {/* <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "100%",
                                height: "100%",
                                marginLeft: 6,
                            }}
                        >
                            <PieChart
                                series={[
                                    {
                                        data: chartData,
                                        highlightScope: { fade: "global", highlight: "item" },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                                        valueFormatter,
                                    },
                                ]}
                                height={280}
                            />
                        </Box> */}

                        {/* Legend (exact vibe like AccountStats) */}
                        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 3 }}>
                            {chartData.map((entry, index) => (
                                <Box key={index} sx={{ display: 'flex', marginRight: 3, alignItems: 'center' }}>
                                    <Box sx={{ width: 12, height: 12, backgroundColor: entry.color, marginRight: 1, }} />
                                    <Typography variant="body2" sx={{ fontSize: 14 }}>
                                        {entry.name} {entry.percentage}%
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Card>
                </Grid>

                {/* Right: Cards */}
                <Grid item xs={12} sm={4} md={4} sx={{ order: { xs: 1, sm: 2 } }}>
                    <CardContent sx={{ paddingRight: 0.5, paddingLeft: 3 }}>
                        <Grid container direction="column">
                            {[
                                { label: "Total Vendors", value: stats.vendors },
                                { label: "Total Items", value: stats.items },
                                { label: "Total Dishes", value: stats.dishes },
                            ].map((x, idx) => (
                                <Grid item xs={12} sm={4} key={idx}>
                                    <Card
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            padding: {
                                                xs: 1.5, // Default padding for smaller screens
                                                md: 3.6, // Normal padding
                                            },
                                            '@media (min-width: 1100px) and (max-width: 1260px)': {
                                                paddingTop: 4, // Reduced padding for the 1100px to 1260px range
                                                paddingBottom: 4,
                                                paddingRight: 1,
                                                paddingLeft: 1
                                            },
                                            '@media (min-width: 1260px) and (max-width: 1375px)': {
                                                paddingTop: 3.5, // Reduced padding for the 1100px to 1260px range
                                                paddingBottom: 3.5,
                                                paddingRight: 0.5,
                                                paddingLeft: 0.5
                                            },
                                            marginBottom: 2
                                        }}
                                    >
                                        <CardContent>
                                            <Typography
                                                gutterBottom
                                                sx={{
                                                    color: "text.secondary",
                                                    fontSize: { xs: 12, sm: 14 },
                                                    textAlign: "center",
                                                }}
                                            >
                                                {x.label}
                                            </Typography>

                                            <Typography
                                                variant="h6"
                                                align="center"
                                                sx={{
                                                    whiteSpace: 'nowrap', // Prevent text wrapping
                                                    overflow: 'hidden', // Prevent overflow
                                                    textOverflow: 'ellipsis', // Handle long amounts gracefully
                                                    '@media (min-width: 1100px) and (max-width: 1260px)': {
                                                        fontSize: 14 // Reduced padding for the 1100px to 1260px range
                                                    },
                                                }}
                                            >
                                                {x.value}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                </Grid>
            </Grid>
        </Card>
    );
}
