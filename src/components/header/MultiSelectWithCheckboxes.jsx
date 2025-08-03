import React, { useEffect, useRef } from 'react';
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  ListSubheader,
  FormControl,
  InputLabel,
  OutlinedInput,
  Box,
  Chip,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { yellow, brown } from '../../styles/ThemePrimitives';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 300,
    },
  },
};

function MultiSelectWithCheckboxes({
  label,
  options,
  value,
  onChange,
  groupBy, // optional grouping function
  renderGroupLabel, // optional group label render function
  optionLabelKey = 'name',
  optionValueKey = 'id',
  disabled,
  clearSelection,
  onClear,
  renderValueCustom, // optional custom renderValue function
}) {
  const allOptionValue = 'all';

  // Normalize all IDs to strings for consistent comparison
  const normalizedValue = value.map(String);
  const normalizedOptions = options.map((opt) => ({
    ...opt,
    [optionValueKey]: String(opt[optionValueKey]),
  }));

  // Check if "All" is selected or all options are selected
  const allSelected =
    normalizedValue.includes(allOptionValue) ||
    (normalizedOptions.length > 0 &&
      normalizedValue.length === normalizedOptions.length);

  // Value passed to Select - show only 'all' if allSelected
  const selectValue = allSelected ? [allOptionValue] : normalizedValue;

  // Group options if groupBy function provided
  const groupedOptions = groupBy
    ? normalizedOptions.reduce((acc, option) => {
        const groupKey = groupBy(option);
        if (!acc[groupKey]) acc[groupKey] = [];
        acc[groupKey].push(option);
        return acc;
      }, {})
    : null;

  // Default renderValue function if custom not provided
  const defaultRenderValue = (selected) => {
    if (selected.includes(allOptionValue)) return `All`;
    if (!selected.length) return `Select ${label}`;
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {selected.map((selectedId) => {
          const opt = normalizedOptions.find(
            (o) => o[optionValueKey] === String(selectedId)
          );
          if (!opt) return null;
          return (
            <Chip
              key={selectedId}
              label={opt[optionLabelKey]}
              onMouseDown={(e) => e.stopPropagation()}
              onDelete={() => {
                onChange(
                  value.filter(
                    (v) => String(v) !== selectedId && v !== allOptionValue
                  )
                );
              }}
              sx={{ fontWeight: 'bold' }}
            />
          );
        })}
      </Box>
    );
  };

  // Use custom renderValue if provided, else default
  const renderValue = renderValueCustom || defaultRenderValue;

  // Handle selection changes, including "All" option
  const handleChange = (event) => {
    const val = event.target.value;
    const normalizedVal = typeof val === 'string' ? val.split(',') : val.map(String);

    if (normalizedVal.includes(allOptionValue)) {
      if (allSelected) {
        // Unselect all
        onChange([]);
      } else {
        // Select all options
        onChange(normalizedOptions.map((opt) => opt[optionValueKey]));
      }
    } else {
      onChange(normalizedVal);
    }
  };

  return (
    <FormControl sx={{ minWidth: 220, m: 1, position: 'relative' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple
        value={selectValue}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={renderValue}
        MenuProps={MenuProps}
        disabled={disabled}
      >
        {/* "All" option */}
        <MenuItem value={allOptionValue}>
          <Checkbox checked={allSelected} />
          <ListItemText primary="All" />
        </MenuItem>

        {/* Render grouped options if groupBy specified */}
        {groupedOptions
          ? Object.entries(groupedOptions).flatMap(([group, items]) => [
              <ListSubheader
                key={`${group}-header`}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: yellow[100],
                  color: brown[700],
                  lineHeight: '48px',
                }}
              >
                {renderGroupLabel ? renderGroupLabel(group) : group}
              </ListSubheader>,
              ...items.map((opt) => (
                <MenuItem key={opt[optionValueKey]} value={opt[optionValueKey]}>
                  <Checkbox checked={normalizedValue.includes(opt[optionValueKey])} />
                  <ListItemText primary={opt[optionLabelKey]} />
                </MenuItem>
              )),
            ])
          : normalizedOptions.map((opt) => (
              <MenuItem key={opt[optionValueKey]} value={opt[optionValueKey]}>
                <Checkbox checked={normalizedValue.includes(opt[optionValueKey])} />
                <ListItemText primary={opt[optionLabelKey]} />
              </MenuItem>
            ))}
      </Select>

      {/* Clear All button */}
      {clearSelection && value.length > 0 && (
        <IconButton
          size="small"
          onClick={onClear}
          sx={{
            position: 'absolute',
            top: 6,
            right: 30,
            color: brown[600],
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </FormControl>
  );
}

export default function SectorSubSectorSelect({
  sectors,
  subSectors,
  selectedSector,
  setSelectedSector,
  selectedSubSector,
  setSelectedSubSector,
  selectedSectorName,
  setSelectedSectorName
}) {
  const groupBySectorId = (item) => String(item.sector_id);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && sectors.length > 0 && subSectors.length > 0) {
      if (selectedSector.length === 0) {
        setSelectedSector(sectors.map((s) => String(s.id)));
      }
      if (selectedSubSector.length === 0) {
        setSelectedSubSector(subSectors.map((s) => String(s.id)));
      }
      initialized.current = true;
    }
  }, [
    sectors,
    subSectors,
    selectedSector.length,
    selectedSubSector.length,
    setSelectedSector,
    setSelectedSubSector,
  ]);

  // Filter sub-sectors that belong to selected sectors
  const filteredSubSectors = subSectors.filter((ss) =>
    selectedSector.includes(String(ss.sector_id))
  );

  // --- NEW: Clean selectedSubSector to keep only valid sub-sector IDs ---
  // This prevents the +N more showing wrong count due to invalid selections
  const filteredSubSectorIds = filteredSubSectors.map((ss) => String(ss.id));
  const cleanedSelectedSubSector = selectedSubSector.filter((id) =>
    filteredSubSectorIds.includes(id)
  );

  // Custom renderValue for Sub-Sector MultiSelect: show first selected + N more
  const renderSubSectorValue = (selected) => {
    if (selected.includes('all')) return 'All';
    if (selected.length === 0) return 'Select Sub-Sector';

    const firstSelected = selected[0];
    const firstOption = subSectors.find((ss) => String(ss.id) === String(firstSelected));
    const firstLabel = firstOption ? firstOption.sub_sector_name : '';

    const remainingCount = selected.length - 1;

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Chip label={firstLabel} sx={{ fontWeight: 'bold' }} />
        {remainingCount > 0 && <Box sx={{ fontWeight: 'bold' }}>+{remainingCount} more</Box>}
      </Box>
    );
  };

  return (
    <>
      {/* Sector MultiSelect */}
      <MultiSelectWithCheckboxes
        label="Select Sector"
        options={sectors.map((s) => ({ ...s, id: String(s.id) }))}
        value={selectedSector}
        onChange={(val) => {
          setSelectedSector(val);

          // Filter sub-sector selection to only those under selected sectors
          setSelectedSubSector((prevSubs) =>
            prevSubs.filter((subId) => {
              const sub = subSectors.find((s) => String(s.id) === String(subId));
              return sub && val.includes(String(sub.sector_id));
            })
          );
        }}
        clearSelection={true}
        onClear={() => {
          setSelectedSector([]);
          setSelectedSubSector([]);
        }}
      />

      {/* Sub-Sector MultiSelect */}
      <MultiSelectWithCheckboxes
        label="Select Sub-Sector"
        options={filteredSubSectors.map((ss) => ({
          ...ss,
          id: String(ss.id),
          sector_id: String(ss.sector_id),
        }))}
        value={cleanedSelectedSubSector} 
        onChange={setSelectedSubSector}
        groupBy={groupBySectorId}
        renderGroupLabel={(groupId) => {
          const sector = sectors.find((s) => String(s.id) === String(groupId));
          return sector ? sector.name : 'Unknown Sector';
        }}
        optionLabelKey="sub_sector_name"
        optionValueKey="id"
        disabled={selectedSector.length === 0}
        clearSelection={true}
        onClear={() => setSelectedSubSector([])}
        renderValueCustom={renderSubSectorValue} // custom chip rendering here
      />
    </>
  );
}
