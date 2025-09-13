import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Verified as VerifiedIcon,
  Security as SecurityIcon,
  QrCode as QrCodeIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { DigitalTouristID } from '../types';

const DigitalIDManagement: React.FC = () => {
  const [digitalIDs, setDigitalIDs] = useState<DigitalTouristID[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newID, setNewID] = useState({
    visaNumber: '',
    aadharNumber: '',
    entryPoint: '',
    idType: 'visa' as 'visa' | 'aadhar',
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockIDs: DigitalTouristID[] = [
      {
        id: 'did_001',
        touristId: 'tourist_001',
        blockchainHash: '0x1a2b3c4d5e6f7890abcdef1234567890',
        visaNumber: 'VISA123456789',
        issueDate: new Date('2024-01-15'),
        expiryDate: new Date('2024-07-15'),
        kycStatus: 'verified',
        entryPoint: 'Delhi Airport',
        isActive: true,
      },
      {
        id: 'did_002',
        touristId: 'tourist_002',
        blockchainHash: '0x9876543210fedcba0987654321',
        aadharNumber: '1234-5678-9012',
        issueDate: new Date('2024-02-01'),
        expiryDate: new Date('2024-08-01'),
        kycStatus: 'pending',
        entryPoint: 'Mumbai Airport',
        isActive: true,
      },
    ];
    setDigitalIDs(mockIDs);
  }, []);

  const handleCreateID = () => {
    const newDigitalID: DigitalTouristID = {
      id: `did_${Date.now()}`,
      touristId: `tourist_${Date.now()}`,
      blockchainHash: `0x${Math.random().toString(16).substr(2, 40)}`,
      visaNumber: newID.idType === 'visa' ? newID.visaNumber : undefined,
      aadharNumber: newID.idType === 'aadhar' ? newID.aadharNumber : undefined,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months
      kycStatus: 'pending',
      entryPoint: newID.entryPoint,
      isActive: true,
    };

    setDigitalIDs([...digitalIDs, newDigitalID]);
    setOpenDialog(false);
    setNewID({ visaNumber: '', aadharNumber: '', entryPoint: '', idType: 'visa' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Digital Tourist ID Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Generate New ID
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SecurityIcon color="primary" />
              <Box>
                <Typography variant="h6">{digitalIDs.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Digital IDs
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <VerifiedIcon color="success" />
              <Box>
                <Typography variant="h6">
                  {digitalIDs.filter(id => id.kycStatus === 'verified').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Verified IDs
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <QrCodeIcon color="info" />
              <Box>
                <Typography variant="h6">
                  {digitalIDs.filter(id => id.isActive).length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active IDs
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Digital IDs Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Digital Tourist IDs
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Identification</TableCell>
                  <TableCell>Entry Point</TableCell>
                  <TableCell>Issue Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Blockchain Hash</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {digitalIDs.map((id) => (
                  <TableRow key={id.id}>
                    <TableCell>{id.id}</TableCell>
                    <TableCell>
                      {id.visaNumber ? `Visa: ${id.visaNumber}` : `Aadhar: ${id.aadharNumber}`}
                    </TableCell>
                    <TableCell>{id.entryPoint}</TableCell>
                    <TableCell>{id.issueDate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={id.kycStatus}
                        color={getStatusColor(id.kycStatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {id.blockchainHash.substring(0, 20)}...
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button size="small" startIcon={<DownloadIcon />}>
                        Export
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create New ID Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Generate New Digital Tourist ID</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>ID Type</InputLabel>
              <Select
                value={newID.idType}
                onChange={(e) => setNewID({ ...newID, idType: e.target.value as 'visa' | 'aadhar' })}
              >
                <MenuItem value="visa">Visa Number</MenuItem>
                <MenuItem value="aadhar">Aadhar Number</MenuItem>
              </Select>
            </FormControl>

            {newID.idType === 'visa' ? (
              <TextField
                fullWidth
                label="Visa Number"
                value={newID.visaNumber}
                onChange={(e) => setNewID({ ...newID, visaNumber: e.target.value })}
                placeholder="Enter visa number"
              />
            ) : (
              <TextField
                fullWidth
                label="Aadhar Number"
                value={newID.aadharNumber}
                onChange={(e) => setNewID({ ...newID, aadharNumber: e.target.value })}
                placeholder="Enter aadhar number"
              />
            )}

            <TextField
              fullWidth
              label="Entry Point"
              value={newID.entryPoint}
              onChange={(e) => setNewID({ ...newID, entryPoint: e.target.value })}
              placeholder="e.g., Delhi Airport, Mumbai Port"
            />

            <Alert severity="info">
              Digital ID will be generated on blockchain with tamper-proof security and time-bound validity.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateID}
            disabled={!newID.entryPoint || (!newID.visaNumber && !newID.aadharNumber)}
          >
            Generate ID
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DigitalIDManagement;
