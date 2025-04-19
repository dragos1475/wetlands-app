import { Box, Grid, Card, CardMedia, CardActionArea, CardContent, Typography, Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from "react";

const tiles = [
  {
    title: "Discover Wetlands",
    image: "/images/discover.jpg",
    content: "<h2>Discover Wetlands</h2><p>Wetlands are areas where water covers the soil or is present either at or near the surface of the soil.</p>"
  },
  {
    title: "Wetland Flora and Fauna",
    image: "/images/flora-fauna.jpg",
    content: "<h2>Wetland Flora and Fauna</h2><p>Wetlands support diverse plant and animal life adapted to wet conditions.</p>"
  },
  {
    title: "Services of Wetlands",
    image: "/images/services.jpg",
    content: "<h2>Services of Wetlands</h2><p>Wetlands provide water purification, flood control, carbon storage, and more.</p>"
  },
  {
    title: "Threats and Protection",
    image: "/images/protection.jpg",
    content: "<h2>Threats and Protection</h2><p>Wetlands face threats from development and pollution, but can be protected through conservation efforts.</p>"
  },
];

export default function WetlandsInfoTiles() {
  const [selectedTile, setSelectedTile] = useState(null);

  return (
    <Box sx={{ width: '100%', p: 2, bgcolor: '#f5f5f5' }}>
      <Typography variant="h5" align="center" gutterBottom>
        Learn More About Wetlands
      </Typography>
      <Grid container spacing={2}>
        {tiles.map((tile, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardActionArea onClick={() => setSelectedTile(tile)}>
                <CardMedia
                  component="img"
                  height="140"
                  image={tile.image}
                  alt={tile.title}
                />
                <CardContent>
                  <Typography variant="h6" align="center">{tile.title}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={!!selectedTile} onClose={() => setSelectedTile(null)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {selectedTile?.title}
          <IconButton onClick={() => setSelectedTile(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box dangerouslySetInnerHTML={{ __html: selectedTile?.content }} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}
