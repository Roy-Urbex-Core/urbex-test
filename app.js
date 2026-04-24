function sanitizeWorkspaceToken(value='') {
 return String(value || '')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9_-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);
}

function readPreparedWorkspaceDraftOnce() {
 try {
  const raw = JSON.parse(localStorage.getItem('urbex_core_workspace_draft_v1') || 'null');
  return raw && typeof raw === 'object' ? raw : {};
 } catch (err) {
  return {};
 }
}

const PREPARED_WORKSPACE_DRAFT_KEY = 'urbex_core_workspace_draft_v1';
const PREPARED_WORKSPACE_DRAFT = readPreparedWorkspaceDraftOnce();
const ACTIVE_WORKSPACE_ID = sanitizeWorkspaceToken(window.APP_WORKSPACE_ID || PREPARED_WORKSPACE_DRAFT.workspaceId || '');
const ACTIVE_WORKSPACE_LABEL = String(window.APP_WORKSPACE_LABEL || PREPARED_WORKSPACE_DRAFT.workspaceLabel || 'Gedeelde kaart').trim() || 'Gedeelde kaart';
const ACTIVE_BACKEND_MODE = String(window.APP_BACKEND_MODE || PREPARED_WORKSPACE_DRAFT.backendMode || 'local-only').trim() || 'local-first';
const ACTIVE_AUTH_USER_ID = String(window.APP_AUTH_USER_ID || PREPARED_WORKSPACE_DRAFT.authUserId || '').trim();
const ACTIVE_AUTH_EMAIL = String(window.APP_AUTH_EMAIL || PREPARED_WORKSPACE_DRAFT.authEmail || '').trim().toLowerCase();
const ACTIVE_AUTH_DISPLAY_NAME = String(window.APP_AUTH_DISPLAY_NAME || PREPARED_WORKSPACE_DRAFT.authDisplayName || '').trim();

let runtimeWorkspaceId = ACTIVE_WORKSPACE_ID;
let runtimeWorkspaceLabel = ACTIVE_WORKSPACE_LABEL;
let runtimeBackendMode = ACTIVE_BACKEND_MODE;
let runtimeAuthUserId = ACTIVE_AUTH_USER_ID;
let runtimeAuthEmail = ACTIVE_AUTH_EMAIL;
let runtimeAuthDisplayName = ACTIVE_AUTH_DISPLAY_NAME;

function getActiveWorkspaceId() {
 return String(runtimeWorkspaceId || '').trim();
}

function getActiveWorkspaceLabel() {
 return String(runtimeWorkspaceLabel || '').trim() || 'Gedeelde kaart';
}

function getActiveBackendMode() {
 return String(runtimeBackendMode || '').trim() || 'local-only';
}

function getActiveAuthUserId() {
 return String(runtimeAuthUserId || '').trim();
}

function getActiveAuthEmail() {
 return String(runtimeAuthEmail || '').trim().toLowerCase();
}

function getActiveAuthDisplayName() {
 return String(runtimeAuthDisplayName || '').trim();
}

function getWorkspaceScopedStorageKey(baseKey) {
 const workspaceId = getActiveWorkspaceId();
 return workspaceId ? `${baseKey}::ws::${workspaceId}` : baseKey;
}

function getWorkspaceScopedDbName(baseName) {
 const workspaceId = getActiveWorkspaceId();
 return workspaceId ? `${baseName}__ws__${workspaceId}` : baseName;
}

function persistPreparedWorkspaceDraft(patch={}) {
 try {
  const current = readPreparedWorkspaceDraftOnce();
  const next = {
   ...current,
   ...patch
  };
  const hasAnyValue = ['workspaceId','workspaceLabel','backendMode','authUserId','authEmail','authDisplayName'].some((key) => String(next[key] || '').trim());
  if (!hasAnyValue) localStorage.removeItem(PREPARED_WORKSPACE_DRAFT_KEY);
  else localStorage.setItem(PREPARED_WORKSPACE_DRAFT_KEY, JSON.stringify(next));
  return next;
 } catch (err) {
  return null;
 }
}

function getPreparedWorkspaceContext() {
 return {
  workspaceId: getActiveWorkspaceId(),
  workspaceLabel: getActiveWorkspaceLabel(),
  backendMode: getActiveBackendMode(),
  authUserId: getActiveAuthUserId(),
  authEmail: getActiveAuthEmail(),
  authDisplayName: getActiveAuthDisplayName(),
  hasWorkspace: !!getActiveWorkspaceId()
 };
}

const persistWorkspaceDraft = persistPreparedWorkspaceDraft;

const STORAGE_KEY_BASE = "urbex_core_hosting_v92_map_locations_v1";
const STORAGE_BACKEND_KEY_BASE = "urbex_core_hosting_v92_map_locations_backend_v1";
const STORAGE_HIDDEN_SEED_IDS_KEY_BASE = "urbex_core_hosting_v92_hidden_seed_ids_v1";
const ROUTE_STORAGE_KEY_BASE = "urbex_core_hosting_v92_route_local_v1";
const MAP_STYLE_STORAGE_KEY_BASE = "urbex_core_hosting_v92_map_style_v1";
const ROUTE_HOME_STORAGE_KEY_BASE = "urbex_core_hosting_v92_route_home_v1";
const STORAGE_GLOBAL_CLEAR_AT_KEY_BASE = "urbex_core_hosting_v92_global_clear_at_v1";
const IDB_DB_NAME_BASE = "urbex_core_hosting_v92_map_db_v1";
const STORAGE_KEY = getWorkspaceScopedStorageKey(STORAGE_KEY_BASE);
const STORAGE_BACKEND_KEY = getWorkspaceScopedStorageKey(STORAGE_BACKEND_KEY_BASE);
const STORAGE_HIDDEN_SEED_IDS_KEY = getWorkspaceScopedStorageKey(STORAGE_HIDDEN_SEED_IDS_KEY_BASE);
const ROUTE_STORAGE_KEY = getWorkspaceScopedStorageKey(ROUTE_STORAGE_KEY_BASE);
const MAP_STYLE_STORAGE_KEY = getWorkspaceScopedStorageKey(MAP_STYLE_STORAGE_KEY_BASE);
const ROUTE_HOME_STORAGE_KEY = getWorkspaceScopedStorageKey(ROUTE_HOME_STORAGE_KEY_BASE);
const STORAGE_GLOBAL_CLEAR_AT_KEY = getWorkspaceScopedStorageKey(STORAGE_GLOBAL_CLEAR_AT_KEY_BASE);
const IDB_DB_NAME = getWorkspaceScopedDbName(IDB_DB_NAME_BASE);
const IDB_STORE_LOCATIONS = "locations";
const TEAM_MEMBERS_STORAGE_KEY_BASE = 'urbex_core_hosting_v92_team_members_v1';
const TEAM_OWNER_PROFILE_STORAGE_KEY_BASE = 'urbex_core_hosting_v92_owner_profile_v1';
const TEAM_MEMBERS_STORAGE_KEY = getWorkspaceScopedStorageKey(TEAM_MEMBERS_STORAGE_KEY_BASE);
const TEAM_OWNER_PROFILE_STORAGE_KEY = getWorkspaceScopedStorageKey(TEAM_OWNER_PROFILE_STORAGE_KEY_BASE);
const APP_ACTIVE_CREW_MEMBER_STORAGE_KEY_BASE = 'urbex_core_hosting_v92_active_crew_member_v1';
const APP_ACTIVE_CREW_MEMBER_STORAGE_KEY = getWorkspaceScopedStorageKey(APP_ACTIVE_CREW_MEMBER_STORAGE_KEY_BASE);
const APP_ACTIVE_CREW_MEMBER_ID = String(window.APP_ACTIVE_CREW_MEMBER_ID || '').trim();
const STATIC_WORKSPACE_COLLECTION = 'workspaces';
const STATIC_MEMBERS_COLLECTION = 'members';
const STATIC_ROUTES_COLLECTION = 'routes';
const DEFAULT_CATEGORIES = [];
let CATEGORY_OPTIONS = [...DEFAULT_CATEGORIES];
let expandedCategoryNodes = new Set();

function normalizeCategoryName(value) {
 const raw = String(value || '').trim();
 return raw || 'Overig';
}

function escapeAttr(value) {
 return String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
}

function hashString(value) {
 let hash = 0;
 const text = String(value || '');
 for (let i = 0; i < text.length; i++) {
  hash = ((hash << 5) - hash) + text.charCodeAt(i);
  hash |= 0;
 }
 return hash;
}

function ensureCategoryOption(category) {
 const value = normalizeCategoryName(category);
 if (!CATEGORY_OPTIONS.includes(value)) CATEGORY_OPTIONS.push(value);
 CATEGORY_OPTIONS.sort((a, b) => a.localeCompare(b, 'nl'));
 return value;
}


function syncDerivedCategories() {
 const previousCategories = new Set(Array.isArray(CATEGORY_OPTIONS) ? CATEGORY_OPTIONS : []);
 const derived = [...new Set((Array.isArray(locations) ? locations : []).map(loc => normalizeCategoryName(loc && loc.category)).filter(Boolean))];
 const combined = [...new Set([...DEFAULT_CATEGORIES, ...previousCategories, ...derived])]
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, 'nl'));
 CATEGORY_OPTIONS = combined;

 const existingVisible = new Set(visibleCategories || []);
 const nextVisible = new Set();
 CATEGORY_OPTIONS.forEach(cat => {
  if (!previousCategories.size || existingVisible.has(cat) || DEFAULT_CATEGORIES.includes(cat)) nextVisible.add(cat);
 });
 if (!nextVisible.size) CATEGORY_OPTIONS.forEach(cat => nextVisible.add(cat));
 visibleCategories = nextVisible;

 const list = document.getElementById('categoryOptionsList');
 if (list) {
  list.innerHTML = CATEGORY_OPTIONS.map(cat => `<option value="${escapeAttr(cat)}">`).join('');
 }

 const input = document.getElementById('categoryInput');
 if (input) {
  const current = String(input.value || '').trim();
  input.value = current && CATEGORY_OPTIONS.includes(current) ? current : defaultQuickSaveCategory();
 }
}


function averageRouteSpacingKm(points) {
 if (!Array.isArray(points) || points.length < 2) return Infinity;
 let total = 0;
 for (let i = 0; i < points.length - 1; i++) {
  total += kmBetween(points[i].lat, points[i].lng, points[i + 1].lat, points[i + 1].lng);
 }
 return total / Math.max(1, points.length - 1);
}

function thinRoutePoints(points, maxPoints = ROUTE_ANALYSIS_MAX_POINTS) {
 if (!Array.isArray(points) || points.length <= maxPoints) return Array.isArray(points) ? points.slice() : [];
 const step = Math.max(1, Math.ceil(points.length / maxPoints));
 const reduced = [];
 for (let i = 0; i < points.length; i += step) {
  reduced.push(points[i]);
 }
 const last = points[points.length - 1];
 const lastReduced = reduced[reduced.length - 1];
 if (!lastReduced || lastReduced.lat !== last.lat || lastReduced.lng !== last.lng) {
  reduced.push(last);
 }
 return reduced;
}

function getRouteAnalysisPoints(routePoints) {
 return thinRoutePoints(routePoints, ROUTE_ANALYSIS_MAX_POINTS);
}

function getRouteDisplayPoints(routePoints) {
 return thinRoutePoints(routePoints, ROUTE_DISPLAY_MAX_POINTS);
}

function isDetailedImportedRoute(points) {
 if (!Array.isArray(points) || points.length < 2) return false;
 const avgSpacingKm = averageRouteSpacingKm(points);
 return points.length >= 25 || avgSpacingKm <= 0.15;
}

function routeMeetsRoadLevelRequirement(route) {
 if (!route || !Array.isArray(route.points) || route.points.length < 2) return false;
 if (route.roadRouted && !route.usedStraightFallback) return true;
 return !route.roadRouted && isDetailedImportedRoute(route.points);
}

const seedData = [];
const TOP_LOCATION_IDS = new Set(seedData.filter(x => String(x.category || '').toLowerCase() === 'top locaties').map(x => x.id));
const SEED_LOCATION_INDEX = new Map(seedData.map(x => [String(x.id || ''), x]));
function loadHiddenSeedIds() {
 try {
  const raw = localStorage.getItem(STORAGE_HIDDEN_SEED_IDS_KEY);
  const parsed = raw ? JSON.parse(raw) : [];
  return new Set(Array.isArray(parsed) ? parsed.map(x => String(x || '').trim()).filter(Boolean) : []);
 } catch (err) {
  return new Set();
 }
}

function saveHiddenSeedIds() {
 try {
  localStorage.setItem(STORAGE_HIDDEN_SEED_IDS_KEY, JSON.stringify([...hiddenSeedIds]));
 } catch (err) {}
}

function loadGlobalClearTimestamp() {
 try {
  const raw = localStorage.getItem(STORAGE_GLOBAL_CLEAR_AT_KEY);
  const stamp = Number(raw || 0);
  return Number.isFinite(stamp) && stamp > 0 ? stamp : 0;
 } catch (err) {
  return 0;
 }
}

function saveGlobalClearTimestamp(value) {
 try {
  const stamp = Number(value || 0);
  if (Number.isFinite(stamp) && stamp > 0) localStorage.setItem(STORAGE_GLOBAL_CLEAR_AT_KEY, String(stamp));
  else localStorage.removeItem(STORAGE_GLOBAL_CLEAR_AT_KEY);
 } catch (err) {}
}

let localClearAllAt = loadGlobalClearTimestamp();
let remoteClearAllAt = 0;
const STATIC_META_DOC_ID = '__app_state__';

function getEffectiveGlobalClearAt() {
 return Math.max(Number(localClearAllAt || 0), Number(remoteClearAllAt || 0), 0);
}

function applyGlobalClearFilter(records) {
 const clearAt = getEffectiveGlobalClearAt();
 const list = Array.isArray(records) ? records : [];
 if (!clearAt) return list;
 return list.filter((loc) => Number(loc && loc.updated_at || 0) > clearAt);
}

async function dropLocalStoredMapCaches() {
 try { localStorage.removeItem(STORAGE_KEY); } catch (err) {}
 try { localStorage.removeItem(STORAGE_BACKEND_KEY); } catch (err) {}
 try { localStorage.removeItem(STORAGE_HIDDEN_SEED_IDS_KEY); } catch (err) {}
 await clearLocationsFromIndexedDb().catch(() => {});
}

function isSeedLocationRecord(loc) {
 const id = String(loc && loc.id || '');
 return SEED_LOCATION_INDEX.has(id) && !String(id).startsWith('new-') && !isSharedLocationRecord(loc);
}

let hiddenSeedIds = loadHiddenSeedIds();

let visibleCategories = new Set(CATEGORY_OPTIONS);
let locations = loadLocations();
let filtered = [];
let initialLargeStoreRestored = false;
let locationPersistPromise = Promise.resolve();
let selectedId = null;
let routeData = loadStoredRouteState();
let routePlannerActive = false;
let routePlannerStopIds = [];
let routeHomeBase = loadRouteHomeBase();
let onRouteMap = new Map();
let nearRouteMap = new Map();
let routeSequenceMap = new Map();
const IMPORTED_ROUTE_MATCH_KM = 0.35;
const NEAR_ROUTE_KM = 1.5;
const ROUTE_ANALYSIS_MAX_POINTS = 600;
const ROUTE_PLANNER_QUERY_KEY = 'routeplanner';
const ROUTE_RETURN_STATUS_KEY = 'social_urbex_route_return_status_v1';
const IS_ROUTE_PLANNER_TAB = new URLSearchParams(window.location.search).get(ROUTE_PLANNER_QUERY_KEY) === '1';
let routePlannerPreviewMode = IS_ROUTE_PLANNER_TAB;
let routePlannerSearchResults = [];
let routePlannerSearchQuery = '';
let routePlannerLastBuiltStops = [];
const ROUTE_POINT_MARKER_LIMIT = 250;
const ROUTE_DISPLAY_MAX_POINTS = 5000;
let userPosition = null;
let liveTrackingWatchId = null;
let isLiveTracking = false;
let map, clusterGroup = null, searchLayer = null, onRouteLayer = null, nearRouteLayer = null, topLocationLayer = null, onderwegLayer = null, immediateSavedLayer = null, routeLayer = null, routePointLayer = null, userMarker = null, routeHomeMarker = null, previewMarker = null, routeCanvasRenderer = null;
let currentBaseMapStyle = loadStoredMapStyle();
let baseMapLayers = null;
let markerIndex = new Map();
let lastMarkerRenderKey = '';
let lastSelectedMarkerId = null;
let searchPreviewTimer = null;
let addMode = false;
let pendingDraft = null;
let searchHighlightId = null;
let searchTextActive = false;
let overviewSearchResults = null;
let overviewSearchQuery = '';
let editorPhotos = [];
let detailMode = "overview";
let editorDirty = false;
let detailPanelVisible = false;
let editorSourceKey = "";
let categoryChooserOpen = false;
let manualCategoryOverride = false;
const MAX_PHOTO_COUNT = 6;
const MAX_PHOTO_DIMENSION = 1400;
const MAX_PHOTO_DATA_URL_LENGTH = 260000;
const ROUTE_ONLY_MAP_MARKERS = false;
const ROAD_TRAVEL_CACHE_TTL_MS = 15 * 60 * 1000;
const ROAD_TRAVEL_FETCH_TIMEOUT_MS = 6500;
let roadTravelCache = new Map();
let selectedTravelRequestToken = 0;
function pad2(n) {
 return String(n).padStart(2, '0');
}

