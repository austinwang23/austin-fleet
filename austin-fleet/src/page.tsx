import React, { useState, ChangeEvent } from 'react';
import './App.css';
import { makeStyles } from '@mui/styles';
import { ReactComponent as SearchIcon } from './assets/icons/search.svg';
import CompanyModal from './modal';
import axios from 'axios';

interface CompanyObject {
  name: string;
  modeType: string;
  icon: string;
  website: string;
  description: string;
}

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// Axios POST config
const config = {
  headers: {
    'content-type': 'application/json',
  },
};

const Page = () => {
  const classes = useStyles();

  // Untouched JSON from backend
  const [originalJSON, setOriginalJSON] = useState<CompanyObject[]>([]);

  // Search bar text
  const [search, setSearch] = useState('');

  // Selected company for modal
  const [currentCompany, setCurrentCompany] = useState<
    CompanyObject | undefined
  >(undefined);

  // State for modal
  const [open, setOpen] = React.useState(false);

  // Company data to be displayed in a grid
  let data: CompanyObject[] = [];

  // Closing and Opening Modal
  const handleOpen = (company: CompanyObject) => {
    setCurrentCompany(company);
    setOpen(true);
  };
  const handleClose = () => {
    setCurrentCompany(undefined);
    setOpen(false);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Updating company info in backend using POST
  const sendBackendAPI = async (
    name: string,
    website: string,
    description: string
  ) => {
    const toUpdate = {
      name: name,
      website: website,
      description: description,
    };
    const response = await axios.post('/update_data', toUpdate, config);
    if (response.status !== 200) {
      throw Error('POST request failed with code ' + response.status);
    }
    const changed: CompanyObject[] = response.data.resp;
    let updatedJSON: CompanyObject[] = originalJSON;
    changed.forEach((company) => {
      const isChanged = (oldCompany: CompanyObject) => {
        return (
          oldCompany.name === company.name &&
          oldCompany.modeType === company.modeType
        );
      };
      const index = updatedJSON.findIndex(isChanged);
      updatedJSON[index] = company;
    });
    setOriginalJSON(updatedJSON);
  };

  // Getting company info from backend using fetch
  const callBackendAPI = async () => {
    const response = await fetch('/get_data');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    setOriginalJSON(body.data);
  };

  // Filter through company data
  if (originalJSON) {
    const array: CompanyObject[] = originalJSON;
    const map = new Map();

    array.forEach((company) => {
      if (map.has(company.name)) {
        const oldCompany: CompanyObject = map.get(company.name);
        const filteredCompany: CompanyObject = {
          ...oldCompany,
          modeType:
            oldCompany.modeType +
            ', ' +
            capitalizeFirstLetter(company.modeType),
        };
        map.set(company.name, filteredCompany);
      } else {
        const filteredCompany: CompanyObject = {
          ...company,
          modeType: capitalizeFirstLetter(company.modeType),
        };
        map.set(company.name, filteredCompany);
      }
    });
    var mapArray = Array.from(map.values());
    data = mapArray;
  }

  // Only call backend on first load
  if (data.length === 0) {
    callBackendAPI();
  }

  return (
    <div className={classes.root}>
      {currentCompany && (
        <CompanyModal
          open={open}
          handleClose={handleClose}
          company={currentCompany}
          sendBackendAPI={sendBackendAPI}
        />
      )}
      <h1>Available Services</h1>
      <div className={classes.searchBar}>
        <input
          className={classes.input}
          type="text"
          value={search}
          onChange={(e) => handleSearch(e)}
          placeholder="Search for a specific service"
        />
        <SearchIcon />
      </div>
      <div className={classes.companiesWrapper}>
        {data.map((company) => {
          if (
            search.length === 0 ||
            company.name.toLowerCase().includes(search.toLowerCase()) ||
            company.modeType.toLowerCase().includes(search.toLowerCase())
          ) {
            return (
              <div
                className={classes.companyBox}
                onClick={() => handleOpen(company)}
                key={company.name}
              >
                <img
                  className={classes.companyLogo}
                  src={company.icon}
                  alt={`${company.name}'s Logo`}
                />
                <h4 className={classes.h4}>{company.name}</h4>
                <p className={classes.p}>{company.modeType}</p>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

const useStyles = makeStyles({
  companiesWrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '10px',
    marginTop: '24px',
  },
  companyBox: {
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#F5F5F5',
    borderRadius: '12px',
    padding: '12px',
    '&:hover': {
      backgroundColor: '#F5F5F5',
    },
  },
  companyLogo: {
    height: '48px',
    width: '48px',
    borderRadius: '6px',
  },
  h4: {
    marginBottom: '8px',
    marginTop: '12px',
  },
  p: {
    margin: '0',
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
  },
  input: {
    border: 'none',
    backgroundColor: '#EEEEEE',
    flex: 1,
    outline: '0',
  },
  searchBar: {
    backgroundColor: '#EEEEEE',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#DCDCDC',
    borderRadius: '6px',
    padding: '12px',
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  root: {
    background: '#FFF',
    padding: '0 30px',
  },
});

export default Page;
