import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  CssBaseline,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { DataGridPro } from "@mui/x-data-grid-pro";

import AppTheme from "../../styles/AppTheme";
import { useUser } from "../../contexts/UserContext";
import dividerImg from "../../assets/divider.png";

const safeStr = (v, fallback = "N/A") =>
  v === null || v === undefined || v === "" ? fallback : String(v);

const joinArr = (arr) =>
  Array.isArray(arr) ? arr.filter(Boolean).join(", ") : "N/A";

const chipForThaliStatus = (status) => {
  const s = status ?? "unknown";
  switch (s) {
    case "taking":
      return { label: "Taking", color: "success" };
    case "not_taking":
      return { label: "Not Taking", color: "error" };
    default:
      return { label: "N/A", color: "default" };
  }
};

// ✅ sector ordering requested
const SECTOR_ORDER = ["BURHANI", "EZZY", "MOHAMMEDI", "SHUJAI", "ZAINY"];
const OTHER_SECTOR = "OTHER";
const UNKNOWN_SECTOR = "UNKNOWN";

// parse "1.2" -> [1,2], "2" -> [2,0], "1.10" -> [1,10]
const parseSubSector = (v) => {
  const s = String(v || "").trim();
  if (!s) return [999, 999];
  const parts = s.split(".").map((x) => parseInt(x, 10));
  const a = Number.isFinite(parts[0]) ? parts[0] : 999;
  const b = Number.isFinite(parts[1]) ? parts[1] : 0;
  return [a, b];
};

const compareSubSector = (a, b) => {
  const [a1, a2] = parseSubSector(a);
  const [b1, b2] = parseSubSector(b);
  if (a1 !== b1) return a1 - b1;
  return a2 - b2;
};

// Masool can have sector_names array -> pick a "primary" sector for grouping
const getMasoolPrimarySector = (masool) => {
  const arr = Array.isArray(masool?.sector_names) ? masool.sector_names : [];
  return arr[0] || "UNKNOWN";
};

// Masool can have sub_sector_names array -> take smallest for ordering
const getMasoolPrimarySubSector = (masool) => {
  const arr = Array.isArray(masool?.sub_sector_names)
    ? masool.sub_sector_names
    : [];
  if (!arr.length) return "";
  return [...arr].sort(compareSubSector)[0];
};

