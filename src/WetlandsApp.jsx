import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import AddLocationForm from "./AddLocationForm";
import LocationDetailsDialog from "./LocationDetailsDialog";
import { useAuth } from "./AuthContext";

const redIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const tileItems = [
  { label: "Discover Wetlands", image: "/images/tile1.jpg", content: "<p>Informatii despre zonele umede.</p>" },
  { label: "Wetland Flora and Fauna", image: "/images/tile2.jpg", content: "<p>Flora și fauna din zonele umede.</p>" },
  { label: "Services of Wetlands", image: "/images/tile3.jpg", content: "<p>Serviciile oferite de zonele umede.</p>" },
  { label: "Climate Benefits", image: "/images/tile4.jpg", content: "<p>Beneficiile climatice ale zonelor umede.</p>" }
];

export default function WetlandsApp() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [pendingLocation, setPendingLocation] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openTile, setOpenTile] = useState(null);

  const handleMapClick = (latlng) => {
    setPendingLocation(latlng);
    setFormOpen(true);
  };

  const handleSave = (newMarker) => {
    setMarkers([...markers, { ...newMarker, id: Date.now() }]);
    setFormOpen(false);
  };

  const MapClickHandler = () => {
    useMapEvents({ click: (e) => handleMapClick(e.latlng) });
    return null;
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="fixed">
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Wetlands App
          </Typography>

          {tileItems.map((item, index) => (
            <Tooltip key={index} title={item.label}>
              <IconButton onClick={() => setOpenTile(item)} sx={{ p: 0.5 }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.label}
                  sx={{ width: 36, height: 36, borderRadius: 1 }}
                />
              </IconButton>
            </Tooltip>
          ))}

          {!isMobile && (
            <>
              <Button color="inherit" startIcon={<AddLocationAltIcon />} onClick={() => setFormOpen(true)}>
                Adaugă locație
              </Button>
              {user?.role === "admin" && (
                <Button color="inherit" startIcon={<AdminPanelSettingsIcon />} onClick={() => navigate("/admin")}>Administrator</Button>
              )}
            </>
          )}

          {user && (
            <>
              <Tooltip title={user.email}>
                <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                  <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}>
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem disabled>{user.email}</MenuItem>
                {isMobile && <MenuItem onClick={() => setFormOpen(true)}>Adaugă locație</MenuItem>}
                {isMobile && user?.role === "admin" && (
                  <MenuItem onClick={() => navigate("/admin")}>Administrator</MenuItem>
                )}
                <MenuItem onClick={() => { logout(); handleMenuClose(); }}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

      <Box sx={{ position: "relative", height: "100vh", width: "100%" }}>
        <MapContainer center={[45.43, 28.04]} zoom={8} style={{ height: "100%", width: "100%" }}>
          <MapClickHandler />
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((m) => (
            <Marker key={m.id} position={[m.lat, m.lng]} icon={redIcon} eventHandlers={{ click: () => setSelectedLocation(m) }} />
          ))}
        </MapContainer>
      </Box>

      <AddLocationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        initialLocation={pendingLocation}
      />

      <LocationDetailsDialog
        open={!!selectedLocation}
        location={selectedLocation}
        onClose={() => setSelectedLocation(null)}
        isAdmin={user?.role === "admin"}
        onDelete={(id) => setMarkers(markers.filter((m) => m.id !== id))}
        onEdit={(updated) => {
          setMarkers(markers.map((m) => m.id === updated.id ? updated : m));
          setSelectedLocation(null);
        }}
      />

      <Dialog open={!!openTile} onClose={() => setOpenTile(null)} maxWidth="md" fullWidth>
        <DialogTitle>{openTile?.label}</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: openTile?.content }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTile(null)}>Închide</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
