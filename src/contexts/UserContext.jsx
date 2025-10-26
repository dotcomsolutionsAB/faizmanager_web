import React, { createContext, useState, useEffect, useContext } from "react";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [jamiatId, setJamiatId] = useState(null);

  const [role, setRole] = useState(null);       // main active/default role (name/slug as you store)
  const [roles, setRoles] = useState([]);       // full array of roles

  const [permissions, setPermissions] = useState([]);
  const [accessRoleId, setAccessRoleId] = useState(null);
  const [hofCount, setHofCount] = useState(0);

  // 🔥 New: store sector / sub-sector access lists after role switch
  const [sectorAccessIds, setSectorAccessIds] = useState([]);
  const [subSectorAccessIds, setSubSectorAccessIds] = useState([]);

  const [loading, setLoading] = useState(true);

  // ---------- Hydrate from localStorage ----------
  useEffect(() => {
    const storedUser         = JSON.parse(localStorage.getItem("user") || "null");
    const storedToken        = localStorage.getItem("token");
    const storedCurrency     = JSON.parse(localStorage.getItem("currency") || "null");
    const storedJamiatId     = localStorage.getItem("jamiat_id");
    const storedRole         = localStorage.getItem("role");
    const storedRoles        = JSON.parse(localStorage.getItem("roles") || "[]");
    const storedPermissions  = JSON.parse(localStorage.getItem("permissions") || "[]");
    const storedAccessRoleId = localStorage.getItem("access_role_id");
    const storedHofCount     = localStorage.getItem("hof_count");

    const storedSectorIds    = JSON.parse(localStorage.getItem("sector_access_ids") || "[]");
    const storedSubSectorIds = JSON.parse(localStorage.getItem("sub_sector_access_ids") || "[]");

    if (storedUser) setUser(storedUser);
    if (storedToken) setToken(storedToken);
    if (storedCurrency) setCurrency(storedCurrency);
    if (storedJamiatId) setJamiatId(storedJamiatId);
    if (storedRole) setRole(storedRole);
    if (storedRoles) setRoles(storedRoles);
    if (storedPermissions) setPermissions(storedPermissions);
    if (storedAccessRoleId) setAccessRoleId(Number(storedAccessRoleId));
    if (storedHofCount) setHofCount(Number(storedHofCount));

    if (Array.isArray(storedSectorIds)) setSectorAccessIds(storedSectorIds.map(String));
    if (Array.isArray(storedSubSectorIds)) setSubSectorAccessIds(storedSubSectorIds.map(String));

    console.log("Access Role ID loaded from localStorage:", storedAccessRoleId);
    setLoading(false);
  }, []);

  // ---------- Persist to localStorage when these change ----------
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (accessRoleId !== null && accessRoleId !== undefined) {
      localStorage.setItem("access_role_id", accessRoleId);
    } else {
      localStorage.removeItem("access_role_id");
    }
  }, [accessRoleId]);

  useEffect(() => {
    localStorage.setItem("sector_access_ids", JSON.stringify(sectorAccessIds || []));
  }, [sectorAccessIds]);

  useEffect(() => {
    localStorage.setItem("sub_sector_access_ids", JSON.stringify(subSectorAccessIds || []));
  }, [subSectorAccessIds]);

  // ---------- Your existing updateUser (kept as-is) ----------
  const updateUser = (
    newUser,
    newToken,
    newCurrency,
    newJamiatId,
    newRole,
    newPermissions,
    newHofCount,
    newAccessRoleId,
    newRoles // <-- roles array
  ) => {
    setUser(newUser);
    setToken(newToken);
    setCurrency(newCurrency);
    setJamiatId(newJamiatId);
    setRole(newRole);
    setPermissions(newPermissions);
    setHofCount(newHofCount);
    setAccessRoleId(newAccessRoleId);
    setRoles(newRoles || []);

    // store everything in localStorage
    if (newUser) localStorage.setItem("user", JSON.stringify(newUser));
    else localStorage.removeItem("user");

    if (newToken) localStorage.setItem("token", newToken);
    else localStorage.removeItem("token");

    if (newCurrency) localStorage.setItem("currency", JSON.stringify(newCurrency));
    else localStorage.removeItem("currency");

    if (newJamiatId) localStorage.setItem("jamiat_id", newJamiatId);
    else localStorage.removeItem("jamiat_id");

    if (newRole) localStorage.setItem("role", newRole);
    else localStorage.removeItem("role");

    if (newPermissions) localStorage.setItem("permissions", JSON.stringify(newPermissions));
    else localStorage.removeItem("permissions");

    if (newHofCount !== null && newHofCount !== undefined)
      localStorage.setItem("hof_count", newHofCount);
    else localStorage.removeItem("hof_count");

    if (newAccessRoleId !== null && newAccessRoleId !== undefined)
      localStorage.setItem("access_role_id", newAccessRoleId);
    else localStorage.removeItem("access_role_id");

    if (newRoles)
      localStorage.setItem("roles", JSON.stringify(newRoles));
    else localStorage.removeItem("roles");
  };

  console.log("access role id:", accessRoleId);

  // ---------- NEW: switchRole(roleId) ----------
  // Calls backend to switch role and returns new token + access ids
// ...everything above stays the same

// ---------- NEW: switchRole(roleId) ----------
// No API call needed. We just flip the active access role locally.
// Your other fetchers already use accessRoleId in their URLs.
const switchRole = async (access) => {
  // 1️⃣ normalize
  const idNum = Number(access);

  // 2️⃣ update accessRoleId
  setAccessRoleId(idNum);
  localStorage.setItem("access_role_id", idNum);

  // 3️⃣ update readable role label using access_role_id
  const r = Array.isArray(roles)
    ? roles.find(r => String(r.access_role_id) === String(access))
    : null;

  if (r) {
    const label = r.access_role_name ?? r.name ?? r.slug ?? String(access);
    setRole(label);
    localStorage.setItem("role", label);
  }

  // 4️⃣ clear cached access lists so dependent effects refetch for the new role
  setSectorAccessIds([]);
  setSubSectorAccessIds([]);
  localStorage.removeItem("sector_access_ids");
  localStorage.removeItem("sub_sector_access_ids");

  // 5️⃣ token stays the same, this is just switching local role context
  try {
    window.dispatchEvent(new CustomEvent("role:changed", { detail: { access_role_id: String(access) } }));
  } catch (_) {}
};


// ...everything below stays the same


  const logout = () => {
    setUser(null);
    setToken(null);
    setCurrency(null);
    setJamiatId(null);
    setRole(null);
    setPermissions([]);
    setHofCount(null);
    setAccessRoleId(null);
    setRoles([]);
    setSectorAccessIds([]);
    setSubSectorAccessIds([]);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("currency");
    localStorage.removeItem("jamiat_id");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    localStorage.removeItem("hof_count");
    localStorage.removeItem("access_role_id");
    localStorage.removeItem("roles");
    localStorage.removeItem("sector_access_ids");
    localStorage.removeItem("sub_sector_access_ids");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        token,
        currency,
        jamiatId,
        role,                   // main/default role (string/slug)
        roles,                  // full roles array
        permissions,
        hofCount,
        accessRoleId,
        sectorAccessIds,        // 🔥 expose to consumers
        subSectorAccessIds,     // 🔥 expose to consumers
        updateUser,
        switchRole,             // 🔥 call this on role change
        logout,
      }}
    >
      {loading ? null : children}
    </UserContext.Provider>
  );
}

export default UserContext;