function quickSaveTimestamp() {
 const now = new Date();
 return `${pad2(now.getDate())}-${pad2(now.getMonth() + 1)} ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;
}

function defaultQuickSaveName() {
 return `Nieuwe locatie - ${quickSaveTimestamp()}`;
}

function defaultQuickSaveCategory() {
 const preferred = normalizeCategoryName('Onderweg');
 return ensureCategoryOption(preferred);
}

function resolveNewLocationCategory() {
 if (addMode && !manualCategoryOverride) return ensureCategoryOption(defaultQuickSaveCategory());
 const input = document.getElementById('categoryInput');
 return ensureCategoryOption(normalizeCategoryName(String(input && input.value || '').trim() || defaultQuickSaveCategory()));
}

function updateAddCategoryUi() {
 const bar = document.getElementById('autoCategoryBar');
 const manualWrap = document.getElementById('categoryManualWrap');
 const hint = document.getElementById('categoryAutoHint');
 const toggleBtn = document.getElementById('toggleCategoryOverrideBtn');
 const input = document.getElementById('categoryInput');
 if (!bar || !manualWrap || !hint || !toggleBtn) return;
 const useAutoDefault = !!(addMode && !manualCategoryOverride);
 bar.style.display = addMode ? 'flex' : 'none';
 hint.style.display = useAutoDefault ? 'block' : 'none';
 manualWrap.style.display = useAutoDefault ? 'none' : '';
 toggleBtn.textContent = useAutoDefault ? 'Zelf rubriek kiezen' : 'Standaard Onderweg';
 if (useAutoDefault && input) input.value = defaultQuickSaveCategory();
}


const STATIC_HOSTING_MODE = true;
const SHARED_SYNC_ENABLED = false;
const STATIC_SHARED_COLLECTION = 'shared_locations';
let authReady = false;
let authStateReady = false;
let applyingRemoteMembersSnapshot = false;
let applyingRemoteRoutesSnapshot = false;

function getMemberDocIdFromEmail(email='') {

 const normalized = normalizeMemberEmail(email);
 return normalized ? `member_${normalized.replace(/[^a-z0-9]+/gi, '_')}` : '';
}

function setAuthStatus(message, mode='info') {
 const el = document.getElementById('authStatusBox');
 if (!el) return;
 const colors = { info:'rgba(255,255,255,.05)', success:'rgba(34,197,94,.12)', warn:'rgba(245,158,11,.12)' };
 const borders = { info:'rgba(148,163,184,.16)', success:'rgba(74,222,128,.24)', warn:'rgba(253,186,116,.28)' };
 el.style.background = colors[mode] || colors.info;
 el.style.borderColor = borders[mode] || borders.info;
 el.innerHTML = message;
}

function syncAuthUi() {
 const workspaceIdInput = document.getElementById('workspaceIdInput');
 const workspaceLabelInput = document.getElementById('workspaceLabelInput');
 const nameInput = document.getElementById('authDisplayNameInput');
 const emailInput = document.getElementById('authEmailInput');
 if (workspaceIdInput && !workspaceIdInput.matches(':focus')) workspaceIdInput.value = getActiveWorkspaceId();
 if (workspaceLabelInput && !workspaceLabelInput.matches(':focus')) workspaceLabelInput.value = getActiveWorkspaceLabel();
 if (nameInput && !nameInput.matches(':focus')) nameInput.value = getActiveAuthDisplayName() || ownerProfile.name || '';
 if (emailInput && !emailInput.matches(':focus')) emailInput.value = getActiveAuthEmail() || ownerProfile.email || '';
 const logoutBtn = document.getElementById('authLogoutBtn');
 if (logoutBtn) logoutBtn.disabled = !getActiveAuthUserId();
}

function applyPreparedRuntimeFromDraft() {
 const current = readPreparedWorkspaceDraftOnce();
 runtimeWorkspaceId = sanitizeWorkspaceToken(current.workspaceId || runtimeWorkspaceId || '');
 runtimeWorkspaceLabel = String(current.workspaceLabel || runtimeWorkspaceLabel || 'Gedeelde kaart').trim() || 'Gedeelde kaart';
 runtimeBackendMode = String(current.backendMode || runtimeBackendMode || 'local-only').trim() || 'local-only';
 runtimeAuthUserId = String(current.authUserId || runtimeAuthUserId || '').trim();
 runtimeAuthEmail = String(current.authEmail || runtimeAuthEmail || '').trim().toLowerCase();
 runtimeAuthDisplayName = String(current.authDisplayName || runtimeAuthDisplayName || '').trim();
}

function scheduleMembersSync() { return false; }

function scheduleRoutesSync() { return false; }

async function syncMembersToWorkspace() {
 const membersRef = getWorkspaceMembersCollectionRef();
 if (!membersRef) return false;
 const docs = [getOwnerMember(), ...teamMembers].map((member) => ({
  docId: member.role === 'owner' ? 'owner-fixed' : (getMemberDocIdFromEmail(member.email) || String(member.id || '')),
  payload: {
   id: String(member.id || ''),
   name: normalizeMemberName(member.name || ''),
   email: normalizeMemberEmail(member.email || ''),
   remote_user_id: String(member.remote_user_id || '').trim(),
   role: member.role === 'owner' ? 'owner' : (member.role === 'editor' ? 'editor' : 'viewer'),
   added_at: Number(member.added_at || Date.now()),
   updated_at: Date.now(),
   workspace_id: getActiveWorkspaceId()
  }
 })).filter((entry) => entry.docId && entry.payload.email || entry.docId === 'owner-fixed');
 try {
  const snapshot = await membersRef.get();
  const remoteIds = new Set();
  snapshot.forEach((docSnap) => remoteIds.add(docSnap.id));
  const localIds = new Set(docs.map((entry) => entry.docId));
  const jobs = docs.map((entry) => membersRef.doc(entry.docId).set(entry.payload, { merge:true }));
  remoteIds.forEach((docId) => {
   if (!localIds.has(docId)) jobs.push(membersRef.doc(docId).delete().catch(() => {}));
  });
  if (jobs.length) await Promise.all(jobs);
  return true;
 } catch (err) {
  console.error('Crew-opslagcontrole mislukte', err);
  setTeamAdminStatus('<strong>Online crew-sync mislukt.</strong> Controleer Firestore-rules of je login.', 'warn');
  return false;
 }
}

function normalizeRemoteMember(raw={}, docId='') {
 const role = String(raw.role || '').trim() === 'owner' ? 'owner' : (String(raw.role || '').trim() === 'editor' ? 'editor' : 'viewer');
 const email = normalizeMemberEmail(raw.email || '');
 const name = normalizeMemberName(raw.name || '');
 return {
  id: String(raw.id || docId || ''),
  name,
  email,
  remote_user_id: String(raw.remote_user_id || '').trim(),
  role,
  added_at: Number(raw.added_at || Date.now())
 };
}

function refreshSessionMemberFromAuth() {
 const resolved = resolvePreparedMemberIdFromAuth();
 if (resolved && resolved !== currentSessionMemberId) {
  currentSessionMemberId = resolved;
  saveCurrentSessionMemberId();
 }
}

function subscribeMembersSync() {
 if (membersUnsubscribe) { membersUnsubscribe(); membersUnsubscribe = null; }
 const membersRef = getWorkspaceMembersCollectionRef();
 if (!membersRef) return;
 membersUnsubscribe = membersRef.onSnapshot((snapshot) => {
  applyingRemoteMembersSnapshot = true;
  try {
   let nextOwner = null;
   const nextMembers = [];
   snapshot.forEach((docSnap) => {
    const data = normalizeRemoteMember(docSnap.data() || {}, docSnap.id);
    if (!data) return;
    if (data.role === 'owner' || docSnap.id === 'owner-fixed') nextOwner = data;
    else if (data.email) nextMembers.push(data);
   });
   if (nextOwner) {
    ownerProfile = { name: nextOwner.name || ownerProfile.name || DEFAULT_TEAM_OWNER_NAME, email: nextOwner.email || ownerProfile.email || DEFAULT_TEAM_OWNER_EMAIL };
    saveOwnerProfile();
   }
   if (snapshot.size) {
    teamMembers = nextMembers.filter((member) => normalizeMemberEmail(member.email) !== normalizeMemberEmail(ownerProfile.email));
    saveTeamMembers();
   }
   refreshSessionMemberFromAuth();
   renderTeamAdmin();
   renderAll(false);
  } finally {
   applyingRemoteMembersSnapshot = false;
  }
 }, (err) => {
  console.error('Members snapshot mislukt', err);
  setTeamAdminStatus('<strong>Online crew lezen mislukt.</strong> De lokale crewlijst blijft zichtbaar.', 'warn');
 });
}

async function syncRouteStateToWorkspace() {
 const routesRef = getWorkspaceRoutesCollectionRef();
 if (!routesRef) return false;
 try {
  const jobs = [];
  if (routeData && Array.isArray(routeData.points) && routeData.points.length > 1) {
   jobs.push(routesRef.doc('active_route').set({
    type: 'route',
    workspace_id: getActiveWorkspaceId(),
    updated_at: Number(routeData.updated_at || Date.now()),
    updated_by: getActiveAuthEmail() || getActiveAuthUserId() || 'unknown',
    route: normalizeRouteState(routeData)
   }, { merge:true }));
  } else {
   jobs.push(routesRef.doc('active_route').delete().catch(() => {}));
  }
  if (routeHomeBase) {
   jobs.push(routesRef.doc('home_base').set({
    type: 'home',
    workspace_id: getActiveWorkspaceId(),
    updated_at: Number(routeHomeBase.updated_at || Date.now()),
    updated_by: getActiveAuthEmail() || getActiveAuthUserId() || 'unknown',
    home: normalizeRouteHomeBase(routeHomeBase)
   }, { merge:true }));
  } else {
   jobs.push(routesRef.doc('home_base').delete().catch(() => {}));
  }
  await Promise.all(jobs);
  return true;
 } catch (err) {
  console.error('Route-opslagcontrole mislukte', err);
  setStatusBox('Online route-sync mislukte. De route blijft lokaal bewaard.', 'warn', true);
  return false;
 }
}

function subscribeRoutesSync() {
 if (routesUnsubscribe) { routesUnsubscribe(); routesUnsubscribe = null; }
 const routesRef = getWorkspaceRoutesCollectionRef();
 if (!routesRef) return;
 routesUnsubscribe = routesRef.onSnapshot((snapshot) => {
  applyingRemoteRoutesSnapshot = true;
  try {
   let hasRouteDoc = false;
   let hasHomeDoc = false;
   const localRouteBeforeSnapshot = routeData && Array.isArray(routeData.points) && routeData.points.length > 1 ? routeData : null;
   const localHomeBeforeSnapshot = routeHomeBase ? routeHomeBase : null;
   snapshot.forEach((docSnap) => {
    const data = docSnap.data() || {};
    if (docSnap.id === 'active_route') {
      hasRouteDoc = true;
      const remoteRoute = normalizeRouteState(data.route || null);
      if (remoteRoute) routeData = remoteRoute;
    }
    if (docSnap.id === 'home_base') {
      hasHomeDoc = true;
      const remoteHome = normalizeRouteHomeBase(data.home || null);
      if (remoteHome) routeHomeBase = remoteHome;
    }
   });
   if (!hasRouteDoc && localRouteBeforeSnapshot) routeData = localRouteBeforeSnapshot;
   else if (!hasRouteDoc) routeData = null;
   if (!hasHomeDoc && localHomeBeforeSnapshot) routeHomeBase = localHomeBeforeSnapshot;
   else if (!hasHomeDoc) routeHomeBase = null;
   saveRouteStateLocal();
   saveRouteHomeBase();
   if (!restoreRouteIfPresent()) {
    if (localRouteBeforeSnapshot) {
     routeData = localRouteBeforeSnapshot;
     recomputeRouteMaps();
    } else {
     routeData = null;
     recomputeRouteMaps();
    }
   }
   updateHomeSetupButton();
   renderRouteSummaryBox();
   renderAll(false);
  } finally {
   applyingRemoteRoutesSnapshot = false;
  }
 }, (err) => {
  console.error('Routes snapshot mislukt', err);
  setStatusBox('Online routes lezen mislukt. Lokale route blijft werken.', 'warn', true);
 });
}

function refreshCollabSubscriptions() {
 syncAuthUi();
 renderProductHealthPanel();
 return false;
}


const LOCAL_AUTH_ACCOUNTS_KEY = 'urbex_core_local_accounts_v1';

function loadLocalAccounts() {
 try {
  const raw = JSON.parse(localStorage.getItem(LOCAL_AUTH_ACCOUNTS_KEY) || '{}');
  return raw && typeof raw === 'object' ? raw : {};
 } catch (err) {
  return {};
 }
}

function saveLocalAccounts(accounts) {
 try { localStorage.setItem(LOCAL_AUTH_ACCOUNTS_KEY, JSON.stringify(accounts || {})); } catch (err) {}
}

const LOCAL_AUTH_HASH_VERSION = 'sha256-local-beta-v1';

function makeLocalAuthSalt() {
 try {
  const buffer = new Uint8Array(16);
  window.crypto.getRandomValues(buffer);
  return Array.from(buffer).map((byte) => byte.toString(16).padStart(2, '0')).join('');
 } catch (err) {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
 }
}

async function hashLocalAuthPassword(password='', salt='') {
 const input = salt + '::' + password;
 if (window.crypto && window.crypto.subtle && window.TextEncoder) {
  const encoded = new TextEncoder().encode(input);
  const digest = await window.crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
 }
 let hash = 5381;
 for (let i = 0; i < input.length; i++) hash = ((hash << 5) + hash) ^ input.charCodeAt(i);
 return 'fallback-' + Math.abs(hash).toString(16);
}

async function createLocalAuthPasswordRecord(password='') {
 const salt = makeLocalAuthSalt();
 return {
  password_hash: await hashLocalAuthPassword(password, salt),
  password_salt: salt,
  password_version: LOCAL_AUTH_HASH_VERSION
 };
}

async function verifyLocalAuthPassword(account={}, password='') {
 if (!account || !password) return { ok:false, upgrade:false };
 const storedHash = String(account.password_hash || '');
 const storedSalt = String(account.password_salt || '');
 if (storedHash && storedSalt) {
  const nextHash = await hashLocalAuthPassword(password, storedSalt);
  return { ok: nextHash === storedHash, upgrade:false };
 }
 if (String(account.password || '') === password) return { ok:true, upgrade:true };
 return { ok:false, upgrade:false };
}

function buildLocalAuthId(email='') {
 const base = normalizeMemberEmail(email);
 return base ? `local_${base.replace(/[^a-z0-9]+/gi, '_')}` : '';
}

function setLocalAuthSession(email='', displayName='') {
 const normalizedEmail = normalizeMemberEmail(email);
 const normalizedName = normalizeMemberName(displayName || normalizedEmail);
 runtimeAuthUserId = normalizedEmail ? buildLocalAuthId(normalizedEmail) : '';
 runtimeAuthEmail = normalizedEmail;
 runtimeAuthDisplayName = normalizedName;
 persistPreparedWorkspaceDraft({
  workspaceId: getActiveWorkspaceId(),
  workspaceLabel: getActiveWorkspaceLabel(),
  backendMode: 'local-only',
  authUserId: runtimeAuthUserId,
  authEmail: runtimeAuthEmail,
  authDisplayName: runtimeAuthDisplayName
 });
 syncAuthUi();
 refreshSessionMemberFromAuth();
 renderTeamAdmin();
 renderProductHealthPanel();
 renderAll(false);
}

function clearLocalAuthSession() {
 runtimeAuthUserId = '';
 runtimeAuthEmail = '';
 runtimeAuthDisplayName = '';
 persistPreparedWorkspaceDraft({
  workspaceId: getActiveWorkspaceId(),
  workspaceLabel: getActiveWorkspaceLabel(),
  backendMode: 'local-only',
  authUserId: '',
  authEmail: '',
  authDisplayName: ''
 });
 syncAuthUi();
 refreshSessionMemberFromAuth();
 renderTeamAdmin();
 renderProductHealthPanel();
 renderAll(false);
}


function saveWorkspaceFromUi() {
 const idInput = document.getElementById('workspaceIdInput');
 const labelInput = document.getElementById('workspaceLabelInput');
 const nextId = sanitizeWorkspaceToken(idInput && idInput.value || '');
 const nextLabel = String(labelInput && labelInput.value || '').trim() || 'Gedeelde kaart';
 if (!nextId) {
  setAuthStatus('<strong>Workspace ontbreekt.</strong> Vul eerst een workspace-id in, bijvoorbeeld <code>urbex-core-test</code>.', 'warn');
  return;
 }
 persistPreparedWorkspaceDraft({
  workspaceId: nextId,
  workspaceLabel: nextLabel,
  backendMode: 'local-only',
  authUserId: getActiveAuthUserId(),
  authEmail: getActiveAuthEmail(),
  authDisplayName: getActiveAuthDisplayName()
 });
 setAuthStatus(`<strong>Workspace opgeslagen.</strong> ${escapeHtml(nextId)} wordt direct opnieuw geladen voor deze browser op laptop of webhosting.`, 'success');
 window.setTimeout(() => window.location.reload(), 150);
}


function initLocalAuth() {
 authReady = true;
 authStateReady = true;
 applyPreparedRuntimeFromDraft();
 if (!getActiveAuthUserId()) {
  currentSessionMemberId = 'owner-fixed';
  saveCurrentSessionMemberId();
 }
 syncAuthUi();
 if (getActiveAuthUserId()) {
  setAuthStatus(`<strong>Lokaal ingelogd.</strong> ${escapeHtml(getActiveAuthEmail() || getActiveAuthDisplayName())} is actief op deze laptop.`, 'success');
 } else {
  setAuthStatus('Nog niet ingelogd. Je zit nu in lokale owner-modus op deze laptop, dus import/export en kaartbeheer blijven beschikbaar. Log alleen in als je bewust met een testaccount of andere rol wilt testen.', 'info');
 }
 refreshSessionMemberFromAuth();
 renderTeamAdmin();
 renderProductHealthPanel();
}

async function handleAuthRegister() {
 const emailInput = document.getElementById('authEmailInput');
 const passwordInput = document.getElementById('authPasswordInput');
 const nameInput = document.getElementById('authDisplayNameInput');
 const email = normalizeMemberEmail(emailInput && emailInput.value || '');
 const password = String(passwordInput && passwordInput.value || '');
 const displayName = normalizeMemberName(nameInput && nameInput.value || '') || email;
 if (!isValidMemberEmail(email)) { setAuthStatus('<strong>Registratie geblokkeerd.</strong> Vul een geldig e-mailadres in.', 'warn'); return; }
 if (password.length < 6) { setAuthStatus('<strong>Wachtwoord te kort.</strong> Gebruik minimaal 6 tekens.', 'warn'); return; }
 const accounts = loadLocalAccounts();
 if (accounts[email]) { setAuthStatus('<strong>Account bestaat al.</strong> Log in met dit e-mailadres of kies een ander adres.', 'warn'); return; }
 const passwordRecord = await createLocalAuthPasswordRecord(password);
 accounts[email] = {
  email,
  ...passwordRecord,
  displayName,
  userId: buildLocalAuthId(email),
  createdAt: Date.now(),
  lastWorkspaceId: getActiveWorkspaceId()
 };
 saveLocalAccounts(accounts);
 setLocalAuthSession(email, displayName);
 if (passwordInput) passwordInput.value = '';
 setAuthStatus('<strong>Lokaal account gemaakt.</strong> Je bent direct ingelogd in deze browser.', 'success');
}

async function handleAuthLogin() {
 const emailInput = document.getElementById('authEmailInput');
 const passwordInput = document.getElementById('authPasswordInput');
 const email = normalizeMemberEmail(emailInput && emailInput.value || '');
 const password = String(passwordInput && passwordInput.value || '');
 if (!isValidMemberEmail(email) || !password) { setAuthStatus('<strong>Inloggen lukt nog niet.</strong> Vul e-mail en wachtwoord in.', 'warn'); return; }
 const accounts = loadLocalAccounts();
 const account = accounts[email];
 const passwordCheck = await verifyLocalAuthPassword(account, password);
 if (!account || !passwordCheck.ok) {
  setAuthStatus('<strong>Inloggen mislukt.</strong> Controleer je lokale e-mail/wachtwoord-combinatie op deze laptop.', 'warn');
  return;
 }
 if (passwordCheck.upgrade) {
  Object.assign(account, await createLocalAuthPasswordRecord(password));
  delete account.password;
 }
 account.lastLoginAt = Date.now();
 account.lastWorkspaceId = getActiveWorkspaceId();
 accounts[email] = account;
 saveLocalAccounts(accounts);
 setLocalAuthSession(email, normalizeMemberName(account.displayName || email));
 if (passwordInput) passwordInput.value = '';
 setAuthStatus('<strong>Lokaal ingelogd.</strong> Crew, routes en locaties blijven in deze browser opgeslagen.', 'success');
}

async function handleAuthReset() {
 const emailInput = document.getElementById('authEmailInput');
 const passwordInput = document.getElementById('authPasswordInput');
 const email = normalizeMemberEmail(emailInput && emailInput.value || '');
 const newPassword = String(passwordInput && passwordInput.value || '');
 if (!isValidMemberEmail(email)) { setAuthStatus('<strong>Reset geblokkeerd.</strong> Vul eerst een geldig e-mailadres in.', 'warn'); return; }
 if (newPassword.length < 6) { setAuthStatus('<strong>Nieuw wachtwoord nodig.</strong> Vul in het wachtwoordveld minimaal 6 tekens in en klik daarna opnieuw op reset.', 'warn'); return; }
 const accounts = loadLocalAccounts();
 if (!accounts[email]) { setAuthStatus('<strong>Account niet gevonden.</strong> Dit lokale account bestaat nog niet in deze browser.', 'warn'); return; }
 Object.assign(accounts[email], await createLocalAuthPasswordRecord(newPassword));
 delete accounts[email].password;
 accounts[email].updatedAt = Date.now();
 saveLocalAccounts(accounts);
 if (passwordInput) passwordInput.value = '';
 setAuthStatus(`<strong>Lokaal wachtwoord bijgewerkt.</strong> ${escapeHtml(email)} gebruikt nu het nieuwe wachtwoord op deze laptop.`, 'success');
}

async function handleAuthLogout() {
 if (!getActiveAuthUserId()) return;
 clearLocalAuthSession();
 currentSessionMemberId = 'owner-fixed';
 saveCurrentSessionMemberId();
 applyRoleDrivenUi();
 const passwordInput = document.getElementById('authPasswordInput');
 if (passwordInput) passwordInput.value = '';
 setAuthStatus('<strong>Uitgelogd.</strong> Je bent terug in lokale owner-modus op deze laptop. Import/export en kaartbeheer zijn weer direct beschikbaar.', 'success');
}


function getWorkspaceDocRef() { return null; }

function getSharedLocationsCollectionRef() { return null; }

function getWorkspaceMembersCollectionRef() { return null; }

function getWorkspaceRoutesCollectionRef() { return null; }

function ensurePreparedWorkspaceDoc() { return false; }


const DEFAULT_TEAM_OWNER_EMAIL = '';

const DEFAULT_TEAM_OWNER_NAME = 'Roy Janssen';

function normalizeMemberName(value='') {
 return String(value || '').trim().replace(/\s+/g, ' ');
}

function normalizeMemberEmail(value='') {
 return String(value || '').trim().toLowerCase();
}

function isValidMemberEmail(value='') {
 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeMemberEmail(value));
}

function loadOwnerProfile() {
 try {
  const raw = JSON.parse(localStorage.getItem(TEAM_OWNER_PROFILE_STORAGE_KEY) || localStorage.getItem(TEAM_OWNER_PROFILE_STORAGE_KEY_BASE) || 'null');
  return {
   name: normalizeMemberName(raw && raw.name) || DEFAULT_TEAM_OWNER_NAME || 'Owner',
   email: normalizeMemberEmail(raw && raw.email) || DEFAULT_TEAM_OWNER_EMAIL
  };
 } catch (err) {
  return {
   name: DEFAULT_TEAM_OWNER_NAME || 'Owner',
   email: DEFAULT_TEAM_OWNER_EMAIL
  };
 }
}

let ownerProfile = loadOwnerProfile();

function saveOwnerProfile() {
 try {
  localStorage.setItem(TEAM_OWNER_PROFILE_STORAGE_KEY, JSON.stringify(ownerProfile));
 } catch (err) {}
 if (!applyingRemoteMembersSnapshot) scheduleMembersSync();
}


function memberDisplayName(member={}) {
 const explicitName = normalizeMemberName(member && member.name);
 if (explicitName) return explicitName;
 return normalizeMemberEmail(member && member.email) || 'Onbekend lid';
}

function loadTeamMembers() {
 try {
  const raw = JSON.parse(localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY) || localStorage.getItem(TEAM_MEMBERS_STORAGE_KEY_BASE) || 'null');
  const source = Array.isArray(raw) ? raw : [];
  const normalized = source.map((member, index) => ({
   id: String(member && member.id || `member-${index + 1}`),
   name: normalizeMemberName(member && member.name),
   email: normalizeMemberEmail(member && member.email),
   remote_user_id: String(member && (member.remote_user_id || member.auth_uid) || '').trim(),
   role: String(member && member.role || 'viewer') === 'editor' ? 'editor' : 'viewer',
   added_at: Number(member && member.added_at || Date.now())
  })).filter((member) => member.email && member.email !== DEFAULT_TEAM_OWNER_EMAIL);
  return normalized;
 } catch (err) {
  return [];
 }
}

let teamMembers = loadTeamMembers();

function saveTeamMembers() {
 try {
  localStorage.setItem(TEAM_MEMBERS_STORAGE_KEY, JSON.stringify(teamMembers));
 } catch (err) {}
 if (!applyingRemoteMembersSnapshot) scheduleMembersSync();
}

function resolvePreparedMemberIdFromAuth() {
 const authEmail = normalizeMemberEmail(getActiveAuthEmail());
 const authUserId = String(getActiveAuthUserId() || '').trim();
 if (authEmail && normalizeMemberEmail(ownerProfile && ownerProfile.email) === authEmail) return 'owner-fixed';
 if (authUserId === 'owner-fixed') return 'owner-fixed';
 const memberByAuthId = teamMembers.find((member) => String(member && member.remote_user_id || '').trim() === authUserId);
 if (memberByAuthId && memberByAuthId.id) return String(memberByAuthId.id);
 const memberByEmail = teamMembers.find((member) => normalizeMemberEmail(member && member.email) === authEmail);
 return memberByEmail && memberByEmail.id ? String(memberByEmail.id) : '';
}

function loadCurrentSessionMemberId() {
 const explicit = String(APP_ACTIVE_CREW_MEMBER_ID || '').trim();
 const preparedMatch = resolvePreparedMemberIdFromAuth();
 try {
  const stored = localStorage.getItem(APP_ACTIVE_CREW_MEMBER_STORAGE_KEY) || localStorage.getItem(APP_ACTIVE_CREW_MEMBER_STORAGE_KEY_BASE) || '';
  return explicit || preparedMatch || String(stored || '').trim() || 'owner-fixed';
 } catch (err) {
  return explicit || preparedMatch || 'owner-fixed';
 }
}

function saveCurrentSessionMemberId() {
 try {
  if (currentSessionMemberId) localStorage.setItem(APP_ACTIVE_CREW_MEMBER_STORAGE_KEY, String(currentSessionMemberId));
  else localStorage.removeItem(APP_ACTIVE_CREW_MEMBER_STORAGE_KEY);
 } catch (err) {}
}

function getOwnerMember() {
 return { id:'owner-fixed', name:ownerProfile.name || DEFAULT_TEAM_OWNER_NAME || 'Owner', email:ownerProfile.email || DEFAULT_TEAM_OWNER_EMAIL, role:'owner', added_at:0 };
}

function getCrewMembersWithOwner() {
 return [getOwnerMember(), ...teamMembers];
}

function findCrewMemberById(memberId='') {
 return getCrewMembersWithOwner().find((member) => String(member.id || '') === String(memberId || '')) || null;
}

let currentSessionMemberId = loadCurrentSessionMemberId();

function ensureCurrentSessionMemberId() {
 if (!findCrewMemberById(currentSessionMemberId)) {
  currentSessionMemberId = 'owner-fixed';
  saveCurrentSessionMemberId();
 }
 return currentSessionMemberId;
}

function getCurrentCrewMember() {
 return findCrewMemberById(ensureCurrentSessionMemberId()) || getOwnerMember();
}

function getCurrentCrewRole() {
 const role = String(getCurrentCrewMember().role || 'viewer');
 return ['owner','editor','viewer'].includes(role) ? role : 'viewer';
}

function teamRoleLabel(role='viewer') {
 return role === 'owner' ? 'Owner' : (role === 'editor' ? 'Editor' : 'Viewer');
}

function getCurrentRolePermissions() {
 const matrix = {
  owner: {
   manageCrew: true,
   addLocations: true,
   editLocations: true,
   deleteLocations: true,
   manageCategories: true,
   importLocations: true,
   importRoute: true,
   exportData: true,
   manageHome: true
  },
  editor: {
   manageCrew: false,
   addLocations: true,
   editLocations: true,
   deleteLocations: true,
   manageCategories: true,
   importLocations: true,
   importRoute: true,
   exportData: true,
   manageHome: true
  },
  viewer: {
   manageCrew: false,
   addLocations: false,
   editLocations: false,
   deleteLocations: false,
   manageCategories: false,
   importLocations: false,
   importRoute: false,
   exportData: false,
   manageHome: false
  }
 };
 return matrix[getCurrentCrewRole()] || matrix.viewer;
}

function currentRoleAllows(action='view') {
 return !!getCurrentRolePermissions()[action];
}

function setCurrentSessionMember(memberId='owner-fixed') {
 currentSessionMemberId = String(memberId || 'owner-fixed');
 ensureCurrentSessionMemberId();
 saveCurrentSessionMemberId();
 if (!currentRoleAllows('editLocations') && detailMode === 'edit') detailMode = 'overview';
 if (!currentRoleAllows('addLocations') && addMode) exitAddMode(true);
 renderAll(false);
}

function requireRolePermission(action='view', message='Deze functie is uitgeschakeld voor jouw rol.') {
 if (currentRoleAllows(action)) return true;
 setStatusBox(message, 'warn', true);
 return false;
}

function requireCrewAdminPermission(message='Alleen de owner mag crew-beheer aanpassen.') {
 if (currentRoleAllows('manageCrew')) return true;
 setStatusBox(message, 'warn', true);
 return false;
}

function formatMemberAddedAt(value) {
 const stamp = Number(value || 0);
 if (!Number.isFinite(stamp) || stamp <= 0) return 'onbekend moment';
 const d = new Date(stamp);
 return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function setTeamAdminStatus(message, mode='info') {
 const el = document.getElementById('teamAdminStatus');
 if (!el) return;
 const colors = {
  info: 'rgba(255,255,255,.05)',
  success: 'rgba(34,197,94,.12)',
  warn: 'rgba(245,158,11,.12)'
 };
 const borders = {
  info: 'rgba(148,163,184,.16)',
  success: 'rgba(74,222,128,.24)',
  warn: 'rgba(253,186,116,.28)'
 };
 el.style.background = colors[mode] || colors.info;
 el.style.borderColor = borders[mode] || borders.info;
 el.innerHTML = message;
}


function syncOwnerProfileUi() {
 const nameInput = document.getElementById('teamOwnerNameInput');
 const emailInput = document.getElementById('teamOwnerEmailInput');
 if (nameInput) nameInput.value = ownerProfile.name || '';
 if (emailInput) emailInput.value = ownerProfile.email || '';
}

function saveOwnerProfileFromUi() {
 if (!requireCrewAdminPermission('Alleen de owner mag de eigenaar aanpassen.')) return;
 const nameInput = document.getElementById('teamOwnerNameInput');
 const emailInput = document.getElementById('teamOwnerEmailInput');
 if (!nameInput || !emailInput) return;

 const nextName = normalizeMemberName(nameInput.value) || DEFAULT_TEAM_OWNER_NAME || 'Owner';
 const nextEmail = normalizeMemberEmail(emailInput.value);
 if (nextEmail && !isValidMemberEmail(nextEmail)) {
  setTeamAdminStatus('<strong>Niet opgeslagen.</strong> Vul een geldig owner e-mailadres in of laat dit veld leeg.', 'warn');
  return;
 }

 const previousEmail = normalizeMemberEmail(ownerProfile.email);
 ownerProfile = {
  name: nextName,
  email: nextEmail || DEFAULT_TEAM_OWNER_EMAIL
 };
 teamMembers = teamMembers.filter((member) => {
  const memberEmail = normalizeMemberEmail(member && member.email);
  if (!memberEmail) return false;
  return memberEmail !== previousEmail && memberEmail !== ownerProfile.email;
 });
 saveOwnerProfile();
 saveTeamMembers();
 renderTeamAdmin();
 setTeamAdminStatus(`<strong>Owner bijgewerkt.</strong> ${escapeHtml(ownerProfile.name || 'Owner')} staat nu als eigenaar bovenaan de crewlijst.`, 'success');
}

function renderTeamSessionUi() {
 const ownerWrap = document.getElementById('teamOwnerOnlyWrap');
 if (ownerWrap) ownerWrap.hidden = !currentRoleAllows('manageCrew');
 syncOwnerProfileUi();
}

function applyRoleDrivenUi() {
 const canEdit = currentRoleAllows('editLocations');
 const canAdd = currentRoleAllows('addLocations');
 const canDelete = currentRoleAllows('deleteLocations');
 const canManageCategories = currentRoleAllows('manageCategories');
 const canImportLocations = currentRoleAllows('importLocations');
 const canImportRoute = currentRoleAllows('importRoute');
 const canExport = currentRoleAllows('exportData');
 const canManageHome = currentRoleAllows('manageHome');

 const toggleHidden = (id, show) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('roleHidden', !show);
 }
 const setReadonly = (id, readonly) => {
  const el = document.getElementById(id);
  if (!el) return;
  if ('readOnly' in el) el.readOnly = !!readonly;
  if ('disabled' in el && el.tagName === 'INPUT' && el.type === 'file') el.disabled = !!readonly;
  el.setAttribute('aria-readonly', readonly ? 'true' : 'false');
 }

 ['primaryAddBtn','addLocationBtn','emptyAddBtn','mobileAddFab','onboardingAddBtn','editModeBtn','overviewEditBtn','editModeSwitchBtn'].forEach((id) => toggleHidden(id, canAdd || canEdit));
 ['exportBtn','importBtn','myMapsExportBtn','clearMapBtn','emptyImportBtn','onboardingImportBtn'].forEach((id) => toggleHidden(id, canExport || canImportLocations));
 ['routeImportBtn','emptyRouteBtn','onboardingRouteBtn','primaryPlanRouteBtn','routeBtn'].forEach((id) => toggleHidden(id, canImportRoute));
 ['homeSetupBtn','addCategoryBtn','applyCategoryBtn','renameCategoryBtn','deleteCategoryBtn'].forEach((id) => toggleHidden(id, canManageHome || canManageCategories));
 toggleHidden('deleteLocationBtn', canDelete && !addMode && !!getSelected());
 toggleHidden('saveLocationBtn', canEdit || canAdd);

 ['nameInput','coordsInput','categoryInput','notesInput'].forEach((id) => setReadonly(id, !canEdit));
 const photoInput = document.getElementById('photoInput');
 if (photoInput) photoInput.disabled = !canEdit;

 const detailSwitch = document.getElementById('detailModeSwitch');
 if (detailSwitch) detailSwitch.classList.toggle('roleHidden', !canEdit);
 const ownerBadge = document.querySelector('.teamAdminOwnerBadge');
 if (ownerBadge) ownerBadge.textContent = currentRoleAllows('manageCrew') ? 'Lokaal beheer' : `${teamRoleLabel(getCurrentCrewRole())} weergave`;
}

function renderTeamAdmin() {
 renderTeamSessionUi();
 const list = document.getElementById('teamMemberList');
 if (!list) {
  applyRoleDrivenUi();
  return;
 }
 const members = getCrewMembersWithOwner();
 if (!members.length) {
  list.innerHTML = '<div class="teamAdminEmpty">Nog geen crewleden bekend.</div>';
  applyRoleDrivenUi();
  return;
 }
 const allowRemoval = currentRoleAllows('manageCrew');
 list.innerHTML = members.map((member) => {
  const roleClass = member.role === 'owner' ? 'owner' : (member.role === 'editor' ? 'editor' : 'viewer');
  const displayName = memberDisplayName(member);
  const showEmailLine = !!member.email && normalizeMemberEmail(displayName) !== normalizeMemberEmail(member.email);
  const actions = member.role === 'owner'
   ? '<div class="teamMemberActions"><button class="teamMemberBtn" type="button" disabled>Owner</button></div>'
   : (allowRemoval
    ? `<div class="teamMemberActions"><button class="teamMemberBtn teamMemberBtnDanger" type="button" data-remove-member="${escapeAttr(member.id)}">Verwijderen</button></div>`
    : `<div class="teamMemberActions"><button class="teamMemberBtn" type="button" disabled>${escapeHtml(teamRoleLabel(member.role))}</button></div>`);
  return `
   <div class="teamMemberItem">
    <div class="teamMemberIdentity">
     <div class="teamMemberFirstName">${escapeHtml(displayName)}</div>
     ${showEmailLine ? `<span class="teamMemberEmail">${escapeHtml(member.email)}</span>` : ''}
     <div class="teamMemberMeta">
      <span class="teamRolePill ${roleClass}">${teamRoleLabel(member.role)}</span>
      <span>${member.role === 'owner' ? 'Beheerder van deze gedeelde kaart' : `Toegevoegd op ${escapeHtml(formatMemberAddedAt(member.added_at))}`}</span>
     </div>
    </div>
    ${actions}
   </div>`;
 }).join('');
 list.querySelectorAll('[data-remove-member]').forEach((btn) => {
  btn.addEventListener('click', () => removeTeamMember(String(btn.getAttribute('data-remove-member') || '')));
 });
 applyRoleDrivenUi();
}

function addTeamMemberFromUi() {
 if (!requireCrewAdminPermission('Alleen de owner mag crewleden toevoegen.')) return;
 const nameInput = document.getElementById('teamInviteNameInput');
 const emailInput = document.getElementById('teamInviteEmailInput');
 const roleSelect = document.getElementById('teamInviteRoleSelect');
 if (!emailInput || !roleSelect) return;
 const name = normalizeMemberName(nameInput && nameInput.value);
 const email = normalizeMemberEmail(emailInput.value);
 const role = String(roleSelect.value || 'viewer') === 'editor' ? 'editor' : 'viewer';
 if (!isValidMemberEmail(email)) {
  setTeamAdminStatus('<strong>Niet toegevoegd.</strong> Vul een geldig e-mailadres in.', 'warn');
  return;
 }
 const ownerEmail = normalizeMemberEmail(getOwnerMember().email);
 if (ownerEmail && email === ownerEmail) {
  setTeamAdminStatus('<strong>Niet toegevoegd.</strong> Deze eigenaar bestaat al.', 'warn');
  return;
 }
 if (teamMembers.some((member) => member.email === email)) {
  setTeamAdminStatus(`<strong>Niet toegevoegd.</strong> ${escapeHtml(email)} zit al in deze crew.`, 'warn');
  return;
 }
 const entry = { id:`member-${Date.now()}`, name, email, role, added_at:Date.now() };
 teamMembers.unshift(entry);
 saveTeamMembers();
 renderTeamAdmin();
 updateHomeSetupButton();
 setTeamAdminStatus(`<strong>Lid toegevoegd.</strong> ${escapeHtml(memberDisplayName(entry))} heeft nu de rol <strong>${escapeHtml(teamRoleLabel(role))}</strong>. Deze rechten worden gebruikt zodra dit lid de gedeelde versie opent.`, 'success');
 if (nameInput) nameInput.value = '';
 emailInput.value = '';
 roleSelect.value = 'editor';
}

function removeTeamMember(memberId='') {
 if (!requireCrewAdminPermission('Alleen de owner mag crewleden verwijderen.')) return;
 const target = teamMembers.find((member) => member.id === memberId);
 if (!target) return;
 const label = memberDisplayName(target);
 const ok = window.confirm(`Weet je zeker dat je ${label} wilt verwijderen uit deze crew?`);
 if (!ok) return;
 teamMembers = teamMembers.filter((member) => member.id !== memberId);
 saveTeamMembers();
 ensureCurrentSessionMemberId();
 renderTeamAdmin();
 setTeamAdminStatus(`<strong>Toegang ingetrokken.</strong> ${escapeHtml(label)} is verwijderd uit deze crew.`, 'success');
}


function normalizeMapStyle(value) {
 const style = String(value || '').trim().toLowerCase();
 return ['map', 'satellite'].includes(style) ? style : 'satellite';
}

function loadStoredMapStyle() {
 try {
  return normalizeMapStyle(localStorage.getItem(MAP_STYLE_STORAGE_KEY) || 'satellite');
 } catch (err) {
  return 'satellite';
 }
}

function saveStoredMapStyle(value) {
 try {
  localStorage.setItem(MAP_STYLE_STORAGE_KEY, normalizeMapStyle(value));
 } catch (err) {}
}

function normalizeRouteHomeBase(raw) {
 const lat = Number(raw && raw.lat);
 const lng = Number(raw && raw.lng);
 if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
 const name = String(raw && raw.name || 'Thuis').trim() || 'Thuis';
 return {
  name,
  lat,
  lng,
  updated_at: Number(raw && raw.updated_at || Date.now())
 };
}

function loadRouteHomeBase() {
 try {
  return normalizeRouteHomeBase(JSON.parse(localStorage.getItem(ROUTE_HOME_STORAGE_KEY) || 'null'));
 } catch (err) {
  return null;
 }
}

function saveRouteHomeBase() {
 try {
  if (routeHomeBase) localStorage.setItem(ROUTE_HOME_STORAGE_KEY, JSON.stringify(routeHomeBase));
  else localStorage.removeItem(ROUTE_HOME_STORAGE_KEY);
 } catch (err) {}
 if (!applyingRemoteRoutesSnapshot) scheduleRoutesSync();
}

function formatRouteHomeLabel() {
 if (!routeHomeBase) return 'Geen thuis ingesteld';
 const customName = String(routeHomeBase.name || '').trim();
 if (customName && customName.toLowerCase() !== 'thuis') return `Thuis · ${customName}`;
 return `Thuis · ${formatCoord(routeHomeBase.lat)}, ${formatCoord(routeHomeBase.lng)}`;
}

function updateHomeSetupButton() {
 const btn = document.getElementById('homeSetupBtn');
 if (!btn) return;
 btn.textContent = 'Thuis instellen';
 btn.title = routeHomeBase ? `${formatRouteHomeLabel()}. Klik om te wijzigen.` : 'Stel je thuisbasis in voor Plan route';
}

function setRouteHomeBaseFromValue(value, options={}) {
 const normalized = normalizeRouteHomeBase(value);
 if (!normalized) {
  routeHomeBase = null;
  saveRouteHomeBase();
  updateHomeSetupButton();
  if (options.showMessage !== false) setStatusBox('Thuislocatie verwijderd.', 'warn', true);
  renderAll(false);
  return false;
 }
 routeHomeBase = normalized;
 saveRouteHomeBase();
 updateHomeSetupButton();
 if (map && options.flyTo !== false) {
  map.flyTo([normalized.lat, normalized.lng], Math.max(map.getZoom(), 12), { duration:.45 });
 }
 if (options.showMessage !== false) setStatusBox(`Thuis ingesteld op ${normalized.name}. Plan route bouwt nu logisch op vanaf thuis.`, 'success', true);
  renderAll(false);
 return true;
}

function handleHomeSetupClick() {
 if (!requireRolePermission('manageHome', 'Alleen de owner mag thuisinstellingen wijzigen.')) return;
 const currentValue = routeHomeBase ? `${routeHomeBase.lat.toFixed(5)}, ${routeHomeBase.lng.toFixed(5)}` : '';
 const promptText = routeHomeBase
  ? 'Waar is thuis? Plak coördinaten of een Google Maps-link. Laat leeg om de huidige thuislocatie te verwijderen.'
  : 'Waar is thuis? Plak coördinaten of een Google Maps-link.';
 const raw = window.prompt(promptText, currentValue);
 if (raw === null) return;
 if (!String(raw).trim()) {
  if (!routeHomeBase) {
   setStatusBox('Geen thuislocatie ingevuld.', 'info', true);
   return;
  }
  const shouldClear = window.confirm('Huidige thuislocatie verwijderen?');
  if (shouldClear) setRouteHomeBaseFromValue(null, { showMessage:true, flyTo:false });
  return;
 }
 const parsed = parseCoordinateInput(raw);
 if (!parsed) {
  setStatusBox('Gebruik voor thuis coördinaten of een Google Maps-link, bijvoorbeeld 51.12345, 4.56789.', 'warn', true);
  return;
 }
 setRouteHomeBaseFromValue({ name:'Thuis', lat:parsed.lat, lng:parsed.lng }, { showMessage:true, flyTo:true });
}

function createBaseMapLayers() {
 const road = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  subdomains:'abcd',
  maxZoom:20
 });
 const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri',
  maxZoom:19
 });
 const labels = L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Labels &copy; Esri',
  maxZoom:19,
  opacity:0.92
 });
 return { road, satellite, labels };
}

function applyBaseMapStyle(style) {
 if (!map) return;
 if (!baseMapLayers) baseMapLayers = createBaseMapLayers();
 const next = normalizeMapStyle(style);
 Object.values(baseMapLayers).forEach((layer) => {
  try { if (map.hasLayer(layer)) map.removeLayer(layer); } catch (err) {}
 });
 if (next === 'satellite') {
  baseMapLayers.satellite.addTo(map);
  baseMapLayers.labels.addTo(map);
 } else {
  baseMapLayers.road.addTo(map);
 }
 currentBaseMapStyle = next;
 saveStoredMapStyle(next);
 updateMapStyleButtons();
}

function updateMapStyleButtons() {
 const ids = {
  satellite: 'mapStyleSatelliteBtn',
  map: 'mapStyleMapBtn'
 };
 Object.entries(ids).forEach(([style, id]) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.classList.toggle('active', currentBaseMapStyle === style);
 });
}

function bindMapStyleButtons() {
 const pairs = [
  ['mapStyleSatelliteBtn', 'satellite'],
  ['mapStyleMapBtn', 'map']
 ];
 pairs.forEach(([id, style]) => {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => applyBaseMapStyle(style));
 });
 updateMapStyleButtons();
}

function normalizeRouteState(raw) {
 try {
  if (!raw || !Array.isArray(raw.points) || raw.points.length < 2) return null;
  const points = raw.points.map(p => ({
   lat: Number(p && p.lat),
   lng: Number(p && p.lng)
  })).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  if (points.length < 2) return null;
  const importedPoints = Array.isArray(raw.importedPoints)
   ? raw.importedPoints.map(p => ({ lat:Number(p && p.lat), lng:Number(p && p.lng) })).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng))
   : [];
  const normalized = {
   name: String(raw.name || 'Geimporteerde route'),
   points,
   importedPoints,
   derivedFromPoints: !!raw.derivedFromPoints,
   roadRouted: !!raw.roadRouted,
   usedStraightFallback: !!raw.usedStraightFallback,
   routeBuildSource: String(raw.routeBuildSource || 'original'),
   updated_at: Number(raw.updated_at || Date.now())
  };
  return routeMeetsRoadLevelRequirement(normalized) ? normalized : null;
 } catch (err) {
  return null;
 }
}

function saveRouteStateLocal() {
 try {
  if (!routeData || !Array.isArray(routeData.points) || routeData.points.length < 2) {
   localStorage.removeItem(ROUTE_STORAGE_KEY);
   if (!applyingRemoteRoutesSnapshot) scheduleRoutesSync();
   return;
  }
  localStorage.setItem(ROUTE_STORAGE_KEY, JSON.stringify({
   name: String(routeData.name || 'Geimporteerde route'),
   points: routeData.points.map(p => ({ lat:Number(p.lat), lng:Number(p.lng) })),
   importedPoints: Array.isArray(routeData.importedPoints) ? routeData.importedPoints.map(p => ({ lat:Number(p.lat), lng:Number(p.lng) })) : [],
   derivedFromPoints: !!routeData.derivedFromPoints,
   roadRouted: !!routeData.roadRouted,
   usedStraightFallback: !!routeData.usedStraightFallback,
   routeBuildSource: String(routeData.routeBuildSource || 'original'),
   updated_at: Number(routeData.updated_at || Date.now())
  }));
 } catch (err) {}
 if (!applyingRemoteRoutesSnapshot) scheduleRoutesSync();
}

function loadStoredRouteState() {
 try {
  const raw = localStorage.getItem(ROUTE_STORAGE_KEY);
  return raw ? normalizeRouteState(JSON.parse(raw)) : null;
 } catch (err) {
  return null;
 }
}

function restoreRouteIfPresent() {
 if (!routeData || !Array.isArray(routeData.points) || routeData.points.length < 2) return false;
 if (!routeMeetsRoadLevelRequirement(routeData)) {
  routeData = null;
  saveRouteStateLocal();
  return false;
 }
 recomputeRouteMaps();
 return true;
}

function isSharedLocationRecord(loc) {
 return !!(loc && loc.shared_remote);
}

function isCustomLocationRecord(loc) {
 return !!(loc && String(loc.id || '').startsWith('new-'));
}


function uniqueNonEmptyStrings(values) {
 const list = Array.isArray(values) ? values : [];
 const seen = new Set();
 const out = [];
 list.forEach((entry) => {
  const value = String(entry || '').trim();
  if (!value) return;
  const key = value.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  out.push(value);
 });
 return out;
}

function decodeHtmlEntities(value='') {
 const textarea = document.createElement('textarea');
 textarea.innerHTML = String(value || '');
 return textarea.value;
}

function extractPhotoUrlsFromText(text='') {
 const source = decodeHtmlEntities(String(text || ''));
 if (!source.trim()) return [];
 const urls = [];
 const pushUrl = (raw) => {
  const value = String(raw || '').trim().replace(/^['"]+|['"]+$/g, '');
  if (!value) return;
  if (/^data:image\//i.test(value) || /^https?:\/\//i.test(value)) urls.push(value);
 };

 const imgRegex = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
 let match;
 while ((match = imgRegex.exec(source))) {
  pushUrl(match[1]);
 }

 const urlRegex = /(https?:\/\/[^\s<>"]+)/gi;
 while ((match = urlRegex.exec(source))) {
  const candidate = String(match[1] || '').replace(/[),.;!?]+$/, '');
  if (/\.(?:png|jpe?g|webp|gif|bmp|avif|svg)(?:[?#].*)?$/i.test(candidate)) pushUrl(candidate);
 }

 return uniqueNonEmptyStrings(urls).slice(0, MAX_PHOTO_COUNT);
}

function cleanImportedNotesText(text='') {
 const raw = decodeHtmlEntities(String(text || ''));
 if (!raw.trim()) return '';
 let source = raw;
 source = source
  .replace(/<(script|style|iframe|object|embed|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<(img|iframe|object|embed|svg)\b[^>]*\/?>/gi, ' ')
  .replace(/<\s*br\s*\/?>/gi, '\n')
  .replace(/<\/(p|div|li|tr|h1|h2|h3|h4|h5|h6|ul|ol|table|section|article)>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\u00a0/g, ' ');

 let lines = source
  .split(/\r?\n+/)
  .map((line) => line.replace(/\s+/g, ' ').trim())
  .filter(Boolean);

 lines = lines.filter((line) => {
  if (/^https?:\/\/\S+$/i.test(line) && line.length > 40) return false;
  if (line.length > 260 && !/[.!?]/.test(line)) return false;
  return true;
 });

 return lines.join('\n').trim();
}

function deriveLocationMediaPayload(payload={}) {
 const description = String(payload && payload.description || '');
 const notes = String(payload && payload.notes || '');
 const basePhotos = Array.isArray(payload && payload.photos) ? payload.photos : [];
 const primaryPhoto = String(payload && payload.photo || '');
 const photos = uniqueNonEmptyStrings([
  ...basePhotos,
  primaryPhoto,
  ...extractPhotoUrlsFromText(description),
  ...extractPhotoUrlsFromText(notes)
 ]).slice(0, MAX_PHOTO_COUNT);
 const cleanedDescription = cleanImportedNotesText(description) || description.trim();
 const cleanedNotes = cleanImportedNotesText(notes) || cleanImportedNotesText(description) || notes.trim();
 return {
  description: cleanedDescription || 'Geïmporteerde locatie',
  notes: cleanedNotes,
  photo: photos[0] || '',
  photos
 };
}

function getLocationDisplayMedia(loc) {
 return deriveLocationMediaPayload({
  description: String(loc && loc.description || ''),
  notes: String(loc && loc.notes || ''),
  photos: Array.isArray(loc && loc.photos) ? loc.photos : [],
  photo: String(loc && loc.photo || '')
 });
}

function shouldRenderMapLocationsForActiveRoute() {
 return !!(routeData && Array.isArray(routeData.points) && routeData.points.length > 1);
}

function shouldShowAnyLocationMarkersOnMap() {
 if (!ROUTE_ONLY_MAP_MARKERS) return true;
 return shouldRenderMapLocationsForActiveRoute();
}

function normalizeSharedLocation(raw) {
 const lat = Number(raw && raw.lat);
 const lng = Number(raw && raw.lng);
 if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
 let category = normalizeCategoryName(String(raw && raw.category || '').trim() || defaultQuickSaveCategory());
 category = ensureCategoryOption(category || defaultQuickSaveCategory());
 const media = deriveLocationMediaPayload({
  description: String(raw && raw.description || 'Handmatig toegevoegd'),
  notes: String(raw && raw.notes || ''),
  photos: Array.isArray(raw && raw.photos) ? raw.photos.filter(Boolean) : [],
  photo: String(raw && raw.photo || '')
 });
 return {
  id: String(raw && raw.id || ''),
  name: String(raw && raw.name || '').trim() || defaultQuickSaveName(),
  description: media.description || 'Handmatig toegevoegd',
  lat,
  lng,
  photo: media.photo,
  photos: media.photos,
  notes: media.notes,
  category,
  country_detected: String(raw && raw.country_detected || ''),
  shared_remote: SHARED_SYNC_ENABLED,
  updated_at: Number(raw && raw.updated_at || Date.now())
 };
}

function mergeSharedLocationsIntoState(remoteRecords) {
 const remoteValid = remoteRecords.map(normalizeSharedLocation).filter(Boolean);
 const localById = new Map(locations.map(loc => [String(loc && loc.id || ''), loc]).filter(entry => entry[0]));
 const merged = [];

 remoteValid.forEach((remoteLoc) => {
  const key = String(remoteLoc && remoteLoc.id || '');
  const localLoc = localById.get(key);
  if (localLoc) {
   const localUpdated = Number(localLoc && localLoc.updated_at || 0);
   const remoteUpdated = Number(remoteLoc && remoteLoc.updated_at || 0);
   const localHasPhotos = Array.isArray(localLoc && localLoc.photos) && localLoc.photos.length > 0;
   const remoteHasPhotos = Array.isArray(remoteLoc && remoteLoc.photos) && remoteLoc.photos.length > 0;
   merged.push((localUpdated > remoteUpdated || (localUpdated == remoteUpdated && localHasPhotos && !remoteHasPhotos)) ? localLoc : remoteLoc);
   localById.delete(key);
  } else {
   merged.push(remoteLoc);
  }
 });

 localById.forEach((localLoc) => {
  merged.push(localLoc);
 });

 locations = applyGlobalClearFilter(merged);
 saveLocations();
 if (routeData) recomputeRouteMaps();
 filtered = getVisibleLocations([...locations]);
 if (!locations.some(x => x.id === selectedId)) {
  selectedId = filtered[0]?.id || locations[0]?.id || null;
 }
 renderSelected();
 renderList();
 renderRouteSummaryBox();
 document.getElementById('routeTag').textContent = routeData && routeData.points && routeData.points.length > 1
 ? `Route ${onRouteMap.size} · Nabij ${nearRouteMap.size}`
 : 'Geen route';
 document.getElementById('countTag').textContent = `${filtered.length} zichtbaar / ${locations.length} totaal`;
 try { renderMarkers(); } catch (err) { console.error('Render markers na Firebase snapshot mislukte', err); }
}


async function syncCustomLocationToWorkspace(loc) { return !!loc; }

async function deleteCustomLocationFromWorkspace(locId) { return !!locId; }

async function syncLocationsBatchToWorkspace(records) { return Array.isArray(records) ? records.length : 0; }

async function deleteLocationsBatchToWorkspace(ids) { return Array.isArray(ids) ? ids.length : 0; }

async function syncGlobalClearToWorkspace(clearAt) { return Number.isFinite(Number(clearAt)) && Number(clearAt) > 0; }

function initLocalWorkspaceSync() {
 refreshCollabSubscriptions();
 return false;
}



function normalizeStoredLocation(raw, index=0) {
 const lat = Number(raw && raw.lat);
 const lng = Number(raw && raw.lng);
 if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -85 || lat > 85 || lng <= -180 || lng >= 180) return null;
 const photoList = Array.isArray(raw && raw.photos) ? raw.photos.filter(Boolean) : (raw && raw.photo ? [raw.photo] : []);
 const media = deriveLocationMediaPayload({
  description: String(raw && raw.description || ''),
  notes: String(raw && raw.notes || ''),
  photos: photoList,
  photo: String(raw && raw.photo || photoList[0] || '')
 });
 return {
  ...raw,
  id: String(raw && raw.id || `loc-${Date.now()}-${index}`),
  name: String(raw && raw.name || `Locatie ${index + 1}`).trim() || `Locatie ${index + 1}`,
  description: media.description,
  lat,
  lng,
  notes: media.notes,
  photo: media.photo,
  photos: media.photos,
  category: normalizeCategoryName(raw && raw.category),
  layerPath: Array.isArray(raw && raw.layerPath) ? raw.layerPath.map(part => String(part || '').trim()).filter(Boolean) : [],
  country_detected: String(raw && raw.country_detected || ''),
  updated_at: Number(raw && raw.updated_at || Date.now())
 };
}

function isQuotaExceededError(err) {
 try {
  return !!(err && (
   err.name === 'QuotaExceededError' ||
   err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
   err.code === 22 ||
   err.code === 1014
  ));
 } catch (e) {
  return false;
 }
}

function openLocationDb() {
 return new Promise((resolve, reject) => {
  try {
   const request = indexedDB.open(IDB_DB_NAME, 1);
   request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(IDB_STORE_LOCATIONS)) {
     db.createObjectStore(IDB_STORE_LOCATIONS);
    }
   };
   request.onsuccess = () => resolve(request.result);
   request.onerror = () => reject(request.error || new Error('IndexedDB kon niet worden geopend.'));
  } catch (err) {
   reject(err);
  }
 });
}

async function writeLocationsToIndexedDb(records) {
 if (typeof indexedDB === 'undefined') throw new Error('IndexedDB wordt niet ondersteund.');
 const db = await openLocationDb();
 await new Promise((resolve, reject) => {
  const tx = db.transaction(IDB_STORE_LOCATIONS, 'readwrite');
  tx.objectStore(IDB_STORE_LOCATIONS).put({
   updated_at: Date.now(),
   locations: Array.isArray(records) ? records : []
  }, 'current');
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error || new Error('Opslaan in browserdatabase mislukte.'));
  tx.onabort = () => reject(tx.error || new Error('Opslaan in browserdatabase is afgebroken.'));
 });
 try { db.close(); } catch (err) {}
}

async function readLocationsFromIndexedDb() {
 if (typeof indexedDB === 'undefined') return [];
 const db = await openLocationDb();
 const payload = await new Promise((resolve, reject) => {
  const tx = db.transaction(IDB_STORE_LOCATIONS, 'readonly');
  const req = tx.objectStore(IDB_STORE_LOCATIONS).get('current');
  req.onsuccess = () => resolve(req.result || null);
  req.onerror = () => reject(req.error || new Error('Lezen uit browserdatabase mislukte.'));
 });
 try { db.close(); } catch (err) {}
 const source = Array.isArray(payload && payload.locations) ? payload.locations : [];
 return source.map(normalizeStoredLocation).filter(Boolean);
}

async function clearLocationsFromIndexedDb() {
 if (typeof indexedDB === 'undefined') return;
 const db = await openLocationDb();
 await new Promise((resolve, reject) => {
  const tx = db.transaction(IDB_STORE_LOCATIONS, 'readwrite');
  tx.objectStore(IDB_STORE_LOCATIONS).delete('current');
  tx.oncomplete = () => resolve();
  tx.onerror = () => reject(tx.error || new Error('Browserdatabase opschonen mislukte.'));
  tx.onabort = () => reject(tx.error || new Error('Browserdatabase opschonen is afgebroken.'));
 });
 try { db.close(); } catch (err) {}
}

function loadLocations() {
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 const base = (!raw ? [] : JSON.parse(raw));
 if (!Array.isArray(base) || !base.length) return [];
 return applyGlobalClearFilter(base.map(x => {
 const seedLoc = SEED_LOCATION_INDEX.get(String(x && x.id || '')) || null;
 const rawDescription = String((x && x.description) || (seedLoc && seedLoc.description) || '').toLowerCase();
 const rawCategory = String(x && x.category || '').trim();
 const rawCategoryLower = rawCategory.toLowerCase();
 let detectedCountry = x && x.country_detected ? x.country_detected : (seedLoc && seedLoc.country_detected ? seedLoc.country_detected : '');
 if (!detectedCountry) {
 if (rawCategoryLower === 'duitsland') detectedCountry = 'Germany';
 else if (rawCategoryLower === 'italie') detectedCountry = 'Italy';
 else if (rawDescription.includes('bronbestand: team mattie kaart- urbex locaties duitsland')) detectedCountry = 'Germany';
 else if (rawDescription.includes('bronbestand: team mattie kaart- urbex locaties italie')) detectedCountry = 'Italy';
 else if (rawDescription.includes('country_detected":"germany') || rawDescription.includes('country_detected: germany')) detectedCountry = 'Germany';
 else if (rawDescription.includes('country_detected":"italy') || rawDescription.includes('country_detected: italy')) detectedCountry = 'Italy';
 }
 const detectedCountryLower = String(detectedCountry || '').trim().toLowerCase();
 const isTop = TOP_LOCATION_IDS.has(String(x && x.id || '')) || rawCategoryLower === 'top locaties';
 const isGermany = detectedCountryLower === 'germany' || detectedCountryLower === 'duitsland';
 const isItaly = detectedCountryLower === 'italy' || detectedCountryLower === 'italie';
 const isCore = detectedCountryLower === 'belgium' || detectedCountryLower === 'belgie' || detectedCountryLower === 'france' || detectedCountryLower === 'frankrijk' || detectedCountryLower === 'luxembourg' || detectedCountryLower === 'luxemburg';
 const rubricMatch = String((x && x.description) || (seedLoc && seedLoc.description) || '').match(/Rubriek:\s*([^\n]+)/i);
 const rubricFromDescription = rubricMatch ? String(rubricMatch[1] || '').trim() : '';
 let baseFilterCategory = '';
 if (isGermany) baseFilterCategory = 'Duitsland';
 else if (isItaly) baseFilterCategory = 'Italie';
 else if (detectedCountry && !isCore) baseFilterCategory = 'Diverse landen';
 else if (rubricFromDescription && CATEGORY_OPTIONS.includes(rubricFromDescription) && rubricFromDescription !== 'Top locaties') baseFilterCategory = rubricFromDescription;
 else if (CATEGORY_OPTIONS.includes(rawCategory) && rawCategory !== 'Top locaties') baseFilterCategory = rawCategory;
 else if (seedLoc && CATEGORY_OPTIONS.includes(seedLoc.category) && seedLoc.category !== 'Top locaties') baseFilterCategory = seedLoc.category;
 if (!baseFilterCategory) baseFilterCategory = 'Overig';
 let normalizedCategory = CATEGORY_OPTIONS.includes(rawCategory) ? rawCategory : '';
 if (!isTop) normalizedCategory = baseFilterCategory;
 if (!normalizedCategory) normalizedCategory = isTop ? 'Top locaties' : baseFilterCategory;
 return {
 ...x,
 country_detected: detectedCountry,
 notes: x.notes || '',
 photos: Array.isArray(x.photos) ? x.photos : (x.photo ? [x.photo] : []),
 photo: x.photo || '',
 category: normalizedCategory,
 is_top: isTop,
 base_filter_category: baseFilterCategory
 };
 }).filter(loc => {
 const lat = Number(loc && loc.lat);
 const lng = Number(loc && loc.lng);
 return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -85 && lat <= 85 && lng > -180 && lng < 180;
 }));
 } catch (e) {
 return [];
 }
}

function saveLocations() {
 const cleaned = (Array.isArray(locations) ? locations : []).map((loc, index) => normalizeStoredLocation(loc, index)).filter(Boolean);
 const serialized = JSON.stringify(cleaned);
 try {
  localStorage.setItem(STORAGE_KEY, serialized);
  localStorage.setItem(STORAGE_BACKEND_KEY, 'localStorage');
  locationPersistPromise = clearLocationsFromIndexedDb().catch(() => {});
  return;
 } catch (err) {
  if (!isQuotaExceededError(err)) throw err;
 }

 try { localStorage.removeItem(STORAGE_KEY); } catch (err) {}
 try { localStorage.setItem(STORAGE_BACKEND_KEY, 'indexedDB'); } catch (err) {}
 locationPersistPromise = writeLocationsToIndexedDb(cleaned).catch((err) => {
  console.error('Opslaan in IndexedDB mislukte', err);
  setStatusBox('Import lukte wel, maar lokaal opslaan van deze grote kaart in de browser mislukte. Exporteer meteen een JSON-backup.', 'warn', true);
 });
 setStatusBox('Deze kaart is te groot voor gewone browseropslag en wordt daarom in de browserdatabase bewaard.', 'info', true);
}

async function restoreLargeStoredLocations() {
 if (initialLargeStoreRestored) return;
 initialLargeStoreRestored = true;
 try {
  const backend = localStorage.getItem(STORAGE_BACKEND_KEY);
  if (backend !== 'indexedDB') return;
  const restored = applyGlobalClearFilter(await readLocationsFromIndexedDb());
  if (!Array.isArray(restored) || !restored.length) return;
  locations = restored;
  filtered = getVisibleLocations([...locations]);
  selectedId = filtered[0]?.id || locations[0]?.id || null;
  renderAll(true);
  setStatusBox(`Vorige grote kaart hersteld: ${locations.length} locaties geladen uit browserdatabase.`, 'info', true);
 } catch (err) {
  console.error('Herstellen uit IndexedDB mislukte', err);
 }
}

function openClearMapConfirm() {
 if (!requireRolePermission('exportData', 'Alleen de owner mag de kaart leegmaken.')) return;
 const overlay = document.getElementById('confirmOverlay');
 if (!overlay) return;
 overlay.classList.add('show');
 overlay.setAttribute('aria-hidden', 'false');
 const noBtn = document.getElementById('confirmClearNoBtn');
 if (noBtn) {
  window.setTimeout(() => {
   try { noBtn.focus(); } catch (err) {}
  }, 0);
 }
}

function closeClearMapConfirm() {
 const overlay = document.getElementById('confirmOverlay');
 if (!overlay) return;
 overlay.classList.remove('show');
 overlay.setAttribute('aria-hidden', 'true');
}

async function clearEntireMap() {
 if (!requireRolePermission('exportData', 'Alleen de owner mag de kaart leegmaken.')) return;
 closeClearMapConfirm();
 exitAddMode(false);
 const clearAt = Date.now();
 localClearAllAt = clearAt;
 saveGlobalClearTimestamp(clearAt);
 locations = [];
 filtered = [];
 selectedId = null;
 detailPanelVisible = false;
 editorPhotos = [];
 visibleCategories = new Set();
 CATEGORY_OPTIONS = [];
 categoryChooserOpen = false;
 searchTextActive = false;
 searchHighlightId = null;
 hiddenSeedIds = new Set(seedData.map(loc => String(loc && loc.id || '')).filter(Boolean));
 saveHiddenSeedIds();
 try { document.getElementById('searchInput').value = ''; } catch (err) {}
 try { document.getElementById('photoInput').value = ''; } catch (err) {}
 try { document.getElementById('categoryOptionsList').innerHTML = ''; } catch (err) {}
 try { document.getElementById('categoryInput').value = ''; } catch (err) {}
 await dropLocalStoredMapCaches();
 await syncGlobalClearToWorkspace(clearAt).catch(() => false);
 clearImportedRoute();
 renderPhotoGrid();
 renderAll(true);
 setStatusBox('Kaart leeggemaakt in deze lokale workspace/browser.', 'success', true);
 showToast('Kaart leeggemaakt.');
}

function setModeBanner(text, visible) {
 const banner = document.getElementById('modeBanner');
 banner.textContent = text;
 banner.style.display = visible ? 'block' : 'none';
}

function setStatusBox(text='', kind='info', visible=false) {
 const el = document.getElementById('statusBox');
 el.className = 'statusBox ' + kind;
 el.textContent = text;
 el.style.display = visible ? 'block' : 'none';
}

function setStatusBoxHtml(html='', kind='info', visible=false) {
 const el = document.getElementById('statusBox');
 el.className = 'statusBox ' + kind;
 el.innerHTML = html;
 el.style.display = visible ? 'block' : 'none';
}

function sumRouteDistanceKm(points) {
 if (!Array.isArray(points) || points.length < 2) return 0;
 let total = 0;
 for (let i = 0; i < points.length - 1; i++) {
 total += kmBetween(points[i].lat, points[i].lng, points[i + 1].lat, points[i + 1].lng);
 }
 return total;
}

function formatDistanceLabel(km) {
 if (!Number.isFinite(km) || km <= 0) return '0 km';
 if (km < 1) return `${Math.round(km * 1000)} m`;
 return `${km.toFixed(1)} km`;
}

let toastTimer = null;
let saveInProgress = false;

function desiredSaveButtonLabel() {
 const activeLoc = getSelected();
 if (addMode) return 'Locatie opslaan';
 return activeLoc ? 'Wijzigingen opslaan' : 'Opslaan';
}

function setSaveButtonState(isBusy=false) {
 const btn = document.getElementById('saveLocationBtn');
 if (!btn) return;
 btn.disabled = !!isBusy;
 btn.style.opacity = isBusy ? '.72' : '1';
 btn.textContent = isBusy ? (addMode ? 'Locatie opslaan...' : 'Opslaan...') : desiredSaveButtonLabel();
}


function beginSaveAction() {
 if (saveInProgress) return false;
 saveInProgress = true;
 setSaveButtonState(true);
 return true;
}

function finishSaveAction() {
 saveInProgress = false;
 setSaveButtonState(false);
}

function warnPendingSave() {
 setStatusBox('Nieuwe locatie staat klaar. Klik op Opslaan om haar echt toe te voegen, of op Annuleer toevoegen.', 'warn', true);
}

let transientSavedMarker = null;
let immediateSavedMarker = null;
let immediateSavedTimer = null;

function showImmediateSavedMarker(loc) {
 try {
 if (!loc || !map || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) return;
 if (!immediateSavedLayer) buildClusterGroup();
 if (immediateSavedMarker) {
  try { immediateSavedLayer.removeLayer(immediateSavedMarker); } catch (err) {}
  immediateSavedMarker = null;
 }
 immediateSavedMarker = L.marker([loc.lat, loc.lng], {
  icon: pinIcon(true, onRouteMap.has(loc.id), !onRouteMap.has(loc.id) && nearRouteMap.has(loc.id), false, loc.category),
  zIndexOffset: 2600,
  interactive: false
 });
 immediateSavedMarker.__locId = loc.id;
 immediateSavedLayer.addLayer(immediateSavedMarker);
 clearTimeout(immediateSavedTimer);
 immediateSavedTimer = window.setTimeout(() => {
  if (immediateSavedMarker) {
   try { immediateSavedLayer.removeLayer(immediateSavedMarker); } catch (err) {}
   immediateSavedMarker = null;
  }
 }, 12000);
 } catch (err) {
 console.error('Directe opgeslagen marker tonen mislukte', err);
 }
}

function showTransientSavedMarker(loc) {
 try {
 if (!loc || !map || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) return;
 if (transientSavedMarker) {
 transientSavedMarker.remove();
 transientSavedMarker = null;
 }
 transientSavedMarker = L.marker([loc.lat, loc.lng], {
 icon: pinIcon(true, onRouteMap.has(loc.id), nearRouteMap.has(loc.id), false, loc.category),
 zIndexOffset: 1600
 }).addTo(map);
 window.setTimeout(() => {
 if (transientSavedMarker) {
 transientSavedMarker.remove();
 transientSavedMarker = null;
 }
 }, 8000);
 } catch (err) {
 console.error('Tijdelijke marker tonen mislukte', err);
 }
}

function refreshAfterSave(loc, shouldFly=false) {
 try {
 if (routeData) recomputeRouteMaps();
 filtered = getVisibleLocations([...locations]);
 if (loc && loc.id) selectedId = loc.id;
 renderSelected();
 renderRouteSummaryBox();
 renderList();
 updatePrimaryPlanRouteButton();
 document.getElementById('routeTag').textContent = routeData && routeData.points && routeData.points.length > 1
 ? `Route ${onRouteMap.size} · Nabij ${nearRouteMap.size}`
 : 'Geen route';
 document.getElementById('countTag').textContent = `${filtered.length} zichtbaar / ${locations.length} totaal`;
 showTransientSavedMarker(loc);
 showImmediateSavedMarker(loc);
 if (clusterGroup && typeof clusterGroup.refreshClusters === 'function') {
 try { clusterGroup.refreshClusters(); } catch (err) {}
 }
 if (shouldFly && loc && map && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)) {
 map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 15), { duration:.45 });
 }
 } catch (err) {
 console.error('Lichte refresh na opslaan mislukte', err);
 } finally {
 finishSaveAction();
 }
 window.setTimeout(() => {
 try {
 renderMarkers();
 } catch (err) {
 console.error('Markers later verversen mislukte', err);
 }
 }, 350);
}

function showToast(text) {
 const el = document.getElementById('toast');
 if (!el) return;
 el.textContent = text;
 el.classList.add('show');
 clearTimeout(toastTimer);
 toastTimer = setTimeout(() => {
 el.classList.remove('show');
 }, 2600);
}

function clearImportedRoute() {
 routeData = null;
 onRouteMap = new Map();
 nearRouteMap = new Map();
 saveRouteStateLocal();
 if (routeLayer) {
 routeLayer.remove();
 routeLayer = null;
 }
 if (routePointLayer) {
 routePointLayer.remove();
 routePointLayer = null;
 }
 renderAll(false);
 setStatusBox('Route verwijderd. De kaart blijft leeg totdat je opnieuw een route importeert.', 'warn', true);
}


function buildRoutePlannerCoordStopId(lat, lng) {
 return `coord:${Number(lat).toFixed(6)},${Number(lng).toFixed(6)}`;
}

function parseRoutePlannerStop(stopId) {
 const raw = String(stopId || '').trim();
 if (!raw) return null;
 if (raw.startsWith('coord:')) {
  const pair = raw.slice(6).split(',');
  const lat = Number(pair[0]);
  const lng = Number(pair[1]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return {
   id: raw,
   key: raw,
   name: `Punt ${formatCoord(lat)}, ${formatCoord(lng)}`,
   lat,
   lng,
   isWaypoint: true
  };
 }
 const loc = locations.find(entry => entry.id === raw);
 if (!loc) return null;
 return {
  ...loc,
  key: loc.id,
  isWaypoint: false
 };
}

function getRoutePlannerStopLocations() {
 const seen = new Set();
 const next = [];
 routePlannerStopIds.forEach((stopId) => {
  const parsed = parseRoutePlannerStop(stopId);
  if (!parsed || seen.has(parsed.key)) return;
  seen.add(parsed.key);
  next.push(parsed);
 });
 routePlannerStopIds = next.map(stop => stop.key);
 return next;
}

function getRoutePlannerIndex(id) {
 const stops = getRoutePlannerStopLocations();
 const target = String(id || '').trim();
 const idx = stops.findIndex((stop) => stop.key === target || stop.id === target);
 return idx >= 0 ? idx + 1 : null;
}

function getMinimumRoutePlannerStops() {
 return routeHomeBase ? 1 : 2;
}

function getRoutePlannerJourneyLabel() {
 return routeHomeBase ? `vanaf ${routeHomeBase.name} en terug naar ${routeHomeBase.name}` : 'tussen je gekozen stops';
}


function resetRoutePlannerWorkspace() {
 routePlannerStopIds = [];
 routePlannerSearchResults = [];
 routePlannerSearchQuery = '';
 routePlannerLastBuiltStops = [];
}

function setRoutePlannerSearchResults(query, results) {
 routePlannerSearchQuery = String(query || '').trim();
 routePlannerSearchResults = Array.isArray(results) ? results.slice(0, 8) : [];
}

function addRoutePlannerSearchResult(stopId) {
 if (!stopId) return;
 if (routePlannerStopIds.includes(stopId)) {
  setStatusBox('Deze locatie zit al in je routeveld.', 'info', true);
  return;
 }
 routePlannerStopIds.push(stopId);
 const loc = locations.find((item) => item.id === stopId);
 if (loc) {
  selectedId = loc.id;
  if (map) map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 12), { duration:.35 });
  setStatusBox(`${loc.name} toegevoegd aan je routeveld.`, 'success', true);
 }
 renderAll(false);
}

function removeRoutePlannerStop(stopId) {
 const index = routePlannerStopIds.indexOf(stopId);
 if (index < 0) return;
 routePlannerStopIds.splice(index, 1);
 renderAll(false);
 setStatusBox('Stop verwijderd uit je routeveld.', 'warn', true);
}

function findRoutePlannerWaypoint(lat, lng, maxKm=0.05) {
 const stops = getRoutePlannerStopLocations();
 let best = null;
 let bestDistance = Infinity;
 stops.forEach((stop) => {
  if (!stop.isWaypoint) return;
  const distance = kmBetween(lat, lng, stop.lat, stop.lng);
  if (distance < bestDistance) {
   bestDistance = distance;
   best = stop;
  }
 });
 return best && bestDistance <= maxKm ? { ...best, distanceKm: bestDistance } : null;
}

function getMainAppUrl() {
 const url = new URL(window.location.href);
 url.searchParams.delete(ROUTE_PLANNER_QUERY_KEY);
 return url.toString();
}

function getRoutePlannerTabUrl() {
 const url = new URL(getMainAppUrl());
 url.searchParams.set(ROUTE_PLANNER_QUERY_KEY, '1');
 return url.toString();
}

function openRoutePlannerTab() {
 if (!routeHomeBase) {
  handleHomeSetupClick();
  if (!routeHomeBase) return false;
 }
 startRoutePlanner();
 setStatusBox('Routeplanner blijft nu in dezelfde kaart open. Klik locaties op de kaart om ze toe te voegen.', 'info', true);
 return true;
}

function applyRoutePlannerTabMode() {
 if (!IS_ROUTE_PLANNER_TAB) return;
 document.body.classList.add('route-planner-tab');
 detailMode = 'overview';
 detailPanelVisible = false;
 routePlannerActive = true;
 resetRoutePlannerWorkspace();
 setControlShelfOpen(window.innerWidth <= 900 ? true : false);
window.addEventListener('resize', () => {
 setControlShelfOpen(window.innerWidth <= 900 ? true : !document.getElementById('controlShelf')?.hidden);
});
 updateOnboardingVisibility(true);
 if (!routeHomeBase) {
  setTimeout(() => {
   handleHomeSetupClick();
   if (!routeHomeBase) {
    setStatusBox('Stel eerst thuis in. Daarna klik je locaties op de kaart om ze als stops toe te voegen.', 'warn', true);
   } else {
    renderAll(false);
    setStatusBox('Routeplanner staat klaar. Thuis wordt automatisch als start en einde meegenomen.', 'info', true);
   }
  }, 80);
 } else {
  setStatusBox('Routeplanner staat klaar. Thuis wordt automatisch als start en einde meegenomen.', 'info', true);
 }
}

function updatePrimaryPlanRouteButton() {
 const btn = document.getElementById('primaryPlanRouteBtn');
 if (!btn) return;
 if (!routePlannerActive) {
  btn.textContent = '🧭 Plan route';
  btn.dataset.routePlannerState = 'idle';
  return;
 }
 const count = getRoutePlannerStopLocations().length;
 const minStops = getMinimumRoutePlannerStops();
 btn.dataset.routePlannerState = count >= minStops ? 'ready' : 'selecting';
 if (count >= minStops) {
  btn.textContent = `✔ Route verwerken (${count})`;
 } else {
  btn.textContent = `🧭 Kies stops (${count})`;
 }
}

async function handlePrimaryPlanRouteClick(event) {
 if (event) {
  try { event.preventDefault(); } catch (err) {}
  try { event.stopPropagation(); } catch (err) {}
 }
 if (!currentRoleAllows('importRoute')) {
  setStatusBox('Alleen owner en editor mogen routes plannen.', 'warn', true);
  return false;
 }
 try {
  if (!routeHomeBase) {
   handleHomeSetupClick();
   if (!routeHomeBase) return false;
  }
  if (!routePlannerActive) {
   startRoutePlanner();
   return false;
  }
  const count = getRoutePlannerStopLocations().length;
  const minStops = getMinimumRoutePlannerStops();
  if (count >= minStops) {
   await buildPlannedRoute();
   return false;
  }
  if (count === 0) {
   cancelRoutePlanner(true);
   return false;
  }
  setStatusBox(`Kies nog ${minStops - count} ${minStops - count === 1 ? 'stop' : 'stops'} en druk daarna opnieuw op Route verwerken.`, 'info', true);
  return false;
 } catch (err) {
  console.error('Plan route fout', err);
  setStatusBox('Plan route kon niet starten. Probeer het opnieuw.', 'warn', true);
  return false;
 }
}

function startRoutePlanner() {
 if (addMode) {
  warnPendingSave();
  return;
 }
 routePlannerActive = true;
 resetRoutePlannerWorkspace();
 detailPanelVisible = false;
 detailMode = 'overview';
 renderAll(false);
 const homeHint = routeHomeBase
  ? ` Start en einde: ${routeHomeBase.name}.`
  : ' Stel eerst thuis in als je route heen en terug vanuit huis moet lopen.';
 setStatusBox(`Route plannen staat aan. Je ziet nu alleen je routeveld met gekozen stops. Klik locaties op de kaart om ze toe te voegen.${homeHint}`, 'info', true);
}

function cancelRoutePlanner(showMessage=true) {
 routePlannerActive = false;
 resetRoutePlannerWorkspace();
 renderAll(false);
 if (showMessage) setStatusBox('Plan route geannuleerd.', 'warn', true);
}

function toggleRoutePlannerLocation(id, options={}) {
 const loc = locations.find(x => x.id === id);
 if (!loc) return;
 const existingIndex = routePlannerStopIds.indexOf(id);
 if (options.ask !== false) {
  if (existingIndex >= 0) {
   const shouldRemove = window.confirm(`${loc.name} zit al in je route. Verwijderen?`);
   if (!shouldRemove) {
    setStatusBox(`${loc.name} blijft in de route staan.`, 'info', true);
    return;
   }
  } else {
   const shouldAdd = window.confirm(`${loc.name} toevoegen aan de route?`);
   if (!shouldAdd) {
    setStatusBox(`${loc.name} niet toegevoegd.`, 'info', true);
    return;
   }
  }
 }
 if (existingIndex >= 0) {
  routePlannerStopIds.splice(existingIndex, 1);
  selectedId = id;
  renderAll(false);
  setStatusBox(`${loc.name} verwijderd uit de planroute.`, 'warn', true);
 } else {
  routePlannerStopIds.push(id);
  selectedId = id;
  renderAll(false);
  const stopNumber = routePlannerStopIds.length;
  setStatusBox(`${loc.name} toegevoegd als stop ${stopNumber}.`, 'success', true);
 }
 if (options.flyTo !== false && map) {
  map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 12), { duration:.35 });
 }
}

function toggleRoutePlannerCoordinate(lat, lng, options={}) {
 const stopId = buildRoutePlannerCoordStopId(lat, lng);
 const existingIndex = routePlannerStopIds.indexOf(stopId);
 if (options.ask !== false) {
  if (existingIndex >= 0) {
   const shouldRemove = window.confirm(`Dit routepunt zit al in je route. Verwijderen?`);
   if (!shouldRemove) {
    setStatusBox('Routepunt blijft staan.', 'info', true);
    return;
   }
  } else {
   const shouldAdd = window.confirm(`Dit punt toevoegen aan de route op ${formatCoord(lat)}, ${formatCoord(lng)}?`);
   if (!shouldAdd) {
    setStatusBox('Routepunt niet toegevoegd.', 'info', true);
    return;
   }
  }
 }
 if (existingIndex >= 0) {
  routePlannerStopIds.splice(existingIndex, 1);
  renderAll(false);
  setStatusBox('Handmatig routepunt verwijderd.', 'warn', true);
 } else {
  routePlannerStopIds.push(stopId);
  renderAll(false);
  setStatusBox(`Handmatig routepunt toegevoegd als stop ${routePlannerStopIds.length}.`, 'success', true);
 }
 if (options.flyTo !== false && map) {
  map.flyTo([lat, lng], Math.max(map.getZoom(), 12), { duration:.35 });
 }
}

function handleRoutePlannerMapClick(latlng) {
 const nearestLoc = findNearestLocation(latlng.lat, latlng.lng, 0.18);
 if (nearestLoc && visibleCategories.has(normalizeCategoryName(nearestLoc.category))) {
  toggleRoutePlannerLocation(nearestLoc.id, { flyTo:false, ask:true });
  return;
 }
 const existingWaypoint = findRoutePlannerWaypoint(latlng.lat, latlng.lng, 0.05);
 if (existingWaypoint) {
  toggleRoutePlannerCoordinate(existingWaypoint.lat, existingWaypoint.lng, { flyTo:false, ask:true });
  return;
 }
 toggleRoutePlannerCoordinate(latlng.lat, latlng.lng, { flyTo:false, ask:true });
}

async function buildRoadDurationMatrix(points) {
 const cleaned = (Array.isArray(points) ? points : []).filter((point) => Number.isFinite(Number(point && point.lat)) && Number.isFinite(Number(point && point.lng)));
 if (cleaned.length < 2) return null;
 const coordString = cleaned.map((point) => `${point.lng},${point.lat}`).join(';');
 const tableUrl = `https://router.project-osrm.org/table/v1/driving/${coordString}?annotations=duration`;
 const data = await fetchOsrmJson(tableUrl);
 const durations = data && data.durations;
 return Array.isArray(durations) ? durations : null;
}

