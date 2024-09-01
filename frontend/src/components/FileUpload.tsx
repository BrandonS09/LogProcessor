import React, { useState, useEffect } from 'react';
import { Button, Input, TextField, IconButton, Box, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [jobIdPattern, setJobIdPattern] = useState<string>('');
  const [additionalPatterns, setAdditionalPatterns] = useState<string[]>(['']);

  useEffect(() => {
    fetch('http://localhost:8000/api/csrf-token/')
      .then(response => response.json())
      .then(data => setCsrfToken(data.csrfToken))
      .catch(error => console.error('Error fetching CSRF token:', error));
  }, []);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const onFileUpload = () => {
    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('jobIdPattern', jobIdPattern);
    formData.append('additionalPatterns', JSON.stringify(additionalPatterns));

    console.log('Job ID Pattern:', jobIdPattern);
    console.log('Additional Patterns:', additionalPatterns);

    fetch('http://localhost:8000/api/upload/', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'X-CSRFToken': csrfToken,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    })
    .catch(error => {
      console.error('Error:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const onFileDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'processed_file.txt');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
    }
  };

  const handleAdditionalPatternChange = (index: number, value: string) => {
    const newPatterns = [...additionalPatterns];
    newPatterns[index] = value;
    setAdditionalPatterns(newPatterns);
  };

  const addPatternField = () => {
    setAdditionalPatterns([...additionalPatterns, '']);
  };

  const removePatternField = (index: number) => {
    const newPatterns = additionalPatterns.filter((_, i) => i !== index);
    setAdditionalPatterns(newPatterns);
  };

  return (
    <div>
      <h2>Log Processor</h2>
      <Button
        variant="contained"
        component="label"
        startIcon={<CloudUploadIcon />}
      >
        {selectedFile ? selectedFile.name : 'Choose File'}
        <Input
          type="file"
          onChange={onFileChange}
          accept=".txt"
          hidden
        />
      </Button>
      <TextField
        label="Job ID Pattern"
        value={jobIdPattern}
        onChange={(e) => setJobIdPattern(e.target.value)}
        sx={{ mt: 2, width: '100%' }}
      />
      <Typography variant="h6" sx={{ mt: 2 }}>Additional Patterns</Typography>
      {additionalPatterns.map((pattern, index) => (
        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <TextField
            value={pattern}
            onChange={(e) => handleAdditionalPatternChange(index, e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <IconButton onClick={() => removePatternField(index)}>
            <RemoveCircleIcon />
          </IconButton>
        </Box>
      ))}
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        onClick={addPatternField}
        sx={{ mt: 1 }}
      >
        Add Pattern
      </Button>
      <Button
        variant="contained"
        onClick={onFileUpload}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Upload'}
      </Button>
      <Button
        variant="contained"
        onClick={onFileDownload}
        disabled={!downloadUrl}
        sx={{ mt: 2 }}
      >
        Download Processed File
      </Button>
    </div>
  );
};

export default FileUpload;
