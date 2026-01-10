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

// ✅ tiffin segments (handle variants from API)
const SEGMENTS = ["house", "joint", "extra_house", "external"];
const prettySegment = (s) =>
  ({
    house: "House",
    joint: "Joint",
    extra_house: "Extra House",
    external: "External",
  }[s] || "N/A");

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
  return arr[0] || UNKNOWN_SECTOR;
};

// Masool can have sub_sector_names array -> take smallest for ordering
const getMasoolPrimarySubSector = (masool) => {
  const arr = Array.isArray(masool?.sub_sector_names)
    ? masool.sub_sector_names
    : [];
  if (!arr.length) return "";
  return [...arr].sort(compareSubSector)[0];
};

// ✅ segment counter helpers
const emptySegmentCounts = () =>
  SEGMENTS.reduce((acc, k) => {
    acc[k] = 0;
    return acc;
  }, {});

// ✅ FIX: normalize API variants:
// "extra_house", "extra house", "extrahouse", "extra-house"
// "external", "outstation", etc. (if any) -> external (only if you want; currently only maps obvious variants)
const normalizeSegment = (v) => {
  const raw = String(v ?? "").trim().toLowerCase();
  if (!raw) return null;

  const s = raw.replace(/\s+/g, "_").replace(/-+/g, "_");
  if (SEGMENTS.includes(s)) return s;

  // extra house variants
  if (["extrahouse", "extra_house", "extra__house", "extra"].includes(s))
    return "extra_house";

  // external variants (kept conservative)
  if (["external", "externals"].includes(s)) return "external";

  return null;
};

const addCounts = (a, b) => {
  const out = { ...emptySegmentCounts() };
  SEGMENTS.forEach((k) => {
    out[k] = Number(a?.[k] ?? 0) + Number(b?.[k] ?? 0);
  });
  return out;
};

const countFromHofs = (hofs) => {
  const c = emptySegmentCounts();
  (hofs || []).forEach((h) => {
    const seg = normalizeSegment(h?.tiffin_segment);
    if (seg) c[seg] += 1;
  });
  return c;
};

const sumSegmentCountsFromMusaids = (musaids) => {
  return (musaids || []).reduce((acc, m) => {
    const hofs = Array.isArray(m?.hofs) ? m.hofs : [];
    return addCounts(acc, countFromHofs(hofs));
  }, emptySegmentCounts());
};