function getDurationMatrixValue(durations, fromIndex, toIndex) {
 const value = Number(durations && durations[fromIndex] && durations[fromIndex][toIndex]);
 return Number.isFinite(value) ? value : Number.POSITIVE_INFINITY;
}

function scoreRoutePlannerOrder(order, durations) {
 const indices = Array.isArray(order) ? order.slice() : [];
 if (!indices.length) return 0;
 let total = 0;
 let currentMatrixIndex = 0;
 for (const stopIndex of indices) {
  total += getDurationMatrixValue(durations, currentMatrixIndex, stopIndex + 1);
  currentMatrixIndex = stopIndex + 1;
 }
 total += getDurationMatrixValue(durations, currentMatrixIndex, 0);
 return total;
}

function buildGreedyRoutePlannerOrder(count, durations) {
 const remaining = Array.from({ length: count }, (_, index) => index);
 const ordered = [];
 let currentMatrixIndex = 0;
 while (remaining.length) {
  remaining.sort((a, b) => {
   const costA = getDurationMatrixValue(durations, currentMatrixIndex, a + 1);
   const costB = getDurationMatrixValue(durations, currentMatrixIndex, b + 1);
   return costA - costB;
  });
  const next = remaining.shift();
  ordered.push(next);
  currentMatrixIndex = next + 1;
 }
 return ordered;
}

function improveRoutePlannerOrderWithTwoOpt(order, durations, maxPasses = 8) {
 const best = Array.isArray(order) ? order.slice() : [];
 if (best.length <= 2) return best;
 let bestScore = scoreRoutePlannerOrder(best, durations);
 let improved = true;
 let pass = 0;
 while (improved && pass < maxPasses) {
  improved = false;
  pass += 1;
  for (let i = 0; i < best.length - 1; i++) {
   for (let k = i + 1; k < best.length; k++) {
    const candidate = best.slice(0, i).concat(best.slice(i, k + 1).reverse(), best.slice(k + 1));
    const candidateScore = scoreRoutePlannerOrder(candidate, durations);
    if (candidateScore + 1 < bestScore) {
     best.splice(0, best.length, ...candidate);
     bestScore = candidateScore;
     improved = true;
    }
   }
  }
 }
 return best;
}

function buildExactRoutePlannerOrder(count, durations) {
 const fullMask = (1 << count) - 1;
 const dp = Array.from({ length: 1 << count }, () => Array(count).fill(Number.POSITIVE_INFINITY));
 const parent = Array.from({ length: 1 << count }, () => Array(count).fill(-1));

 for (let stop = 0; stop < count; stop++) {
  dp[1 << stop][stop] = getDurationMatrixValue(durations, 0, stop + 1);
 }

 for (let mask = 1; mask <= fullMask; mask++) {
  for (let last = 0; last < count; last++) {
   if (!(mask & (1 << last))) continue;
   const prevMask = mask ^ (1 << last);
   if (!prevMask) continue;
   for (let prev = 0; prev < count; prev++) {
    if (!(prevMask & (1 << prev))) continue;
    const candidate = dp[prevMask][prev] + getDurationMatrixValue(durations, prev + 1, last + 1);
    if (candidate < dp[mask][last]) {
     dp[mask][last] = candidate;
     parent[mask][last] = prev;
    }
   }
  }
 }

 let bestLast = 0;
 let bestScore = Number.POSITIVE_INFINITY;
 for (let last = 0; last < count; last++) {
  const total = dp[fullMask][last] + getDurationMatrixValue(durations, last + 1, 0);
  if (total < bestScore) {
   bestScore = total;
   bestLast = last;
  }
 }

 const ordered = [];
 let mask = fullMask;
 let current = bestLast;
 while (mask) {
  ordered.push(current);
  const prev = parent[mask][current];
  mask ^= (1 << current);
  current = prev;
  if (current < 0 && mask) {
   const fallback = [];
   for (let stop = 0; stop < count; stop++) if (mask & (1 << stop)) fallback.push(stop);
   ordered.push(...fallback.reverse());
   break;
  }
 }
 return ordered.reverse();
}

function buildFallbackDurationMatrix(points) {
 const usablePoints = Array.isArray(points) ? points.filter((point) => point && Number.isFinite(Number(point.lat)) && Number.isFinite(Number(point.lng))) : [];
 return usablePoints.map((from) => usablePoints.map((to) => Math.round(kmBetween(Number(from.lat), Number(from.lng), Number(to.lat), Number(to.lng)) * 60)));
}

function isUsableDurationMatrix(durations, expectedSize) {
 if (!Array.isArray(durations) || durations.length !== expectedSize) return false;
 return durations.every((row) => Array.isArray(row) && row.length === expectedSize && row.every((value) => Number.isFinite(Number(value))));
}

async function optimizeRoutePlannerStops(stops) {
 const usableStops = Array.isArray(stops) ? stops.filter(Boolean) : [];
 if (usableStops.length <= 1) return usableStops;
 if (!routeHomeBase) return usableStops;

 const matrixPoints = [{ lat:routeHomeBase.lat, lng:routeHomeBase.lng }, ...usableStops.map((stop) => ({ lat:stop.lat, lng:stop.lng }))];
 const stopCount = usableStops.length;
 let durations = null;

 try {
  const roadDurations = await buildRoadDurationMatrix(matrixPoints);
  if (isUsableDurationMatrix(roadDurations, matrixPoints.length)) {
   durations = roadDurations;
  } else {
   throw new Error('ongeldige matrix');
  }
 } catch (err) {
  durations = buildFallbackDurationMatrix(matrixPoints);
 }

 let order;
 if (stopCount <= 10) {
  order = buildExactRoutePlannerOrder(stopCount, durations);
 } else {
  const greedyOrder = buildGreedyRoutePlannerOrder(stopCount, durations);
  order = improveRoutePlannerOrderWithTwoOpt(greedyOrder, durations, 16);
 }

 return order.map((index) => usableStops[index]).filter(Boolean);
}

async function buildPlannedRoute() {
 const pickedStops = getRoutePlannerStopLocations();
 const minStops = getMinimumRoutePlannerStops();
 if (pickedStops.length < minStops) {
  setStatusBox(routeHomeBase ? 'Kies minimaal 1 stop naast thuis voor je route heen en terug.' : 'Kies minimaal 2 stops voor je planroute.', 'warn', true);
  return;
 }
 const orderedStops = await optimizeRoutePlannerStops(pickedStops);
 const waypointPoints = orderedStops.map(loc => ({ lat:Number(loc.lat), lng:Number(loc.lng) })).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
 const routePoints = routeHomeBase
  ? [
    { lat:Number(routeHomeBase.lat), lng:Number(routeHomeBase.lng) },
    ...waypointPoints,
    { lat:Number(routeHomeBase.lat), lng:Number(routeHomeBase.lng) }
   ]
  : waypointPoints.slice();
 if (routePoints.length < 2) {
  setStatusBox('De gekozen stops bevatten geen geldige coördinaten.', 'warn', true);
  return;
 }
 setStatusBox(`Route wordt verwerkt via het wegennet voor ${pickedStops.length} gekozen ${pickedStops.length === 1 ? 'stop' : 'stops'} ${getRoutePlannerJourneyLabel()}...`, 'info', true);
 try {
  const roadResult = await buildRoadRoute(routePoints, { preferMatch:false });
  if (!roadResult || !Array.isArray(roadResult.points) || roadResult.points.length < 2) {
   setStatusBox('De route kon niet via het wegennet worden opgebouwd. Probeer het opnieuw met minder of dichterbij liggende locaties.', 'warn', true);
   return;
  }
  routeData = {
   name: `Planroute ${routeHomeBase ? `vanaf en terug naar ${routeHomeBase.name}` : 'tussen gekozen stops'} · ${pickedStops.length} ${pickedStops.length === 1 ? 'stop' : 'stops'}`,
   points: roadResult.points,
   importedPoints: waypointPoints,
   derivedFromPoints: true,
   roadRouted: true,
   usedStraightFallback: false,
   routeBuildSource: roadResult.source || 'route',
   updated_at: Date.now()
  };
  routePlannerActive = false;
  routePlannerSearchResults = [];
  routePlannerSearchQuery = '';
  routePlannerLastBuiltStops = orderedStops.slice();
  routePlannerStopIds = [];
  saveRouteStateLocal();
  recomputeRouteMaps();
  const bounds = L.latLngBounds(getRouteDisplayPoints(routeData.points).map(p => [p.lat, p.lng]));
  if (routeHomeBase) bounds.extend([routeHomeBase.lat, routeHomeBase.lng]);
  orderedStops.forEach((loc) => bounds.extend([loc.lat, loc.lng]));
  if (bounds.isValid() && map) map.fitBounds(bounds.pad(0.12));
  const firstSelectableStop = orderedStops.find((stop) => !stop.isWaypoint && stop.id);
  selectedId = firstSelectableStop && firstSelectableStop.id ? firstSelectableStop.id : selectedId;
  renderAll(false);
  if (routePlannerPreviewMode) {
   setStatusBox(`Planroute verwerkt ${getRoutePlannerJourneyLabel()} met ${pickedStops.length} ${pickedStops.length === 1 ? 'stop' : 'stops'}. Controleer eerst de route op de kaart. Is alles goed, klik dan op 'Route bevestigen en terug'.`, 'success', true);
  } else {
   setStatusBox(`Planroute verwerkt ${getRoutePlannerJourneyLabel()} met ${pickedStops.length} ${pickedStops.length === 1 ? 'stop' : 'stops'}. Je ziet nu ${onRouteMap.size} locaties op de route en ${nearRouteMap.size} binnen 1,5 km.`, 'success', true);
  }
 } catch (err) {
  console.error('Planroute maken mislukte', err);
  setStatusBox('Planroute maken mislukte. Probeer het opnieuw.', 'warn', true);
 }
}

function renderRouteSummaryBox() {
 const el = document.getElementById('routeSummaryBox');
 if (routePlannerActive) {
  const stops = getRoutePlannerStopLocations();
  const minStops = getMinimumRoutePlannerStops();
  const exactMatch = routePlannerSearchQuery ? routePlannerSearchResults.find((loc) => String(loc.name || '').trim().toLowerCase() === routePlannerSearchQuery.trim().toLowerCase()) : null;
  const stopLines = stops.length
   ? `<div class="routePlannerStopList">${stops.map((loc, index) => `<div class="routePlannerStopCard"><div class="routePlannerStopMain"><div class="routePlannerStopIndex">${index + 1}</div><div class="routePlannerStopText"><div class="routePlannerStopName">${escapeHtml(loc.name)}</div><div class="routePlannerStopMeta">${loc.isWaypoint ? 'Handmatig routepunt' : 'Gekozen vanaf de kaart of zoekfunctie'}</div></div></div><div class="routePlannerStopActions"><button class="routePlannerMiniBtn routePlannerRemoveStopBtn" type="button" data-route-stop-remove="${escapeAttr(loc.id)}">Verwijder</button></div></div>`).join('')}</div>`
   : `<div class="routePlannerEmpty">Je routeveld is nog leeg. Klik locaties op de kaart of zoek hierboven. Alleen gekozen stops komen hier te staan. <strong>Thuis</strong> telt automatisch mee als start en eindpunt, maar krijgt geen nummer.</div>`;
  const searchResultsHtml = routePlannerSearchQuery
   ? (routePlannerSearchResults.length
      ? `<div class="routePlannerSearchResults">${routePlannerSearchResults.map((loc) => `<div class="routePlannerResultCard"><div><div class="routePlannerResultName">${escapeHtml(loc.name)}</div><div class="routePlannerResultMeta">${escapeHtml(normalizeCategoryName(loc.category))}${loc.city ? ` · ${escapeHtml(loc.city)}` : ''}</div></div><button class="routePlannerMiniBtn routePlannerAddSearchResultBtn" type="button" data-route-search-add="${escapeAttr(loc.id)}">Toevoegen</button></div>`).join('')}</div>`
      : `<div class="routePlannerEmpty" style="margin-top:10px;">Geen zoektreffers voor <strong>${escapeHtml(routePlannerSearchQuery)}</strong> in je zichtbare locaties.</div>`)
   : '';
  const plannerHint = exactMatch
   ? `Exacte treffer gevonden voor <strong>${escapeHtml(exactMatch.name)}</strong>. Je kunt die hieronder direct toevoegen.`
   : `Zoek op naam in het gewone zoekvak bovenin. Tijdens Plan route verschijnen de treffers hier direct onder, zodat je niets in de algemene lijst hoeft te zoeken.`;
  const homeName = routeHomeBase ? escapeHtml(routeHomeBase.name || 'Thuis') : 'Nog niet ingesteld';
  el.innerHTML = `
  <div class="routeSummaryTitle">Routeplanner · heen en terug</div>
  <div class="routePlannerBoard">
   <div class="routePlannerStrip">
    <div class="routePlannerStat"><div class="routePlannerStatLabel">Start en einde</div><div class="routePlannerStatValue">${homeName}</div></div>
    <div class="routePlannerStat"><div class="routePlannerStatLabel">Gekozen stops</div><div class="routePlannerStatValue">${stops.length}</div></div>
   </div>
   <div class="routePlannerHelper">${plannerHint}</div>
   <div class="routePlannerRouteField">
    <div class="routePlannerFieldHead">
     <div>
      <div class="routePlannerFieldTitle">Routeveld</div>
      <div class="routePlannerFieldSub">Volgorde van je gekozen stops. Bij verwerken wordt de beste volgorde via het wegennet berekend vanaf thuis en weer terug naar thuis.</div>
     </div>
    </div>
    ${stopLines}
    ${searchResultsHtml}
   </div>
   <div class="routeSummaryActions">
    <button id="buildPlannedRouteBtn" class="routeSummaryBtn" type="button" ${stops.length < minStops ? 'disabled' : ''}>Route verwerken</button>
    <button id="resetPlannedRouteBtn" class="routeSummaryBtn" type="button">Leeg routeveld</button>
    <button id="cancelPlannedRouteBtn" class="routeSummaryBtn routeSummaryBtnDanger" type="button">Annuleren</button>
   </div>
  </div>
  `;
  const buildBtn = document.getElementById('buildPlannedRouteBtn');
  const resetBtn = document.getElementById('resetPlannedRouteBtn');
  const cancelBtn = document.getElementById('cancelPlannedRouteBtn');
  if (buildBtn) buildBtn.addEventListener('click', buildPlannedRoute, { once:true });
  if (resetBtn) resetBtn.addEventListener('click', () => {
   resetRoutePlannerWorkspace();
   renderAll(false);
   setStatusBox('Routeveld geleegd. Kies opnieuw stops op de kaart of via zoeken.', 'info', true);
  }, { once:true });
  if (cancelBtn) cancelBtn.addEventListener('click', () => cancelRoutePlanner(true), { once:true });
  el.querySelectorAll('.routePlannerRemoveStopBtn').forEach((btn) => {
   btn.addEventListener('click', () => removeRoutePlannerStop(String(btn.getAttribute('data-route-stop-remove') || '')));
  });
  el.querySelectorAll('.routePlannerAddSearchResultBtn').forEach((btn) => {
   btn.addEventListener('click', () => addRoutePlannerSearchResult(String(btn.getAttribute('data-route-search-add') || '')));
  });
  el.style.display = 'block';
  return;
 }
 if (!routeData || !Array.isArray(routeData.points) || routeData.points.length < 2) {
 el.innerHTML = `
 <div class="routeSummaryTitle routeSummaryEmpty">Geen route geladen</div>
 <div class="routeSummaryMeta routeSummaryEmpty">Importeer een GPX, KML, KMZ of GeoJSON om routepunten, afstand en locaties binnen 1,5 km te tonen. Tot die tijd zie je alle kaartlocaties gewoon op de kaart en blijft dit route-overzicht compact.</div>
 `;
 el.style.display = 'block';
 return;
 }
 const routeName = escapeHtml(routeData.name || 'Geimporteerde route');
 const routeDistanceKm = sumRouteDistanceKm(routeData.points);
 const importedPointCount = Array.isArray(routeData.importedPoints) && routeData.importedPoints.length
 ? routeData.importedPoints.length
 : routeData.points.length;
 let detail = 'originele importlijn';
 if (routeData.routeBuildSource === 'match') detail = 'wegennet gematcht';
 else if (routeData.routeBuildSource === 'route') detail = 'wegennet gevolgd';
 else if (routeData.routeBuildSource === 'original_detailed') detail = 'gedetailleerde importlijn';
 const plannerConfirmButton = routePlannerPreviewMode
  ? '<button id="confirmPlannerRouteBtn" class="routeSummaryBtn" type="button">Route bevestigen en terug</button>'
  : '';
 const plannedStopPreview = routePlannerPreviewMode && routePlannerLastBuiltStops.length
  ? `<div class="routePlannerPreviewNotice">Controleer eerst of de route logisch loopt. Pas als hij goed is, klik je op <strong>Route bevestigen en terug</strong>. Thuis blijft automatisch start en eindpunt.</div><div class="routePlannerPreviewList">${routePlannerLastBuiltStops.map((loc, index) => `<div class="routePlannerStopCard"><div class="routePlannerStopMain"><div class="routePlannerStopIndex">${index + 1}</div><div class="routePlannerStopText"><div class="routePlannerStopName">${escapeHtml(loc.name)}</div><div class="routePlannerStopMeta">Stop in berekende volgorde</div></div></div></div>`).join('')}</div>`
  : '';
 el.innerHTML = `
 <div class="routeSummaryTitle">Actieve route: ${routeName}</div>
 <div class="routeSummaryMeta">Afstand: ${formatDistanceLabel(routeDistanceKm)} · Routepunten: ${importedPointCount} · ${onRouteMap.size} op route · ${nearRouteMap.size} binnen 1,5 km · ${detail}</div>
 ${plannedStopPreview}
 <div class="routeSummaryActions">
 ${plannerConfirmButton}
 <button id="clearRouteBtn" class="routeSummaryBtn routeSummaryBtnDanger" type="button">Route verwijderen</button>
 </div>
 `;
 const btn = document.getElementById('clearRouteBtn');
 const confirmBtn = document.getElementById('confirmPlannerRouteBtn');
 if (btn) btn.addEventListener('click', clearImportedRoute, { once:true });
 if (confirmBtn) confirmBtn.addEventListener('click', confirmPlannerRouteAndReturn, { once:true });
 el.style.display = 'block';
}

