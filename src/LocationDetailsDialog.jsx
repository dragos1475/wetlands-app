import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    Grid,
    Avatar,
    Tooltip,
    IconButton,
    Menu,
    MenuItem
  } from "@mui/material";
  import { MapContainer, TileLayer, Marker } from "react-leaflet";
  import L from "leaflet";
  import "leaflet/dist/leaflet.css";
  import Lightbox from "yet-another-react-lightbox";
  import Download from "yet-another-react-lightbox/plugins/download";
  import "yet-another-react-lightbox/styles.css";
  import { useState } from "react";
  import { useAuth } from "./AuthContext";
  import EditLocationForm from "./EditLocationForm";
  
  const redIcon = new L.Icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  
  const responseLabels = {
    "1": "Foarte bun",
    "2": "Bun",
    "3": "Slab",
    "4": "Nu se poate observa"
  };
  
  const questions = {
    q1: "Cât de variată este vegetația observată în zona umedă?",
    q2: "Câtă faună observați în zona umedă?",
    q3: "Curgerea râului este liberă, fără obstacole?",
    q4: "Care este starea suprafeței zonei umede?",
    q5: "Care este starea vizuală a apei?",
    q6: "Există semne vizibile ale surselor de poluare?",
    q7: "Este zona umedă folosită vizibil de oameni?",
    q8: "Există semne vizibile ale utilizării comerciale?",
    q9: "Există semne vizibile ale activităților de restaurare?",
  };
  
  export default function LocationDetailsDialog({ open, onClose, location, isAdmin, onDelete, onEdit }) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
  
    if (!location || isNaN(parseFloat(location.lat)) || isNaN(parseFloat(location.lng))) {
      return null;
    }
  
    const lat = parseFloat(location.lat);
    const lng = parseFloat(location.lng);
  
    const openLightbox = (index) => {
      setLightboxIndex(index);
      setLightboxOpen(true);
    };
  
    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleMenuClose = () => {
      setAnchorEl(null);
    };
  
    const handleEdit = () => {
      setEditOpen(true);
    };
  
    const handleSaveEdit = (updatedLocation) => {
      onEdit(updatedLocation);
      setEditOpen(false);
    };
  
    return (
      <>
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle>
            Detalii locație
            {user && (
              <Tooltip title={user.email}>
                <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            )}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>{user?.email}</MenuItem>
              <MenuItem onClick={() => { logout(); handleMenuClose(); }}>
                Logout
              </MenuItem>
            </Menu>
          </DialogTitle>
          <DialogContent>
            <Typography variant="h6">{location.name}</Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {location.desc || "Fără descriere"}
            </Typography>
            <Typography variant="subtitle2">Clasificare: {location.classification}</Typography>
  
            <Box sx={{ my: 2, height: 200, borderRadius: 1, overflow: 'hidden' }}>
              <MapContainer
                center={[lat, lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                zoomControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[lat, lng]} icon={redIcon} />
              </MapContainer>
            </Box>
  
            {location.photos?.length > 0 && (
              <Grid container spacing={2} sx={{ mb: 2 }}>
                {location.photos.map((src, i) => (
                  <Grid item xs={4} key={i}>
                    <img
                      src={src}
                      alt={`foto-${i}`}
                      style={{ width: "100%", borderRadius: 4, cursor: "pointer", objectFit: "cover", height: 80 }}
                      onClick={() => openLightbox(i)}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
  
            {location.youtubeLink && (
              <Box sx={{ mb: 2 }}>
                <iframe
                  width="100%"
                  height="180"
                  src={location.youtubeLink.replace("watch?v=", "embed/")}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="YouTube Video"
                ></iframe>
              </Box>
            )}
  
            {location.scores && (
              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Răspunsuri chestionar:</Typography>
                <ul style={{ paddingLeft: 16 }}>
                  {Object.entries(location.scores).map(([key, val]) => (
                    <li key={key}>
                      <Typography variant="body2">
                        {questions[key]} — <strong>{responseLabels[val] || val}</strong>
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
  
            <Lightbox
              open={lightboxOpen}
              close={() => setLightboxOpen(false)}
              slides={location.photos?.map((src) => ({ src })) || []}
              index={lightboxIndex}
              plugins={[Download]}
            />
          </DialogContent>
          <DialogActions>
            {isAdmin && (
              <>
                <Button color="error" onClick={() => onDelete(location.id)}>Șterge</Button>
                <Button onClick={handleEdit}>Editează</Button>
              </>
            )}
            <Button onClick={onClose} variant="contained"> Închide </Button>
          </DialogActions>
        </Dialog>
  
        <EditLocationForm
          open={editOpen}
          location={location}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveEdit}
        />
      </>
    );
  }
  