export default function MasoolHierarchy() {
  const { token } = useUser();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [query, setQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("ALL");

  const showSnack = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://api.fmb52.com/api/masool_musaid_hof",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result?.message || "Failed to fetch data.");
        return;
      }

      setData(Array.isArray(result?.data) ? result.data : []);
    } catch (e) {
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Sector dropdown options (fixed order first + any extras + ALL)
  const sectorOptions = useMemo(() => {
  const set = new Set();

  data.forEach((block) => {
    const masool = block?.masool || {};
    (masool?.sector_names || []).forEach((s) => s && set.add(String(s).toUpperCase()));
    (block?.musaids || []).forEach((m) => {
      const musaid = m?.musaid || {};
      if (musaid?.sector_name) set.add(String(musaid.sector_name).toUpperCase());
    });
  });

  const all = Array.from(set);

  const fixed = SECTOR_ORDER.filter((s) => all.includes(s));
  const extras = all
    .filter((s) => !SECTOR_ORDER.includes(s) && s !== OTHER_SECTOR && s !== UNKNOWN_SECTOR)
    .sort((a, b) => a.localeCompare(b));

  const hasOther = all.includes(OTHER_SECTOR);
  const hasUnknown = all.includes(UNKNOWN_SECTOR);

  return [
    "ALL",
    ...fixed,
    ...extras,
    ...(hasOther ? [OTHER_SECTOR] : []),
    ...(hasUnknown ? [UNKNOWN_SECTOR] : []),
  ];
}, [data]);

  // ✅ filter + search + sort musaids by sub-sector
  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchText = (text) => safeStr(text, "").toLowerCase().includes(q);

    const matchesSectorFilter = (masool, musaids) => {
      if (sectorFilter === "ALL") return true;

      const masoolHas =
        Array.isArray(masool?.sector_names) &&
        masool.sector_names
          .map((x) => String(x).toUpperCase())
          .includes(sectorFilter);

      const musaidHas = (musaids || []).some(
        (m) =>
          String(m?.musaid?.sector_name || "").toUpperCase() === sectorFilter
      );

      return masoolHas || musaidHas;
    };

    return data
      .map((block) => {
        const masool = block?.masool || {};
        const musaids = Array.isArray(block?.musaids) ? block.musaids : [];

        // sector filter
        if (!matchesSectorFilter(masool, musaids)) return null;

        // if no query, keep block but sort musaids
        if (!q) {
          const sortedMusaids = [...musaids].sort((a, b) =>
            compareSubSector(
              a?.musaid?.sub_sector_name,
              b?.musaid?.sub_sector_name
            )
          );
          return { ...block, musaids: sortedMusaids };
        }

        // query match
        const masoolHit =
          matchText(masool?.its) ||
          matchText(masool?.name) ||
          matchText(joinArr(masool?.sector_names)) ||
          matchText(joinArr(masool?.sub_sector_names));

        const filteredMusaids = musaids
          .map((m) => {
            const musaid = m?.musaid || {};
            const hofs = Array.isArray(m?.hofs) ? m.hofs : [];

            const musaidHit =
              matchText(musaid?.its) ||
              matchText(musaid?.name) ||
              matchText(musaid?.sector_name) ||
              matchText(musaid?.sub_sector_name);

            const filteredHofs = hofs.filter((h) => {
              return (
                matchText(h?.its) ||
                matchText(h?.name) ||
                matchText(h?.mobile) ||
                matchText(h?.email) ||
                matchText(h?.thali_status)
              );
            });

            const finalHofs = musaidHit ? hofs : filteredHofs;
            return musaidHit || finalHofs.length > 0
              ? { ...m, hofs: finalHofs }
              : null;
          })
          .filter(Boolean)
          .sort((a, b) =>
            compareSubSector(
              a?.musaid?.sub_sector_name,
              b?.musaid?.sub_sector_name
            )
          );

        return masoolHit || filteredMusaids.length > 0
          ? { ...block, musaids: filteredMusaids }
          : null;
      })
      .filter(Boolean);
  }, [data, query, sectorFilter]);

  // ✅ group masools by sector in required order, and sort each by sub-sector
  const groupedBySector = useMemo(() => {
    // Build all sector names present
    const present = new Set();

    filteredData.forEach((block) => {
        const masool = block?.masool || {};
        const primary = String(getMasoolPrimarySector(masool) || UNKNOWN_SECTOR).toUpperCase();
        present.add(primary);
    });

    // Order: fixed first, then extras, then OTHER last, then UNKNOWN last-last
    const fixed = SECTOR_ORDER.filter((s) => present.has(s));

    const extras = Array.from(present)
        .filter((s) => !SECTOR_ORDER.includes(s) && s !== OTHER_SECTOR && s !== UNKNOWN_SECTOR)
        .sort((a, b) => a.localeCompare(b));

    const orderedSectors = [
        ...fixed,
        ...extras,
        ...(present.has(OTHER_SECTOR) ? [OTHER_SECTOR] : []),
        ...(present.has(UNKNOWN_SECTOR) ? [UNKNOWN_SECTOR] : []),
    ];

    // Buckets
    const buckets = {};
    orderedSectors.forEach((s) => (buckets[s] = []));

    filteredData.forEach((block) => {
        const masool = block?.masool || {};
        const primarySector = String(getMasoolPrimarySector(masool) || UNKNOWN_SECTOR).toUpperCase();

        if (!buckets[primarySector]) buckets[primarySector] = [];
        buckets[primarySector].push(block);
    });

    // Sort each sector by masool primary sub-sector (as you already do)
    Object.keys(buckets).forEach((k) => {
        buckets[k] = buckets[k].sort((a, b) => {
        const aSub = getMasoolPrimarySubSector(a?.masool);
        const bSub = getMasoolPrimarySubSector(b?.masool);
        return compareSubSector(aSub, bSub);
        });
    });

    return orderedSectors.map((sector) => ({
        sector,
        items: buckets[sector] || [],
    }));
    }, [filteredData]);

  // ✅ NEW: totals per sector + overall total (based on currently visible groupedBySector)
  const sectorTotals = useMemo(() => {
    const map = {};
    groupedBySector.forEach(({ sector, items }) => {
      const totalHouses = items.reduce((sum, blk) => {
        const v = Number(blk?.masool?.totals?.total_hofs ?? 0);
        return sum + (Number.isFinite(v) ? v : 0);
      }, 0);

      map[sector] = {
        totalHouses,
        masools: items.length,
      };
    });
    return map;
  }, [groupedBySector]);

  const overallTotalHouses = useMemo(() => {
    return Object.values(sectorTotals).reduce(
      (sum, v) => sum + Number(v?.totalHouses ?? 0),
      0
    );
  }, [sectorTotals]);

  const hofColumns = useMemo(
    () => [
      {
        field: "photo_url",
        headerName: "",
        width: 66,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
          <Avatar
            src={params.value || undefined}
            alt="HOF"
            sx={{ width: 34, height: 34 }}
          />
        ),
      },
      { field: "its", headerName: "ITS", width: 120 },
      { field: "name", headerName: "Name", flex: 1, minWidth: 240 },
      { field: "mobile", headerName: "Mobile", width: 160 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 220 },
      { field: "family_count", headerName: "Family", width: 90 },
      {
        field: "thali_status",
        headerName: "Thaali",
        width: 130,
        renderCell: (params) => {
          const { label, color } = chipForThaliStatus(params.value);
          return (
            <Chip
              size="small"
              variant="outlined"
              color={color}
              label={label}
              sx={{ textTransform: "capitalize" }}
            />
          );
        },
      },
      {
        field: "missing_in_its_data",
        headerName: "Missing",
        width: 110,
        renderCell: (params) => (
          <Chip
            size="small"
            variant="outlined"
            color={Number(params.value) > 0 ? "error" : "success"}
            label={Number(params.value) > 0 ? "Yes" : "No"}
          />
        ),
      },
    ],
    []
  );

  // ✅ Color system (Masool / Musaid / Mumineen)
  const COLORS = {
    masoolBg: "#EAF2FF", // soft blue
    musaidBg: "#FFF7E6", // soft amber
    hofsBg: "#F7F7F7", // soft gray
    border: "#E8E8E8",
    textSoft: "text.secondary",
  };

  return (
    <AppTheme>
      <CssBaseline />

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          mt: 5,
          pt: 9,
          pr: 2,
          pb: 3,
          pl: 2,
        }}
      >
        <Paper
          sx={{
            width: "100%",
            boxShadow: 1,
            overflowX: "auto",
            p: 1,
            "@media (max-width: 600px)": { p: 1 },
          }}
        >
          {/* Header + Filters */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                marginBottom: 1,
                padding: "8px 16px",
                borderRadius: 1,
              }}
            >
              Masool / Musaid Hierarchy (HOF)
            </Typography>

            {/* ✅ NEW: Overall Total Houses */}
            <Chip
              size="small"
              variant="outlined"
              color="success"
              label={`Overall Total Houses: ${overallTotalHouses}`}
              sx={{ fontWeight: 800 }}
            />

            <Box sx={{ flex: 1 }} />

            {/* Sector Filter */}
            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 220 } }}>
              <InputLabel>Sector</InputLabel>
              <Select
                label="Sector"
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
              >
                {sectorOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Search */}
            <TextField
              size="small"
              placeholder="Search masool / musaid / hof..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ minWidth: { xs: "100%", sm: 340 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Top Divider strip */}
          <Box
            sx={{
              width: "calc(100% + 48px)",
              position: "relative",
              height: { xs: 10, sm: 15, md: 15, lg: 15, xl: 15 },
              backgroundImage: `url(${dividerImg})`,
              backgroundSize: "contain",
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
              mb: 2,
              marginLeft: "-24px",
              marginRight: "-24px",
            }}
          />

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredData.length === 0 ? (
            <Typography sx={{ px: 1, py: 2, color: COLORS.textSoft }}>
              No records found.
            </Typography>
          ) : (
            <Box sx={{ pb: 1 }}>
              {groupedBySector.map(({ sector, items }) => {
                if (!items.length) return null;

                // if user chose sector filter, show only that
                if (sectorFilter !== "ALL" && sector !== sectorFilter) return null;

                const sectorHouseTotal = sectorTotals?.[sector]?.totalHouses ?? 0;
                const sectorMasools = sectorTotals?.[sector]?.masools ?? items.length;

                return (
                  <Box key={sector} sx={{ mb: 2 }}>
                    {/* Sector Header */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 1,
                        py: 1,
                        borderRadius: 2,
                        background: "#fff",
                        border: `1px solid ${COLORS.border}`,
                      }}
                    >
                      <Typography sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
                        SECTOR: <span style={{ fontWeight: 900 }}>{sector}</span>
                      </Typography>

                      <Divider sx={{ flex: 1 }} />

                      <Chip
                        size="small"
                        variant="outlined"
                        label={`Masools: ${sectorMasools}`}
                      />

                      {/* ✅ NEW: Total Houses per sector */}
                      <Chip
                        size="small"
                        variant="outlined"
                        color="success"
                        label={`Total Houses: ${sectorHouseTotal}`}
                        sx={{ fontWeight: 800 }}
                      />
                    </Box>

                    {/* Fancy divider strip between sectors */}
                    <Box
                      sx={{
                        width: "100%",
                        height: 12,
                        backgroundImage: `url(${dividerImg})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "repeat-x",
                        backgroundPosition: "center",
                        mt: 1,
                        mb: 1,
                        opacity: 0.9,
                      }}
                    />

                    {/* Masools inside sector */}
                    <Box>
                      {items.map((block, idx) => {
                        const masool = block?.masool || {};
                        const musaids = Array.isArray(block?.musaids)
                          ? block.musaids
                          : [];

                        const totalHofs = masool?.totals?.total_hofs ?? 0;
                        const missingMasool = masool?.totals?.missing_in_its ?? 0;

                        const masoolSectors = joinArr(masool?.sector_names);
                        const masoolSubSectors = joinArr(
                            Array.isArray(masool?.sub_sector_names)
                                ? [...masool.sub_sector_names].sort(compareSubSector)
                                : []
                        );

                        return (
                          <Accordion
                            key={`${masool?.its || "masool"}-${sector}-${idx}`}
                            sx={{
                              mb: 1.2,
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: 2,
                              overflow: "hidden",
                              "&:before": { display: "none" },
                            }}
                          >
                            {/* MASOOL HEADER */}
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                backgroundColor: COLORS.masoolBg,
                                "& .MuiAccordionSummary-content": { my: 1 },
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  gap: 1.5,
                                  alignItems: "center",
                                  width: "100%",
                                  pr: 1,
                                }}
                              >
                                <Avatar
                                  src={masool?.photo_url || undefined}
                                  alt="Masool"
                                  sx={{ width: 46, height: 46 }}
                                />

                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Typography
                                    sx={{ fontWeight: 800, lineHeight: 1.2 }}
                                  >
                                    {safeStr(masool?.name)}
                                  </Typography>

                                  {/* Columns: ITS | Sector | Sub Sector */}
                                  <Box
                                    sx={{
                                      display: "grid",
                                      gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "140px 1fr 1fr",
                                      },
                                      gap: 0.8,
                                      mt: 0.6,
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 12,
                                        color: COLORS.textSoft,
                                      }}
                                    >
                                      <b>ITS:</b> {safeStr(masool?.its)}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: 12,
                                        color: COLORS.textSoft,
                                      }}
                                    >
                                      <b>Sector:</b>{" "}
                                      <span style={{ fontWeight: 800 }}>
                                        {masoolSectors}
                                      </span>
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: 12,
                                        color: COLORS.textSoft,
                                      }}
                                    >
                                      <b>Sub-Sector:</b> {masoolSubSectors}
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Totals */}
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  flexWrap="wrap"
                                  useFlexGap
                                >
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    label={`Musaids: ${musaids.length}`}
                                  />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    color="success"
                                    label={`Total HOFs: ${totalHofs}`}
                                  />
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    color={
                                      Number(missingMasool) > 0
                                        ? "error"
                                        : "success"
                                    }
                                    label={`Missing: ${missingMasool}`}
                                  />
                                </Stack>
                              </Box>
                            </AccordionSummary>

                            <AccordionDetails sx={{ pt: 1 }}>
                              {musaids.length === 0 ? (
                                <Typography sx={{ color: COLORS.textSoft }}>
                                  No musaids found under this masool.
                                </Typography>
                              ) : (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 1.2,
                                  }}
                                >
                                  {musaids.map((m, mi) => {
                                    const musaid = m?.musaid || {};
                                    const totals = m?.totals || {};
                                    const hofs = Array.isArray(m?.hofs)
                                      ? m.hofs
                                      : [];

                                    const musaidTotalHofs =
                                      totals?.total_hofs ?? 0;
                                    const musaidMissing =
                                      totals?.missing_in_its ?? 0;

                                    const rows = hofs.map((h, hi) => ({
                                      id: `${musaid?.its || "musaid"}-${
                                        h?.its || hi
                                      }-${hi}`,
                                      its: safeStr(h?.its),
                                      name: safeStr(h?.name),
                                      mobile: safeStr(h?.mobile),
                                      email: safeStr(h?.email),
                                      photo_url: h?.photo_url || "",
                                      family_count: Number(
                                        h?.family_count ?? 0
                                      ),
                                      thali_status: h?.thali_status ?? null,
                                      missing_in_its_data: Number(
                                        h?.missing_in_its_data ?? 0
                                      ),
                                    }));

                                    return (
                                      <Accordion
                                        key={`${musaid?.its || "m"}-${mi}`}
                                        sx={{
                                          border: `1px solid ${COLORS.border}`,
                                          borderRadius: 2,
                                          overflow: "hidden",
                                          "&:before": { display: "none" },
                                        }}
                                      >
                                        {/* MUSAID HEADER */}
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          sx={{
                                            backgroundColor: COLORS.musaidBg,
                                            "& .MuiAccordionSummary-content": {
                                              my: 1,
                                            },
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              gap: 1.2,
                                              alignItems: "center",
                                              width: "100%",
                                              pr: 1,
                                            }}
                                          >
                                            {/* Pointer */}
                                            <Tooltip title="Musaid">
                                              <Box
                                                sx={{
                                                  display: "flex",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  width: 34,
                                                  height: 34,
                                                  borderRadius: 2,
                                                  border: `1px solid ${COLORS.border}`,
                                                  backgroundColor: "#fff",
                                                }}
                                              >
                                                <ArrowRightAltIcon fontSize="small" />
                                              </Box>
                                            </Tooltip>

                                            <Avatar
                                              src={musaid?.photo_url || undefined}
                                              alt="Musaid"
                                              sx={{ width: 40, height: 40 }}
                                            />

                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                              <Typography
                                                sx={{
                                                  fontWeight: 800,
                                                  lineHeight: 1.2,
                                                }}
                                              >
                                                {safeStr(musaid?.name)}
                                              </Typography>

                                              {/* Columns: ITS | Sector | SubSector | Total HOF | Missing */}
                                              <Box
                                                sx={{
                                                  display: "grid",
                                                  gridTemplateColumns: {
                                                    xs: "1fr",
                                                    md: "140px 1fr 1fr 140px 120px",
                                                  },
                                                  gap: 0.8,
                                                  mt: 0.6,
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: COLORS.textSoft,
                                                  }}
                                                >
                                                  <b>ITS:</b> {safeStr(musaid?.its)}
                                                </Typography>

                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: COLORS.textSoft,
                                                  }}
                                                >
                                                  <b>Sector:</b>{" "}
                                                  <span style={{ fontWeight: 800 }}>
                                                    {safeStr(musaid?.sector_name)}
                                                  </span>
                                                </Typography>

                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: COLORS.textSoft,
                                                  }}
                                                >
                                                  <b>Sub-Sector:</b>{" "}
                                                  {safeStr(musaid?.sub_sector_name)}
                                                </Typography>

                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: COLORS.textSoft,
                                                  }}
                                                >
                                                  <b>Total HOF:</b>{" "}
                                                  <span style={{ fontWeight: 800 }}>
                                                    {musaidTotalHofs}
                                                  </span>
                                                </Typography>

                                                <Typography
                                                  sx={{
                                                    fontSize: 12,
                                                    color: COLORS.textSoft,
                                                  }}
                                                >
                                                  <b>Missing:</b>{" "}
                                                  <span style={{ fontWeight: 800 }}>
                                                    {musaidMissing}
                                                  </span>
                                                </Typography>
                                              </Box>
                                            </Box>

                                            <Stack
                                              direction="row"
                                              spacing={1}
                                              alignItems="center"
                                              flexWrap="wrap"
                                              useFlexGap
                                            >
                                              <Chip
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                label={`Shown: ${rows.length}`}
                                              />
                                            </Stack>
                                          </Box>
                                        </AccordionSummary>

                                        {/* HOF SECTION */}
                                        <AccordionDetails
                                          sx={{
                                            pt: 1,
                                            backgroundColor: COLORS.hofsBg,
                                          }}
                                        >
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              mb: 1,
                                              gap: 1,
                                              flexWrap: "wrap",
                                            }}
                                          >
                                            <Typography sx={{ fontWeight: 800 }}>
                                              Mumineen (HOF) List
                                            </Typography>

                                            <Stack
                                              direction="row"
                                              spacing={1}
                                              alignItems="center"
                                              flexWrap="wrap"
                                              useFlexGap
                                            >
                                              <Chip
                                                size="small"
                                                variant="outlined"
                                                color="success"
                                                label={`Total HOF: ${musaidTotalHofs}`}
                                              />
                                              <Chip
                                                size="small"
                                                variant="outlined"
                                                color={
                                                  Number(musaidMissing) > 0
                                                    ? "error"
                                                    : "success"
                                                }
                                                label={`Missing: ${musaidMissing}`}
                                              />
                                            </Stack>
                                          </Box>

                                          <Divider sx={{ mb: 1 }} />

                                          <Box sx={{ height: 430, width: "100%" }}>
                                            <DataGridPro
                                              rows={rows}
                                              columns={hofColumns}
                                              disableSelectionOnClick
                                              pagination
                                              pageSize={10}
                                              rowsPerPageOptions={[10, 25, 50]}
                                              onRowClick={(params) => {
                                                showSnack(
                                                  `HOF selected: ${params.row.name} (ITS: ${params.row.its})`,
                                                  "info"
                                                );
                                              }}
                                              sx={{
                                                backgroundColor: "#fff",
                                                borderRadius: 2,
                                                border: `1px solid ${COLORS.border}`,
                                                "& .MuiDataGrid-columnHeaders": {
                                                  backgroundColor: "#f5f5f5",
                                                },
                                                "& .MuiDataGrid-cell": {
                                                  color: "#555",
                                                },
                                              }}
                                            />
                                          </Box>
                                        </AccordionDetails>
                                      </Accordion>
                                    );
                                  })}
                                </Box>
                              )}
                            </AccordionDetails>
                          </Accordion>
                        );
                      })}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </AppTheme>
  );
}