function confirmPlannerRouteAndReturn() {
 if (!routeData || !Array.isArray(routeData.points) || routeData.points.length < 2) {
  setStatusBox('Er is nog geen verwerkte route om te bevestigen.', 'warn', true);
  return;
 }
 saveRouteStateLocal();
 routePlannerPreviewMode = false;
 routePlannerActive = false;
 routePlannerSearchResults = [];
 routePlannerSearchQuery = '';
 routePlannerStopIds = [];
 detailPanelVisible = false;
 detailMode = 'overview';
 try {
  const cleanUrl = getMainAppUrl();
  if (window.history && typeof window.history.replaceState === 'function') {
   window.history.replaceState({}, document.title, cleanUrl);
  }
 } catch (err) {}
 renderAll(false);
 setStatusBox('Route bevestigd. De route blijft nu zichtbaar in het hoofdscherm.', 'success', true);
}
function consumeRouteReturnStatus() {
 try {
  const message = localStorage.getItem(ROUTE_RETURN_STATUS_KEY);
  if (!message) return;
  localStorage.removeItem(ROUTE_RETURN_STATUS_KEY);
  setStatusBox(String(message), 'success', true);
 } catch (err) {}
}


function makePinHtml(selected=false, onRoute=false, nearRoute=false, searchHit=false, category='') {
 const normalizedCategory = String(category || '').toLowerCase().trim();
 const isTopLocation = normalizedCategory === 'top locaties' || normalizedCategory === 'top';
 const isOnderweg = normalizedCategory === 'onderweg' || normalizedCategory === 'nieuw onderweg';
 const isBezocht = normalizedCategory === 'bezocht' || normalizedCategory === 'bezocht locaties' || normalizedCategory.includes('bezocht');
 const size = isTopLocation ? (selected ? 20 : 16) : (isOnderweg ? (selected ? 23 : 19) : (selected ? 24 : 18));
 const dot = isTopLocation ? (selected ? 7 : 6) : (selected ? 8 : 6);

 const baseColor = isTopLocation
  ? '#fbbf24'
  : (isOnderweg ? '#ef4444' : (isBezocht ? '#ff6a00' : '#60a5fa'));

 const selectedColor = isTopLocation
  ? '#fbbf24'
  : (isOnderweg ? '#dc2626' : (isBezocht ? '#ff4d00' : '#2563eb'));

 const routeColor = '#22c55e';
 const nearColor = '#f59e0b';

 const searchColor = isTopLocation
  ? '#fbbf24'
  : (isOnderweg ? '#fecaca' : (isBezocht ? '#ffb066' : '#bfdbfe'));

 const haloBg = isTopLocation
  ? 'rgba(251,191,36,.18)'
  : (isOnderweg ? 'rgba(239,68,68,.18)' : (isBezocht ? 'rgba(255,106,0,.24)' : 'rgba(37,99,235,.18)'));

 const haloBorder = isTopLocation
  ? 'rgba(245,158,11,.45)'
  : (isOnderweg ? 'rgba(234,88,12,.45)' : (isBezocht ? 'rgba(255,106,0,.55)' : 'rgba(37,99,235,.45)'));

 const routeHaloBg = 'rgba(34,197,94,.18)';
 const routeHaloBorder = 'rgba(134,239,172,.42)';
 const nearHaloBg = 'rgba(245,158,11,.18)';
 const nearHaloBorder = 'rgba(251,191,36,.42)';

 const searchHaloBg = isTopLocation
  ? 'rgba(254,243,199,.22)'
  : (isOnderweg ? 'rgba(254,215,170,.22)' : (isBezocht ? 'rgba(255,190,140,.28)' : 'rgba(191,219,254,.18)'));

 const searchHaloBorder = isTopLocation
  ? 'rgba(251,191,36,.34)'
  : (isOnderweg ? 'rgba(249,115,22,.36)' : (isBezocht ? 'rgba(255,122,26,.42)' : 'rgba(191,219,254,.36)'));

 const searchRingBg = isTopLocation
  ? 'rgba(254,243,199,.20)'
  : (isOnderweg ? 'rgba(255,237,213,.18)' : (isBezocht ? 'rgba(255,221,194,.24)' : 'rgba(219,234,254,.18)'));

 const searchRingBorder = isTopLocation
  ? 'rgba(251,191,36,.32)'
  : (isOnderweg ? 'rgba(249,115,22,.34)' : (isBezocht ? 'rgba(255,122,26,.38)' : 'rgba(219,234,254,.36)'));

 const color = isTopLocation
  ? baseColor
  : (isOnderweg
   ? (selected ? selectedColor : (searchHit ? searchColor : baseColor))
   : (selected
    ? (onRoute ? routeColor : (nearRoute ? nearColor : selectedColor))
    : (searchHit ? searchColor : (onRoute ? routeColor : (nearRoute ? nearColor : baseColor)))));

 const selectedHaloBg = onRoute ? routeHaloBg : (nearRoute ? nearHaloBg : haloBg);
 const selectedHaloBorder = onRoute ? routeHaloBorder : (nearRoute ? nearHaloBorder : haloBorder);

 const halo = selected
  ? `<div style="position:absolute;left:50%;top:52%;width:42px;height:42px;border-radius:999px;background:${selectedHaloBg};border:2px solid ${selectedHaloBorder};box-shadow:0 0 0 5px rgba(255,255,255,.06);transform:translate(-50%,-62%);"></div>`
  : (onRoute
   ? `<div style="position:absolute;left:50%;top:52%;width:32px;height:32px;border-radius:999px;background:${routeHaloBg};border:2px solid ${routeHaloBorder};transform:translate(-50%,-62%);"></div>`
   : (nearRoute
    ? `<div style="position:absolute;left:50%;top:52%;width:32px;height:32px;border-radius:999px;background:${nearHaloBg};border:2px solid ${nearHaloBorder};transform:translate(-50%,-62%);"></div>`
    : (searchHit
     ? `<div style="position:absolute;left:50%;top:52%;width:32px;height:32px;border-radius:999px;background:${searchHaloBg};border:2px solid ${searchHaloBorder};transform:translate(-50%,-62%);"></div>`
     : '')));

 const searchRing = searchHit && !selected
  ? `<div style="position:absolute;left:50%;top:52%;width:34px;height:34px;border-radius:999px;background:${searchRingBg};border:2px solid ${searchRingBorder};transform:translate(-50%,-62%);"></div>`
  : '';

 const stateBadge = onRoute
  ? `<div style="position:absolute;right:-2px;top:-4px;width:18px;height:18px;border-radius:999px;background:#166534;border:2px solid #dcfce7;color:#ffffff;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 16px rgba(22,101,52,.28);">✓</div>`
  : (nearRoute
   ? `<div style="position:absolute;right:-1px;top:-3px;width:16px;height:16px;border-radius:999px;background:#fef3c7;border:2px solid #f59e0b;box-shadow:0 8px 16px rgba(245,158,11,.22);"></div>`
   : '');

 return `
 <div style="position:relative;width:${size}px;height:${Math.round(size*1.35)}px;transform:translate(-50%,-100%);">
 ${halo}
 ${searchRing}
 ${stateBadge}
 <div style="position:absolute;inset:0;background:${color};border:2.5px solid rgba(255,255,255,.96);border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 10px 20px rgba(15,23,42,.28), 0 0 0 2px rgba(255,255,255,.05);"></div>
 <div style="position:absolute;left:50%;top:39%;width:${dot}px;height:${dot}px;border-radius:999px;background:#fff;transform:translate(-50%,-50%);"></div>
 </div>
 `;
}

function pinIcon(selected=false, onRoute=false, nearRoute=false, searchHit=false, category='') {
 const normalizedCategory = String(category || '').toLowerCase();
 const isTopLocation = normalizedCategory === 'top locaties' || normalizedCategory === 'top';
 const isOnderweg = normalizedCategory === 'onderweg' || normalizedCategory === 'nieuw onderweg';
 const size = isTopLocation ? (selected ? 20 : 16) : (isOnderweg ? (selected ? 23 : 19) : (selected ? 24 : 18));
 return L.divIcon({
 className:'',
 html: makePinHtml(selected, onRoute, nearRoute, searchHit, category),
 iconSize:[size, Math.round(size*1.35)],
 iconAnchor:[size/2, Math.round(size*1.35)]
 });
}

function createRoutePointMarker(lat, lng, emphasis=false, importedStop=false, stopNumber=null) {
 if (importedStop && Number.isFinite(Number(stopNumber))) {
  const label = String(Number(stopNumber));
  return L.marker([lat, lng], {
   icon: L.divIcon({
    className:'',
    html:`<div style="position:relative;width:${emphasis ? 34 : 30}px;height:${emphasis ? 34 : 30}px;border-radius:999px;background:#16a34a;border:3px solid #dcfce7;box-shadow:0 8px 18px rgba(22,163,74,.32);display:flex;align-items:center;justify-content:center;color:#ffffff;font-weight:900;font-size:${emphasis ? 15 : 13}px;line-height:1;">${label}</div>`,
    iconSize:[emphasis ? 34 : 30, emphasis ? 34 : 30],
    iconAnchor:[emphasis ? 17 : 15, emphasis ? 17 : 15]
   }),
   pane:'markerPane',
   interactive:false,
   keyboard:false,
   zIndexOffset:1400 + Number(stopNumber)
  });
 }
 return L.circleMarker([lat, lng], {
  renderer: routeCanvasRenderer || undefined,
  radius: importedStop ? (emphasis ? 6 : 5) : (emphasis ? 3.5 : 2.5),
  color: importedStop ? '#15803d' : '#16a34a',
  weight: importedStop ? (emphasis ? 3 : 2.5) : (emphasis ? 2.2 : 1.4),
  fillColor: importedStop ? '#86efac' : '#bbf7d0',
  fillOpacity: 0.98,
  opacity: 0.98,
  pane: importedStop ? 'markerPane' : 'overlayPane',
  interactive: false
 });
}

function createUserIcon() {
 return L.divIcon({
 className:'',
 html:'<div style="width:18px;height:18px;border-radius:999px;background:#3478f6;border:3px solid #fff;box-shadow:0 0 0 8px rgba(52,120,246,.16),0 6px 16px rgba(0,0,0,.25);"></div>',
 iconSize:[18,18],
 iconAnchor:[9,9]
 });
}

function createRouteHomeIcon() {
 return L.divIcon({
  className:'',
  html:`<div style="display:inline-flex;align-items:center;gap:8px;min-height:34px;padding:6px 12px;border-radius:999px;background:rgba(15,23,42,.96);border:1px solid rgba(96,165,250,.28);box-shadow:0 12px 26px rgba(2,6,23,.30);color:#ffffff;font-size:12px;font-weight:900;white-space:nowrap;"><span style="font-size:13px;line-height:1;">🏠</span><span>Thuis</span></div>`,
  iconSize:[86,34],
  iconAnchor:[43,17]
 });
}

function updateRouteHomeMarker() {
 if (!map) return;
 if (routeHomeBase && Number.isFinite(Number(routeHomeBase.lat)) && Number.isFinite(Number(routeHomeBase.lng))) {
  const latlng = [Number(routeHomeBase.lat), Number(routeHomeBase.lng)];
  if (routeHomeMarker) {
   routeHomeMarker.setLatLng(latlng);
   routeHomeMarker.setIcon(createRouteHomeIcon());
  } else {
   routeHomeMarker = L.marker(latlng, {
    icon:createRouteHomeIcon(),
    zIndexOffset:1750,
    interactive:false,
    keyboard:false
   }).addTo(map);
  }
  routeHomeMarker.unbindTooltip();
  return;
 }
 if (routeHomeMarker) {
  try { routeHomeMarker.remove(); } catch (err) {}
  routeHomeMarker = null;
 }
}

function formatCoord(value) {
 const num = Number(value);
 if (!Number.isFinite(num)) return '';
 return num.toFixed(6).replace(/0+$/,'').replace(/\.$/,'');
}

function setCoordinateFields(lat, lng) {
 const coordsInput = document.getElementById('coordsInput');
 const latInput = document.getElementById('latInput');
 const lngInput = document.getElementById('lngInput');
 if (Number.isFinite(lat) && Number.isFinite(lng)) {
 latInput.value = formatCoord(lat);
 lngInput.value = formatCoord(lng);
 coordsInput.value = `${formatCoord(lat)}, ${formatCoord(lng)}`;
 } else {
 latInput.value = '';
 lngInput.value = '';
 coordsInput.value = '';
 }
}

function getCoordinatesFromEditor() {
 const coordsRaw = document.getElementById('coordsInput').value.trim();
 const parsed = parseCoordinateInput(coordsRaw);
 if (parsed) {
 setCoordinateFields(parsed.lat, parsed.lng);
 return parsed;
 }
 const lat = Number(document.getElementById('latInput').value);
 const lng = Number(document.getElementById('lngInput').value);
 if (Number.isFinite(lat) && Number.isFinite(lng)) {
 setCoordinateFields(lat, lng);
 return { lat, lng };
 }
 return null;
}

function syncCoordsInputFeedback() {
 const raw = document.getElementById('coordsInput').value.trim();
 if (!raw) {
 document.getElementById('latInput').value = '';
 document.getElementById('lngInput').value = '';
 return false;
 }
 const parsed = parseCoordinateInput(raw);
 if (!parsed) return false;
 setCoordinateFields(parsed.lat, parsed.lng);
 return true;
}

function parseCoordinateInput(value) {
 const original = String(value || '').trim();
 if (!original) return null;

 const explicitUrlPatterns = [
  /@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/,
  /[?&](?:q|query|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,
  /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/,
  /destination=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i,
  /origin=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i
 ];
 for (const pattern of explicitUrlPatterns) {
  const match = original.match(pattern);
  if (!match) continue;
  const lat = Number(match[1]);
  const lng = Number(match[2]);
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
   return { lat, lng };
  }
 }

 const cleaned = original
  .replace(/[\[\]()]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

 const directMatch = cleaned.match(/^(-?\d+(?:\.\d+)?)\s*[,; ]\s*(-?\d+(?:\.\d+)?)$/);
 if (directMatch) {
  const lat = Number(directMatch[1]);
  const lng = Number(directMatch[2]);
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
   return { lat, lng };
  }
 }

 const labelMatch = cleaned.match(/lat(?:itude)?\s*[:=]?\s*(-?\d+(?:\.\d+)?).*?(?:lng|lon|long|longitude)\s*[:=]?\s*(-?\d+(?:\.\d+)?)/i);
 if (labelMatch) {
  const lat = Number(labelMatch[1]);
  const lng = Number(labelMatch[2]);
  if (Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
   return { lat, lng };
  }
 }

 if (/https?:\/\//i.test(original) || /maps\./i.test(original) || /goo\.gl/i.test(original)) return null;

 const allNums = cleaned.match(/-?\d+(?:\.\d+)?/g);
 if (!allNums || allNums.length < 2) return null;
 const lat = Number(allNums[0]);
 const lng = Number(allNums[1]);
 if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
 if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
 return { lat, lng };
}

function normalizeForSearch(value) {
 return String(value || '')
 .toLowerCase()
 .normalize('NFD')
 .replace(/[\u0300-\u036f]/g, '')
 .replace(/\s+/g, ' ')
 .trim();
}

function extractFieldFromDescription(description, label) {
 const safeLabel = String(label || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
 const regex = new RegExp('^' + safeLabel + '\\s*:\\s*(.+)$', 'im');
 const match = String(description || '').match(regex);
 return match ? match[1].trim() : '';
}

function buildSearchText(loc) {
 const description = String(loc && loc.description || '');
 const layerPath = Array.isArray(loc && loc.layerPath) ? loc.layerPath.join(' ') : '';
 const type = extractFieldFromDescription(description, 'Type');
 const group = extractFieldFromDescription(description, 'Icoongroep');
 const icon = extractFieldFromDescription(description, 'Aanbevolen_icoon');
 const originalName = extractFieldFromDescription(description, 'Originele naam');
 const country = String(loc && loc.country_detected || '');
 return normalizeForSearch([
  loc && loc.name || '',
  loc && loc.notes || '',
  normalizeCategoryName(loc && loc.category),
  layerPath,
  description,
  country,
  type,
  group,
  icon,
  originalName
 ].join(' '));
}

function getSearchPriorityScore(loc, query) {
 const q = String(query || '').trim().toLowerCase();
 if (!q) return 9999;
 const name = String(loc && loc.name || '').trim().toLowerCase();
 const category = normalizeCategoryName(loc && loc.category).toLowerCase();
 const city = String(loc && loc.city || '').trim().toLowerCase();
 if (name === q) return 0;
 if (name.startsWith(q)) return 1;
 if (name.split(/\s+/).some(part => part === q)) return 2;
 if (name.includes(q)) return 3;
 if (category === q) return 4;
 if (category.startsWith(q)) return 5;
 if (city === q) return 6;
 if (city.startsWith(q)) return 7;
 return 8;
}

function sortSearchMatches(matches, query) {
 return [...(Array.isArray(matches) ? matches : [])].sort((a, b) => {
  const scoreDiff = getSearchPriorityScore(a, query) - getSearchPriorityScore(b, query);
  if (scoreDiff !== 0) return scoreDiff;
  const nameDiff = String(a && a.name || '').localeCompare(String(b && b.name || ''), 'nl', { sensitivity:'base' });
  if (nameDiff !== 0) return nameDiff;
  return String(a && a.id || '').localeCompare(String(b && b.id || ''), 'nl', { sensitivity:'base' });
 });
}

function matchesSearch(loc, query) {
 const normalizedQuery = normalizeForSearch(query);
 if (!normalizedQuery) return true;
 const haystack = buildSearchText(loc);
 const tokens = normalizedQuery.split(' ').filter(Boolean);
 return tokens.every(token => haystack.includes(token));
}

function zoomToSearchResults(results) {
 if (!Array.isArray(results) || !results.length) return;
 if (results.length === 1) {
 const loc = results[0];
 map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 14), { duration:.55 });
 return;
 }
 if (results.length <= 40) {
 const bounds = L.latLngBounds(results.map(loc => [loc.lat, loc.lng]));
 if (bounds.isValid()) {
 map.fitBounds(bounds.pad(0.12));
 return;
 }
 }
 const first = results[0];
 map.flyTo([first.lat, first.lng], Math.max(map.getZoom(), 10), { duration:.55 });
}

