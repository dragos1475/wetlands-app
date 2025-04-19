import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField,
    Typography, Grid, Card, CardContent, FormControl, InputLabel,
    Select, MenuItem, Button, Box, Stack
  } from "@mui/material";
  import MyLocationIcon from '@mui/icons-material/MyLocation';
  import { useState, useEffect, useRef } from "react";
  import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";
  
  const categories = {
    Biologic: ["q1", "q2"],
    Fizic: ["q3", "q4", "q5"],
    Antropic: ["q6", "q7", "q8", "q9"],
  };
  
  const questionText = {
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
  
  const redIcon = new L.Icon({
    iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
  
  function MiniMap({ lat, lng }) {
    const mapRef = useRef();
    const position = [parseFloat(lat), parseFloat(lng)];
  
    const DynamicMap = () => {
      const map = useMap();
      useEffect(() => {
        map.setView(position);
      }, [position, map]);
      return null;
    };
  
    return (
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={redIcon} />
        <DynamicMap />
      </MapContainer>
    );
  }
  
  export default function AddLocationForm({ open, onClose, onSave, initialLocation }) {
    const [locationName, setLocationName] = useState("");
    const [description, setDescription] = useState("");
    const [youtubeLink, setYoutubeLink] = useState("");
    const [photos, setPhotos] = useState([]);
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [scores, setScores] = useState({
      q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "", q8: "", q9: "",
    });
  
    useEffect(() => {
      if (open) {
        setLat(initialLocation?.lat ?? "");
        setLng(initialLocation?.lng ?? "");
      } else {
        setLocationName("");
        setDescription("");
        setYoutubeLink("");
        setPhotos([]);
        setLat("");
        setLng("");
        setScores({ q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "", q8: "", q9: "" });
      }
    }, [open, initialLocation]);
  
    const handleUseMyLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const newLat = pos.coords.latitude.toFixed(6);
          const newLng = pos.coords.longitude.toFixed(6);
          setLat(newLat);
          setLng(newLng);
        });
      } else {
        alert("Geolocalizarea nu este disponibilă.");
      }
    };
  
    const handleSubmit = () => {
      const answered = Object.values(scores).filter((s) => s !== "" && s !== "4");
      const scoreSum = answered.reduce((sum, val) => sum + parseInt(val), 0);
      const average = answered.length ? scoreSum / answered.length : null;
      let classification = "Necunoscută";
      if (average !== null) {
        if (average <= 1.5) classification = "Naturală";
        else if (average <= 2.5) classification = "Semi-naturală";
        else classification = "Puternic afectată";
      }
  
      onSave({
        name: locationName || "Nume necompletat",
        desc: description,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        photos,
        youtubeLink,
        classification,
        scores, // ✅ asta lipsea!
      });
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>

<DialogTitle>Adaugă o zonă umedă</DialogTitle>
<DialogContent>
  <Stack spacing={2} sx={{ mb: 2 }}>
    <Stack direction="row" spacing={2}>
      <TextField
        label="Latitudine"
        type="number"
        value={lat}
        onChange={(e) => setLat(e.target.value)}
        fullWidth
        inputProps={{ step: "any" }}
      />
      <TextField
        label="Longitudine"
        type="number"
        value={lng}
        onChange={(e) => setLng(e.target.value)}
        fullWidth
        inputProps={{ step: "any" }}
      />
    </Stack>
    <Button
      startIcon={<MyLocationIcon />}
      variant="outlined"
      fullWidth
      onClick={handleUseMyLocation}
    >
      Folosește locația mea
    </Button>
  </Stack>

  {lat && lng && (
    <Box sx={{ mb: 2, border: '1px solid #ccc', borderRadius: 1, overflow: 'hidden', height: 200 }}>
      <MiniMap lat={lat} lng={lng} />
    </Box>
  )}

  <TextField
    label="Numele locației"
    fullWidth
    value={locationName}
    onChange={(e) => setLocationName(e.target.value)}
    sx={{ mb: 2 }}
  />
  <TextField
    label="Descriere (opțional)"
    fullWidth
    multiline
    rows={2}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    sx={{ mb: 2 }}
  />
  <TextField
    label="Link video YouTube (opțional)"
    fullWidth
    value={youtubeLink}
    onChange={(e) => setYoutubeLink(e.target.value)}
    sx={{ mb: 2 }}
  />

  <Button variant="outlined" component="label" sx={{ mb: 2 }}>
    Încarcă fotografii
    <input
      type="file"
      accept="image/*"
      multiple
      hidden
      onChange={(e) => {
        const files = Array.from(e.target.files).map((file) =>
          URL.createObjectURL(file)
        );
        setPhotos(files);
      }}
    />
  </Button>

  <Grid container spacing={1} sx={{ mb: 2 }}>
    {photos.map((src, index) => (
      <Grid item key={index} xs={4}>
        <Box sx={{ position: "relative" }}>
          <img
            src={src}
            alt={`Preview ${index}`}
            style={{ width: "100%", borderRadius: 4 }}
          />
        </Box>
      </Grid>
    ))}
  </Grid>

  <Typography variant="h6" gutterBottom>Chestionar zonă umedă</Typography>
  {Object.entries(categories).map(([category, questionIds]) => (
    <Box key={category} sx={{ mb: 3 }}>
      <Typography variant="subtitle1">{category}</Typography>
      <Grid container spacing={2}>
        {questionIds.map((qid) => (
          <Grid item xs={12} sm={6} key={qid}>
            <Card>
              <CardContent>
                <Typography variant="body2" gutterBottom sx={{ mb: 1 }}>
                  {questionText[qid]}
                </Typography>
                <FormControl fullWidth>
                  <InputLabel>Răspuns</InputLabel>
                  <Select
                    value={scores[qid]}
                    label="Răspuns"
                    onChange={(e) =>
                      setScores({ ...scores, [qid]: e.target.value })
                    }
                  >
                    <MenuItem value="1">Foarte bun</MenuItem>
                    <MenuItem value="2">Bun</MenuItem>
                    <MenuItem value="3">Slab</MenuItem>
                    <MenuItem value="4">Nu se poate observa</MenuItem>
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  ))}
</DialogContent>
<DialogActions>
  <Button onClick={onClose}>Anulează</Button>
  <Button onClick={handleSubmit} variant="contained">
    Salvează locația
  </Button>
</DialogActions>
</Dialog>
);
}
