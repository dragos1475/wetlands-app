import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Grid,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    Stack
  } from "@mui/material";
  import { useState, useEffect } from "react";
  
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
  
  export default function EditLocationForm({ open, location, onClose, onSave }) {
    const [formData, setFormData] = useState({ ...location });
  
    useEffect(() => {
      if (location) {
        setFormData({ ...location });
      }
    }, [location]);
  
    const handleChange = (field) => (e) => {
      setFormData({ ...formData, [field]: e.target.value });
    };
  
    const handleScoreChange = (qid) => (e) => {
      setFormData({
        ...formData,
        scores: {
          ...formData.scores,
          [qid]: e.target.value,
        },
      });
    };
  
    const handleSave = () => {
      onSave(formData);
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Editează locația</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="Numele locației"
              fullWidth
              value={formData.name}
              onChange={handleChange("name")}
            />
            <TextField
              label="Descriere"
              fullWidth
              multiline
              value={formData.desc || ""}
              onChange={handleChange("desc")}
            />
            <TextField
              label="Link video YouTube"
              fullWidth
              value={formData.youtubeLink || ""}
              onChange={handleChange("youtubeLink")}
            />
          </Stack>
  
          <Typography variant="h6" gutterBottom>Chestionar zonă umedă</Typography>
          {Object.entries(categories).map(([category, questionIds]) => (
            <Box key={category} sx={{ mb: 3 }}>
              <Typography variant="subtitle1">{category}</Typography>
              <Grid container spacing={2}>
                {questionIds.map((qid) => (
                  <Grid item xs={12} sm={6} key={qid}>
                    <Card>
                      <CardContent>
                        <Typography variant="body2" gutterBottom>
                          {questionText[qid]}
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel>Răspuns</InputLabel>
                          <Select
                            value={formData.scores?.[qid] || ""}
                            label="Răspuns"
                            onChange={handleScoreChange(qid)}
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
          <Button onClick={handleSave} variant="contained">Salvează</Button>
        </DialogActions>
      </Dialog>
    );
  }
  