function kmBetween(lat1, lon1, lat2, lon2) {
 const R = 6371;
 const dLat = (lat2-lat1) * Math.PI / 180;
 const dLon = (lon2-lon1) * Math.PI / 180;
 const a =
 Math.sin(dLat/2) * Math.sin(dLat/2) +
 Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
 Math.sin(dLon/2) * Math.sin(dLon/2);
 return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function pointToSegmentDistanceKm(point, a, b) {
 const refLat = (point.lat + a.lat + b.lat) / 3;
 const xScale = 111.320 * Math.cos(refLat * Math.PI / 180);
 const yScale = 110.574;
 const px = point.lng * xScale;
 const py = point.lat * yScale;
 const ax = a.lng * xScale;
 const ay = a.lat * yScale;
 const bx = b.lng * xScale;
 const by = b.lat * yScale;
 const dx = bx - ax;
 const dy = by - ay;
 const len2 = dx*dx + dy*dy;
 if (!len2) return Math.sqrt((px-ax)*(px-ax) + (py-ay)*(py-ay));
 let t = ((px-ax)*dx + (py-ay)*dy) / len2;
 t = Math.max(0, Math.min(1, t));
 const cx = ax + t * dx;
 const cy = ay + t * dy;
 return Math.sqrt((px-cx)*(px-cx) + (py-cy)*(py-cy));
}

function distanceToRouteKm(loc, routePoints) {
 if (!routePoints || !routePoints.length) return Infinity;
 if (routePoints.length === 1) return kmBetween(loc.lat, loc.lng, routePoints[0].lat, routePoints[0].lng);
 let min = Infinity;
 for (let i=0; i<routePoints.length-1; i++) {
 const d = pointToSegmentDistanceKm({ lat: loc.lat, lng: loc.lng }, routePoints[i], routePoints[i+1]);
 if (d < min) min = d;
 }
 return min;
}

function distanceToPointSetKm(loc, points) {
 if (!points || !points.length) return Infinity;
 let min = Infinity;
 points.forEach((p) => {
 const d = kmBetween(loc.lat, loc.lng, p.lat, p.lng);
 if (d < min) min = d;
 });
 return min;
}

function recomputeRouteMaps() {
 onRouteMap = new Map();
 nearRouteMap = new Map();
 routeSequenceMap = new Map();
 if (!routeData || !routeData.points || !routeData.points.length) return;

 const importedPoints = Array.isArray(routeData.importedPoints) ? routeData.importedPoints : [];
 const canMatchImportedStops = !!routeData.derivedFromPoints && importedPoints.length > 0;

 if (canMatchImportedStops) {
 importedPoints.forEach((point, idx) => {
 let bestLoc = null;
 let bestDistance = Infinity;
 locations.forEach((loc) => {
 const d = kmBetween(loc.lat, loc.lng, point.lat, point.lng);
 if (d < bestDistance) {
  bestDistance = d;
  bestLoc = loc;
 }
 });
 if (bestLoc && bestDistance <= IMPORTED_ROUTE_MATCH_KM) {
  const current = onRouteMap.get(bestLoc.id);
  if (current == null || bestDistance < current) onRouteMap.set(bestLoc.id, bestDistance);
  const currentSeq = routeSequenceMap.get(bestLoc.id);
  const seq = idx + 1;
  if (!Number.isFinite(currentSeq) || seq < currentSeq) routeSequenceMap.set(bestLoc.id, seq);
 }
 });
 }

 locations.forEach((loc) => {
 if (onRouteMap.has(loc.id)) return;
 const lineDistance = distanceToRouteKm(loc, routeData.points);
 if (lineDistance <= NEAR_ROUTE_KM) nearRouteMap.set(loc.id, lineDistance);
 });
}

function formatMinutesLabel(totalMinutes) {
 const minutes = Math.max(1, Math.round(Number(totalMinutes || 0)));
 const h = Math.floor(minutes / 60);
 const m = minutes % 60;
 return h ? `${h} u ${m} min` : `${m} min`;
}

function driveText(loc) {
 if (!userPosition) return 'live reistijd zodra locatie actief is';
 const km = kmBetween(userPosition.lat, userPosition.lng, loc.lat, loc.lng) * 1.22;
 const minutes = Math.max(8, Math.round((km / 68) * 60));
 return `± ${formatMinutesLabel(minutes)}`;
}

function makeRoadTravelCacheKey(origin, loc) {
 return `${Number(origin && origin.lat || 0).toFixed(5)},${Number(origin && origin.lng || 0).toFixed(5)}|${Number(loc && loc.lat || 0).toFixed(5)},${Number(loc && loc.lng || 0).toFixed(5)}`;
}

async function fetchRoadTravelInfo(origin, loc) {
 const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
 let timeoutId = null;
 try {
  if (controller) timeoutId = window.setTimeout(() => controller.abort(), ROAD_TRAVEL_FETCH_TIMEOUT_MS);
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${loc.lng},${loc.lat}?overview=false&steps=false&alternatives=false`;
  const response = await fetch(url, controller ? { signal: controller.signal } : undefined);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = await response.json();
  const route = data && Array.isArray(data.routes) ? data.routes[0] : null;
  if (!route || !Number.isFinite(route.duration)) throw new Error('Geen routegegevens ontvangen');
  return {
   minutes: Math.max(1, Math.round(Number(route.duration) / 60)),
   distanceKm: Number.isFinite(route.distance) ? Number(route.distance) / 1000 : null,
   fetchedAt: Date.now()
  };
 } finally {
  if (timeoutId != null) window.clearTimeout(timeoutId);
 }
}

function createSelectedMetaHtml(loc, travelInfo = null) {
 const category = normalizeCategoryName(loc && loc.category);
 const coords = `${Number(loc && loc.lat || 0).toFixed(5)}, ${Number(loc && loc.lng || 0).toFixed(5)}`;
 const travelValue = travelInfo && travelInfo.label ? travelInfo.label : driveText(loc);
 const travelHint = travelInfo && travelInfo.hint ? travelInfo.hint : (userPosition ? 'slimme indicatie' : 'zet live locatie aan');
 const travelLoadingClass = travelInfo && travelInfo.loading ? ' isLoading' : '';
 return `
  <div class="selectedMetaGrid">
   <div class="selectedMetaCard">
    <div class="selectedMetaKicker">Coördinaten</div>
    <div class="selectedMetaValue">${escapeHtml(coords)}</div>
    <div class="selectedMetaHint">Direct kopieerbaar</div>
   </div>
   <div class="selectedMetaCard">
    <div class="selectedMetaKicker">Reistijd</div>
    <div class="selectedMetaValue${travelLoadingClass}">${escapeHtml(travelValue)}</div>
    <div class="selectedMetaHint">${escapeHtml(travelHint)}</div>
   </div>
   <div class="selectedMetaCard">
    <div class="selectedMetaKicker">Rubriek</div>
    <div class="selectedMetaValue">${escapeHtml(category)}</div>
    <div class="selectedMetaHint">Hoofdcategorie</div>
   </div>
  </div>`;
}

function applySelectedTravelMeta(loc, travelInfo = null) {
 const metaEl = document.getElementById('selectedMeta');
 if (!metaEl || !loc) return;
 metaEl.innerHTML = createSelectedMetaHtml(loc, travelInfo);
}

async function refreshSelectedRoadTravelTime(force = false) {
 const loc = getSelected();
 if (!loc || addMode) return;
 const metaEl = document.getElementById('selectedMeta');
 if (!metaEl) return;
 if (!userPosition || !Number.isFinite(userPosition.lat) || !Number.isFinite(userPosition.lng)) {
  applySelectedTravelMeta(loc, { label: driveText(loc), hint: 'zet live locatie aan voor echte wegtijd', source: 'estimate' });
  return;
 }

 const origin = { lat: Number(userPosition.lat), lng: Number(userPosition.lng) };
 const cacheKey = makeRoadTravelCacheKey(origin, loc);
 const cached = roadTravelCache.get(cacheKey);
 if (!force && cached && Number(cached.fetchedAt || 0) > (Date.now() - ROAD_TRAVEL_CACHE_TTL_MS)) {
  applySelectedTravelMeta(loc, {
   label: formatMinutesLabel(cached.minutes),
   hint: Number.isFinite(cached.distanceKm) ? `${cached.distanceKm.toFixed(0)} km via wegennet` : 'via wegennet',
   source: 'road'
  });
  return;
 }

 const requestToken = ++selectedTravelRequestToken;
 applySelectedTravelMeta(loc, {
  label: driveText(loc),
  hint: 'wegennet wordt berekend',
  source: 'loading',
  loading: true
 });
 try {
  const result = await fetchRoadTravelInfo(origin, loc);
  roadTravelCache.set(cacheKey, result);
  if (requestToken !== selectedTravelRequestToken || !getSelected() || getSelected().id !== loc.id) return;
  applySelectedTravelMeta(loc, {
   label: formatMinutesLabel(result.minutes),
   hint: Number.isFinite(result.distanceKm) ? `${result.distanceKm.toFixed(0)} km via wegennet` : 'via wegennet',
   source: 'road'
  });
 } catch (err) {
  if (requestToken !== selectedTravelRequestToken || !getSelected() || getSelected().id !== loc.id) return;
  applySelectedTravelMeta(loc, {
   label: driveText(loc),
   hint: 'snelle schatting, route-service niet bereikbaar',
   source: 'estimate'
  });
 }
}

function clearPreviewMarker() {

 if (previewMarker) {
 previewMarker.remove();
 previewMarker = null;
 }
}

function showPreviewMarker(lat, lng) {
 clearPreviewMarker();
 previewMarker = L.circleMarker([lat, lng], {
 radius: 10, color: '#bfdbfe', weight: 3, fillColor: '#3b82f6', fillOpacity: 0.88
 }).addTo(map);
}

function isLocationAllowedByCountryToggles(loc) {
 return true;
}

function getVisibleLocations(baseList) {
 return (Array.isArray(baseList) ? baseList : []).filter(loc => visibleCategories.has(normalizeCategoryName(loc && loc.category)));
}

function getSelected() {
 return locations.find(x => x.id === selectedId) || filtered[0] || locations[0] || null;
}

function findNearestLocation(lat, lng, maxKm=0.2) {
 let best = null;
 let bestDistance = Infinity;
 locations.forEach((loc) => {
 const d = kmBetween(lat, lng, loc.lat, loc.lng);
 if (d < bestDistance) {
 bestDistance = d;
 best = loc;
 }
 });
 return best && bestDistance <= maxKm ? { ...best, distanceKm: bestDistance } : null;
}

function findDuplicateLocation(lat, lng, name, category) {
 const normalizedName = normalizeForSearch(name || '');
 const normalizedCategory = normalizeCategoryName(category);
 return locations.find(loc => {
 const sameCategory = normalizeCategoryName(loc.category) === normalizedCategory;
 const sameName = normalizeForSearch(loc.name || '') === normalizedName;
 const closeEnough = kmBetween(lat, lng, loc.lat, loc.lng) <= 0.02;
 return sameCategory && sameName && closeEnough;
 }) || null;
}


function buildCategoryCounts() {
 const counts = new Map();
 (Array.isArray(locations) ? locations : []).forEach((loc) => {
  const cat = normalizeCategoryName(loc && loc.category);
  counts.set(cat, (counts.get(cat) || 0) + 1);
 });
 return counts;
}

function renderFilterBar() {
 const host = document.getElementById('filterBar');
 const counts = buildCategoryCounts();
 const categories = [...(Array.isArray(CATEGORY_OPTIONS) ? CATEGORY_OPTIONS : [])].sort((a, b) => a.localeCompare(b, 'nl'));
 if (!categories.length) {
  host.innerHTML = '<div class="filterBarEmpty">Nog geen rubrieken. Importeer locaties of voeg handmatig rubrieken toe.</div>';
  return;
 }
 host.innerHTML = categories.map((category) => {
  const safe = escapeAttr(category);
  const checked = visibleCategories.has(category) ? 'checked' : '';
  const count = counts.get(category) || 0;
  const id = `filter-${Math.abs(hashString(category))}`;
  return `
   <label class="filterChipFlat" for="${id}">
    <input id="${id}" type="checkbox" data-flat-category="${safe}" ${checked}>
    <span>${escapeHtml(category)}</span>
    <span class="filterChipCount">${count}</span>
   </label>
  `;
 }).join('');
 host.querySelectorAll('[data-flat-category]').forEach((input) => {
  input.addEventListener('change', () => {
   const category = String(input.getAttribute('data-flat-category') || '');
   if (input.checked) visibleCategories.add(category);
   else visibleCategories.delete(category);
   applySearch();
  });
 });
}

function estimatePhotoPayloadSize(photos) {
 try {
  return (Array.isArray(photos) ? photos : []).reduce((sum, src) => sum + String(src || '').length, 0);
 } catch (err) {
  return 0;
 }
}

function loadImageElementFromDataUrl(dataUrl) {
 return new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error('Afbeelding kon niet worden gelezen.'));
  img.src = dataUrl;
 });
}

function canvasToCompressedDataUrl(canvas, mimeType, quality) {
 try {
  return canvas.toDataURL(mimeType, quality);
 } catch (err) {
  return canvas.toDataURL('image/jpeg', quality);
 }
}

async function compressImageFileForStorage(file) {
 if (!file || !String(file.type || '').startsWith('image/')) {
  throw new Error('Alleen afbeeldingsbestanden zijn toegestaan.');
 }
 const rawDataUrl = await new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result || ''));
  reader.onerror = () => reject(new Error('Bestand kon niet worden gelezen.'));
  reader.readAsDataURL(file);
 });
 const img = await loadImageElementFromDataUrl(rawDataUrl);
 const width = Number(img.naturalWidth || img.width || 0);
 const height = Number(img.naturalHeight || img.height || 0);
 if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
  return rawDataUrl;
 }
 const scale = Math.min(1, MAX_PHOTO_DIMENSION / Math.max(width, height));
 const targetWidth = Math.max(1, Math.round(width * scale));
 const targetHeight = Math.max(1, Math.round(height * scale));
 const canvas = document.createElement('canvas');
 canvas.width = targetWidth;
 canvas.height = targetHeight;
 const ctx = canvas.getContext('2d');
 if (!ctx) return rawDataUrl;
 ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

 const preferredMime = String(file.type || '').includes('png') ? 'image/jpeg' : (String(file.type || '').includes('webp') ? 'image/webp' : 'image/jpeg');
 let best = canvasToCompressedDataUrl(canvas, preferredMime, 0.82);
 for (const quality of [0.76, 0.7, 0.64, 0.58, 0.52]) {
  if (best.length <= MAX_PHOTO_DATA_URL_LENGTH) break;
  best = canvasToCompressedDataUrl(canvas, preferredMime, quality);
 }
 if (best.length > MAX_PHOTO_DATA_URL_LENGTH) {
  best = canvasToCompressedDataUrl(canvas, 'image/jpeg', 0.48);
 }
 return best.length <= rawDataUrl.length ? best : rawDataUrl;
}

async function addPhotosFromFiles(files) {
 const validFiles = [...(files || [])].filter(Boolean).slice(0, MAX_PHOTO_COUNT);
 if (!validFiles.length) return;
 const roomLeft = Math.max(0, MAX_PHOTO_COUNT - editorPhotos.length);
 if (!roomLeft) {
  setStatusBox(`Er kunnen maximaal ${MAX_PHOTO_COUNT} foto's per locatie worden bewaard.`, 'warn', true);
  return;
 }
 const toProcess = validFiles.slice(0, roomLeft);
 setStatusBox(`Foto${toProcess.length > 1 ? "'s" : ''} verwerken...`, 'info', true);
 const added = [];
 for (const file of toProcess) {
  try {
   const compressed = await compressImageFileForStorage(file);
   if (compressed) added.push(compressed);
  } catch (err) {
   console.error('Foto verwerken mislukte', err);
  }
 }
 if (added.length) {
  editorPhotos.push(...added);
  renderPhotoGrid();
  editorDirty = true;
  updateDetailModeUi();
  setStatusBox(`${added.length} foto${added.length > 1 ? "'s zijn" : ' is'} toegevoegd.`, 'success', true);
 } else {
  setStatusBox('Foto toevoegen mislukt. Probeer een kleinere of andere foto.', 'warn', true);
 }
}

function renderPhotoGrid() {
 const grid = document.getElementById('photoGrid');
 if (!editorPhotos.length) {
 grid.innerHTML = "<div class=\"emptyPhotos\">Nog geen foto's toegevoegd</div>";
 return;
 }
 grid.innerHTML = editorPhotos.map((src, idx) => `
 <div class="photoCard">
 <img class="photoPreview" src="${src}" alt="foto ${idx + 1}">
 <button class="removePhotoBtn" data-idx="${idx}" type="button">×</button>
 </div>
 `).join('');
 grid.querySelectorAll('.removePhotoBtn').forEach(btn => {
 btn.addEventListener('click', () => {
 const idx = Number(btn.getAttribute('data-idx'));
 editorPhotos.splice(idx, 1);
 editorDirty = true;
 renderPhotoGrid();
 updateDetailModeUi();
 });
 });
}

function buildClusterGroup() {
 if (clusterGroup) {
 map.removeLayer(clusterGroup);
 }
 if (searchLayer) {
 map.removeLayer(searchLayer);
 }
 if (onRouteLayer) {
 map.removeLayer(onRouteLayer);
 }
 if (nearRouteLayer) {
 map.removeLayer(nearRouteLayer);
 }
 if (topLocationLayer) {
 map.removeLayer(topLocationLayer);
 }
 if (onderwegLayer) {
 map.removeLayer(onderwegLayer);
 }
 if (immediateSavedLayer) {
 map.removeLayer(immediateSavedLayer);
 }

 clusterGroup = L.markerClusterGroup({
 chunkedLoading: true,
 chunkInterval: 80,
 chunkDelay: 20,
 animate: false,
 animateAddingMarkers: false,
 spiderfyOnMaxZoom: true,
 showCoverageOnHover: false,
 removeOutsideVisibleBounds: true,
 disableClusteringAtZoom: 13
 });
 clusterGroup.on('clusterclick', function (a) {
 a.layer.spiderfy();
 });

 searchLayer = L.layerGroup();
 onRouteLayer = L.layerGroup();
 nearRouteLayer = L.layerGroup();
 topLocationLayer = L.layerGroup();
 onderwegLayer = L.layerGroup();
 immediateSavedLayer = L.layerGroup();

 map.addLayer(clusterGroup);
 map.addLayer(onRouteLayer);
 map.addLayer(nearRouteLayer);
 map.addLayer(topLocationLayer);
 map.addLayer(onderwegLayer);
 map.addLayer(immediateSavedLayer);
}

function removeMarkerFromVisibleLayers(marker) {
 if (!marker) return;
 try { clusterGroup && clusterGroup.removeLayer(marker); } catch (err) {}
 try { searchLayer && searchLayer.removeLayer(marker); } catch (err) {}
 try { onRouteLayer && onRouteLayer.removeLayer(marker); } catch (err) {}
 try { nearRouteLayer && nearRouteLayer.removeLayer(marker); } catch (err) {}
 try { topLocationLayer && topLocationLayer.removeLayer(marker); } catch (err) {}
 try { onderwegLayer && onderwegLayer.removeLayer(marker); } catch (err) {}
 try { immediateSavedLayer && immediateSavedLayer.removeLayer(marker); } catch (err) {}
}

function createLocationMarker(loc) {
 const onRoute = onRouteMap.has(loc.id);
 const near = !onRoute && nearRouteMap.has(loc.id);
 const isSearchHit = !searchTextActive && (loc.id === searchHighlightId);
 const plannerSelected = routePlannerActive && routePlannerStopIds.includes(loc.id);
 const marker = L.marker([loc.lat, loc.lng], {
 icon: pinIcon(loc.id === selectedId || plannerSelected, onRoute, near, isSearchHit, loc.category),
 zIndexOffset: plannerSelected ? 1600 : (onRoute ? 1400 : (near ? 1200 : 0))
 });
 marker.__locId = loc.id;
 marker.on('click', () => {
 if (addMode) {
  warnPendingSave();
  return;
 }
 if (routePlannerActive) {
  toggleRoutePlannerLocation(loc.id, { flyTo:false });
  return;
 }
 if (detailMode === 'edit' && editorDirty && selectedId !== loc.id) {
  setStatusBox('Niet-opgeslagen wijzigingen zijn verlaten omdat je een andere locatie koos.', 'warn', true);
 }
 selectedId = loc.id;
 detailPanelVisible = true;
 detailMode = 'overview';
 if (!searchTextActive) searchHighlightId = null;
 if (isMobileSheetLayout()) toggleMobileMenu(true);
 renderAll(false);
 focusSelectedLocationInSidebar();
 });
 return marker;
}

function shouldSkipClusteringForLocation(loc) {
 if (!loc) return false;
 const normalizedCategory = String(loc.category || '').toLowerCase();
 const onRoute = onRouteMap.has(loc.id);
 const near = !onRoute && nearRouteMap.has(loc.id);
 return onRoute || near || ['onderweg', 'nieuw onderweg'].includes(normalizedCategory);
}

function addMarkerForLocation(loc) {
 if (!clusterGroup || !searchLayer || !onRouteLayer || !nearRouteLayer || !topLocationLayer || !onderwegLayer) buildClusterGroup();
 if (!loc || !visibleCategories.has(normalizeCategoryName(loc.category))) return;
 const marker = createLocationMarker(loc);
 markerIndex.set(loc.id, marker);
 const onRoute = onRouteMap.has(loc.id);
 const near = !onRoute && nearRouteMap.has(loc.id);
 const routeOnlyMode = shouldRenderMapLocationsForActiveRoute();
 if (routeOnlyMode && !onRoute && !near) return;
 const isOnderweg = ['onderweg', 'nieuw onderweg'].includes(String(loc.category || '').toLowerCase());
 const skipClustering = shouldSkipClusteringForLocation(loc);
 if (onRoute) {
 if (!map.hasLayer(onRouteLayer)) map.addLayer(onRouteLayer);
 onRouteLayer.addLayer(marker);
 } else if (near) {
 if (!map.hasLayer(nearRouteLayer)) map.addLayer(nearRouteLayer);
 nearRouteLayer.addLayer(marker);
 } else if (searchTextActive && !skipClustering) {
 if (map.hasLayer(clusterGroup)) map.removeLayer(clusterGroup);
 if (!map.hasLayer(searchLayer)) map.addLayer(searchLayer);
 searchLayer.addLayer(marker);
 } else {
 if (map.hasLayer(searchLayer)) map.removeLayer(searchLayer);
 const isTopLocation = ['top locaties', 'top'].includes(String(loc.category || '').toLowerCase());
 if (isTopLocation) {
 if (!map.hasLayer(topLocationLayer)) map.addLayer(topLocationLayer);
 topLocationLayer.addLayer(marker);
 } else if (isOnderweg) {
 if (!map.hasLayer(onderwegLayer)) map.addLayer(onderwegLayer);
 onderwegLayer.addLayer(marker);
 } else {
 if (!map.hasLayer(clusterGroup)) map.addLayer(clusterGroup);
 clusterGroup.addLayer(marker);
 if (typeof clusterGroup.refreshClusters === 'function') {
 try { clusterGroup.refreshClusters(); } catch (err) {}
 }
 }
 }
}

function removeMarkerById(locId) {
 const marker = markerIndex.get(locId);
 if (!marker) return;
 removeMarkerFromVisibleLayers(marker);
 markerIndex.delete(locId);
}

function buildMarkerRenderKey() {
 const filteredSignature = Array.isArray(filtered)
  ? filtered.map(loc => {
   const category = normalizeCategoryName(loc && loc.category);
   const lat = Number(loc && loc.lat);
   const lng = Number(loc && loc.lng);
   return [String(loc && loc.id || ''), category, Number.isFinite(lat) ? lat.toFixed(5) : '', Number.isFinite(lng) ? lng.toFixed(5) : ''].join(':');
  }).join('|')
  : '';
 const routeStamp = routeData && Number.isFinite(Number(routeData.updated_at)) ? Number(routeData.updated_at) : 0;
 return `${filteredSignature}::${routeStamp}::${onRouteMap.size}::${nearRouteMap.size}`;
}

function getLocationById(locId) {
 return (Array.isArray(locations) ? locations.find(loc => String(loc && loc.id || '') === String(locId || '')) : null) || null;
}

function refreshMarkerIconForId(locId) {
 if (!locId) return;
 const marker = markerIndex.get(locId);
 const loc = getLocationById(locId);
 if (!marker || !loc) return;
 const onRoute = onRouteMap.has(loc.id);
 const near = !onRoute && nearRouteMap.has(loc.id);
 const isSearchHit = !searchTextActive && (loc.id === searchHighlightId);
 try {
  marker.setIcon(pinIcon(loc.id === selectedId, onRoute, near, isSearchHit, loc.category));
  if (typeof marker.setZIndexOffset === 'function') marker.setZIndexOffset(onRoute ? 1400 : (near ? 1200 : 0));
 } catch (err) {}
}

function syncSelectedMarkerIcons() {
 const previousId = lastSelectedMarkerId;
 const nextId = selectedId || null;
 if (previousId && previousId !== nextId) refreshMarkerIconForId(previousId);
 if (nextId) refreshMarkerIconForId(nextId);
 lastSelectedMarkerId = nextId;
}

function updateUserMarkerLayer() {
 if (!map) return;
 if (userPosition && Number.isFinite(userPosition.lat) && Number.isFinite(userPosition.lng)) {
  if (userMarker) userMarker.setLatLng([userPosition.lat, userPosition.lng]);
  else userMarker = L.marker([userPosition.lat, userPosition.lng], { icon:createUserIcon() }).addTo(map);
 } else if (userMarker) {
  userMarker.remove();
  userMarker = null;
 }
}

function renderMarkers() {
 if (!clusterGroup || !searchLayer || !onRouteLayer || !nearRouteLayer || !topLocationLayer || !onderwegLayer) buildClusterGroup();

 const markerRenderKey = buildMarkerRenderKey();
 if (markerRenderKey === lastMarkerRenderKey && markerIndex.size) {
  syncSelectedMarkerIcons();
  updateRouteHomeMarker();
  updateUserMarkerLayer();
  if (previewMarker && !map.hasLayer(previewMarker)) previewMarker.addTo(map);
  return;
 }

 clusterGroup.clearLayers();
 searchLayer.clearLayers();
 onRouteLayer.clearLayers();
 nearRouteLayer.clearLayers();
 topLocationLayer.clearLayers();
 onderwegLayer.clearLayers();
 markerIndex = new Map();

 const routeOnlyMode = shouldRenderMapLocationsForActiveRoute();
 const showAnyLocationMarkers = shouldShowAnyLocationMarkersOnMap();
 const standardMarkers = [];
 const topMarkers = [];
 const onderwegMarkers = [];
 const onRouteMarkers = [];
 const routeNearbyMarkers = [];

 if (showAnyLocationMarkers) {
 filtered.forEach(loc => {
 const onRoute = onRouteMap.has(loc.id);
 const near = !onRoute && nearRouteMap.has(loc.id);
 if (routeOnlyMode && !onRoute && !near) return;
 const marker = createLocationMarker(loc);
 markerIndex.set(loc.id, marker);
 const normalizedCategory = String(loc.category || '').toLowerCase();
 const skipClustering = shouldSkipClusteringForLocation(loc);
 if (onRoute) onRouteMarkers.push(marker);
 else if (near) routeNearbyMarkers.push(marker);
 else if (['top locaties', 'top'].includes(normalizedCategory)) topMarkers.push(marker);
 else if (skipClustering) onderwegMarkers.push(marker);
 else standardMarkers.push(marker);
 });
 }

 if (map.hasLayer(searchLayer)) map.removeLayer(searchLayer);
 if (!showAnyLocationMarkers) {
  if (map.hasLayer(clusterGroup)) map.removeLayer(clusterGroup);
  if (map.hasLayer(topLocationLayer)) map.removeLayer(topLocationLayer);
  if (map.hasLayer(onderwegLayer)) map.removeLayer(onderwegLayer);
  if (map.hasLayer(onRouteLayer)) map.removeLayer(onRouteLayer);
  if (map.hasLayer(nearRouteLayer)) map.removeLayer(nearRouteLayer);
 } else if (!routeOnlyMode) {
  if (!map.hasLayer(clusterGroup)) map.addLayer(clusterGroup);
  if (!map.hasLayer(topLocationLayer)) map.addLayer(topLocationLayer);
  if (!map.hasLayer(onderwegLayer)) map.addLayer(onderwegLayer);
  clusterGroup.addLayers(standardMarkers);
  topMarkers.forEach(marker => topLocationLayer.addLayer(marker));
  onderwegMarkers.forEach(marker => onderwegLayer.addLayer(marker));
 } else {
  if (map.hasLayer(clusterGroup)) map.removeLayer(clusterGroup);
  if (map.hasLayer(topLocationLayer)) map.removeLayer(topLocationLayer);
  if (map.hasLayer(onderwegLayer)) map.removeLayer(onderwegLayer);
 }

 onRouteMarkers.forEach(marker => onRouteLayer.addLayer(marker));
 routeNearbyMarkers.forEach(marker => nearRouteLayer.addLayer(marker));
 if (showAnyLocationMarkers && !map.hasLayer(onRouteLayer)) map.addLayer(onRouteLayer);
 if (showAnyLocationMarkers && !map.hasLayer(nearRouteLayer)) map.addLayer(nearRouteLayer);
 if (showAnyLocationMarkers && !routeOnlyMode && !map.hasLayer(topLocationLayer)) map.addLayer(topLocationLayer);
 if (showAnyLocationMarkers && !routeOnlyMode && !map.hasLayer(onderwegLayer)) map.addLayer(onderwegLayer);
 try {
  onRouteLayer && typeof onRouteLayer.bringToFront === 'function' && onRouteLayer.bringToFront();
  nearRouteLayer && typeof nearRouteLayer.bringToFront === 'function' && nearRouteLayer.bringToFront();
  onderwegLayer && typeof onderwegLayer.bringToFront === 'function' && onderwegLayer.bringToFront();
 } catch (err) {}

 if (routeLayer) {
 routeLayer.remove();
 routeLayer = null;
 }
 if (routePointLayer) {
 routePointLayer.remove();
 routePointLayer = null;
 }
 if (routeData && routeData.points.length > 1) {
 const displayPoints = getRouteDisplayPoints(routeData.points);
 routeLayer = L.polyline(displayPoints.map(p => [p.lat, p.lng]), {
 renderer: routeCanvasRenderer || undefined,
 color:'#60a5fa', weight:5, opacity:.95
 }).addTo(map);

 routePointLayer = L.layerGroup().addTo(map);
 if (routeData.points.length <= ROUTE_POINT_MARKER_LIMIT) {
 routeData.points.forEach((p, idx) => {
 const emphasis = idx === 0 || idx === routeData.points.length - 1;
 routePointLayer.addLayer(createRoutePointMarker(p.lat, p.lng, emphasis, false));
 });
 } else {
 const first = routeData.points[0];
 const last = routeData.points[routeData.points.length - 1];
 routePointLayer.addLayer(createRoutePointMarker(first.lat, first.lng, true, false));
 routePointLayer.addLayer(createRoutePointMarker(last.lat, last.lng, true, false));
 }

 const importedStops = Array.isArray(routeData.importedPoints) && routeData.importedPoints.length > 1
 ? routeData.importedPoints
 : [];
 importedStops.forEach((p, idx) => {
 const emphasis = idx === 0 || idx === importedStops.length - 1;
 routePointLayer.addLayer(createRoutePointMarker(p.lat, p.lng, emphasis, true, idx + 1));
 });
 }
 updateRouteHomeMarker();
 updateUserMarkerLayer();
 if (previewMarker && !map.hasLayer(previewMarker)) previewMarker.addTo(map);
 lastMarkerRenderKey = markerRenderKey;
 lastSelectedMarkerId = selectedId || null;
}

function selectedPhotoFallbackHtml(index, compact=false) {
 return `<div class="selectedPhotoFallback${compact ? ' isCompact' : ''}"><strong>Geen preview</strong><span>Foto ${index} kon niet geladen worden.</span></div>`;
}

function handleSelectedPhotoError(img, index) {
 try {
  const card = img && img.closest ? img.closest('.selectedPhotoCard') : null;
  if (!card) return;
  card.innerHTML = selectedPhotoFallbackHtml(index, card !== card.parentElement?.firstElementChild);
 } catch (err) {}
}

function renderSelectedPhotos(sources) {
 const host = document.getElementById('selectedPhotos');
 if (!host) return;
 const photos = Array.isArray(sources) ? sources.filter(Boolean) : [];
 if (!photos.length) {
  host.classList.remove('hasPhotos');
  host.innerHTML = '';
  return;
 }
 host.classList.add('hasPhotos');
 host.innerHTML = photos.slice(0, 3).map((src, idx) => `<figure class="selectedPhotoCard"><img class="selectedPhotoThumb" src="${src}" alt="foto ${idx + 1}" loading="lazy" onerror="handleSelectedPhotoError(this, ${idx + 1})"></figure>`).join('');
}

function linkifySelectedNotes(text='') {
 const value = String(text || '');
 if (!value.trim()) return '';
 const urlRegex = /(https?:\/\/[^\s<>"']+|www\.[^\s<>"']+)/gi;
 let html = '';
 let lastIndex = 0;

 value.replace(urlRegex, (match, _unused, offset) => {
  let rawUrl = String(match || '');
  let trailing = '';
  while (/[).,!?;:]$/.test(rawUrl)) {
   trailing = rawUrl.slice(-1) + trailing;
   rawUrl = rawUrl.slice(0, -1);
  }
  const plainChunk = value.slice(lastIndex, offset);
  html += escapeHtml(plainChunk).replace(/\n/g, '<br>');
  const href = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  const linkLabel = rawUrl.length > 72 ? `${rawUrl.slice(0, 54)}…` : rawUrl;
  html += `<a href="${escapeAttr(href)}" target="_blank" rel="noreferrer noopener">${escapeHtml(linkLabel)}</a>${escapeHtml(trailing)}`;
  lastIndex = offset + match.length;
  return match;
 });

 html += escapeHtml(value.slice(lastIndex)).replace(/\n/g, '<br>');
 return html;
}

function renderSelectedNotes(text='') {
 const notesEl = document.getElementById('selectedNotes');
 if (!notesEl) return;
 const value = cleanImportedNotesText(String(text || '')) || String(text || '').trim();
 if (!value) {
  notesEl.style.display = 'none';
  notesEl.innerHTML = '';
  return;
 }
 notesEl.style.display = 'block';
 notesEl.innerHTML = linkifySelectedNotes(value);
}

function clearEditorForm() {
 document.getElementById('nameInput').value = '';
 setCoordinateFields(null, null);
 document.getElementById('categoryInput').value = defaultQuickSaveCategory();
 document.getElementById('notesInput').value = '';
 editorPhotos = [];
 editorSourceKey = 'none';
 editorDirty = false;
 manualCategoryOverride = false;
 renderPhotoGrid();
 updateAddCategoryUi();
 updateDetailModeUi();
}

function fillEditorFromDraft(force=true) {
 if (!pendingDraft) return;
 const sourceKey = 'draft';
 if (!force && editorDirty && editorSourceKey === sourceKey) return;
 document.getElementById('nameInput').value = pendingDraft.name || '';
 setCoordinateFields(pendingDraft.lat, pendingDraft.lng);
 document.getElementById('categoryInput').value = normalizeCategoryName(pendingDraft.category || defaultQuickSaveCategory());
 document.getElementById('notesInput').value = pendingDraft.notes || '';
 editorPhotos = Array.isArray(editorPhotos) ? [...editorPhotos] : [];
 editorSourceKey = sourceKey;
 editorDirty = false;
 renderPhotoGrid();
 const photoInput = document.getElementById('photoInput');
 if (photoInput) photoInput.value = '';
 updateAddCategoryUi();
 updateDetailModeUi();
}

function fillEditorFromLocation(loc, force=true) {
 if (!loc) return;
 const sourceKey = `loc:${loc.id}`;
 if (!force && editorDirty && editorSourceKey === sourceKey) return;
 const media = getLocationDisplayMedia(loc);
 document.getElementById('nameInput').value = loc.name || '';
 setCoordinateFields(loc.lat, loc.lng);
 document.getElementById('categoryInput').value = normalizeCategoryName(loc.category);
 document.getElementById('notesInput').value = media.notes || '';
 editorPhotos = [...media.photos];
 manualCategoryOverride = true;
 editorSourceKey = sourceKey;
 editorDirty = false;
 renderPhotoGrid();
 document.getElementById('photoInput').value = '';
 updateAddCategoryUi();
 updateDetailModeUi();
}

function updateQuickStartCard() {
 const card = document.getElementById('quickStartCard');
 if (!card) return;
 const shouldShow = isMobileSheetLayout() && !locations.length && !addMode;
 card.classList.toggle('isHidden', !shouldShow);
 card.style.display = shouldShow ? 'block' : 'none';
 updateOnboardingVisibility();
}

function shouldShowSelectedPanel() {
 return !!(routePlannerActive || addMode || detailMode === 'edit' || detailPanelVisible);
}

function updateDetailModeUi() {
 const activeLoc = getSelected();
 const canEditLocations = currentRoleAllows('editLocations');
 const canDeleteLocations = currentRoleAllows('deleteLocations');
 const effectiveMode = addMode ? 'edit' : detailMode;
 const isEdit = effectiveMode === 'edit';
 const selectedPanel = document.querySelector('.selected');
 const infoPanel = document.getElementById('selectedInfoPanel');
 const editorPanel = document.getElementById('editorPanel');
 const switchWrap = document.getElementById('detailModeSwitch');
 const statusBox = document.getElementById('statusBox');
 const routeSummary = document.getElementById('routeSummaryBox');
 const overviewBtn = document.getElementById('overviewModeBtn');
 const editSwitchBtn = document.getElementById('editModeSwitchBtn');
 const editToggleBtn = document.getElementById('editModeBtn');
 const cancelBtn = document.getElementById('cancelAddBtn');
 const deleteBtn = document.getElementById('deleteLocationBtn');
 const saveBtn = document.getElementById('saveLocationBtn');
 const titleEl = document.getElementById('editorTitleText');
 const hintEl = document.getElementById('editorHintText');
 const labelEl = document.getElementById('selectionLabel');
 const noSelection = !activeLoc && !addMode && !routePlannerActive;
 const desktopSummaryVisible = !isMobileSheetLayout() && !!activeLoc;
 const showSelectedPanel = (shouldShowSelectedPanel() || desktopSummaryVisible) && !noSelection;
 const showExpandedInfo = routePlannerActive
  ? false
  : ((addMode || isEdit || detailPanelVisible || (!isMobileSheetLayout() && !!activeLoc)) && !noSelection);
 const showStatusBox = routePlannerActive || addMode || detailMode === 'edit' || (statusBox && /warn|success/.test(statusBox.className));

 if (selectedPanel) selectedPanel.classList.toggle('isHidden', !showSelectedPanel);
 if (infoPanel) infoPanel.classList.toggle('isHidden', !showExpandedInfo || (isEdit && !addMode) || noSelection || routePlannerActive);
 if (editorPanel) editorPanel.classList.toggle('isHidden', !canEditLocations || !isEdit || noSelection || routePlannerActive);
 if (switchWrap) switchWrap.classList.toggle('isHidden', !canEditLocations || !isEdit || noSelection || routePlannerActive);
 if (statusBox) statusBox.classList.toggle('isHidden', !showStatusBox);
 if (routeSummary && !routePlannerActive && !(routeData && routeData.points && routeData.points.length > 1)) routeSummary.style.display = 'none';
 if (editToggleBtn) {
  editToggleBtn.classList.toggle('isHidden', !canEditLocations || !showSelectedPanel || routePlannerActive);
  editToggleBtn.textContent = isEdit && !addMode ? 'Overzicht' : 'Bewerken';
 }
 if (overviewBtn) overviewBtn.classList.toggle('active', !isEdit);
 if (editSwitchBtn) editSwitchBtn.classList.toggle('active', isEdit);
 if (cancelBtn) cancelBtn.style.display = addMode && canEditLocations ? 'inline-flex' : 'none';
 if (deleteBtn) deleteBtn.style.display = addMode || !activeLoc || !canDeleteLocations ? 'none' : 'inline-flex';
 if (saveBtn && !saveInProgress) saveBtn.textContent = desiredSaveButtonLabel();
 if (titleEl) titleEl.textContent = addMode ? 'Nieuwe locatie toevoegen' : 'Locatie bewerken';
 if (hintEl) hintEl.textContent = canEditLocations
  ? (addMode
   ? "Kies een pin, naam, categorie, notities en foto's. Tik op Opslaan zodra alles klopt."
   : 'Werk de geselecteerde locatie bij zonder je overzicht kwijt te raken.')
  : 'Jouw rol staat alleen kijken toe. Bewerken is op dit apparaat uitgeschakeld.';
 if (labelEl) labelEl.textContent = routePlannerActive ? 'Routeplanner' : (addMode ? 'Nieuwe locatie' : (isEdit ? 'Bewerkmodus' : 'Overzicht'));
 updateQuickStartCard();
}

function setDetailMode(mode='overview', options={}) {
 if (mode === 'edit' && !currentRoleAllows('editLocations')) {
  detailMode = 'overview';
  detailPanelVisible = true;
  setStatusBox('Jouw rol mag alleen kijken. Bewerken staat uit op dit apparaat.', 'warn', true);
  updateDetailModeUi();
  return;
 }
 detailMode = mode === 'edit' ? 'edit' : 'overview';
 if (detailMode !== 'edit') closeCategoryChooser();
 if (detailMode === 'edit') detailPanelVisible = true;
 if (detailMode === 'edit') {
  if (addMode) fillEditorFromDraft(options.forceReload !== false);
  else {
   const loc = getSelected();
   if (loc) fillEditorFromLocation(loc, options.forceReload !== false);
  }
 }
 updateDetailModeUi();
 if (isMobileSheetLayout() && (detailMode === 'edit' || options.openMobile)) {
  toggleMobileMenu(true);
 }
}

function renderSelected() {
 const routeBtn = document.getElementById('routeBtn');
 const editBtn = document.getElementById('overviewEditBtn');
 const editToggle = document.getElementById('editModeBtn');
 const loc = getSelected();
 const hasLoc = !!loc;
 const hasDraft = addMode && pendingDraft;

 if (routePlannerActive) {
  document.getElementById('selectedMeta').classList.remove('isSoftEmpty');
  document.getElementById('selectionLabel').textContent = 'Routeplanner';
  document.getElementById('selectedTitle').textContent = 'Plan route';
  document.getElementById('selectedMeta').innerHTML = `<div class="selectedMetaGrid"><div class="selectedMetaCard"><div class="selectedMetaKicker">Start</div><div class="selectedMetaValue">${routeHomeBase ? escapeHtml(routeHomeBase.name || 'Thuis') : 'Nog niet ingesteld'}</div><div class="selectedMetaHint">Wordt automatisch als start gebruikt</div></div><div class="selectedMetaCard"><div class="selectedMetaKicker">Stops</div><div class="selectedMetaValue">${getRoutePlannerStopLocations().length}</div><div class="selectedMetaHint">Zoek bovenin of klik locaties op de kaart</div></div><div class="selectedMetaCard"><div class="selectedMetaKicker">Einde</div><div class="selectedMetaValue">${routeHomeBase ? escapeHtml(routeHomeBase.name || 'Thuis') : 'Nog niet ingesteld'}</div><div class="selectedMetaHint">Wordt automatisch als eindpunt gebruikt</div></div></div>`;
  renderSelectedPhotos([]);
  renderSelectedNotes('');
  routeBtn.removeAttribute('href');
  delete routeBtn.dataset.routeUrl;
  routeBtn.setAttribute('aria-disabled', 'true');
  routeBtn.style.pointerEvents = 'none';
  routeBtn.style.opacity = '.55';
  routeBtn.title = 'Routeplanner actief';
  if (editBtn) editBtn.textContent = currentRoleAllows('editLocations') ? 'Details' : 'Bekijken';
  if (editToggle) editToggle.textContent = 'Bewerken';
  clearEditorForm();
  updateDetailModeUi();
  return;
 }

 if (hasDraft && pendingDraft.lat != null && pendingDraft.lng != null) {
  detailPanelVisible = true;
  document.getElementById('selectedMeta').classList.remove('isSoftEmpty');
  document.getElementById('selectedTitle').textContent = pendingDraft.name || 'Nieuwe locatie';
  document.getElementById('selectedMeta').innerHTML = `<div class="selectedMetaGrid"><div class="selectedMetaCard"><div class="selectedMetaKicker">Coördinaten</div><div class="selectedMetaValue">${Number(pendingDraft.lat).toFixed(5)}, ${Number(pendingDraft.lng).toFixed(5)}</div><div class="selectedMetaHint">Klaar om toe te voegen</div></div><div class="selectedMetaCard"><div class="selectedMetaKicker">Reistijd</div><div class="selectedMetaValue">Nog niet beschikbaar</div><div class="selectedMetaHint">Sla eerst op om te navigeren</div></div><div class="selectedMetaCard"><div class="selectedMetaKicker">Rubriek</div><div class="selectedMetaValue">${escapeHtml(normalizeCategoryName(pendingDraft.category || defaultQuickSaveCategory()))}</div><div class="selectedMetaHint">Wordt gebruikt na opslaan</div></div></div>`;
  renderSelectedPhotos(editorPhotos);
  renderSelectedNotes(pendingDraft.notes || "Voeg eventueel nog notities, categorie en foto's toe voordat je opslaat.");
  routeBtn.removeAttribute('href');
  delete routeBtn.dataset.routeUrl;
  routeBtn.setAttribute('aria-disabled', 'true');
  routeBtn.style.pointerEvents = 'none';
  routeBtn.style.opacity = '.55';
  routeBtn.title = 'Sla eerst een echte locatie op om een route te openen';
  if (editBtn) editBtn.textContent = currentRoleAllows('editLocations') ? 'Bewerk details' : 'Bekijken';
  if (editToggle) editToggle.textContent = 'Overzicht';
  fillEditorFromDraft(false);
  updateDetailModeUi();
  return;
 }

 if (!hasLoc) {
  if (!addMode && detailMode !== 'edit') detailPanelVisible = false;
  document.getElementById('selectedTitle').textContent = 'Nog geen locatie geselecteerd';
  document.getElementById('selectedMeta').innerHTML = locations.length
   ? 'Kies een locatie op de kaart of in de lijst om details te bekijken.'
   : 'Importeer een bestand of voeg je eerste locatie toe. Werk je met echte testdata, maak daarna meteen een <strong>JSON-backup</strong> voor je browser of laptop wisselt.';
  document.getElementById('selectedMeta').classList.add('isSoftEmpty');
  renderSelectedPhotos([]);
  renderSelectedNotes('');
  routeBtn.removeAttribute('href');
  delete routeBtn.dataset.routeUrl;
  routeBtn.setAttribute('aria-disabled', 'true');
  routeBtn.style.pointerEvents = 'none';
  routeBtn.style.opacity = '.55';
  routeBtn.title = 'Selecteer eerst een locatie';
  clearEditorForm();
  updateDetailModeUi();
  return;
 }

 document.getElementById('selectedMeta').classList.remove('isSoftEmpty');
 document.getElementById('selectedTitle').textContent = loc.name;
 const media = getLocationDisplayMedia(loc);
 renderSelectedPhotos(media.photos);
 renderSelectedNotes(media.notes || 'Nog geen extra notities bij deze locatie.');
 applySelectedTravelMeta(loc, { label: driveText(loc), hint: userPosition ? 'slimme indicatie, wegtijd wordt geladen' : 'zet live locatie aan voor echte wegtijd', source: userPosition ? 'loading' : 'estimate', loading: !!userPosition });

 const routeUrl = userPosition
  ? `https://www.google.com/maps/dir/?api=1&origin=${userPosition.lat},${userPosition.lng}&destination=${loc.lat},${loc.lng}&travelmode=driving`
  : `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}&travelmode=driving`;
 routeBtn.dataset.routeUrl = routeUrl;
 routeBtn.removeAttribute('href');
 routeBtn.setAttribute('role', 'button');
 routeBtn.setAttribute('aria-disabled', 'false');
 routeBtn.style.pointerEvents = 'auto';
 routeBtn.style.opacity = '1';
 routeBtn.title = `Open route naar ${loc.name}`;
 refreshSelectedRoadTravelTime(false);

 if (routeData) {
  const routeMessage = onRouteMap.has(loc.id)
  ? 'Deze locatie ligt direct op je geïmporteerde route.'
  : (nearRouteMap.has(loc.id)
  ? 'Deze locatie ligt binnen 1,5 km van je route.'
  : `Route geladen. ${onRouteMap.size} locaties liggen op de route en ${nearRouteMap.size} locaties binnen 1,5 km.`);
  setStatusBox(routeMessage, 'success', true);
 }

 if (detailMode !== 'edit') fillEditorFromLocation(loc, true);
 updateDetailModeUi();
}

function sortRouteRelevantLocations(items) {
 return items.sort((a, b) => {
  const aOn = onRouteMap.has(a.id);
  const bOn = onRouteMap.has(b.id);
  if (aOn !== bOn) return aOn ? -1 : 1;
  const aNear = nearRouteMap.has(a.id);
  const bNear = nearRouteMap.has(b.id);
  if (aNear !== bNear) return aNear ? -1 : 1;
  const aSeq = routeSequenceMap.get(a.id);
  const bSeq = routeSequenceMap.get(b.id);
  if (Number.isFinite(aSeq) || Number.isFinite(bSeq)) {
   const safeA = Number.isFinite(aSeq) ? aSeq : Number.MAX_SAFE_INTEGER;
   const safeB = Number.isFinite(bSeq) ? bSeq : Number.MAX_SAFE_INTEGER;
   if (safeA !== safeB) return safeA - safeB;
  }
  const aNearDistance = nearRouteMap.get(a.id);
  const bNearDistance = nearRouteMap.get(b.id);
  if (Number.isFinite(aNearDistance) || Number.isFinite(bNearDistance)) {
   const safeA = Number.isFinite(aNearDistance) ? aNearDistance : Number.MAX_SAFE_INTEGER;
   const safeB = Number.isFinite(bNearDistance) ? bNearDistance : Number.MAX_SAFE_INTEGER;
   if (safeA !== safeB) return safeA - safeB;
  }
  return String(a.name || '').localeCompare(String(b.name || ''), 'nl');
 });
}

function getRouteListItems() {
 const relevant = filtered.filter(loc => onRouteMap.has(loc.id) || nearRouteMap.has(loc.id));
 return sortRouteRelevantLocations(relevant);
}

function getRouteListSections() {
 const sorted = getRouteListItems();
 return {
  onRoute: sorted.filter(loc => onRouteMap.has(loc.id)),
  nearRoute: sorted.filter(loc => !onRouteMap.has(loc.id) && nearRouteMap.has(loc.id))
 };
}

function buildRouteListItemHtml(loc, options={}) {
 const showingSearchResults = !!options.showingSearchResults;
 const routeActive = !!options.routeActive;
 const plannerMode = !!options.plannerMode;
 const seq = routeSequenceMap.get(loc.id);
 const plannerIndex = plannerMode ? getRoutePlannerIndex(loc.id) : null;
 const prefix = Number.isFinite(plannerIndex)
  ? `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;border-radius:999px;background:#f97316;color:#fff;font-size:12px;font-weight:800;margin-right:8px;">${plannerIndex}</span>`
  : (routeActive && Number.isFinite(seq)
   ? `<span style="display:inline-flex;align-items:center;justify-content:center;min-width:24px;height:24px;border-radius:999px;background:#16a34a;color:#fff;font-size:12px;font-weight:800;margin-right:8px;">${seq}</span>`
   : '');
 const nearDistance = nearRouteMap.get(loc.id);
 const routeStatePill = Number.isFinite(plannerIndex)
  ? `<span class="routeStatePill routeStatePillNear">Stop ${plannerIndex}</span>`
  : (onRouteMap.has(loc.id)
   ? '<span class="routeStatePill routeStatePillOn">Op route</span>'
   : (Number.isFinite(nearDistance)
    ? `<span class="routeStatePill routeStatePillNear">${nearDistance < 1 ? `${Math.round(nearDistance * 1000)} m` : `${nearDistance.toFixed(1)} km`} van route</span>`
    : ''));
 const foundMeta = showingSearchResults ? ' · gevonden' : '';
 const normalizedCategory = String(loc.category || '').toLowerCase();
 const dotColor = ['top locaties', 'top'].includes(normalizedCategory)
  ? '#fbbf24'
  : (['onderweg', 'nieuw onderweg'].includes(normalizedCategory)
   ? '#f97316'
   : ((normalizedCategory === 'bezocht' || normalizedCategory === 'bezocht locaties' || normalizedCategory.includes('bezocht'))
    ? '#ff6a00'
    : (onRouteMap.has(loc.id)
     ? '#22c55e'
     : ((nearRouteMap.has(loc.id) || Number.isFinite(nearDistance)) ? '#f59e0b' : '#23a4f4'))));
 return `
  <button class="item ${loc.id === selectedId ? 'active' : ''}" data-location-id="${escapeAttr(loc.id)}" onclick="selectLocation('${loc.id}')">
   <div class="itemTop">
    <div>
     <div class="itemTitle">${prefix}${escapeHtml(loc.name)}</div>
     <div class="itemMeta">${normalizeCategoryName(loc.category)} · ${driveText(loc)}${foundMeta}</div>
     ${routeStatePill}
    </div>
    <div class="pinDot" style="background:${dotColor}"></div>
   </div>
  </button>`;
}

function buildRouteListSectionHtml(title, items, tone='on') {
 if (!Array.isArray(items) || !items.length) return '';
 const dotColor = tone === 'near' ? '#f59e0b' : '#22c55e';
 const chipClass = tone === 'near' ? 'routeLegendChip routeLegendChipNear' : 'routeLegendChip routeLegendChipOn';
 return `
  <div class="listSection">
   <div class="listSectionHeader">
    <div class="listSectionTitle"><span class="listSectionDot" style="background:${dotColor}"></span>${escapeHtml(title)}</div>
    <div class="listSectionCount">${items.length}</div>
   </div>
   <div class="list">${items.map(loc => buildRouteListItemHtml(loc, { routeActive:true })).join('')}</div>
  </div>`;
}

function getWorkspaceModeSummary() {
 const hasWorkspace = !!getActiveWorkspaceId();
 const hasAuth = !!getActiveAuthUserId();
 if (hasWorkspace && hasAuth) return { label:'Lokale workspace', hint:getActiveWorkspaceLabel(), tone:'live' };
 if (hasWorkspace) return { label:'Workspace lokaal', hint:getActiveWorkspaceLabel(), tone:'warn' };
 return { label:'Lokaal testen', hint:'Nog zonder account of backend', tone:'offline' };
}

function getRoleSummaryHint(role) {
 if (role === 'owner') return 'Crew, route en locaties volledig beheren';
 if (role === 'editor') return 'Mag spots en routes aanpassen';
 return 'Alleen meekijken in read-only';
}

function getRouteScanSummary() {
 if (routeData && Array.isArray(routeData.points) && routeData.points.length > 1) {
  const routeName = String(routeData.name || 'Actieve route').trim() || 'Actieve route';
  return {
   label: routeName,
   hint: `${nearRouteMap.size} binnen 1,5 km · ${onRouteMap.size} op route`
  };
 }
 return {
  label: 'Nog geen route',
  hint: 'Importeer GPX, KML, KMZ, JSON of GeoJSON'
 };
}

function getHomeBaseSummary() {
 if (!routeHomeBase) return { label:'Niet ingesteld', hint:'Zet thuis zodat planroute logisch start en eindigt' };
 const customName = String(routeHomeBase.name || '').trim() || 'Thuis';
 return { label: customName, hint: `${Number(routeHomeBase.lat).toFixed(4)}, ${Number(routeHomeBase.lng).toFixed(4)}` };
}

function promptImportedRouteName(defaultName='') {
 const fallback = String(defaultName || 'Nieuwe route').trim() || 'Nieuwe route';
 try {
  const answer = window.prompt('Hoe wil je deze route noemen?', fallback);
  if (answer === null) return fallback;
  const cleaned = String(answer || '').trim().replace(/\s+/g, ' ').slice(0, 90);
  return cleaned || fallback;
 } catch (err) {
  return fallback;
 }
}

function getPlannedRouteSummary() {
 if (!routeData || !Array.isArray(routeData.points) || routeData.points.length < 2) {
  return { label:'Nog geen route', hint:'Aantal locaties en afstand verschijnen zodra een route actief is' };
 }
 const distanceKm = sumRouteDistanceKm(routeData.points);
 const locationCount = onRouteMap.size || getRoutePlannerStopLocations().length || 0;
 return {
  label: `${locationCount} ${locationCount === 1 ? 'locatie' : 'locaties'}`,
  hint: `${formatDistanceLabel(distanceKm)} totale afstand`
 };
}

function getLocalBetaReadinessSummary() {
 const hasExport = typeof exportLocationsBackup === 'function';
 const hasMobileSheet = !!document.getElementById('mobileSheetHandle');
 const hasRouteImport = !!document.getElementById('routeImportBtn');
 const hasCrewAdmin = !!document.getElementById('teamAdminCard');
 const hasOnboarding = !!document.getElementById('onboardingOverlay');
 const checklist = [hasExport, hasMobileSheet, hasRouteImport, hasCrewAdmin, hasOnboarding, STATIC_HOSTING_MODE, !SHARED_SYNC_ENABLED];
 const readyCount = checklist.filter(Boolean).length;
 const score = readyCount >= 7 ? '9.3+' : (readyCount >= 6 ? '9.2' : '8.8');
 return {
  scoreLabel: score,
  hint: 'Persoonlijke/gesloten beta: premium flow, backup, route, mobiel en crew klaar'
 };
}

function getBackupReadinessLabel() {
 const lastBackupAt = getLastBackupAt();
 const currentSignature = getBackupSignature();
 const savedSignature = getLastBackupSignature();
 const backupCurrent = !!lastBackupAt && !!savedSignature && savedSignature === currentSignature;
 if (backupCurrent) return { label:'Actueel', hint:`Laatste JSON-backup ${formatRelativeTime(lastBackupAt)}` };
 if (lastBackupAt) return { label:'Bijwerken', hint:`Laatste backup ${formatRelativeTime(lastBackupAt)} · exporteer na wijzigingen` };
 return { label:'Nog maken', hint:'Export klaar · maak eerste JSON-backup na testdata' };
}

function renderProductHealthPanel() {
 const panel = document.getElementById('productHealthPanel');
 const grid = document.getElementById('productHealthGrid');
 const pill = document.getElementById('productHealthPill');
 const headerBadge = document.getElementById('appHeaderStatusBadge');
 if (!panel || !grid) return;

 const workspace = getWorkspaceModeSummary();
 const isOfflineOrWorkspaceOnly = !getActiveAuthUserId() && !getActiveAuthEmail();
 const role = isOfflineOrWorkspaceOnly ? 'owner' : getCurrentCrewRole();
 const crewCount = isOfflineOrWorkspaceOnly ? 1 : getCrewMembersWithOwner().length;
 const categoryCount = new Set((Array.isArray(locations) ? locations : []).map((loc) => normalizeCategoryName(loc && loc.category)).filter(Boolean)).size;
 const routeScan = getRouteScanSummary();
 const homeBase = getHomeBaseSummary();
 const plannedRoute = getPlannedRouteSummary();
 const authName = isOfflineOrWorkspaceOnly
  ? (ownerProfile.name || DEFAULT_TEAM_OWNER_NAME || 'Owner')
  : (getActiveAuthDisplayName() || getActiveAuthEmail() || memberDisplayName(getCurrentCrewMember()));
 const readiness = getLocalBetaReadinessSummary();
 const backupLabel = getBackupReadinessLabel();
 const cards = [
  { kicker:'Testscore', value:readiness.scoreLabel, hint:readiness.hint },
  { kicker:'Modus', value:workspace.label, hint:workspace.hint },
  { kicker:'Backup', value:backupLabel.label, hint:backupLabel.hint },
  { kicker:'Jouw rol', value:teamRoleLabel(role), hint:getRoleSummaryHint(role) },
  { kicker:'Crew', value:String(crewCount), hint:`${getActiveWorkspaceLabel()} · ${crewCount === 1 ? 'solo' : 'gedeeld'}` },
  { kicker:'Locaties', value:String(locations.length), hint:`${categoryCount} rubrieken in kaart` },
  { kicker:'Routescan', value:routeScan.label, hint:routeScan.hint },
  { kicker:'Geplande route', value:plannedRoute.label, hint:plannedRoute.hint },
  { kicker:'Thuisbasis', value:homeBase.label, hint:homeBase.hint }
 ];

 grid.innerHTML = cards.map((card) => `
  <div class="healthCard">
   <div class="healthKicker">${escapeHtml(card.kicker)}</div>
   <div class="healthValue">${escapeHtml(card.value)}</div>
   <div class="healthHint">${escapeHtml(card.hint)}</div>
  </div>
 `).join('');

 if (pill) {
  pill.textContent = workspace.label;
  pill.classList.remove('warn', 'offline');
  if (workspace.tone === 'warn') pill.classList.add('warn');
  if (workspace.tone === 'offline') pill.classList.add('offline');
 }
 if (headerBadge) {
  headerBadge.innerHTML = `<span class="syncDot"></span>${escapeHtml(workspace.label)} · ${escapeHtml(teamRoleLabel(role))}`;
  headerBadge.classList.toggle('warn', workspace.tone === 'warn');
  headerBadge.classList.toggle('offline', workspace.tone === 'offline');
  headerBadge.title = authName ? `${workspace.hint} · ${authName}` : workspace.hint;
 }
}

function renderList() {
 const listWrap = document.querySelector('.listWrap');
 if (listWrap) listWrap.style.display = routePlannerActive ? 'none' : '';

 document.getElementById('countTag').textContent = `${filtered.length} zichtbaar / ${locations.length} totaal`;

 const counts = filtered.reduce((acc, loc) => {
  acc[loc.category] = (acc[loc.category] || 0) + 1;
  return acc;
 }, {});
 const topCategories = Object.entries(counts)
  .sort((a, b) => (b[1] - a[1]) || String(a[0]).localeCompare(String(b[0]), 'nl'))
  .slice(0, 3);
 [document.getElementById('beTag'), document.getElementById('frTag'), document.getElementById('luTag')].forEach((el, index) => {
  const entry = topCategories[index];
  if (!entry) {
   el.style.display = 'none';
   return;
  }
  el.style.display = 'inline-flex';
  el.textContent = `${entry[0]} ${entry[1]}`;
 });

 const list = document.getElementById('list');
 const listTitle = document.getElementById('listTitle');
 const listSub = document.getElementById('listSub');
 const routeActive = !!(routeData && routeData.points && routeData.points.length > 1);
 const showingSearchResults = !!(searchTextActive && Array.isArray(overviewSearchResults));

 if (showingSearchResults) {
  const baseList = overviewSearchResults.slice();
  if (listTitle) listTitle.textContent = baseList.length === 1 ? 'Gevonden locatie' : 'Gevonden locaties';
  if (listSub) {
   listSub.style.display = 'block';
   listSub.textContent = `Zoekresultaten voor "${overviewSearchQuery}" in je data. De kaart blijft ongewijzigd.`;
  }
  if (!baseList.length) {
   list.innerHTML = `<div class="emptyState">Geen treffers gevonden voor "${escapeHtml(overviewSearchQuery)}" in je data. Controleer spelling, filters of importeer eerst extra locaties.</div>`;
   return;
  }
  list.innerHTML = baseList.slice(0, 120).map(loc => buildRouteListItemHtml(loc, { showingSearchResults:true, routeActive:false })).join('');
  return;
 }

 if (routePlannerActive) {
  if (list) list.innerHTML = '';
  return;
 }

 if (listTitle) listTitle.textContent = 'Route-overzicht';
 if (listSub) {
  listSub.style.display = 'block';
  listSub.textContent = routeActive
   ? 'De kaart toont alle locaties. Hieronder zie je locaties op de route en binnen 1,5 km.'
   : 'Importeer een route om hier een slim overzicht te krijgen van locaties op de route en binnen 1,5 km.';
 }

 if (!routeActive) {
  list.innerHTML = '<div class="emptyState">Nog geen route geïmporteerd. De kaart toont alle locaties; dit overzicht start pas na route-import. Upload GPX, KML, KMZ, JSON of GeoJSON om direct afstand, volgorde en spots binnen 1,5 km te zien.</div>';
  return;
 }

 const sections = getRouteListSections();
 const totalRouteHits = sections.onRoute.length + sections.nearRoute.length;
 if (!totalRouteHits) {
  list.innerHTML = '<div class="emptyState">Geen route-locaties of locaties binnen 1,5 km zichtbaar met deze filters. Zet filters ruimer of kies een andere route om weer matches te zien.</div>';
  return;
 }

 const legendHtml = `
  <div class="routeLegendRow">
   <span class="routeLegendChip routeLegendChipOn"><strong>${sections.onRoute.length}</strong> op route</span>
   <span class="routeLegendChip routeLegendChipNear"><strong>${sections.nearRoute.length}</strong> binnen 1,5 km</span>
  </div>`;
 const sectionHtml = [
  buildRouteListSectionHtml('Op route', sections.onRoute, 'on'),
  buildRouteListSectionHtml('Binnen 1,5 km', sections.nearRoute, 'near')
 ].filter(Boolean).join('');
 list.innerHTML = legendHtml + sectionHtml;
}

function renderAll(refit=false) {
 syncDerivedCategories();
 filtered = getVisibleLocations([...locations]);
 if (!filtered.find(x => x.id === selectedId)) selectedId = filtered[0]?.id || locations[0]?.id || null;
 document.getElementById('routeTag').textContent = routeData && routeData.points && routeData.points.length > 1
 ? `Route ${onRouteMap.size} · Nabij ${nearRouteMap.size}`
 : 'Geen route';
 renderFilterBar();
 renderMarkers();
 renderSelected();
 renderRouteSummaryBox();
 renderList();
 renderCategoryChooser();
 renderProductHealthPanel();
 renderBackupReminder();
 renderTeamAdmin();
 updateHomeSetupButton();
 applyRoleDrivenUi();
 updateDetailModeUi();

 if (refit) {
 const bounds = L.latLngBounds(filtered.map(x => [x.lat, x.lng]));
 if (bounds.isValid()) map.fitBounds(bounds.pad(0.08));
 }
}

function getActiveCategoryNameFromEditor() {
 return String(document.getElementById('categoryInput')?.value || '').trim();
}

function renderCategoryChooser() {
 const chooser = document.getElementById('categoryChooser');
 const list = document.getElementById('categoryChooserList');
 if (!chooser || !list) return;
 const categories = [...(Array.isArray(CATEGORY_OPTIONS) ? CATEGORY_OPTIONS : [])].sort((a, b) => a.localeCompare(b, 'nl'));
 const current = normalizeCategoryName(getActiveCategoryNameFromEditor());
 chooser.classList.toggle('show', !!categoryChooserOpen);
 chooser.setAttribute('aria-hidden', categoryChooserOpen ? 'false' : 'true');
 if (!categoryChooserOpen) return;
 if (!categories.length) {
  list.innerHTML = '<div class="categoryChooserEmpty">Nog geen bestaande rubrieken. Typ hierboven een nieuwe naam en klik opnieuw op Nieuwe rubriek.</div>';
  return;
 }
 list.innerHTML = categories.map((category) => `
  <button class="categoryChooserChip ${category === current ? 'active' : ''}" type="button" data-category-choice="${escapeAttr(category)}">${escapeHtml(category)}</button>
 `).join('');
 list.querySelectorAll('[data-category-choice]').forEach((btn) => {
  btn.addEventListener('click', () => {
   const chosen = String(btn.getAttribute('data-category-choice') || '');
   const input = document.getElementById('categoryInput');
   if (input) {
    input.value = chosen;
    try { input.focus(); } catch (err) {}
   }
   editorDirty = true;
   renderCategoryChooser();
   const selectedLoc = !addMode ? getSelected() : null;
   setStatusBox(selectedLoc
    ? `Rubriek gekozen: ${chosen}. Klik nu op Verplaats hierheen om ${selectedLoc.name} meteen in deze rubriek te zetten.`
    : `Rubriek gekozen: ${chosen}.`, 'info', true);
  });
 });
}

function openCategoryChooser() {
 categoryChooserOpen = true;
 renderCategoryChooser();
}

function closeCategoryChooser() {
 categoryChooserOpen = false;
 renderCategoryChooser();
}

function addCategoryManually() {
 if (!requireRolePermission('manageCategories', 'Alleen de owner mag rubrieken beheren.')) return;
 const input = document.getElementById('categoryInput');
 const raw = String(input && input.value || '').trim();
 const normalized = normalizeCategoryName(raw);
 const alreadyExists = !!raw && CATEGORY_OPTIONS.includes(normalized);
 if (!categoryChooserOpen) openCategoryChooser();
 if (!raw) {
  setStatusBox('Bestaande rubrieken staan nu hieronder. Typ bovenaan een nieuwe naam en klik daarna nog eens op Nieuwe rubriek om haar toe te voegen.', 'info', true);
  return;
 }
 if (alreadyExists) {
  if (input) input.value = normalized;
  renderCategoryChooser();
  const selectedLoc = !addMode ? getSelected() : null;
  setStatusBox(selectedLoc
   ? `Rubriek ${normalized} bestaat al. Klik op Verplaats hierheen om ${selectedLoc.name} meteen in deze rubriek te zetten.`
   : `Rubriek ${normalized} bestaat al.`, 'info', true);
  return;
 }
 const category = ensureCategoryOption(raw);
 visibleCategories.add(category);
 if (input) input.value = category;
 editorDirty = true;
 renderAll(false);
 openCategoryChooser();
 const selectedLoc = !addMode ? getSelected() : null;
 setStatusBox(selectedLoc
  ? `Rubriek toegevoegd: ${category}. Klik nu op Verplaats hierheen om ${selectedLoc.name} meteen in deze rubriek te zetten.`
  : `Rubriek toegevoegd: ${category}.`, 'success', true);
}

async function renameCurrentCategory() {
 if (!requireRolePermission('manageCategories', 'Alleen de owner mag rubrieken hernoemen.')) return;
 const current = getActiveCategoryNameFromEditor();
 if (!current) {
  setStatusBox('Kies of typ eerst een rubriek die je wilt hernoemen.', 'warn', true);
  return;
 }
 const normalizedCurrent = normalizeCategoryName(current);
 const raw = prompt(`Nieuwe naam voor rubriek "${normalizedCurrent}"?`, normalizedCurrent);
 if (raw == null) return;
 const nextName = String(raw).trim();
 if (!nextName) {
  setStatusBox('Hernoemen geannuleerd. De nieuwe naam mag niet leeg zijn.', 'warn', true);
  return;
 }
 const normalizedNext = normalizeCategoryName(nextName);
 if (normalizedNext === normalizedCurrent) {
  setStatusBox('De rubrieknaam is niet gewijzigd.', 'info', true);
  return;
 }
 const affectedLocations = [];
 const renameStamp = Date.now();
 locations.forEach(loc => {
  if (normalizeCategoryName(loc && loc.category) === normalizedCurrent) {
   loc.category = normalizedNext;
   loc.updated_at = renameStamp;
   affectedLocations.push(loc);
  }
 });
 CATEGORY_OPTIONS = CATEGORY_OPTIONS.filter(cat => cat !== normalizedCurrent);
 ensureCategoryOption(normalizedNext);
 visibleCategories.delete(normalizedCurrent);
 visibleCategories.add(normalizedNext);
 const input = document.getElementById('categoryInput');
 if (input) input.value = normalizedNext;
 renderCategoryChooser();
 if (routeData) recomputeRouteMaps();
 saveLocations();
 await syncLocationsBatchToWorkspace(affectedLocations.filter((loc) => SHARED_SYNC_ENABLED && (isCustomLocationRecord(loc) || isSharedLocationRecord(loc) || isSeedLocationRecord(loc))));
 renderAll(false);
 setStatusBox(`Rubriek hernoemd naar ${normalizedNext}.`, 'success', true);
}

async function deleteCurrentCategory() {
 if (!requireRolePermission('manageCategories', 'Alleen de owner mag rubrieken verwijderen.')) return;
 const current = getActiveCategoryNameFromEditor();
 if (!current) {
  setStatusBox('Kies of typ eerst een rubriek die je wilt verwijderen.', 'warn', true);
  return;
 }
 const normalizedCurrent = normalizeCategoryName(current);
 const matches = locations.filter(loc => normalizeCategoryName(loc && loc.category) === normalizedCurrent);
 if (!matches.length && !CATEGORY_OPTIONS.includes(normalizedCurrent)) {
  setStatusBox(`Rubriek ${normalizedCurrent} bestaat niet op deze kaart.`, 'warn', true);
  return;
 }
 const ok = confirm(`Rubriek "${normalizedCurrent}" wordt volledig verwijderd met alle locaties daarin. Weet je dit zeker?`);
 if (!ok) return;

 const idsToRemove = new Set(matches.map(loc => String(loc.id)));
 const remoteIdsToRemove = matches
  .filter((loc) => SHARED_SYNC_ENABLED && (isCustomLocationRecord(loc) || isSharedLocationRecord(loc) || isSeedLocationRecord(loc)))
  .map((loc) => String(loc.id));
 idsToRemove.forEach(id => removeMarkerById(id));
 locations = locations.filter(loc => !idsToRemove.has(String(loc.id)));
 CATEGORY_OPTIONS = CATEGORY_OPTIONS.filter(cat => cat !== normalizedCurrent);
 visibleCategories.delete(normalizedCurrent);
 if (routeData) recomputeRouteMaps();
 selectedId = locations.find(loc => !idsToRemove.has(String(loc.id)))?.id || null;
 const input = document.getElementById('categoryInput');
 if (input) input.value = '';
 renderCategoryChooser();
 await saveLocations();
 await deleteLocationsBatchToWorkspace(remoteIdsToRemove);
 renderAll(false);
 setStatusBox(`Rubriek verwijderd: ${normalizedCurrent}. ${matches.length} locatie(s) verwijderd.`, 'warn', true);
 showToast(`Rubriek verwijderd: ${normalizedCurrent}.`);
}

async function moveSelectedLocationToEditorCategory() {
 if (!requireRolePermission('manageCategories', 'Alleen de owner mag locaties tussen rubrieken verplaatsen.')) return;
 if (addMode) {
  setStatusBox('Deze knop is bedoeld voor een bestaande geselecteerde locatie. Gebruik Opslaan om een nieuwe locatie te bewaren.', 'warn', true);
  return;
 }
 const loc = getSelected();
 if (!loc) {
  setStatusBox('Selecteer eerst een locatie die je wilt verplaatsen.', 'warn', true);
  return;
 }
 const input = document.getElementById('categoryInput');
 const rawCategory = String(input && input.value || '').trim();
 if (!rawCategory) {
  setStatusBox('Typ of maak eerst een rubriek.', 'warn', true);
  if (input) {
   try { input.focus(); } catch (err) {}
  }
  return;
 }
 const category = ensureCategoryOption(normalizeCategoryName(rawCategory));
 visibleCategories.add(category);
 if (input) input.value = category;
 editorDirty = true;
 renderCategoryChooser();
 await updateSelectedFromEditor();
}

async function updateSelectedFromEditor() {
 if (!requireRolePermission('editLocations', 'Jouw rol mag geen locaties bewerken.')) return;
 const loc = getSelected();
 if (!loc) return;
 if (!beginSaveAction()) return;
 try {
 loc.name = document.getElementById('nameInput').value.trim() || loc.name;
 const coords = getCoordinatesFromEditor();
 if (coords) {
  loc.lat = coords.lat;
  loc.lng = coords.lng;
 }
 let category = resolveNewLocationCategory();
 category = ensureCategoryOption(category);
 visibleCategories.add(category);
 loc.category = category;
 loc.notes = document.getElementById('notesInput').value.trim();
 loc.photos = [...editorPhotos];
 loc.photo = loc.photos[0] || '';
 loc.updated_at = Date.now();
 const shouldSyncShared = SHARED_SYNC_ENABLED && (isCustomLocationRecord(loc) || isSharedLocationRecord(loc) || isSeedLocationRecord(loc));
 if (shouldSyncShared) {
  loc.shared_remote = true;
 }
 saveLocations();
 if (shouldSyncShared) {
  await syncCustomLocationToWorkspace(loc);
 }
 filtered = getVisibleLocations([...locations]);
 editorDirty = false;
 setDetailMode('overview');
 renderSelected();
 renderList();
 renderRouteSummaryBox();
 const message = `Locatie is opgeslagen in ${normalizeCategoryName(loc.category)}.`;
 setStatusBox(message, 'success', true);
 showToast(message);
 document.getElementById('routeTag').textContent = routeData && routeData.points && routeData.points.length > 1
 ? `Route ${onRouteMap.size} · Nabij ${nearRouteMap.size}`
 : 'Geen route';
 document.getElementById('countTag').textContent = `${filtered.length} zichtbaar / ${locations.length} totaal`;
 showTransientSavedMarker(loc);
 await new Promise(requestAnimationFrame);
 await new Promise(requestAnimationFrame);
 renderMarkers();
 } catch (err) {
 console.error('Opslaan van bestaande locatie mislukte', err);
 setStatusBox('Opslaan mislukt. Probeer opnieuw.', 'warn', true);
 } finally {
 finishSaveAction();
 }
}

function setPendingLocationFromMap(lat, lng) {
 const safeLat = Number(lat);
 const safeLng = Number(lng);
 if (!Number.isFinite(safeLat) || !Number.isFinite(safeLng)) return;
 if (!pendingDraft) {
 pendingDraft = {
 name: document.getElementById('nameInput').value.trim() || '',
 lat: null,
 lng: null,
 category: resolveNewLocationCategory(),
 notes: document.getElementById('notesInput').value.trim() || ''
 };
 }
 pendingDraft.lat = safeLat;
 pendingDraft.lng = safeLng;
 pendingDraft.name = document.getElementById('nameInput').value.trim() || pendingDraft.name || '';
 pendingDraft.category = resolveNewLocationCategory() || normalizeCategoryName(pendingDraft.category || defaultQuickSaveCategory() || 'Onderweg');
 pendingDraft.notes = document.getElementById('notesInput').value.trim() || pendingDraft.notes || '';
 setCoordinateFields(safeLat, safeLng);
 showPreviewMarker(safeLat, safeLng);
 setStatusBox(`Pin klaar op ${formatCoord(safeLat)}, ${formatCoord(safeLng)}. Klik op Opslaan om te bewaren.`, 'info', true);
 renderSelected();
}

function createNewLocationAt(lat, lng) {
 const typedName = document.getElementById('nameInput').value.trim();
 const typedNotes = document.getElementById('notesInput').value.trim();
 let category = resolveNewLocationCategory();
 category = ensureCategoryOption(category);
 visibleCategories.add(category);
 const categoryInput = document.getElementById('categoryInput');
 if (categoryInput) categoryInput.value = category;

 const loc = {
 id: 'new-' + Date.now(),
 name: typedName || defaultQuickSaveName(),
 description: 'Handmatig toegevoegd',
 lat, lng,
 photo: editorPhotos[0] || '',
 photos: [...editorPhotos],
 notes: typedNotes || '',
 category,
 shared_remote: true,
 updated_at: Date.now()
 };
 locations.unshift(loc);
 if (routeData) recomputeRouteMaps();
 selectedId = loc.id;
 filtered = getVisibleLocations([...locations]);
 saveLocations();
 syncCustomLocationToWorkspace({ ...loc, shared_remote: true, updated_at: loc.updated_at });
 showToast(`Locatie is opgeslagen in ${normalizeCategoryName(loc.category)}.`);
 clearPreviewMarker();
 exitAddMode(false);
 renderAll(false);
 map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 12), { duration:.55 });
 setStatusBox(`Locatie opgeslagen in rubriek: ${normalizeCategoryName(loc.category)}.`, 'success', true);
}


