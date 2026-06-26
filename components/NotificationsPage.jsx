import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, FormControl, InputLabel, 
  Select, MenuItem, Card, CardContent, Badge, Grid, 
  Button, Pagination, CircularProgress, Alert 
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';

const API_BASE_URL = 'http://4.224.186.213/evaluation-service/notifications';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewed_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}?page=${page}&limit=${limit}`;
        if (type) {
          url += `&notification_type=${type}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        setNotifications(Array.isArray(data) ? data : data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [page, type, limit]);

  const handleMarkAsViewed = (id) => {
    if (!viewedIds.includes(id)) {
      const updatedViewed = [...viewedIds, id];
      setViewedIds(updatedViewed);
      localStorage.setItem('viewed_notifications', JSON.stringify(updatedViewed));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Notifications Center
        </Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="type-filter-label">Filter by Type</InputLabel>
          <Select
            labelId="type-filter-label"
            value={type}
            label="Filter by Type"
            onChange={(e) => { setType(e.target.value); setPage(1); }}
          >
            <MenuItem value=""><em>All Notifications</em></MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Failed to load notifications: {error}</Alert>}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress color="primary" />
        </Box>
      )}

      {!loading && notifications.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}

      {!loading && notifications.map((notif) => {
        const isNew = !viewedIds.includes(notif.id);
        return (
          <Card key={notif.id} sx={{ mb: 2, borderLeft: isNew ? '5px solid #1976d2' : '5px solid #b0bec5', backgroundColor: isNew ? '#f4f9ff' : '#ffffff' }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Badge color="error" variant="dot" invisible={!isNew}>
                    <NotificationsIcon color={isNew ? "primary" : "action"} />
                  </Badge>
                </Grid>
                <Grid item xs={12} sm>
                  <Box display="flex" gap={1} alignItems="center" mb={0.5}>
                    <Typography variant="subtitle2" px={1} py={0.2} borderRadius={1} bgcolor="#e0e0e0" fontSize="0.75rem">
                      {notif.notification_type || notif.type || 'General'}
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={isNew ? 'medium' : 'regular'}>
                    {notif.message || 'Notification content'}
                  </Typography>
                </Grid>
                <Grid item>
                  {isNew && (
                    <Button size="small" variant="outlined" startIcon={<VisibilityIcon />} onClick={() => handleMarkAsViewed(notif.id)}>
                      Mark Read
                    </Button>
                  )}
                </Grid>
                
              </Grid>
            </CardContent>
          </Card>
        );
      })}

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination count={5} page={page} onChange={(e, value) => setPage(value)} color="primary" />
      </Box>
    </Container>
  );
}
