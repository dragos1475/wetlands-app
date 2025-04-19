import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ text: "", category: "", lang: "ro" });

  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.category) {
      setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
      setNewQuestion({ text: "", category: "", lang: "ro" });
    }
  };

  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h4">Panou Administrator</Typography>
        <Button variant="outlined" onClick={() => navigate("/")}>Înapoi la aplicație</Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Editor conținut educațional</Typography>
        <TextField
          label="Conținut HTML/Markdown"
          placeholder="Scrie conținutul aici..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          multiline
          rows={8}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button variant="contained" sx={{ mt: 2 }}>Salvează</Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Adaugă întrebare de clasificare</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Text întrebare"
              value={newQuestion.text}
              onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Select
              fullWidth
              value={newQuestion.category}
              onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
              displayEmpty
            >
              <MenuItem value="" disabled>Categorie</MenuItem>
              <MenuItem value="Biologic">Biologic</MenuItem>
              <MenuItem value="Fizic">Fizic</MenuItem>
              <MenuItem value="Antropic">Antropic</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} md={3}>
            <Select
              fullWidth
              value={newQuestion.lang}
              onChange={(e) => setNewQuestion({ ...newQuestion, lang: e.target.value })}
            >
              <MenuItem value="ro">Română</MenuItem>
              <MenuItem value="en">English</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleAddQuestion}>
              Adaugă întrebare
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Typography variant="h6">Întrebări existente</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {questions.map((q) => (
            <Grid item xs={12} sm={6} md={4} key={q.id}>
              <Card>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    {q.text}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categorie: {q.category} | Limba: {q.lang}
                  </Typography>
                  <IconButton onClick={() => handleDeleteQuestion(q.id)} sx={{ mt: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
