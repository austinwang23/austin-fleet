import React, { useState, ChangeEvent } from 'react';
import './App.css';
import { makeStyles } from '@mui/styles';
import { ReactComponent as CloseIcon } from './assets/icons/x.svg';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

interface CompanyObject {
  name: string;
  modeType: string;
  icon: string;
  website: string;
  description: string;
}

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  company: CompanyObject;
  sendBackendAPI: (name: string, website: string, description: string) => void;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#5218a4',
    },
  },
});

const CompanyModal = (props: ModalProps) => {
  const { open, handleClose, company, sendBackendAPI } = props;
  const classes = useStyles();

  // Website text input
  const [websiteText, setWebsiteText] = useState(company.website);
  const handleChangeWebsite = (e: ChangeEvent<HTMLInputElement>) => {
    setWebsiteText(e.target.value);
  };

  // Description text input
  const [descriptionText, setDescriptionText] = useState(company.description);
  const handleChangeDescription = (e: ChangeEvent<HTMLInputElement>) => {
    setDescriptionText(e.target.value);
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <div className={classes.modal}>
        <ThemeProvider theme={theme}>
          <div className={classes.header}>
            <h2>{company.name}</h2>
            <CloseIcon onClick={handleClose} />
          </div>
          <span>Website</span>
          <div className={classes.inputBar}>
            <input
              className={classes.input}
              type="text"
              value={websiteText}
              onChange={(e) => handleChangeWebsite(e)}
            />
          </div>
          <span>Description</span>
          <div className={classes.inputBar}>
            <input
              className={classes.input}
              type="text"
              value={descriptionText}
              onChange={(e) => handleChangeDescription(e)}
            />
          </div>
          <div className={classes.buttonRow}>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              style={{
                marginLeft: '12px',
              }}
              onClick={() =>
                sendBackendAPI(company.name, websiteText, descriptionText)
              }
            >
              Update
            </Button>
          </div>
        </ThemeProvider>
      </div>
    </Modal>
  );
};

const useStyles = makeStyles({
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  input: {
    border: 'none',
    flex: 1,
    outline: '0',
  },
  inputBar: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#5218a4',
    borderRadius: '6px',
    padding: '12px',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '18px',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    backgroundColor: '#FFFFFF',
    padding: '24px 36px',
    borderRadius: '12px',
  },
});

export default CompanyModal;