function promptCategoryForNewLocation(suggested='') {
 syncDerivedCategories();
 const suggestion = normalizeCategoryName(suggested || defaultQuickSaveCategory() || 'Onderweg');
 const existing = [...CATEGORY_OPTIONS];
 const message = existing.length
  ? `In welke rubriek wil je deze locatie opslaan?\n\nBestaande rubrieken:\n- ${existing.join('\n- ')}\n\nLaat leeg voor ${suggestion}.`
  : `In welke rubriek wil je deze locatie opslaan?\n\nLaat leeg voor ${suggestion}.`;
 const raw = prompt(message, suggestion);
 if (raw === null) return null;
 const chosen = normalizeCategoryName(String(raw || '').trim() || suggestion);
 ensureCategoryOption(chosen);
 visibleCategories.add(chosen);
 return chosen;
}

function startAddMode(prefill = {}) {
 addMode = true;
 manualCategoryOverride = false;
 pendingDraft = {
  name: typeof prefill.name === 'string' ? prefill.name : '',
  lat: prefill.lat != null ? Number(prefill.lat) : null,
  lng: prefill.lng != null ? Number(prefill.lng) : null,
  category: normalizeCategoryName(prefill.category || defaultQuickSaveCategory() || 'Onderweg'),
  notes: prefill.notes || ''
 };
 setModeBanner(prefill.lat != null && prefill.lng != null
 ? 'Pin klaar. Controleer naam en klik op Opslaan om haar echt toe te voegen. Nieuwe locaties gaan standaard naar Onderweg.'
 : 'Klik op de kaart om een nieuwe locatie te plaatsen. Nieuwe locaties gaan standaard naar Onderweg.', true);
 document.getElementById('nameInput').value = pendingDraft.name;
 setCoordinateFields(pendingDraft.lat, pendingDraft.lng);
 document.getElementById('categoryInput').value = normalizeCategoryName(pendingDraft.category || defaultQuickSaveCategory());
 document.getElementById('notesInput').value = pendingDraft.notes;
 updateAddCategoryUi();
 editorPhotos = [];
 editorDirty = false;
 editorSourceKey = 'draft';
 renderPhotoGrid();
 setStatusBox('', 'info', false);
 setDetailMode('edit', { forceReload:true, openMobile:true });
 window.setTimeout(() => {
 const nameInput = document.getElementById('nameInput');
 if (nameInput) {
  try { nameInput.focus(); } catch (err) {}
 }
 }, 0);
}

function exitAddMode(resetFields) {
 addMode = false;
 manualCategoryOverride = false;
 pendingDraft = null;
 if (detailMode !== 'edit') detailPanelVisible = false;
 clearPreviewMarker();
 setModeBanner('', false);
 detailMode = 'overview';
 if (resetFields) {
  const loc = getSelected();
  if (loc) fillEditorFromLocation(loc, true);
  else clearEditorForm();
 }
 updateAddCategoryUi();
 updateDetailModeUi();
}

async function addLocationFromCoords() {
 if (!requireRolePermission('addLocations', 'Jouw rol mag geen locaties toevoegen.')) return;
 const name = document.getElementById('nameInput').value.trim() || defaultQuickSaveName();
 const coords = getCoordinatesFromEditor();
 if (!coords) {
 setStatusBox('Voor een nieuwe locatie is één geldige volledige pin nodig, bijvoorbeeld 49.19223, -0.30636.', 'warn', true);
 return;
 }
 if (!beginSaveAction()) return;
 try {
 const { lat, lng } = coords;
 let category = normalizeCategoryName(document.getElementById('categoryInput').value.trim() || defaultQuickSaveCategory());
 category = ensureCategoryOption(category);
 visibleCategories.add(category);
 const categoryInput = document.getElementById('categoryInput');
 if (categoryInput) categoryInput.value = category;

 const duplicate = findDuplicateLocation(lat, lng, name, category);
 if (duplicate) {
 selectedId = duplicate.id;
 clearPreviewMarker();
 exitAddMode(false);
 searchTextActive = false;
 searchHighlightId = duplicate.id;
 const searchInput = document.getElementById('searchInput');
 if (searchInput) searchInput.value = '';
 filtered = getVisibleLocations([...locations]);
 renderSelected();
 renderList();
 renderRouteSummaryBox();
 document.getElementById('routeTag').textContent = routeData && routeData.points && routeData.points.length > 1
 ? `Route ${onRouteMap.size} · Nabij ${nearRouteMap.size}`
 : 'Geen route';
 document.getElementById('countTag').textContent = `${filtered.length} zichtbaar / ${locations.length} totaal`;
 renderMarkers();
 showImmediateSavedMarker(duplicate);
 setStatusBox(`Deze locatie bestond al in ${normalizeCategoryName(duplicate.category)}.`, 'warn', true);
 if (map) map.setView([duplicate.lat, duplicate.lng], Math.max(map.getZoom(), 15), { animate:false });
 return;
 }

 const loc = {
 id: 'new-' + Date.now(),
 name,
 description: 'Handmatig toegevoegd via coördinaten',
 lat, lng,
 photo: editorPhotos[0] || '',
 photos: [...editorPhotos],
 notes: document.getElementById('notesInput').value.trim(),
 category,
 shared_remote: true,
 updated_at: Date.now()
 };

 locations.unshift(loc);
 saveLocations();
 await syncCustomLocationToWorkspace(loc);
 selectedId = loc.id;
 clearPreviewMarker();
 exitAddMode(false);
 fillEditorFromLocation(loc, true);
 editorDirty = false;

 const searchInput = document.getElementById('searchInput');
 if (searchInput) searchInput.value = '';
 searchTextActive = false;
 searchHighlightId = loc.id;

 if (routeData) recomputeRouteMaps();
 filtered = getVisibleLocations([...locations]);
 renderSelected();
 renderList();
 renderRouteSummaryBox();
 document.getElementById('routeTag').textContent = routeData && routeData.points && routeData.points.length > 1
 ? `Route ${onRouteMap.size} · Nabij ${nearRouteMap.size}`
 : 'Geen route';
 document.getElementById('countTag').textContent = `${filtered.length} zichtbaar / ${locations.length} totaal`;

 const message = `Locatie is opgeslagen in ${normalizeCategoryName(loc.category)}.`;
 setStatusBox(message, 'success', true);
 showToast(message);

 if (map && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)) {
 map.setView([loc.lat, loc.lng], Math.max(map.getZoom(), 15), { animate:false });
 try { map.invalidateSize(false); } catch (err) {}
 }

 await new Promise(requestAnimationFrame);
 await new Promise(requestAnimationFrame);
 renderMarkers();
 showTransientSavedMarker(loc);
 showImmediateSavedMarker(loc);
 const savedMarker = markerIndex.get(loc.id);
 if (savedMarker && map && clusterGroup && map.hasLayer(clusterGroup) && typeof clusterGroup.zoomToShowLayer === 'function') {
 try { clusterGroup.zoomToShowLayer(savedMarker); } catch (err) {}
 }
 } catch (err) {
 console.error('Opslaan van nieuwe locatie mislukte', err);
 setStatusBox('Opslaan mislukt. Probeer opnieuw.', 'warn', true);
 } finally {
 finishSaveAction();
 }
}

async function deleteSelectedLocation() {
 if (!requireRolePermission('deleteLocations', 'Alleen de owner mag locaties verwijderen.')) return;
 const loc = getSelected();
 if (!loc) return;
 const ok = confirm(`Locatie verwijderen: ${loc.name}?`);
 if (!ok) return;
 removeMarkerById(loc.id);
 if (immediateSavedMarker && immediateSavedMarker.__locId === loc.id) {
 try { immediateSavedLayer && immediateSavedLayer.removeLayer(immediateSavedMarker); } catch (err) {}
 immediateSavedMarker = null;
 }
 locations = locations.filter(x => x.id !== loc.id);
 if (isCustomLocationRecord(loc) || isSharedLocationRecord(loc)) {
  await deleteCustomLocationFromWorkspace(loc.id);
 }
 if (isSeedLocationRecord(loc)) {
  hiddenSeedIds.add(String(loc.id));
  saveHiddenSeedIds();
 }
 if (routeData) recomputeRouteMaps();
 filtered = getVisibleLocations([...locations]);
 selectedId = filtered[0]?.id || locations[0]?.id || null;
 saveLocations();
 detailMode = 'overview';
 exitAddMode(false);
 renderSelected();
 renderList();
 renderRouteSummaryBox();
 document.getElementById('routeTag').textContent = routeData && routeData.points && routeData.points.length > 1
 ? `Route ${onRouteMap.size} · Nabij ${nearRouteMap.size}`
 : 'Geen route';
 document.getElementById('countTag').textContent = `${filtered.length} zichtbaar / ${locations.length} totaal`;
 setStatusBox('Locatie verwijderd uit URBEX CORE.', 'warn', true);
 window.setTimeout(() => {
 try { renderMarkers(); } catch (err) { console.error('Markers verversen na verwijderen mislukte', err); }
 }, 120);
}

function focusSelectedLocationInSidebar() {
 const safeId = String(selectedId || '').trim();
 const sidebarScroll = document.querySelector('.sidebarScroll');
 const selectedPanel = document.querySelector('.selected');
 if (selectedPanel && typeof selectedPanel.scrollIntoView === 'function') {
  try { selectedPanel.scrollIntoView({ behavior:'smooth', block:'start', inline:'nearest' }); } catch (err) {}
 }
 if (!safeId) return;
 window.setTimeout(() => {
  const selector = `[data-location-id="${CSS && typeof CSS.escape === 'function' ? CSS.escape(safeId) : safeId.replace(/"/g, '\"')}"], [data-location-id='${safeId.replace(/'/g, "\'")}']`;
  const activeItem = document.querySelector(selector);
  if (activeItem && typeof activeItem.scrollIntoView === 'function') {
   try { activeItem.scrollIntoView({ behavior:'smooth', block:'nearest', inline:'nearest' }); } catch (err) {}
  }
  if (sidebarScroll && typeof sidebarScroll.scrollTo === 'function' && sidebarScroll.scrollTop < 4) {
   try { sidebarScroll.scrollTo({ top:0, behavior:'smooth' }); } catch (err) {}
  }
 }, 30);
}

function selectLocation(id) {
 if (addMode) {
  warnPendingSave();
  return;
 }
 if (routePlannerActive) {
  toggleRoutePlannerLocation(id, { flyTo:true });
  return;
 }
 if (detailMode === 'edit' && editorDirty && selectedId !== id) {
  setStatusBox('Niet-opgeslagen wijzigingen zijn verlaten omdat je een andere locatie koos.', 'warn', true);
 }
 selectedId = id;
 detailPanelVisible = true;
 detailMode = 'overview';
 const loc = locations.find(x => x.id === id);
 if (loc) map.flyTo([loc.lat, loc.lng], Math.max(map.getZoom(), 12), { duration:.55 });
 if (isMobileSheetLayout()) toggleMobileMenu(true);
 renderAll(false);
 updateDetailModeUi();
 focusSelectedLocationInSidebar();
}

function applySearch(commit=true) {
 const raw = document.getElementById('searchInput').value.trim();
 const coord = parseCoordinateInput(raw);

 if (!raw) {
  if (routePlannerActive) setRoutePlannerSearchResults('', []);
  filtered = getVisibleLocations([...locations]);
  overviewSearchResults = null;
  overviewSearchQuery = '';
  searchTextActive = false;
  if (routePlannerActive) setRoutePlannerSearchResults('', []);
  searchHighlightId = null;
  clearPreviewMarker();
  if (!addMode && !routeData) setStatusBox('', 'info', false);
  if (!filtered.find(x => x.id === selectedId)) {
   selectedId = filtered[0]?.id || null;
  }
  renderAll(false);
  return;
 }

 if (coord) {
  if (!commit) {
   setStatusBox(`Coördinaten herkend. Druk op Enter of klik op Zoek om ${coord.lat.toFixed(5)}, ${coord.lng.toFixed(5)} te openen.`, 'info', true);
   return;
  }

  if (routePlannerActive) {
   setRoutePlannerSearchResults('', []);
   const nearestPlannerLocation = findNearestLocation(coord.lat, coord.lng, 0.2);
   if (nearestPlannerLocation && visibleCategories.has(normalizeCategoryName(nearestPlannerLocation.category))) {
    toggleRoutePlannerLocation(nearestPlannerLocation.id, { flyTo:true, ask:true });
   } else {
    toggleRoutePlannerCoordinate(coord.lat, coord.lng, { flyTo:true, ask:true });
   }
   return;
  }

  filtered = getVisibleLocations([...locations]);
  overviewSearchResults = null;
  overviewSearchQuery = '';
  searchTextActive = false;
  if (routePlannerActive) setRoutePlannerSearchResults('', []);
  const nearest = findNearestLocation(coord.lat, coord.lng, 0.2);

  if (nearest && visibleCategories.has(normalizeCategoryName(nearest.category))) {
   selectedId = nearest.id;
   searchHighlightId = nearest.id;
   clearPreviewMarker();
   exitAddMode(false);
   detailMode = 'overview';
   renderAll(false);
   if (isMobileSheetLayout()) toggleMobileMenu(true);
   map.flyTo([nearest.lat, nearest.lng], Math.max(map.getZoom(), 14), { duration:.55 });
   setStatusBox(`Coördinaten herkend. Bestaande locatie gevonden op ${Math.round(nearest.distanceKm * 1000)} m afstand in rubriek ${normalizeCategoryName(nearest.category)}.`, 'success', true);
  } else {
   searchHighlightId = null;
   startAddMode({ name:defaultQuickSaveName(), lat:coord.lat, lng:coord.lng, notes:'', category:defaultQuickSaveCategory() });
   showPreviewMarker(coord.lat, coord.lng);
   renderAll(false);
   if (isMobileSheetLayout()) toggleMobileMenu(true);
   map.flyTo([coord.lat, coord.lng], Math.max(map.getZoom(), 14), { duration:.55 });
   setStatusBox(`Coördinaten herkend: ${coord.lat.toFixed(5)}, ${coord.lng.toFixed(5)}. Nieuwe locatie staat klaar om op te slaan.`, 'success', true);
  }
  return;
 }

 const matches = sortSearchMatches(getVisibleLocations(locations).filter(loc => matchesSearch(loc, raw)), raw);
 overviewSearchResults = matches;
 overviewSearchQuery = raw;
 searchTextActive = true;
 if (routePlannerActive) setRoutePlannerSearchResults(raw, matches);
 clearPreviewMarker();
 exitAddMode(false);

 if (!matches.length) {
  searchHighlightId = null;
  detailMode = 'overview';
  renderAll(false);
  setStatusBox(`Geen treffers voor "${raw}" in je data.`, 'warn', true);
  return;
 }

 if (!matches.find(x => x.id === selectedId)) {
  selectedId = matches[0].id;
 }

 searchHighlightId = matches.length === 1 ? matches[0].id : matches[0].id;
 detailMode = 'overview';
 renderAll(false);
 zoomToSearchResults(matches);
 if (commit && isMobileSheetLayout()) toggleMobileMenu(true);

 if (routePlannerActive) {
  renderAll(false);
  if (commit && matches.length === 1) {
   setStatusBox(`1 treffer gevonden voor "${raw}". Gebruik de knop Toevoegen in het routeveld of klik de locatie op de kaart aan.`, 'success', true);
   return;
  }
  const matchText = matches.length === 1
   ? `1 treffer gevonden voor "${raw}". Deze staat nu direct onder je routeveld klaar om toe te voegen.`
   : `${matches.length} treffers gevonden voor "${raw}". Kies hieronder of klik de juiste locatie op de kaart aan.`;
  setStatusBox(matchText, 'success', true);
  return;
 }

 const selected = matches.find(x => x.id === selectedId) || matches[0] || null;
 const extra = matches.length === 1 && selected ? ` Eerste treffer: ${selected.name}.` : '';
 setStatusBox(`${matches.length} ${matches.length === 1 ? 'treffer' : 'treffers'} gevonden in het overzicht.${extra}`, 'success', true);
}