// ✅ 35 (height) x 25 (width) image avatar, not circular
const Photo = ({ src, alt }) => (
  <Avatar
    variant="rounded"
    src={src || undefined}
    alt={alt || ""}
    sx={{
      height: 35,
      width: 25,
      borderRadius: 1,
      "& img": {
        objectFit: "cover",
      },
    }}
  />
);

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

  // ✅ Sector dropdown options
  const sectorOptions = useMemo(() => {
    const set = new Set();

    data.forEach((block) => {
      const masool = block?.masool || {};
      (masool?.sector_names || []).forEach(
        (s) => s && set.add(String(s).toUpperCase())
      );
      (block?.musaids || []).forEach((m) => {
        const musaid = m?.musaid || {};
        if (musaid?.sector_name)
          set.add(String(musaid.sector_name).toUpperCase());
      });
    });

    const all = Array.from(set);

    const fixed = SECTOR_ORDER.filter((s) => all.includes(s));
    const extras = all
      .filter(
        (s) =>
          !SECTOR_ORDER.includes(s) &&
          s !== OTHER_SECTOR &&
          s !== UNKNOWN_SECTOR
      )
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

        if (!matchesSectorFilter(masool, musaids)) return null;

        if (!q) {
          const sortedMusaids = [...musaids].sort((a, b) =>
            compareSubSector(
              a?.musaid?.sub_sector_name,
              b?.musaid?.sub_sector_name
            )
          );
          return { ...block, musaids: sortedMusaids };
        }

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
                matchText(h?.family_id) ||
                matchText(h?.its) ||
                matchText(h?.name) ||
                matchText(h?.mobile) ||
                matchText(h?.thali_status) ||
                matchText(h?.tiffin_segment)
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

  // ✅ group masools by sector order + sort by sub-sector
  const groupedBySector = useMemo(() => {
    const present = new Set();

    filteredData.forEach((block) => {
      const masool = block?.masool || {};
      const primary = String(getMasoolPrimarySector(masool) || UNKNOWN_SECTOR).toUpperCase();
      present.add(primary);
    });

    const fixed = SECTOR_ORDER.filter((s) => present.has(s));

    const extras = Array.from(present)
      .filter(
        (s) =>
          !SECTOR_ORDER.includes(s) &&
          s !== OTHER_SECTOR &&
          s !== UNKNOWN_SECTOR
      )
      .sort((a, b) => a.localeCompare(b));

    const orderedSectors = [
      ...fixed,
      ...extras,
      ...(present.has(OTHER_SECTOR) ? [OTHER_SECTOR] : []),
      ...(present.has(UNKNOWN_SECTOR) ? [UNKNOWN_SECTOR] : []),
    ];

    const buckets = {};
    orderedSectors.forEach((s) => (buckets[s] = []));

    filteredData.forEach((block) => {
      const masool = block?.masool || {};
      const primarySector = String(getMasoolPrimarySector(masool) || UNKNOWN_SECTOR).toUpperCase();
      if (!buckets[primarySector]) buckets[primarySector] = [];
      buckets[primarySector].push(block);
    });

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

  // ✅ totals per sector + segment counts
  const sectorTotals = useMemo(() => {
    const map = {};
    groupedBySector.forEach(({ sector, items }) => {
      const totalHouses = items.reduce((sum, blk) => {
        const v = Number(blk?.masool?.totals?.total_hofs ?? 0);
        return sum + (Number.isFinite(v) ? v : 0);
      }, 0);

      const segmentCounts = items.reduce((acc, blk) => {
        const musaids = Array.isArray(blk?.musaids) ? blk.musaids : [];
        return addCounts(acc, sumSegmentCountsFromMusaids(musaids));
      }, emptySegmentCounts());

      map[sector] = { totalHouses, masools: items.length, segmentCounts };
    });
    return map;
  }, [groupedBySector]);

  const overallTotalHouses = useMemo(() => {
    return Object.values(sectorTotals).reduce(
      (sum, v) => sum + Number(v?.totalHouses ?? 0),
      0
    );
  }, [sectorTotals]);

  const overallSegmentCounts = useMemo(() => {
    return Object.values(sectorTotals).reduce((acc, v) => {
      return addCounts(acc, v?.segmentCounts || emptySegmentCounts());
    }, emptySegmentCounts());
  }, [sectorTotals]);

  // ✅ HOF table columns (email removed, photo size fixed)
  const hofColumns = useMemo(
    () => [
      {
        field: "photo_url",
        headerName: "",
        width: 60,
        sortable: false,
        filterable: false,
        renderCell: (params) => <Photo src={params.value} alt="HOF" />,
      },
      { field: "family_id", headerName: "Family ID", width: 120 },
      { field: "its", headerName: "ITS", width: 120 },
      { field: "name", headerName: "Name", flex: 1, minWidth: 240 },
      { field: "mobile", headerName: "Mobile", width: 160 },
      { field: "family_count", headerName: "Family", width: 90 },
      {
        field: "tiffin_segment",
        headerName: "Segment",
        width: 140,
        renderCell: (params) => {
          const seg = normalizeSegment(params.value);
          return (
            <Chip
              size="small"
              variant="outlined"
              label={seg ? prettySegment(seg) : "N/A"}
              color={seg ? "primary" : "default"}
            />
          );
        },
      },
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
    masoolBg: "#EAF2FF",
    musaidBg: "#FFF7E6",
    hofsBg: "#F7F7F7",
    border: "#E8E8E8",
    textSoft: "text.secondary",
  };

  const SegmentChips = ({ counts, size = "small" }) => (
    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
      {SEGMENTS.map((k) => (
        <Chip
          key={k}
          size={size}
          variant="outlined"
          label={`${prettySegment(k)}: ${Number(counts?.[k] ?? 0)}`}
          sx={{ fontWeight: 700 }}
        />
      ))}
    </Stack>
  );

  return (
    <AppTheme>
      <CssBaseline />

      <Box sx={{ width: "100%", overflowX: "auto", mt: 5, pt: 9, pr: 2, pb: 3, pl: 2 }}>
        <Paper sx={{ width: "100%", boxShadow: 1, overflowX: "auto", p: 1, "@media (max-width: 600px)": { p: 1 } }}>
          {/* Header + Filters */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 1, padding: "8px 16px", borderRadius: 1 }}>
              Masool / Musaid Hierarchy (HOF)
            </Typography>

            <Chip
              size="small"
              variant="outlined"
              color="success"
              label={`Overall Total Houses: ${overallTotalHouses}`}
              sx={{ fontWeight: 800 }}
            />

            <Box sx={{ flex: 1, minWidth: 260 }}>
              <SegmentChips counts={overallSegmentCounts} size="small" />
            </Box>

            <Box sx={{ flex: 1 }} />

            <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 220 } }}>
              <InputLabel>Sector</InputLabel>
              <Select label="Sector" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
                {sectorOptions.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : filteredData.length === 0 ? (
            <Typography sx={{ px: 1, py: 2, color: COLORS.textSoft }}>No records found.</Typography>
          ) : (
            <Box sx={{ pb: 1 }}>
              {groupedBySector.map(({ sector, items }) => {
                if (!items.length) return null;
                if (sectorFilter !== "ALL" && sector !== sectorFilter) return null;

                const sectorHouseTotal = sectorTotals?.[sector]?.totalHouses ?? 0;
                const sectorMasools = sectorTotals?.[sector]?.masools ?? items.length;
                const sectorSegCounts = sectorTotals?.[sector]?.segmentCounts ?? emptySegmentCounts();

                return (
                  <Box key={sector} sx={{ mb: 2 }}>
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
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography sx={{ fontWeight: 900, letterSpacing: 0.5 }}>
                        SECTOR: <span style={{ fontWeight: 900 }}>{sector}</span>
                      </Typography>

                      <Divider sx={{ flex: 1, minWidth: 60 }} />

                      <Chip size="small" variant="outlined" label={`Masools: ${sectorMasools}`} />
                      <Chip size="small" variant="outlined" color="success" label={`Total Houses: ${sectorHouseTotal}`} sx={{ fontWeight: 800 }} />

                      <Box sx={{ minWidth: 260 }}>
                        <SegmentChips counts={sectorSegCounts} size="small" />
                      </Box>
                    </Box>

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

                    <Box>
                      {items.map((block, idx) => {
                        const masool = block?.masool || {};
                        const musaids = Array.isArray(block?.musaids) ? block.musaids : [];

                        const totalHofs = masool?.totals?.total_hofs ?? 0;
                        const missingMasool = masool?.totals?.missing_in_its ?? 0;

                        const masoolSectors = joinArr(masool?.sector_names);
                        const masoolSubSectors = joinArr(
                          Array.isArray(masool?.sub_sector_names)
                            ? [...masool.sub_sector_names].sort(compareSubSector)
                            : []
                        );

                        const masoolSegCounts = sumSegmentCountsFromMusaids(musaids);

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
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              sx={{
                                backgroundColor: COLORS.masoolBg,
                                "& .MuiAccordionSummary-content": { my: 1 },
                              }}
                            >
                              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", width: "100%", pr: 1, flexWrap: "wrap" }}>
                                <Photo src={masool?.photo_url} alt="Masool" />

                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                  <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                                    {safeStr(masool?.name)}
                                  </Typography>

                                  <Box
                                    sx={{
                                      display: "grid",
                                      gridTemplateColumns: { xs: "1fr", md: "140px 1fr 1fr" },
                                      gap: 0.8,
                                      mt: 0.6,
                                    }}
                                  >
                                    <Typography sx={{ fontSize: 12, color: COLORS.textSoft }}>
                                      <b>ITS:</b> {safeStr(masool?.its)}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: COLORS.textSoft }}>
                                      <b>Sector:</b> <span style={{ fontWeight: 800 }}>{masoolSectors}</span>
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: COLORS.textSoft }}>
                                      <b>Sub-Sector:</b> {masoolSubSectors}
                                    </Typography>
                                  </Box>

                                  <Box sx={{ mt: 0.8 }}>
                                    <SegmentChips counts={masoolSegCounts} size="small" />
                                  </Box>
                                </Box>

                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                  <Chip size="small" variant="outlined" color="primary" label={`Musaids: ${musaids.length}`} />
                                  <Chip size="small" variant="outlined" color="success" label={`Total HOFs: ${totalHofs}`} />
                                  <Chip size="small" variant="outlined" color={Number(missingMasool) > 0 ? "error" : "success"} label={`Missing: ${missingMasool}`} />
                                </Stack>
                              </Box>
                            </AccordionSummary>

                            <AccordionDetails sx={{ pt: 1 }}>
                              {musaids.length === 0 ? (
                                <Typography sx={{ color: COLORS.textSoft }}>
                                  No musaids found under this masool.
                                </Typography>
                              ) : (
                                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                                  {musaids.map((m, mi) => {
                                    const musaid = m?.musaid || {};
                                    const totals = m?.totals || {};
                                    const hofs = Array.isArray(m?.hofs) ? m.hofs : [];

                                    const musaidTotalHofs = totals?.total_hofs ?? 0;
                                    const musaidMissing = totals?.missing_in_its ?? 0;

                                    const musaidSegCounts = countFromHofs(hofs);

                                    const rows = hofs.map((h, hi) => ({
                                      id: `${musaid?.its || "musaid"}-${h?.its || hi}-${hi}`,
                                      family_id: safeStr(h?.family_id, ""),
                                      its: safeStr(h?.its),
                                      name: safeStr(h?.name),
                                      mobile: safeStr(h?.mobile),
                                      photo_url: h?.photo_url || "",
                                      family_count: Number(h?.family_count ?? 0),
                                      tiffin_segment: normalizeSegment(h?.tiffin_segment) || "",
                                      thali_status: h?.thali_status ?? null,
                                      missing_in_its_data: Number(h?.missing_in_its_data ?? 0),
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
                                        <AccordionSummary
                                          expandIcon={<ExpandMoreIcon />}
                                          sx={{
                                            backgroundColor: COLORS.musaidBg,
                                            "& .MuiAccordionSummary-content": { my: 1 },
                                          }}
                                        >
                                          <Box sx={{ display: "flex", gap: 1.2, alignItems: "center", width: "100%", pr: 1, flexWrap: "wrap" }}>
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

                                            <Photo src={musaid?.photo_url} alt="Musaid" />

                                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                              <Typography sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                                                {safeStr(musaid?.name)}
                                              </Typography>

                                              <Box
                                                sx={{
                                                  display: "grid",
                                                  gridTemplateColumns: { xs: "1fr", md: "140px 1fr 1fr 140px 120px" },
                                                  gap: 0.8,
                                                  mt: 0.6,
                                                  alignItems: "center",
                                                }}
                                              >
                                                <Typography sx={{ fontSize: 12, color: COLORS.textSoft }}>
                                                  <b>ITS:</b> {safeStr(musaid?.its)}
                                                </Typography>

                                                <Typography sx={{ fontSize: 12, color: COLORS.textSoft }}>
                                                  <b>Sector:</b>{" "}
                                                  <span style={{ fontWeight: 800 }}>
                                                    {safeStr(musaid?.sector_name)}
                                                  </span>
                                                </Typography>

                                                <Typography sx={{ fontSize: 12, color: COLORS.textSoft }}>
                                                  <b>Sub-Sector:</b> {safeStr(musaid?.sub_sector_name)}
                                                </Typography>

                                                <Typography sx={{ fontSize: 12, color: COLORS.textSoft }}>
                                                  <b>Total HOF:</b>{" "}
                                                  <span style={{ fontWeight: 800 }}>{musaidTotalHofs}</span>
                                                </Typography>

                                                <Typography sx={{ fontSize: 12, color: COLORS.textSoft }}>
                                                  <b>Missing:</b>{" "}
                                                  <span style={{ fontWeight: 800 }}>{musaidMissing}</span>
                                                </Typography>
                                              </Box>

                                              <Box sx={{ mt: 0.8 }}>
                                                <SegmentChips counts={musaidSegCounts} size="small" />
                                              </Box>
                                            </Box>

                                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                              <Chip size="small" variant="outlined" color="primary" label={`Shown: ${rows.length}`} />
                                            </Stack>
                                          </Box>
                                        </AccordionSummary>

                                        <AccordionDetails sx={{ pt: 1, backgroundColor: COLORS.hofsBg }}>
                                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, gap: 1, flexWrap: "wrap" }}>
                                            <Typography sx={{ fontWeight: 800 }}>Mumineen (HOF) List</Typography>

                                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                                              <Chip size="small" variant="outlined" color="success" label={`Total HOF: ${musaidTotalHofs}`} />
                                              <Chip
                                                size="small"
                                                variant="outlined"
                                                color={Number(musaidMissing) > 0 ? "error" : "success"}
                                                label={`Missing: ${musaidMissing}`}
                                              />
                                            </Stack>
                                          </Box>

                                          <Box sx={{ mb: 1 }}>
                                            <SegmentChips counts={musaidSegCounts} size="small" />
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
                                                "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f5f5f5" },
                                                "& .MuiDataGrid-cell": { color: "#555" },
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
          <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </AppTheme>
  );
}