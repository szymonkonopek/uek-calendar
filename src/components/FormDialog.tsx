import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Snackbar,
} from '@mui/material';

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  formData: {
    formFullName: string;
    formEmail: string;
    formIdentifier: string;
    formAdditionalInfo: string;
  };
  onDataChange: (field: string, value: string) => void;
}

const FormDialog: React.FC<FormDialogProps> = (props) => {
  const { open, onClose, formData, onDataChange } = props;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendForm = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!formData.formFullName) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '46ff28a6-34a4-46a3-a16d-e3d3241f98ed',
          subject: 'UEK Calendar - Calendar request',
          from_name: 'UEK Calendar',

          fullName: formData.formFullName,
          email: formData.formEmail,
          identifier: formData.formIdentifier,
          additionalInfo: formData.formAdditionalInfo,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        onClose();
        onDataChange('formFullName', '');
        onDataChange('formEmail', '');
        onDataChange('formIdentifier', '');
        onDataChange('formAdditionalInfo', '');
      } else {
        setError('Failed to send form. Please try again later.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Calendar request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ze względu na bezpieczeństwo i prywatność nie dodajemy nikogo bez
            jego zgody. Jeśli wykładasz na uczelni, zostaw swoje dane - po
            weryfikacji dodamy Cię do systemu. Masz inne pytania? Napisz do nas.
          </DialogContentText>

          <TextField
            autoFocus
            margin='dense'
            label='Full Name / Imię i Nazwisko'
            fullWidth
            required
            variant='standard'
            value={formData.formFullName}
            onChange={(e) => onDataChange('formFullName', e.target.value)}
          />

          <TextField
            margin='dense'
            label='Email Address / Adres Email'
            type='email'
            fullWidth
            variant='standard'
            value={formData.formEmail}
            onChange={(e) => onDataChange('formEmail', e.target.value)}
          />

          <TextField
            margin='dense'
            label='Group Identifier from Schedule / Identyfikator z planu zajęć'
            fullWidth
            variant='standard'
            value={formData.formIdentifier}
            onChange={(e) => onDataChange('formIdentifier', e.target.value)}
          />

          <TextField
            margin='dense'
            label='Additional Information / Dodatkowe informacje'
            fullWidth
            multiline
            rows={4}
            variant='standard'
            value={formData.formAdditionalInfo}
            onChange={(e) => onDataChange('formAdditionalInfo', e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSendForm} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={success}
        autoHideDuration={5000}
        onClose={() => setSuccess(false)}
        message='Form sent successfully. Thank you!'
      />

      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        message={error}
      />
    </>
  );
};

export default FormDialog;