function buildGoogleMapsRouteUrl(loc, origin=null) {
 const params = new URLSearchParams({
 api: '1',
 destination: `${loc.lat},${loc.lng}`,
 travelmode: 'driving'
 });
 if (origin && Number.isFinite(origin.lat) && Number.isFinite(origin.lng)) {
 params.set('origin', `${origin.lat},${origin.lng}`);
 }
 return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function isAndroidMobile() {
 return /Android/i.test(navigator.userAgent || '');
}

function buildAndroidGoogleNavigationUrl(loc) {
 return `google.navigation:q=${loc.lat},${loc.lng}&mode=d`;
}

let routeLaunchLockUntil = 0;

function openRouteForSelected() {
 if (!currentRoleAllows('importRoute')) {
  setStatusBox('Alleen owner en editor mogen een route starten.', 'warn', true);
  return;
 }
 const now = Date.now();
 if (now < routeLaunchLockUntil) return;
 routeLaunchLockUntil = now + 1200;

 const loc = getSelected();
 if (!loc) {
  setStatusBox('Selecteer eerst een locatie om een route te openen.', 'warn', true);
  return;
 }

 if (isAndroidMobile()) {
  const deepLink = buildAndroidGoogleNavigationUrl(loc);
  const fallbackUrl = buildGoogleMapsRouteUrl(loc);
  let fallbackTriggered = false;

  const fallbackToWeb = () => {
   if (fallbackTriggered) return;
   fallbackTriggered = true;
   window.location.href = fallbackUrl;
   setStatusBox(`Ik open de route naar ${loc.name}. Als de app niet direct opent, gebruik ik automatisch de webversie.`, 'info', true);
  };

  const visibilityHandler = () => {
   if (document.visibilityState === 'hidden') {
    fallbackTriggered = true;
   }
  };

  document.addEventListener('visibilitychange', visibilityHandler, { once:true });
  setStatusBox(`Ik open direct de Google Maps-app voor navigatie naar ${loc.name}...`, 'info', true);

  setTimeout(() => {
   if (!fallbackTriggered && document.visibilityState === 'visible') {
    fallbackToWeb();
   }
  }, 900);

  window.location.href = deepLink;
  return;
 }

 const openDesktopRoute = (origin = null) => {
  const url = buildGoogleMapsRouteUrl(loc, origin);
  const popup = window.open(url, 'team-mattie-route', 'noopener,noreferrer');
  if (popup && typeof popup.focus === 'function') popup.focus();
  if (!popup) {
   setStatusBox('Google Maps kon niet in een nieuw venster openen. Sta pop-ups toe voor deze app.', 'warn', true);
  }
 };

 if (!navigator.geolocation) {
  openDesktopRoute();
  setStatusBox('Google Maps is in een apart venster geopend. Voor vertrek vanaf jouw huidige locatie moet locatietoegang in de browser aanstaan.', 'warn', true);
  return;
 }

 setStatusBox('Ik open Google Maps in een apart venster en probeer jouw huidige locatie als vertrekpunt te gebruiken...', 'info', true);
 navigator.geolocation.getCurrentPosition(
  (pos) => {
   userPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude };
   renderAll(false);
   openDesktopRoute(userPosition);
   setStatusBox(`Google Maps route geopend naar ${loc.name} in een apart venster.`, 'success', true);
  },
  () => {
   openDesktopRoute();
   setStatusBox('Google Maps is in een apart venster geopend zonder jouw vertrekpunt. Sta browser-locatietoegang toe om direct vanaf jouw huidige locatie te navigeren.', 'warn', true);
  },
  { enableHighAccuracy:true, timeout:7000, maximumAge:60000 }
 );
}

function updateLiveTrackButtonState() {
 const liveBtn = document.getElementById('liveTrackBtn');
 if (!liveBtn) return;
 const active = !!isLiveTracking;
 liveBtn.classList.toggle('active', active);
 liveBtn.textContent = active ? 'Live aan' : 'Live uit';
 liveBtn.title = active ? 'Live volgen stoppen' : 'Live volgen starten';
 liveBtn.setAttribute('aria-label', active ? 'Live volgen stoppen' : 'Live volgen starten');
}

let mobileMenuOpen = true;

function isMobileSheetLayout() {
 return window.matchMedia('(max-width: 900px)').matches;
}

function updateMobileMenuButtonState() {
 const subtitle = document.getElementById('mobileSheetSubtitle');
 const toggleBtn = document.getElementById('mobileSheetToggleBtn');
 const titleEl = document.querySelector('.mobileSheetTitle');
 const activeLoc = getSelected();
 const title = addMode ? 'Nieuwe locatie' : (activeLoc ? activeLoc.name : 'URBEX CORE');
 if (titleEl) titleEl.textContent = title;
 if (subtitle) {
  subtitle.textContent = addMode
   ? 'Bewerk en sla de nieuwe locatie op'
   : (detailMode === 'edit'
    ? 'Je bewerkt nu de geselecteerde locatie'
    : (mobileMenuOpen ? `${filtered.length} zichtbaar · tik op een locatie voor details` : 'Open paneel voor lijst en details'));
 }
 if (toggleBtn) {
  toggleBtn.textContent = mobileMenuOpen ? 'Sluit' : 'Open';
  toggleBtn.setAttribute('aria-expanded', mobileMenuOpen ? 'true' : 'false');
 }
}

function syncMobileMenuLayout(options = {}) {
 const sidebar = document.querySelector('.sidebar');
 const scrollEl = document.querySelector('.sidebarScroll');
 if (!sidebar) return;
 if (!isMobileSheetLayout()) {
  sidebar.classList.remove('mobile-collapsed');
  mobileMenuOpen = true;
 } else if (typeof options.forceOpen === 'boolean') {
  mobileMenuOpen = !!options.forceOpen;
  sidebar.classList.toggle('mobile-collapsed', !mobileMenuOpen);
 } else {
  sidebar.classList.toggle('mobile-collapsed', !mobileMenuOpen);
 }
 if (mobileMenuOpen && options && options.resetScroll && scrollEl) scrollEl.scrollTop = 0;
 updateMobileMenuButtonState();
 if (typeof map !== 'undefined' && map) {
  setTimeout(() => { try { map.invalidateSize(true); } catch (err) {} }, 60);
  setTimeout(() => { try { map.invalidateSize(true); } catch (err) {} }, 220);
 }
}

function toggleMobileMenu(forceState = null) {
 if (!isMobileSheetLayout()) {
  mobileMenuOpen = true;
  syncMobileMenuLayout();
  return;
 }
 mobileMenuOpen = typeof forceState === 'boolean' ? forceState : !mobileMenuOpen;
 syncMobileMenuLayout({ forceOpen: mobileMenuOpen, resetScroll: mobileMenuOpen });
}

function bindMobileMenuControls() {
 const handle = document.getElementById('mobileSheetHandle');
 const toggleBtn = document.getElementById('mobileSheetToggleBtn');
 const sidebar = document.querySelector('.sidebar');
 const scrollEl = document.querySelector('.sidebarScroll');

 if (handle && !handle.dataset.mobileToggleBound) {
  handle.addEventListener('click', (event) => {
   if (event.target && toggleBtn && toggleBtn.contains(event.target)) return;
   toggleMobileMenu();
  });
  handle.dataset.mobileToggleBound = '1';
 }

 if (toggleBtn && !toggleBtn.dataset.mobileToggleBound) {
  toggleBtn.addEventListener('click', (event) => {
   event.preventDefault();
   event.stopPropagation();
   toggleMobileMenu();
  });
  toggleBtn.dataset.mobileToggleBound = '1';
 }

 const stopPropagation = (event) => { event.stopPropagation(); };
 [sidebar, scrollEl].forEach((el) => {
  if (!el || el.dataset.mobileScrollBound) return;
  ['touchstart','touchmove','pointerdown','pointermove','wheel','mousedown'].forEach((name) => {
   el.addEventListener(name, stopPropagation, { passive:true });
  });
  if (typeof L !== 'undefined' && L.DomEvent) {
   try { L.DomEvent.disableClickPropagation(el); } catch (err) {}
   try { L.DomEvent.disableScrollPropagation(el); } catch (err) {}
  }
  el.dataset.mobileScrollBound = '1';
 });
}

function applyResponsiveOverlayLayout() {
 if (isMobileSheetLayout()) {
  syncMobileMenuLayout({ forceOpen: mobileMenuOpen, resetScroll:false });
 } else {
  mobileMenuOpen = true;
  syncMobileMenuLayout({ forceOpen:true, resetScroll:false });
 }
}

function applyUserPosition(coords, options = {}) {
 const lat = Number(coords && coords.latitude);
 const lng = Number(coords && coords.longitude);
 if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
 userPosition = { lat, lng };
 if (map && options.center) {
  const targetZoom = Math.max(map.getZoom(), 11);
  if (options.fly) map.flyTo([lat, lng], targetZoom, { duration:.7 });
  else map.panTo([lat, lng], { animate:true, duration:.75 });
 }
 renderAll(false);
}

function stopLiveTracking(options = {}) {
 if (liveTrackingWatchId != null && navigator.geolocation) {
  navigator.geolocation.clearWatch(liveTrackingWatchId);
 }
 liveTrackingWatchId = null;
 isLiveTracking = false;
 updateLiveTrackButtonState();
 if (!options.silent) setStatusBox('Live volgen is uitgeschakeld.', 'info', true);
}

function startLiveTracking() {
 if (!navigator.geolocation) {
  setStatusBox('Live volgen werkt niet in deze browser.', 'warn', true);
  return;
 }
 if (liveTrackingWatchId != null) return;
 isLiveTracking = true;
 updateLiveTrackButtonState();
 let hasFirstFix = false;
 setStatusBox('Live volgen wordt gestart...', 'info', true);
 liveTrackingWatchId = navigator.geolocation.watchPosition(
  (pos) => {
   applyUserPosition(pos.coords, { center:true, fly:!hasFirstFix });
   if (!hasFirstFix) {
    setStatusBox('Live volgen staat aan. Jouw locatie wordt nu steeds bijgewerkt op de kaart.', 'success', true);
    hasFirstFix = true;
   }
  },
  (err) => {
   const permissionDenied = err && err.code === 1;
   stopLiveTracking({ silent:true });
   setStatusBox(permissionDenied ? 'Live volgen heeft locatietoegang nodig. Sta locatie toe in je browser.' : 'Live volgen kon jouw locatie niet bijwerken.', 'warn', true);
  },
  { enableHighAccuracy:true, timeout:10000, maximumAge:5000 }
 );
}

function toggleLiveTracking() {
 if (isLiveTracking) stopLiveTracking();
 else startLiveTracking();
}

function activateLocation() {
 if (!navigator.geolocation) return;
 navigator.geolocation.getCurrentPosition(
  (pos) => {
   applyUserPosition(pos.coords, { center:true, fly:true });
   setStatusBox('Jouw locatie is actief.', 'success', true);
  },
  () => {
   setStatusBox('Kon jouw huidige locatie niet ophalen.', 'warn', true);
  },
  { enableHighAccuracy:true, timeout:7000, maximumAge:60000 }
 );
}

function buildMyMapsViewerUrl(routeUrl) {
 try {
 const source = new URL(routeUrl);
 const mid = source.searchParams.get('mid');
 const lid = source.searchParams.get('lid');
 if (!mid) return routeUrl;
 const viewer = new URL('https://www.google.com/maps/d/viewer');
 viewer.searchParams.set('mid', mid);
 if (lid) viewer.searchParams.set('lid', lid);
 return viewer.toString();
 } catch (err) {
 return routeUrl;
 }
}

async function fetchRouteTextWithFallbacks(routeUrl) {
 const attempts = [
 {
 url: routeUrl,
 parser: async (response) => response.text()
 },
 {
 url: `https://api.allorigins.win/get?url=${encodeURIComponent(routeUrl)}`,
 parser: async (response) => {
 const data = await response.json();
 return String(data.contents || '');
 }
 },
 {
 url: `https://api.allorigins.win/raw?url=${encodeURIComponent(routeUrl)}`,
 parser: async (response) => response.text()
 }
 ];

 for (const attempt of attempts) {
 try {
 const response = await fetch(attempt.url, { mode:'cors' });
 if (!response.ok) continue;
 const routeText = await attempt.parser(response);
 if (routeText && routeText.trim()) return routeText;
 } catch (err) {
 // probeer de volgende fallback
 }
 }

 return '';
}

function compressRoadPoints(points, minSpacingKm = 0.03) {
 const unique = [];
 points.forEach((p) => {
 if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return;
 const last = unique[unique.length - 1];
 if (!last || kmBetween(last.lat, last.lng, p.lat, p.lng) > minSpacingKm) {
 unique.push({ lat:p.lat, lng:p.lng });
 }
 });
 return unique;
}

function mergeRoadPointArrays(chunks) {
 const merged = [];
 chunks.forEach((chunk) => {
 (chunk || []).forEach((p) => {
 if (!Number.isFinite(p.lat) || !Number.isFinite(p.lng)) return;
 const last = merged[merged.length - 1];
 if (!last || kmBetween(last.lat, last.lng, p.lat, p.lng) > 0.005) {
 merged.push({ lat:p.lat, lng:p.lng });
 }
 });
 });
 return merged;
}

async function fetchOsrmJson(url) {
 const response = await fetch(url, { mode:'cors' });
 if (!response.ok) throw new Error('osrm_http_' + response.status);
 return await response.json();
}

async function buildRoadMatchedTrace(points) {
 const chunkSize = 80;
 const chunks = [];
 for (let i = 0; i < points.length; i += (chunkSize - 1)) {
 const slice = points.slice(i, i + chunkSize);
 if (slice.length >= 2) chunks.push(slice);
 if (i + chunkSize >= points.length) break;
 }

 const geometries = [];
 for (const chunk of chunks) {
 const coordinates = chunk.map(p => `${p.lng},${p.lat}`).join(';');
 const radiuses = chunk.map(() => '40').join(';');
 const url = `https://router.project-osrm.org/match/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false&gaps=ignore&tidy=true&radiuses=${radiuses}`;
 try {
 const data = await fetchOsrmJson(url);
 const matchings = Array.isArray(data && data.matchings) ? data.matchings : [];
 matchings.forEach((matching) => {
 const coords = matching && matching.geometry && matching.geometry.coordinates;
 if (Array.isArray(coords) && coords.length >= 2) {
 geometries.push(coords.map(entry => ({ lng:Number(entry[0]), lat:Number(entry[1]) }))
 .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng)));
 }
 });
 } catch (err) {
 return null;
 }
 }

 const merged = mergeRoadPointArrays(geometries);
 return merged.length >= 2 ? merged : null;
}

async function buildChunkedRoadRoute(points) {
 const maxWaypoints = 20;
 const chunks = [];
 for (let i = 0; i < points.length; i += (maxWaypoints - 1)) {
 const slice = points.slice(i, i + maxWaypoints);
 if (slice.length >= 2) chunks.push(slice);
 if (i + maxWaypoints >= points.length) break;
 }

 const geometries = [];

 for (const chunk of chunks) {
 const coordinates = chunk.map(p => `${p.lng},${p.lat}`).join(';');
 const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false&continue_straight=true`;
 try {
 const data = await fetchOsrmJson(url);
 const coords = data && data.routes && data.routes[0] && data.routes[0].geometry && data.routes[0].geometry.coordinates;
 if (Array.isArray(coords) && coords.length >= 2) {
 geometries.push(coords.map(entry => ({ lng:Number(entry[0]), lat:Number(entry[1]) }))
 .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng)));
 continue;
 }
 } catch (err) {
 }

 const segmentGeometries = [];
 let chunkFailed = false;
 for (let i = 0; i < chunk.length - 1; i++) {
 const a = chunk[i];
 const b = chunk[i + 1];
 const segUrl = `https://router.project-osrm.org/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson&steps=false&continue_straight=true`;
 try {
 const segData = await fetchOsrmJson(segUrl);
 const segCoords = segData && segData.routes && segData.routes[0] && segData.routes[0].geometry && segData.routes[0].geometry.coordinates;
 if (Array.isArray(segCoords) && segCoords.length >= 2) {
  segmentGeometries.push(segCoords.map(entry => ({ lng:Number(entry[0]), lat:Number(entry[1]) }))
  .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng)));
 } else {
  chunkFailed = true;
  break;
 }
 } catch (err) {
  chunkFailed = true;
  break;
 }
 }

 if (chunkFailed) return null;
 geometries.push(...segmentGeometries);
 }

 const merged = mergeRoadPointArrays(geometries);
 return merged.length >= 2 ? { points: merged, usedStraightFallback:false } : null;
}

async function buildRoadRoute(points, options = {}) {
 const unique = compressRoadPoints(points, 0.03);
 if (unique.length < 2) return null;

 const preferMatch = options.preferMatch !== false;
 const importedDistanceKm = sumRouteDistanceKm(unique);

 if (preferMatch && unique.length >= 6) {
 const matched = await buildRoadMatchedTrace(unique);
 if (matched && matched.length >= 2) {
 const matchedDistanceKm = sumRouteDistanceKm(matched);
 const looksComplete = !Number.isFinite(importedDistanceKm) || importedDistanceKm <= 0 || matchedDistanceKm >= importedDistanceKm * 0.72;
 if (looksComplete) {
 return { points: matched, source:'match', usedStraightFallback:false };
 }
 }
 }

 const chunked = await buildChunkedRoadRoute(unique);
 if (chunked && chunked.points && chunked.points.length >= 2) {
 return { points: chunked.points, source:'route', usedStraightFallback: !!chunked.usedStraightFallback };
 }

 return null;
}

async function maybeRoadRoute(parsed) {
 if (!parsed || !parsed.points || parsed.points.length < 2) return parsed;
 const importedPoints = parsed.points.map(p => ({ lat:p.lat, lng:p.lng }));
 const avgSpacingKm = averageRouteSpacingKm(parsed.points);
 const shouldTryRoads = !!parsed.derivedFromPoints || parsed.points.length <= 12 || avgSpacingKm > 0.25;
 const originalDetailedEnough = isDetailedImportedRoute(importedPoints);

 if (!shouldTryRoads) {
  return {
   ...parsed,
   importedPoints,
   roadRouted: false,
   usedStraightFallback: false,
   routeBuildSource: originalDetailedEnough ? 'original_detailed' : 'original'
  };
 }

 const sparseImportedWaypointRoute = !!parsed.derivedFromPoints && (parsed.points.length <= 12 || avgSpacingKm >= 15);
 const roadResult = await buildRoadRoute(parsed.points, {
  preferMatch: !sparseImportedWaypointRoute
 });

 if (roadResult && roadResult.points && roadResult.points.length >= 2 && !roadResult.usedStraightFallback) {
  return {
   ...parsed,
   points: roadResult.points,
   importedPoints,
   roadRouted: roadResult.source === 'match' || roadResult.source === 'route',
   usedStraightFallback: false,
   routeBuildSource: roadResult.source || 'route'
  };
 }

 if (originalDetailedEnough) {
  return {
   ...parsed,
   points: importedPoints,
   importedPoints,
   roadRouted: false,
   usedStraightFallback: false,
   routeBuildSource: 'original_detailed'
  };
 }

 return {
  ...parsed,
  importedPoints,
  roadRouted: false,
  usedStraightFallback: false,
  routeBuildSource: 'invalid_sparse'
 };
}

function parseRouteText(text, filename, extHint='') {
 if (String(extHint || '').toLowerCase() === 'geojson' || String(filename || '').toLowerCase().endsWith('.geojson')) {
  return parseGeoJsonRoute(text, filename);
 }
 if (String(extHint || '').toLowerCase() === 'json') {
  const maybeGeo = parseGeoJsonRoute(text, filename);
  if (maybeGeo) return maybeGeo;
 }
 const parser = new DOMParser();
 const xml = parser.parseFromString(text, 'application/xml');
 if (xml.querySelector('parsererror')) return null;

 let name = filename || 'Route';
 const nameNode = xml.querySelector('name');
 if (nameNode && nameNode.textContent.trim()) name = nameNode.textContent.trim();

 let points = [];
 const trkpts = [...xml.querySelectorAll('trkpt, rtept')];
 if (trkpts.length > 1) {
  points = trkpts.map(node => ({
   lat:Number(node.getAttribute('lat')),
   lng:Number(node.getAttribute('lon'))
  })).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
 }

 if (points.length < 2) {
  const lines = [...xml.querySelectorAll('LineString coordinates, gx\\:Track coordinates')];
  let best = [];
  lines.forEach(node => {
   const pts = node.textContent.trim().split(/\s+/).map(entry => {
    const parts = entry.split(',');
    return { lng:Number(parts[0]), lat:Number(parts[1]) };
   }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
   if (pts.length > best.length) best = pts;
  });
  points = best;
 }

 if (points.length < 2) {
  const coords = [...xml.getElementsByTagNameNS('*', 'coord')];
  if (coords.length > 1) {
   points = coords.map(node => {
    const parts = node.textContent.trim().split(/\s+/);
    return { lng:Number(parts[0]), lat:Number(parts[1]) };
   }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  }
 }

 if (points.length < 2) {
  const placemarkPoints = [...xml.querySelectorAll('Placemark Point coordinates, Point coordinates')];
  if (placemarkPoints.length > 1) {
   points = placemarkPoints.map(node => {
    const parts = node.textContent.trim().split(',');
    return { lng:Number(parts[0]), lat:Number(parts[1]) };
   }).filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  }
 }

 if (points.length >= 2) {
  return {
   name,
   points,
   derivedFromPoints: trkpts.length < 2 && !xml.querySelector('LineString coordinates, gx\\:Track coordinates')
  };
 }

 const hrefNode = xml.querySelector('NetworkLink Link href, NetworkLink Url href');
 const networkHref = hrefNode ? hrefNode.textContent.trim() : '';
 if (networkHref) {
  return {
   name,
   points: [],
   networkHref,
   networkLinkOnly: true
  };
 }

 return null;
}

function loadRoute(file) {
 if (!requireRolePermission('importRoute', 'Alleen de owner mag routes importeren.')) return;
 cancelRoutePlanner(false);
 const ext = String(file && file.name || '').toLowerCase().split('.').pop();
 const loadText = async () => {
  if (ext === 'kmz') return await extractKmlTextFromKmz(file);
  return await file.text();
 };

 (async () => {
  try {
   const parsed = parseRouteText(await loadText(), file.name, ext);
   if (!parsed) {
    routeData = null;
    onRouteMap = new Map();
    nearRouteMap = new Map();
    renderAll(false);
    setStatusBox('Routebestand kon niet worden gelezen. Gebruik GPX, KML, KMZ of GeoJSON met een echte routelijn of meerdere routepunten.', 'warn', true);
    return;
   }

   if (parsed.networkLinkOnly && parsed.networkHref) {
    setStatusBox('Dit routebestand bevat alleen een Google My Maps-koppeling. Ik probeer de kaartgegevens op te halen...', 'info', true);
    const remoteText = await fetchRouteTextWithFallbacks(parsed.networkHref);
    const resolved = remoteText ? parseRouteText(remoteText, parsed.name, 'kml') : null;
    if (!resolved || !resolved.points || resolved.points.length < 2) {
     routeData = null;
     onRouteMap = new Map();
     nearRouteMap = new Map();
     renderAll(false);
     const viewerUrl = buildMyMapsViewerUrl(parsed.networkHref);
     setStatusBoxHtml(
      `Deze import bevat alleen een <strong>Google My Maps-link</strong> en geen routecoördinaten in het bestand zelf. Daardoor kan de route hier niet geladen worden. Open de kaart via <a href="${viewerUrl}" target="_blank" rel="noreferrer">Google My Maps</a> en exporteer daarna een <strong>GPX</strong>, <strong>KML</strong>, <strong>KMZ</strong> of <strong>GeoJSON</strong> met lijn/punten.`,
      'warn',
      true
     );
     return;
    }
    routeData = await maybeRoadRoute(resolved);
   } else {
    routeData = await maybeRoadRoute(parsed);
   }

   if (!routeMeetsRoadLevelRequirement(routeData)) {
    routeData = null;
    onRouteMap = new Map();
    nearRouteMap = new Map();
    renderAll(false);
    setStatusBox('Deze route is te grof voor een nette wegroute. Gebruik een GPX-track of een export met meer routepunten zodat de lijn het wegennet correct kan volgen.', 'warn', true);
    return;
   }

   routeData.name = promptImportedRouteName(routeData.name || parsed.name || file.name || 'Nieuwe route');
   routeData.updated_at = Date.now();
   saveRouteStateLocal();
   recomputeRouteMaps();

   const bounds = L.latLngBounds(getRouteDisplayPoints(routeData.points).map(p => [p.lat, p.lng]));
   [...onRouteMap.keys(), ...nearRouteMap.keys()].forEach(id => {
    const loc = locations.find(x => x.id === id);
    if (loc) bounds.extend([loc.lat, loc.lng]);
   });
   if (bounds.isValid()) map.fitBounds(bounds.pad(0.12));

   renderAll(false);

   const detail = routeData.roadRouted
    ? 'Wegennet gevolgd voor de route.'
    : 'Gedetailleerde importlijn gebruikt zonder rechte fallback.';
   setStatusBox(`Route geladen: ${routeData.name}. De kaart blijft volledig zichtbaar, maar het route-overzicht focust nu op ${onRouteMap.size} locaties op de route en ${nearRouteMap.size} locaties binnen 1,5 km. ${detail}`, 'success', true);
  } catch (err) {
   console.error('Route laden mislukt', err);
   routeData = null;
   onRouteMap = new Map();
   nearRouteMap = new Map();
   renderAll(false);
   setStatusBox(String(err && err.message || 'Routebestand kon niet worden gelezen.'), 'warn', true);
  }
 })();
}

function escapeHtml(text) {
 return String(text ?? '')
 .replaceAll('&', '&amp;')
 .replaceAll('<', '&lt;')
 .replaceAll('>', '&gt;')
 .replaceAll('"', '&quot;');
}

async function exportLocationsBackup() {
 if (!requireRolePermission('exportData', 'Alleen de owner mag een backup exporteren.')) return;
 const payload = {
  exported_at: new Date().toISOString(),
  version: APP_BUILD_VERSION,
  channel: APP_BUILD_CHANNEL,
  workspace: {
   id: getActiveWorkspaceId() || '',
   label: getActiveWorkspaceLabel() || ''
  },
  route_home: routeHomeBase ? { ...routeHomeBase } : null,
  route_meta: routeData ? { name: routeData.name || '', points: Array.isArray(routeData.points) ? routeData.points.length : 0 } : null,
  team_meta: {
   owner: ownerProfile ? { ...ownerProfile } : null,
   members: getCrewMembersWithOwner().map((member) => ({ id: member.id, name: member.name, role: member.role, email: member.email || '' }))
  },
  locations: (Array.isArray(locations) ? locations : []).map((loc, index) => normalizeStoredLocation(loc, index)).filter(Boolean)
 };
 const jsonText = JSON.stringify(payload, null, 2);
 const fileName = `kaart-backup-${new Date().toISOString().slice(0,10)}.json`;

 if (window.showSaveFilePicker) {
  try {
   const handle = await window.showSaveFilePicker({
    suggestedName: fileName,
    types: [{
     description: 'JSON backup',
     accept: { 'application/json': ['.json'] }
    }]
   });
   const writable = await handle.createWritable();
   await writable.write(jsonText);
   await writable.close();
   markBackupFresh();
   renderBackupReminder();
   renderProductHealthPanel();
   setStatusBox(`Backup opgeslagen als ${fileName}.`, 'success', true);
   return;
  } catch (err) {
   if (err && err.name === 'AbortError') {
    setStatusBox('Opslaan geannuleerd.', 'warn', true);
    return;
   }
  }
 }

 const blob = new Blob([jsonText], { type:'application/json' });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = fileName;
 a.rel = 'noopener';
 a.style.display = 'none';
 document.body.appendChild(a);
 a.click();
 markBackupFresh();
 renderBackupReminder();
 renderProductHealthPanel();
 setTimeout(() => {
  URL.revokeObjectURL(url);
  a.remove();
 }, 4000);
 setStatusBox(`Backupdownload gestart: ${fileName}.`, 'success', true);
}

function csvEscape(value) {
 const raw = String(value ?? '');
 if (/[",\n]/.test(raw)) return '"' + raw.replaceAll('"', '""') + '"';
 return raw;
}

function buildMyMapsDescription(loc) {
 const parts = [];
 if (loc && loc.category) parts.push(`Rubriek: ${loc.category}`);
 if (Array.isArray(loc && loc.layerPath) && loc.layerPath.length) parts.push(`Laagpad: ${loc.layerPath.join(' / ')}`);
 const notes = String(loc && loc.notes || '').trim();
 if (notes) parts.push(`Opmerkingen: ${notes}`);
 return parts.join(' | ');
}

function buildMyMapsCsv(locationsForLayer) {
 const header = ['Name','Description','Latitude','Longitude','id','category','notes','updated_at'];
 const rows = locationsForLayer.map(loc => [
  loc.name || 'Nieuwe locatie',
  buildMyMapsDescription(loc),
  Number(loc.lat),
  Number(loc.lng),
  loc.id || '',
  normalizeCategoryName(loc.category),
  String(loc.notes || '').trim(),
  loc.updated_at || ''
 ]);
 return '\ufeff' + [header, ...rows].map(row => row.map(csvEscape).join(',')).join('\n');
}

function buildMyMapsReadme(layerEntries) {
 const lines = [
  'Generieke My Maps export per rubriek',
  '',
  'Gebruik in Google My Maps per bestaande laag:',
  'Importeren of Reimport and merge op basis van id.',
  '',
  'Bestanden in deze export:'
 ];
 layerEntries.forEach(entry => {
  lines.push(`- ${entry.fileName} -> laag ${entry.layerName} (${entry.count} locaties)`);
 });
 lines.push('');
 lines.push('Kolommen: Name, Description, Latitude, Longitude, id, category, notes, updated_at');
 return lines.join('\n');
}

function buildMyMapsLayerExportEntries() {
 const grouped = new Map();
 (Array.isArray(locations) ? locations : []).forEach((loc) => {
  if (!Number.isFinite(Number(loc && loc.lat)) || !Number.isFinite(Number(loc && loc.lng))) return;
  const category = normalizeCategoryName(loc && loc.category);
  if (!grouped.has(category)) grouped.set(category, []);
  grouped.get(category).push(loc);
 });

 return [...grouped.entries()]
  .sort((a, b) => a[0].localeCompare(b[0], 'nl'))
  .map(([category, items]) => ({
   category,
   layerName: category,
   fileName: `${category.replace(/[\\/:*?"<>|]+/g, '_')}.csv`,
   count: items.length,
   csv: buildMyMapsCsv(items)
  }));
}

function triggerTextDownload(fileName, content, mimeType='text/plain;charset=utf-8') {
 const blob = new Blob([content], { type:mimeType });
 const url = URL.createObjectURL(blob);
 const a = document.createElement('a');
 a.href = url;
 a.download = fileName;
 a.rel = 'noopener';
 a.style.display = 'none';
 document.body.appendChild(a);
 a.click();
 setTimeout(() => {
  URL.revokeObjectURL(url);
  a.remove();
 }, 4000);
}

async function exportMyMapsLayers() {
 if (!requireRolePermission('exportData', 'Alleen de owner mag My Maps exporteren.')) return;
 const mobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
 if (mobile) {
  setStatusBox('My Maps-export is alleen bedoeld voor laptop/desktop.', 'warn', true);
  return;
 }

 const entries = buildMyMapsLayerExportEntries();
 if (!entries.length) {
  setStatusBox('Geen exporteerbare lagen gevonden voor My Maps.', 'warn', true);
  return;
 }

 const readme = buildMyMapsReadme(entries);

 if (window.showDirectoryPicker) {
  try {
   const dirHandle = await window.showDirectoryPicker({ mode:'readwrite' });
   for (const entry of entries) {
    const fileHandle = await dirHandle.getFileHandle(entry.fileName, { create:true });
    const writable = await fileHandle.createWritable();
    await writable.write(entry.csv);
    await writable.close();
   }
   const readmeHandle = await dirHandle.getFileHandle('README_mymaps_sync.txt', { create:true });
   const readmeWritable = await readmeHandle.createWritable();
   await readmeWritable.write(readme);
   await readmeWritable.close();
   setStatusBox(`My Maps-export opgeslagen in gekozen map: ${entries.length} lagen + README.`, 'success', true);
   return;
  } catch (err) {
   if (err && err.name === 'AbortError') {
    setStatusBox('My Maps-export geannuleerd.', 'warn', true);
    return;
   }
  }
 }

 entries.forEach((entry, index) => {
  setTimeout(() => triggerTextDownload(entry.fileName, entry.csv, 'text/csv;charset=utf-8'), index * 250);
 });
 setTimeout(() => triggerTextDownload('README_mymaps_sync.txt', readme), entries.length * 250 + 150);
 setStatusBox(`My Maps-download gestart: ${entries.length} lagen + README. Sta meerdere downloads toe als Chrome daarom vraagt.`, 'success', true);
}

function directChildrenByName(node, name) {
 return [...(node?.children || [])].filter(child => child.localName === name);
}

function directChildByName(node, name) {
 return directChildrenByName(node, name)[0] || null;
}

function directChildText(node, name) {
 return directChildByName(node, name)?.textContent?.trim() || '';
}

function isGenericLayerName(name) {
 const value = String(name || '').trim();
 if (!value) return true;
 const lower = value.toLowerCase();
 const exact = new Set([
  'alle items',
  'individuele stijlen',
  'naamloze laag',
  'untitled layer',
  'untitled map',
  'voorbeeld weergeven',
  'document',
  'layer',
  'map'
 ]);
 if (exact.has(lower)) return true;
 if (/\.csv$/i.test(value)) return true;
 if (/^opgemaakt door /i.test(value)) return true;
 if (/^layer\s+\d+$/i.test(value)) return true;
 return false;
}

function meaningfulLayerPath(pathParts) {
 return (Array.isArray(pathParts) ? pathParts : []).map(part => String(part || '').trim()).filter(part => part && !isGenericLayerName(part));
}

function categoryFromLayerPath(pathParts) {
 const clean = meaningfulLayerPath(pathParts);
 if (!clean.length) return normalizeCategoryName('Overig');
 return normalizeCategoryName(clean.join(' / '));
}

function parsePointCoords(text) {
 const raw = String(text || '').trim().split(/\s+/)[0];
 if (!raw) return null;
 const parts = raw.split(',');
 const lng = Number(parts[0]);
 const lat = Number(parts[1]);
 if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
 return { lat, lng };
}

function extractNetworkLinkHrefFromKml(text) {
 const xml = new DOMParser().parseFromString(text, 'text/xml');
 const parserError = xml.querySelector('parsererror');
 if (parserError) return '';
 const hrefNode = xml.getElementsByTagNameNS('*', 'href')[0];
 return hrefNode?.textContent?.trim() || '';
}

async function extractKmlTextFromKmz(file) {
 if (typeof JSZip === 'undefined') throw new Error('KMZ import vereist JSZip, maar die library is niet geladen.');
 const zip = await JSZip.loadAsync(file);
 const candidates = Object.values(zip.files).filter(entry => !entry.dir && /\.kml$/i.test(entry.name));
 if (!candidates.length) throw new Error('Geen KML-bestand gevonden in KMZ.');
 const preferred = candidates.find(entry => /(^|\/)doc\.kml$/i.test(entry.name)) || candidates[0];
 let text = await preferred.async('text');
 const href = extractNetworkLinkHrefFromKml(text);
 if (href && /^https?:\/\//i.test(href)) {
  try {
   const response = await fetch(href, { credentials:'omit' });
   if (!response.ok) throw new Error(`HTTP ${response.status}`);
   text = await response.text();
  } catch (err) {
   console.warn(err);
   throw new Error('Deze KMZ bevat alleen een externe My Maps-link. Automatisch ophalen lukte niet. Exporteer in My Maps bij voorkeur eerst een echte KML/KMZ of gebruik een openbaar deelbare kaart.');
  }
 }
 return text;
}

function parseKmlLocations(text) {
 const xml = new DOMParser().parseFromString(text, 'text/xml');
 const parserError = xml.querySelector('parsererror');
 if (parserError) throw new Error('KML kon niet worden gelezen.');
 const parsed = [];
 let counter = 0;

 function walk(node, path = []) {
  if (!node || node.nodeType !== 1) return;
  const local = node.localName;
  let nextPath = path;

  if (local === 'Folder' || local === 'Document') {
   const name = directChildText(node, 'name');
   nextPath = name ? [...path, name] : [...path];
  }

  if (local === 'Placemark') {
   const coords = extractPointFromPlacemark(node);
   if (coords) {
    counter += 1;
    const name = directChildText(node, 'name') || `Locatie ${counter}`;
    const description = directChildText(node, 'description');
    const hintedPath = extractPlacemarkPathHints(node, nextPath);
    const category = categoryFromLayerPath(hintedPath);
    parsed.push({
     id: `kml-${Date.now()}-${counter}`,
     name,
     description,
     lat: coords.lat,
     lng: coords.lng,
     category,
     layerPath: hintedPath.length ? hintedPath : splitCategoryParts(category),
     notes: description,
     photos: [],
     photo: '',
     updated_at: Date.now()
    });
   }
  }

  [...node.children].forEach(child => walk(child, nextPath));
 }

 walk(xml.documentElement, []);
 return parsed;
}


function directPlacemarkMetadata(node) {
 const info = {};
 [...node.querySelectorAll('ExtendedData Data, ExtendedData SimpleData')].forEach(entry => {
  const key = String(entry.getAttribute('name') || '').trim().toLowerCase();
  if (!key) return;
  const valueNode = entry.localName === 'Data'
   ? [...entry.children].find(child => child.localName === 'value')
   : entry;
  const value = String((valueNode ? valueNode.textContent : entry.textContent) || '').trim();
  if (value && !info[key]) info[key] = value;
 });
 return info;
}

function splitCategoryParts(value) {
 return String(value || '')
  .split(/[\/>|\\]+/)
  .map(part => String(part || '').trim())
  .filter(Boolean);
}

function uniquePathParts(parts) {
 const out = [];
 parts.forEach(part => {
  const clean = String(part || '').trim();
  if (!clean) return;
  if (!out.length || out[out.length - 1].toLowerCase() !== clean.toLowerCase()) out.push(clean);
 });
 return out;
}

function extractPlacemarkPathHints(node, basePath=[]) {
 const metadata = directPlacemarkMetadata(node);
 const hints = [];
 const styleUrl = directChildText(node, 'styleUrl').replace(/^#/, '').trim();
 const folderLike = [
  metadata['folder'],
  metadata['layer'],
  metadata['laag'],
  metadata['rubriek'],
  metadata['category'],
  metadata['categorie'],
  metadata['type'],
  metadata['group'],
  metadata['groep'],
  metadata['icoongroep']
 ].filter(Boolean);
 folderLike.forEach(value => hints.push(...splitCategoryParts(value)));
 if (styleUrl && !/^icon-\d+$/i.test(styleUrl) && !/^msn_/i.test(styleUrl)) {
  hints.push(...splitCategoryParts(styleUrl.replace(/^icon-/, '').replace(/^msn_/, '')));
 }
 return meaningfulLayerPath(uniquePathParts([...basePath, ...hints]));
}

function extractPointFromPlacemark(node) {
 const pointNode = [...node.getElementsByTagNameNS('*', 'Point')][0];
 const coordNode = pointNode ? [...pointNode.getElementsByTagNameNS('*', 'coordinates')][0] : null;
 return coordNode ? parsePointCoords(coordNode.textContent) : null;
}

function parseGeoJsonLocations(text, fileName='import.geojson') {
 const parsed = JSON.parse(String(text || 'null'));
 const features = Array.isArray(parsed && parsed.features)
  ? parsed.features
  : (parsed && parsed.type === 'Feature' ? [parsed] : []);
 if (!features.length) throw new Error('Geen features gevonden in GeoJSON.');
 const imported = [];
 features.forEach((feature, idx) => {
  const geometry = feature && feature.geometry;
  const props = feature && feature.properties || {};
  if (!geometry) return;
  const type = String(geometry.type || '');
  const coords = geometry.coordinates;
  const points = [];
  if (type === 'Point' && Array.isArray(coords) && coords.length >= 2) {
   points.push(coords);
  } else if (type === 'MultiPoint' && Array.isArray(coords)) {
   coords.forEach(entry => points.push(entry));
  }
  points.forEach((entry, pointIdx) => {
   const lng = Number(entry && entry[0]);
   const lat = Number(entry && entry[1]);
   if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
   const categorySource = props.layerPath || props.layer || props.folder || props.category || props.rubriek || props.type || '';
   const layerPath = Array.isArray(categorySource)
    ? categorySource.map(part => String(part || '').trim()).filter(Boolean)
    : splitCategoryParts(categorySource);
   const category = categoryFromLayerPath(layerPath.length ? layerPath : splitCategoryParts(props.category || props.rubriek || ''));
   imported.push({
    id: `geojson-${Date.now()}-${idx + 1}-${pointIdx + 1}`,
    name: String(props.name || props.title || props.naam || `Locatie ${idx + 1}`).trim() || `Locatie ${idx + 1}`,
    description: String(props.description || props.notes || props.opmerkingen || `Geïmporteerd uit ${fileName}`),
    lat,
    lng,
    notes: String(props.notes || props.description || props.opmerkingen || '').trim(),
    photo: '',
    photos: [],
    category,
    layerPath: meaningfulLayerPath(layerPath.length ? layerPath : splitCategoryParts(category)),
    country_detected: String(props.country || props.land || ''),
    updated_at: Date.now()
   });
  });
 });
 return imported;
}

function parseGpxLocations(text, fileName='import.gpx') {
 const xml = new DOMParser().parseFromString(String(text || ''), 'application/xml');
 if (xml.querySelector('parsererror')) throw new Error('GPX kon niet worden gelezen.');
 const waypoints = [...xml.querySelectorAll('wpt')];
 const candidates = waypoints.length ? waypoints : [...xml.querySelectorAll('rtept, trkpt')];
 const imported = [];
 candidates.forEach((node, idx) => {
  const lat = Number(node.getAttribute('lat'));
  const lng = Number(node.getAttribute('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  const name = directChildText(node, 'name') || `Punt ${idx + 1}`;
  const desc = directChildText(node, 'desc') || directChildText(node, 'cmt') || '';
  const type = directChildText(node, 'type');
  const layerPath = meaningfulLayerPath(splitCategoryParts(type));
  imported.push({
   id: `gpx-${Date.now()}-${idx + 1}`,
   name,
   description: desc || `Geïmporteerd uit ${fileName}`,
   lat,
   lng,
   notes: desc,
   photo: '',
   photos: [],
   category: categoryFromLayerPath(layerPath.length ? layerPath : ['GPX import']),
   layerPath,
   updated_at: Date.now()
  });
 });
 if (!imported.length) throw new Error('Geen waypoint-locaties gevonden in GPX.');
 return imported;
}

function parseGenericJsonLocations(text, fileName='import.json') {
 const parsed = JSON.parse(String(text || 'null'));
 if (parsed && (parsed.type === 'FeatureCollection' || parsed.type === 'Feature')) {
  return parseGeoJsonLocations(JSON.stringify(parsed), fileName);
 }
 const source = Array.isArray(parsed) ? parsed : (Array.isArray(parsed && parsed.locations) ? parsed.locations : []);
 if (!Array.isArray(source) || !source.length) throw new Error('Geen locaties gevonden in JSON.');
 return source.map(normalizeImportedLocation).filter(Boolean);
}

function parseGeoJsonRoute(text, filename='route.geojson') {
 const parsed = JSON.parse(String(text || 'null'));
 const features = Array.isArray(parsed && parsed.features)
  ? parsed.features
  : (parsed && parsed.type === 'Feature' ? [parsed] : []);
 if (!features.length) return null;
 let bestPoints = [];
 let bestName = filename || 'GeoJSON route';
 features.forEach((feature) => {
  const geometry = feature && feature.geometry;
  const props = feature && feature.properties || {};
  if (!geometry) return;
  const type = String(geometry.type || '');
  let candidate = [];
  if (type === 'LineString' && Array.isArray(geometry.coordinates)) {
   candidate = geometry.coordinates.map(entry => ({ lng:Number(entry && entry[0]), lat:Number(entry && entry[1]) }))
    .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  } else if (type === 'MultiLineString' && Array.isArray(geometry.coordinates)) {
   geometry.coordinates.forEach(line => {
    const pts = (Array.isArray(line) ? line : []).map(entry => ({ lng:Number(entry && entry[0]), lat:Number(entry && entry[1]) }))
     .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
    if (pts.length > candidate.length) candidate = pts;
   });
  } else if ((type === 'Point' || type === 'MultiPoint') && Array.isArray(geometry.coordinates)) {
   const arr = type === 'Point' ? [geometry.coordinates] : geometry.coordinates;
   candidate = arr.map(entry => ({ lng:Number(entry && entry[0]), lat:Number(entry && entry[1]) }))
    .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng));
  }
  if (candidate.length > bestPoints.length) {
   bestPoints = candidate;
   bestName = String(props.name || props.title || filename || 'GeoJSON route').trim() || 'GeoJSON route';
  }
 });
 if (bestPoints.length < 2) return null;
 return {
  name: bestName,
  points: bestPoints,
  derivedFromPoints: false
 };
}

function parseCsvLine(line) {
 const cells = [];
 let value = '';
 let inQuotes = false;

 for (let i = 0; i < line.length; i++) {
  const ch = line[i];
  if (ch === '"') {
   if (inQuotes && line[i + 1] === '"') {
    value += '"';
    i += 1;
   } else {
    inQuotes = !inQuotes;
   }
  } else if (ch === ',' && !inQuotes) {
   cells.push(value);
   value = '';
  } else {
   value += ch;
  }
 }
 cells.push(value);
 return cells;
}

function parseCsvRows(text) {
 const rows = [];
 let current = '';
 let inQuotes = false;
 for (let i = 0; i < text.length; i++) {
  const ch = text[i];
  if (ch === '"') {
   current += ch;
   if (inQuotes && text[i + 1] === '"') {
    current += '"';
    i += 1;
   } else {
    inQuotes = !inQuotes;
   }
  } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
   if (current || rows.length) rows.push(parseCsvLine(current));
   if (ch === '\r' && text[i + 1] === '\n') i += 1;
   current = '';
  } else {
   current += ch;
  }
 }
 if (current) rows.push(parseCsvLine(current));
 return rows;
}

function parseCsvLocations(text, fileName='import.csv') {
 const rows = parseCsvRows(String(text || '').replace(/^\ufeff/, ''));
 if (rows.length < 2) throw new Error('CSV bevat te weinig regels.');
 const header = rows[0].map(cell => String(cell || '').trim().toLowerCase());
 const findIndex = (...names) => header.findIndex(h => names.includes(h));
 const latIndex = findIndex('latitude', 'lat', 'y');
 const lngIndex = findIndex('longitude', 'lng', 'lon', 'long', 'x');
 if (latIndex < 0 || lngIndex < 0) throw new Error('CSV mist latitude/longitude-kolommen.');
 const nameIndex = findIndex('name', 'title', 'naam', 'locatie');
 const categoryIndex = findIndex('category', 'rubriek', 'folder', 'layer', 'laag');
 const notesIndex = findIndex('notes', 'description', 'opmerkingen', 'comment', 'beschrijving');

 const imported = [];
 rows.slice(1).forEach((row, idx) => {
  const lat = Number(row[latIndex]);
  const lng = Number(row[lngIndex]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
  const category = normalizeCategoryName(categoryIndex >= 0 ? row[categoryIndex] : 'Overig');
  imported.push({
   id: `csv-${Date.now()}-${idx + 1}`,
   name: String(nameIndex >= 0 ? row[nameIndex] : `Locatie ${idx + 1}`).trim() || `Locatie ${idx + 1}`,
   description: `Geïmporteerd uit ${fileName}`,
   lat,
   lng,
   notes: String(notesIndex >= 0 ? row[notesIndex] : '').trim(),
   photo: '',
   photos: [],
   category,
   layerPath: categoryIndex >= 0 ? [category] : [],
   updated_at: Date.now()
  });
 });
 return imported;
}


function filenameToCategoryName(fileName='') {
 const base = String(fileName || 'Import')
  .replace(/\.[^.]+$/, '')
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
 return normalizeCategoryName(base || 'Import');
}

function isSimpleCategoryName(value) {
 const raw = String(value || '').trim();
 return !!raw && raw.length <= 30 && !/[\\/]/.test(raw);
}

function detectImportCategories(items) {
 const categories = [...new Set((Array.isArray(items) ? items : [])
  .map(item => String(item && item.category || '').trim())
  .map(value => normalizeCategoryName(value))
  .filter(value => value && value !== 'Overig' && isSimpleCategoryName(value)))];
 return categories.sort((a, b) => a.localeCompare(b, 'nl'));
}

function chooseImportCategoryStrategy(fileName, items) {
 const fileCategory = filenameToCategoryName(fileName);
 const importCategories = detectImportCategories(items);
 let message = `Hoe wil je deze import noemen?\n\n`;
 message += `Laat leeg om rubrieken uit het bestand te gebruiken`;
 if (importCategories.length) {
  message += ` (${importCategories.slice(0, 6).join(', ')}${importCategories.length > 6 ? ', ...' : ''})`;
 }
 message += `.\n`;
 message += `Typ =bestand om alles onder bestandsnaam "${fileCategory}" te zetten.\n`;
 message += `Of vul zelf één rubrieknaam in voor alle locaties uit deze import.`;
 const answer = prompt(message, '');
 const raw = String(answer == null ? '' : answer).trim();
 if (!raw) return { mode:'import', forcedCategory:'' };
 if (raw.toLowerCase() === '=bestand') return { mode:'single', forcedCategory:fileCategory };
 return { mode:'single', forcedCategory:normalizeCategoryName(raw) };
}

function pickImportCategory(item, fileName='', strategy=null) {
 if (strategy && strategy.mode === 'single' && strategy.forcedCategory) {
  return normalizeCategoryName(strategy.forcedCategory);
 }
 const current = normalizeCategoryName(item && item.category);
 if (isSimpleCategoryName(current) && current !== 'Overig') return current;
 return filenameToCategoryName(fileName);
}

function findImportMergeDuplicate(candidate) {
 return locations.find((loc) => {
  const sameName = normalizeForSearch(loc && loc.name) === normalizeForSearch(candidate && candidate.name);
  const closeEnough = kmBetween(Number(loc && loc.lat), Number(loc && loc.lng), Number(candidate && candidate.lat), Number(candidate && candidate.lng)) <= 0.02;
  return sameName && closeEnough;
 }) || null;
}

function normalizeImportedLocation(item, index, fileName='', strategy=null) {
 const lat = Number(item && item.lat);
 const lng = Number(item && item.lng);
 if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
 const category = ensureCategoryOption(pickImportCategory(item, fileName, strategy));
 const media = deriveLocationMediaPayload({
  description: String(item && item.description || 'Geïmporteerde locatie'),
  notes: String(item && item.notes || ''),
  photos: Array.isArray(item && item.photos) ? item.photos.filter(Boolean) : (item && item.photo ? [item.photo] : []),
  photo: String(item && item.photo || '')
 });
 return {
  ...item,
  id: String(item && item.id || `import-${Date.now()}-${index}`),
  name: String(item && item.name || 'Nieuwe locatie').trim() || 'Nieuwe locatie',
  description: media.description,
  lat,
  lng,
  notes: media.notes,
  photo: media.photo,
  photos: media.photos,
  category,
  layerPath: Array.isArray(item && item.layerPath) ? item.layerPath.map(part => String(part || '').trim()).filter(Boolean) : [],
  country_detected: String(item && item.country_detected || ''),
  updated_at: Number(item && item.updated_at || Date.now())
 };
}


async function importLocationsBackup(file) {
 if (!requireRolePermission('importLocations', 'Alleen de owner mag locaties importeren.')) return;
 try {
  const ext = String(file && file.name || '').toLowerCase().split('.').pop();
  let rawImported = [];

  if (ext === 'json') {
   rawImported = parseGenericJsonLocations(await file.text(), file.name);
  } else if (ext === 'geojson') {
   rawImported = parseGeoJsonLocations(await file.text(), file.name);
  } else if (ext === 'gpx') {
   rawImported = parseGpxLocations(await file.text(), file.name);
  } else if (ext === 'kml') {
   rawImported = parseKmlLocations(await file.text());
  } else if (ext === 'kmz') {
   rawImported = parseKmlLocations(await extractKmlTextFromKmz(file));
  } else if (ext === 'csv') {
   rawImported = parseCsvLocations(await file.text(), file.name);
  } else {
   throw new Error('Gebruik JSON, GeoJSON, GPX, KML, KMZ of CSV.');
  }

  if (!rawImported.length) throw new Error('Geen geldige locaties gevonden.');

  const strategy = chooseImportCategoryStrategy(file.name, rawImported);
  const imported = rawImported.map((item, idx) => normalizeImportedLocation(item, idx, file.name, strategy)).filter(Boolean);
  if (!imported.length) throw new Error('Geen geldige locaties gevonden.');

  let added = 0;
  let skipped = 0;
  const importedCategories = new Set();
  imported.forEach((loc) => {
   const dup = findImportMergeDuplicate(loc);
   if (dup) {
    skipped += 1;
    return;
   }
   locations.push(loc);
   importedCategories.add(normalizeCategoryName(loc.category));
   added += 1;
  });

  importedCategories.forEach((cat) => {
   ensureCategoryOption(cat);
   visibleCategories.add(cat);
  });

  syncDerivedCategories();
  saveLocations();
  filtered = getVisibleLocations([...locations]);
  selectedId = filtered[0]?.id || locations[0]?.id || null;
  exitAddMode(false);
  renderAll(true);

  const rubricCount = [...new Set(locations.map(loc => normalizeCategoryName(loc.category)))].length;
  setStatusBox(`Import geslaagd: ${added} toegevoegd, ${skipped} overgeslagen. Totaal ${locations.length} locaties in ${rubricCount} rubrieken.`, 'success', true);
 } catch (err) {
  console.error('Import mislukt', err);
  setStatusBox(String(err && err.message || 'Import mislukt. Gebruik een geldig JSON-, GeoJSON-, GPX-, KML-, KMZ- of CSV-bestand.'), 'warn', true);
 }
}

function initMap() {
 map = L.map('map', { zoomControl: true, preferCanvas: true });
 routeCanvasRenderer = L.canvas({ padding: 0.5 });
 baseMapLayers = createBaseMapLayers();
 applyBaseMapStyle(currentBaseMapStyle);
 bindMapStyleButtons();

 buildClusterGroup();

 map.on('click', (e) => {
 if (routePlannerActive) {
  handleRoutePlannerMapClick(e.latlng);
  if (isMobileSheetLayout()) toggleMobileMenu(true);
  return;
 }
 if (!addMode) {
  if (isMobileSheetLayout()) toggleMobileMenu(false);
  return;
 }
 setPendingLocationFromMap(e.latlng.lat, e.latlng.lng);
 if (isMobileSheetLayout()) toggleMobileMenu(true);
 });


 filtered = getVisibleLocations([...locations]);
 selectedId = filtered[0]?.id || locations[0]?.id || null;

 const bounds = L.latLngBounds(filtered.map(x => [x.lat, x.lng]));
 if (restoreRouteIfPresent()) {
  const routeBounds = L.latLngBounds(routeData.points.map(p => [p.lat, p.lng]));
  [...onRouteMap.keys(), ...nearRouteMap.keys()].forEach(id => {
   const loc = locations.find(x => x.id === id);
   if (loc) routeBounds.extend([loc.lat, loc.lng]);
  });
  if (routeBounds.isValid()) map.fitBounds(routeBounds.pad(0.12));
 } else if (bounds.isValid()) map.fitBounds(bounds.pad(0.08));
 else map.setView([50.85, 5.4], 7);

 renderAll(false);
}

document.getElementById('coordsInput').addEventListener('blur', () => {
 const raw = document.getElementById('coordsInput').value.trim();
 if (!raw) return;
 if (syncCoordsInputFeedback()) {
 if (addMode) {
 const coords = getCoordinatesFromEditor();
 if (coords) showPreviewMarker(coords.lat, coords.lng);
 }
 setStatusBox('Volledige pin herkend en opgeslagen in de editor.', 'info', true);
 }
});

document.getElementById('coordsInput').addEventListener('keydown', (e) => {
 if (e.key !== 'Enter') return;
 e.preventDefault();
 const ok = syncCoordsInputFeedback();
 if (!ok) {
 setStatusBox('Gebruik een volledige pin, bijvoorbeeld 49.19223, -0.30636.', 'warn', true);
 return;
 }
 const coords = getCoordinatesFromEditor();
 if (addMode && coords) {
 showPreviewMarker(coords.lat, coords.lng);
 map.flyTo([coords.lat, coords.lng], Math.max(map.getZoom(), 14), { duration:.55 });
 }
});

document.getElementById('searchInput').addEventListener('input', () => {
 const raw = document.getElementById('searchInput').value.trim();
 clearTimeout(searchPreviewTimer);
 if (!raw) {
  applySearch(true);
  return;
 }
 if (parseCoordinateInput(raw)) {
  setStatusBox('Coördinaten herkend. Druk op Enter of klik op Zoek.', 'info', true);
  return;
 }
 if (raw.length < 2) return;
 searchPreviewTimer = window.setTimeout(() => applySearch(false), 180);
});
document.getElementById('searchInput').addEventListener('keydown', (e) => {
 if (e.key !== 'Enter') return;
 e.preventDefault();
 applySearch(true);
});
document.getElementById('searchBtn').addEventListener('click', () => applySearch(true));
document.getElementById('routeBtn').addEventListener('click', (e) => {
 e.preventDefault();
 e.stopPropagation();
 openRouteForSelected();
});
document.getElementById('locateBtn').addEventListener('click', activateLocation);
const liveTrackBtn = document.getElementById('liveTrackBtn');
if (liveTrackBtn) liveTrackBtn.addEventListener('click', toggleLiveTracking);
bindMobileMenuControls();
syncMobileMenuLayout({ resetScroll:true });
applyResponsiveOverlayLayout();
window.addEventListener('resize', applyResponsiveOverlayLayout);
window.addEventListener('orientationchange', () => setTimeout(applyResponsiveOverlayLayout, 180));
updateLiveTrackButtonState();
document.getElementById('exportBtn').addEventListener('click', exportLocationsBackup);
const myMapsExportBtn = document.getElementById('myMapsExportBtn');
if (myMapsExportBtn) myMapsExportBtn.addEventListener('click', exportMyMapsLayers);
document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());
document.getElementById('importFile').addEventListener('change', (e) => {
 const file = e.target.files && e.target.files[0];
 if (file) importLocationsBackup(file);
 e.target.value = '';
});
document.getElementById('routeImportBtn').addEventListener('click', () => document.getElementById('routeFile').click());
const teamInviteBtn = document.getElementById('teamInviteBtn');
if (teamInviteBtn) teamInviteBtn.addEventListener('click', addTeamMemberFromUi);
const teamOwnerSaveBtn = document.getElementById('teamOwnerSaveBtn');
if (teamOwnerSaveBtn) teamOwnerSaveBtn.addEventListener('click', saveOwnerProfileFromUi);
document.getElementById('routeFile').addEventListener('change', (e) => {
 const file = e.target.files && e.target.files[0];
 if (file) loadRoute(file);
 e.target.value = '';
});
function beginAddLocationFlow(preferredCategory='') {
 if (!requireRolePermission('addLocations', 'Jouw rol mag geen locaties toevoegen.')) return;
 const rawCategory = preferredCategory || defaultQuickSaveCategory();
 const chosenCategory = ensureCategoryOption(normalizeCategoryName(rawCategory));
 visibleCategories.add(chosenCategory);
 const coord = parseCoordinateInput(document.getElementById('searchInput').value.trim());
 if (coord) {
  searchTextActive = false;
  searchHighlightId = null;
  startAddMode({ name:defaultQuickSaveName(), lat:coord.lat, lng:coord.lng, notes:'', category:chosenCategory });
  showPreviewMarker(coord.lat, coord.lng);
  map.flyTo([coord.lat, coord.lng], Math.max(map.getZoom(), 14), { duration:.55 });
  setStatusBox(`Pin herkend: ${formatCoord(coord.lat)}, ${formatCoord(coord.lng)}. Controleer details en sla daarna op in ${chosenCategory}.`, 'success', true);
 } else {
  startAddMode({ name:defaultQuickSaveName(), category:chosenCategory });
  setStatusBox(`Nieuwe locatie gestart in ${chosenCategory}. Tik nu op de kaart om direct een pin te zetten.`, 'info', true);
 }
}
document.getElementById('addLocationBtn').addEventListener('click', () => beginAddLocationFlow('Onderweg'));
function handleSaveButtonAction() {
 if (!requireRolePermission('editLocations', 'Jouw rol mag geen wijzigingen opslaan.')) return;
 if (saveInProgress) return;
 const activeEl = document.activeElement;
 if (activeEl && activeEl !== document.body && typeof activeEl.blur === 'function') {
 try { activeEl.blur(); } catch (err) {}
 }
 if (addMode) {
 addLocationFromCoords();
 return;
 }
 updateSelectedFromEditor();
}

const saveLocationBtn = document.getElementById('saveLocationBtn');
let lastSaveTriggerAt = 0;

function triggerSaveFromUi(e) {
 if (e) {
 e.preventDefault();
 e.stopPropagation();
 }
 const now = Date.now();
 if (saveInProgress) return;
 if (now - lastSaveTriggerAt < 450) return;
 lastSaveTriggerAt = now;
 handleSaveButtonAction();
}

saveLocationBtn.setAttribute('type', 'button');
saveLocationBtn.addEventListener('click', triggerSaveFromUi);
const toggleCategoryOverrideBtn = document.getElementById('toggleCategoryOverrideBtn');
if (toggleCategoryOverrideBtn) toggleCategoryOverrideBtn.addEventListener('click', () => {
 manualCategoryOverride = !manualCategoryOverride;
 if (!manualCategoryOverride) {
  const input = document.getElementById('categoryInput');
  if (input) input.value = defaultQuickSaveCategory();
 }
 updateAddCategoryUi();
 if (manualCategoryOverride) {
  const input = document.getElementById('categoryInput');
  if (input) {
   try { input.focus(); } catch (err) {}
  }
 }
});
document.getElementById('cancelAddBtn').addEventListener('click', () => exitAddMode(true));
document.getElementById('deleteLocationBtn').addEventListener('click', deleteSelectedLocation);
document.getElementById('photoInput').addEventListener('change', async (e) => {
 const files = [...(e.target.files || [])];
 if (!files.length) return;
 await addPhotosFromFiles(files);
 setTimeout(() => { editorDirty = true; updateDetailModeUi(); }, 0);
 e.target.value = '';
});
['nameInput','coordsInput','categoryInput','notesInput'].forEach((id) => {
 const el = document.getElementById(id);
 if (!el) return;
 el.addEventListener('input', () => {
  editorDirty = true;
  if (id === 'categoryInput') {
   if (addMode) manualCategoryOverride = true;
   if (categoryChooserOpen) renderCategoryChooser();
  }
  updateAddCategoryUi();
  updateDetailModeUi();
 });
});
const overviewModeBtn = document.getElementById('overviewModeBtn');
if (overviewModeBtn) overviewModeBtn.addEventListener('click', () => setDetailMode('overview'));
const editModeSwitchBtn = document.getElementById('editModeSwitchBtn');
if (editModeSwitchBtn) editModeSwitchBtn.addEventListener('click', () => setDetailMode('edit', { forceReload:false, openMobile:true }));
const editModeBtn = document.getElementById('editModeBtn');
if (editModeBtn) editModeBtn.addEventListener('click', () => setDetailMode((detailMode === 'edit' && !addMode) ? 'overview' : 'edit', { forceReload:false, openMobile:true }));
const overviewEditBtn = document.getElementById('overviewEditBtn');
if (overviewEditBtn) overviewEditBtn.addEventListener('click', () => setDetailMode('edit', { forceReload:true, openMobile:true }));
const emptyImportBtn = document.getElementById('emptyImportBtn');
if (emptyImportBtn) emptyImportBtn.addEventListener('click', () => document.getElementById('importFile').click());
const emptyAddBtn = document.getElementById('emptyAddBtn');
if (emptyAddBtn) emptyAddBtn.addEventListener('click', () => beginAddLocationFlow('Onderweg'));
const emptyRouteBtn = document.getElementById('emptyRouteBtn');
if (emptyRouteBtn) emptyRouteBtn.addEventListener('click', () => document.getElementById('routeFile').click());
const addCategoryBtn = document.getElementById('addCategoryBtn');
if (addCategoryBtn) addCategoryBtn.addEventListener('click', addCategoryManually);
const applyCategoryBtn = document.getElementById('applyCategoryBtn');
if (applyCategoryBtn) applyCategoryBtn.addEventListener('click', moveSelectedLocationToEditorCategory);
const renameCategoryBtn = document.getElementById('renameCategoryBtn');
if (renameCategoryBtn) renameCategoryBtn.addEventListener('click', renameCurrentCategory);
const deleteCategoryBtn = document.getElementById('deleteCategoryBtn');
if (deleteCategoryBtn) deleteCategoryBtn.addEventListener('click', deleteCurrentCategory);
updateAddCategoryUi();
const clearMapBtn = document.getElementById('clearMapBtn');
if (clearMapBtn) clearMapBtn.addEventListener('click', openClearMapConfirm);
const confirmClearYesBtn = document.getElementById('confirmClearYesBtn');
if (confirmClearYesBtn) confirmClearYesBtn.addEventListener('click', clearEntireMap);
const confirmClearNoBtn = document.getElementById('confirmClearNoBtn');
if (confirmClearNoBtn) confirmClearNoBtn.addEventListener('click', closeClearMapConfirm);
const confirmOverlay = document.getElementById('confirmOverlay');
if (confirmOverlay) {
 confirmOverlay.addEventListener('click', (e) => {
  if (e.target === confirmOverlay) closeClearMapConfirm();
 });
}
document.addEventListener('keydown', (e) => {
 if (e.key === 'Escape') closeClearMapConfirm();
});


const ONBOARDING_DISMISSED_KEY = 'vault_urbex_onboarding_dismissed_v1';

const APP_BUILD_VERSION = 'v9.3 beta+';
const APP_BUILD_CHANNEL = 'Premium local beta · klaar voor gesloten test';
const LAST_BACKUP_AT_KEY_BASE = 'urbex_core_hosting_v92_last_backup_at_v1';
const LAST_BACKUP_SIGNATURE_KEY_BASE = 'urbex_core_hosting_v92_last_backup_signature_v1';
const LAST_BACKUP_DISMISSED_SIGNATURE_KEY_BASE = 'urbex_core_hosting_v92_last_backup_dismissed_signature_v1';

function getLastBackupAtKey() {
 return getWorkspaceScopedStorageKey(LAST_BACKUP_AT_KEY_BASE);
}

function getLastBackupSignatureKey() {
 return getWorkspaceScopedStorageKey(LAST_BACKUP_SIGNATURE_KEY_BASE);
}

function getLastBackupDismissedSignatureKey() {
 return getWorkspaceScopedStorageKey(LAST_BACKUP_DISMISSED_SIGNATURE_KEY_BASE);
}

function readStoredNumber(key) {
 try {
  const value = Number(localStorage.getItem(key) || 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
 } catch (err) {
  return 0;
 }
}

function getBackupSignature() {
 const latestLocationUpdate = (Array.isArray(locations) ? locations : []).reduce((maxValue, loc) => {
  const stamp = Number(loc && (loc.updated_at || loc.created_at) || 0);
  return stamp > maxValue ? stamp : maxValue;
 }, 0);
 const routePointCount = routeData && Array.isArray(routeData.points) ? routeData.points.length : 0;
 const routeUpdated = Number(routeData && routeData.updated_at || 0);
 const homeStamp = Number(routeHomeBase && routeHomeBase.updated_at || 0);
 const members = getCrewMembersWithOwner().map((member) => `${member.id || ''}:${member.role || ''}:${member.name || ''}`).sort();
 return JSON.stringify({
  workspaceId: getActiveWorkspaceId() || '',
  locationCount: Array.isArray(locations) ? locations.length : 0,
  latestLocationUpdate,
  routePointCount,
  routeUpdated,
  homeStamp,
  memberCount: members.length,
  members
 });
}

function getLastBackupAt() {
 return readStoredNumber(getLastBackupAtKey());
}

function getLastBackupSignature() {
 try {
  return String(localStorage.getItem(getLastBackupSignatureKey()) || '');
 } catch (err) {
  return '';
 }
}

function getDismissedBackupSignature() {
 try {
  return String(localStorage.getItem(getLastBackupDismissedSignatureKey()) || '');
 } catch (err) {
  return '';
 }
}

function markBackupFresh() {
 const now = Date.now();
 const signature = getBackupSignature();
 try {
  localStorage.setItem(getLastBackupAtKey(), String(now));
  localStorage.setItem(getLastBackupSignatureKey(), signature);
  localStorage.removeItem(getLastBackupDismissedSignatureKey());
 } catch (err) {}
}

function dismissBackupReminder() {
 try {
  localStorage.setItem(getLastBackupDismissedSignatureKey(), getBackupSignature());
 } catch (err) {}
}

function formatRelativeTime(timestamp) {
 if (!timestamp) return 'nog niet';
 const diff = Date.now() - timestamp;
 if (diff < 60 * 1000) return 'zojuist';
 if (diff < 60 * 60 * 1000) return `${Math.round(diff / 60000)} min geleden`;
 if (diff < 24 * 60 * 60 * 1000) return `${Math.round(diff / 3600000)} uur geleden`;
 return `${Math.round(diff / 86400000)} dag(en) geleden`;
}

function renderBackupReminder() {
 const card = document.getElementById('backupReminderCard');
 const meta = document.getElementById('backupReminderMeta');
 const bannerMeta = document.getElementById('betaBannerMeta');
 const badge = document.getElementById('betaVersionBadge');
 if (badge) badge.textContent = APP_BUILD_VERSION;
 const hasData = (Array.isArray(locations) && locations.length > 0)
  || !!(routeData && Array.isArray(routeData.points) && routeData.points.length > 1)
  || getCrewMembersWithOwner().length > 1;
 const currentSignature = getBackupSignature();
 const savedSignature = getLastBackupSignature();
 const dismissedSignature = getDismissedBackupSignature();
 const lastBackupAt = getLastBackupAt();
 const backupIsCurrent = !!lastBackupAt && !!savedSignature && savedSignature === currentSignature;
 const backupIsOld = !!lastBackupAt && (Date.now() - lastBackupAt) > (3 * 24 * 60 * 60 * 1000);
 const needsBackup = hasData && (!backupIsCurrent || backupIsOld);
 const shouldHideBecauseDismissed = needsBackup && dismissedSignature === currentSignature;
 const message = !hasData
  ? 'Browser-opslag actief · klaar voor laptop- en hostingtests'
  : (!lastBackupAt
   ? 'Nog geen backup gemaakt in deze browser. Exporteer een JSON-backup voordat je van browser, profiel of apparaat wisselt.'
   : (backupIsCurrent && !backupIsOld
    ? `Laatste backup ${formatRelativeTime(lastBackupAt)}. Deze browserdata is vastgelegd.`
    : `Laatste backup ${formatRelativeTime(lastBackupAt)}. Er zijn sindsdien wijzigingen of de backup is ouder dan 3 dagen.`));
 if (meta) meta.textContent = message;
 if (bannerMeta) bannerMeta.textContent = hasData
  ? (needsBackup ? 'Browser-opslag actief · exporteer nu een JSON-backup' : `Browser-opslag actief · backup ${formatRelativeTime(lastBackupAt)}`)
  : 'Browser-opslag actief · klaar voor laptop- en hostingtests';
 if (card) card.hidden = !needsBackup || shouldHideBecauseDismissed;
}

function setControlShelfOpen(open) {
 const shelf = document.getElementById('controlShelf');
 const toggle = document.getElementById('primaryMoreBtn');
 if (!shelf) return;
 const forceMobileOpen = window.innerWidth <= 900;
 shelf.hidden = forceMobileOpen ? false : !open;
 if (toggle) {
  toggle.textContent = open ? '✕ Sluit' : '☰ Meer';
  toggle.style.display = forceMobileOpen ? 'none' : '';
 }
}
function toggleControlShelf() {
 const shelf = document.getElementById('controlShelf');
 if (!shelf) return;
 setControlShelfOpen(!!shelf.hidden);
}
function loadOnboardingDismissed() {
 try { return localStorage.getItem(ONBOARDING_DISMISSED_KEY) === '1'; } catch (err) { return false; }
}
function saveOnboardingDismissed(value) {
 try { if (value) localStorage.setItem(ONBOARDING_DISMISSED_KEY, '1'); else localStorage.removeItem(ONBOARDING_DISMISSED_KEY); } catch (err) {}
}
function updateOnboardingVisibility(forceHide=false) {
 const overlay = document.getElementById('onboardingOverlay');
 if (!overlay) return;
 const shouldShow = !forceHide && !loadOnboardingDismissed() && !locations.length && !addMode;
 overlay.classList.toggle('show', shouldShow);
}
function dismissOnboarding() {
 saveOnboardingDismissed(true);
 updateOnboardingVisibility(true);
}


window.URBEX_CORE_STATIC_PREP = {
 version: '2026-04-24-beta-9.3-plus',
 getContext() {
  return {
   ...getPreparedWorkspaceContext(),
   mode: 'static-hosting-local-only',
   storageKeys: {
    locations: STORAGE_KEY,
    routes: ROUTE_STORAGE_KEY,
    home: ROUTE_HOME_STORAGE_KEY,
    members: TEAM_MEMBERS_STORAGE_KEY,
    owner: TEAM_OWNER_PROFILE_STORAGE_KEY
   }
  };
 },
 getSnapshot() {
  return {
   context: getPreparedWorkspaceContext(),
   ownerProfile: { ...ownerProfile },
   currentSessionMemberId,
   currentRole: getCurrentCrewRole(),
   members: getCrewMembersWithOwner().map((member) => ({ ...member })),
   routeHomeBase: routeHomeBase ? { ...routeHomeBase } : null,
   routeData: routeData ? normalizeRouteState(routeData) : null,
   locationCount: Array.isArray(locations) ? locations.length : 0
  };
 },
 persistWorkspaceDraft
};

const betaExportBtn = document.getElementById('betaExportBtn');
if (betaExportBtn) betaExportBtn.addEventListener('click', exportLocationsBackup);
const backupNowBtn = document.getElementById('backupNowBtn');
if (backupNowBtn) backupNowBtn.addEventListener('click', exportLocationsBackup);
const backupDismissBtn = document.getElementById('backupDismissBtn');
if (backupDismissBtn) backupDismissBtn.addEventListener('click', () => { dismissBackupReminder(); renderBackupReminder(); renderProductHealthPanel(); });

const primaryAddBtn = document.getElementById('primaryAddBtn');
if (primaryAddBtn) primaryAddBtn.addEventListener('click', () => beginAddLocationFlow('Onderweg'));
const mobileAddFab = document.getElementById('mobileAddFab');
if (mobileAddFab) mobileAddFab.addEventListener('click', () => beginAddLocationFlow('Onderweg'));
const primaryPlanRouteBtn = document.getElementById('primaryPlanRouteBtn');
if (primaryPlanRouteBtn) primaryPlanRouteBtn.addEventListener('click', handlePrimaryPlanRouteClick);
const primaryMoreBtn = document.getElementById('primaryMoreBtn');
if (primaryMoreBtn) primaryMoreBtn.addEventListener('click', toggleControlShelf);
const homeSetupBtn = document.getElementById('homeSetupBtn');
if (homeSetupBtn) homeSetupBtn.addEventListener('click', handleHomeSetupClick);
const workspaceSaveBtn = document.getElementById('workspaceSaveBtn');
if (workspaceSaveBtn) workspaceSaveBtn.addEventListener('click', saveWorkspaceFromUi);
const authRegisterBtn = document.getElementById('authRegisterBtn');
if (authRegisterBtn) authRegisterBtn.addEventListener('click', handleAuthRegister);
const authLoginBtn = document.getElementById('authLoginBtn');
if (authLoginBtn) authLoginBtn.addEventListener('click', handleAuthLogin);
const authResetBtn = document.getElementById('authResetBtn');
if (authResetBtn) authResetBtn.addEventListener('click', handleAuthReset);
const authLogoutBtn = document.getElementById('authLogoutBtn');
if (authLogoutBtn) authLogoutBtn.addEventListener('click', handleAuthLogout);
const onboardingAddBtn = document.getElementById('onboardingAddBtn');
if (onboardingAddBtn) onboardingAddBtn.addEventListener('click', () => { dismissOnboarding(); beginAddLocationFlow('Onderweg'); });
const onboardingImportBtn = document.getElementById('onboardingImportBtn');
if (onboardingImportBtn) onboardingImportBtn.addEventListener('click', () => { dismissOnboarding(); document.getElementById('importFile').click(); });
const onboardingRouteBtn = document.getElementById('onboardingRouteBtn');
if (onboardingRouteBtn) onboardingRouteBtn.addEventListener('click', () => { dismissOnboarding(); document.getElementById('routeFile').click(); });
const onboardingSkipBtn = document.getElementById('onboardingSkipBtn');
if (onboardingSkipBtn) onboardingSkipBtn.addEventListener('click', dismissOnboarding);
applyPreparedRuntimeFromDraft();
syncAuthUi();
setControlShelfOpen(false);
updateOnboardingVisibility();
window.addEventListener('storage', (event) => {
 if (event && [getLastBackupAtKey(), getLastBackupSignatureKey(), getLastBackupDismissedSignatureKey()].includes(event.key)) {
  renderBackupReminder();
  return;
 }
 if (!event || ![ROUTE_STORAGE_KEY, ROUTE_HOME_STORAGE_KEY].includes(event.key)) return;
 routeHomeBase = loadRouteHomeBase();
 routeData = loadStoredRouteState();
 if (!restoreRouteIfPresent()) {
  routeData = null;
  recomputeRouteMaps();
 }
 updateHomeSetupButton();
 renderAll(false);
});
initMap();
applyRoutePlannerTabMode();
consumeRouteReturnStatus();
restoreLargeStoredLocations();
initLocalWorkspaceSync();
initLocalAuth();
renderTeamAdmin();
renderBackupReminder();
setTeamAdminStatus('<strong>Klaar voor beheer.</strong> Voeg vanaf laptop of webhosting-test een editor of viewer toe. Alles blijft lokaal in deze browser opgeslagen.');
applyRoleDrivenUi();
updateOnboardingVisibility();
