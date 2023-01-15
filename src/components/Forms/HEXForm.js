import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { Form, FormSpy } from 'react-final-form';

import Summary from './HEXForms/Summary';
import EngineFields from './EngineFields';
import Dimensions from './HEXForms/Dimensions';
import DimensionsTrack from './HEXForms/DimensionsTrack';
import DimensionsQC from './HEXForms/DimensionsQC';
import Swivel from './HEXForms/Swivel';
import TravelHX from './HEXForms/TravelHX';
import AddDrawings from './HEXForms/Drawings/AddDrawings';
import StabilityCOG from './HEXForms/StabilityCOG';
import TransPortation from './HEXForms/TransPortation';
import TAResult from './HEXForms/TAResult';

import { updateHEX, createHEX, deleteHEX, createHEXChange } from '../../actions/HEXs';
import { Grid, Button, Stack, Snackbar, Box, Tab, Tabs, Typography } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import useTabs from '../../hooks/useTabs';

// import {Tab, Tabs,  } from 'react-bootstrap'
import SpecSheet from '../../pages/KRTA/previews/SpecSheet';
import CompareSheet from '../../pages/KRTA//previews/CompareSheet';
import { useLocation } from 'react-router-dom';

import HEXCalc from './HEXCalc';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const HEXForm = (HEXData) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  const snackbarClick = () => {
    setSnackbarOpen(true);
  };
  const snackbarClose = (e, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const { id } = useParams();

  const dispatch = useDispatch();
  let navigate = useNavigate();

  let location = useLocation();

  const onSubmit = (values) => {
    if (location.pathname.includes('addChange')) {
      values.origin = values._id;
      delete values._id;

      return createChange(values);
    } else {
      if (!id) {
        return create(values);
      }
      return update(id, values);
    }
  };

  const create = async (values) => {
    await dispatch(createHEX(values))
      .then((response) => {
        console.log(response);
        navigate('/');
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  const createChange = async (values) => {
    await dispatch(createHEXChange(values))
      .then((response) => {
        console.log(response);
        navigate('/');
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  const update = async (id, values) => {
    await dispatch(updateHEX(id, values))
      .then((response) => {
        console.log(response);
        // navigate("/");
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  };

  const remove = async () => {
    if (window.confirm('이 모델을 삭제하시겠습니까')) {
      await dispatch(deleteHEX(id))
        .then((response) => {
          console.log(response);
          navigate('/');
        })
        .catch((e) => {
          console.log(e.response.data);
        });
    }
  };

  return (
    <div>
      <Form
        onSubmit={onSubmit}
        initialValues={HEXData.HEXData || ''}
        render={({ handleSubmit, form, submitting, pristine, values }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                {HEXCalc(values)}
                <Summary {...values} />

                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs">
                      <Tab label="외관 제원" {...a11yProps(0)} />
                      <Tab label="주행 선회" {...a11yProps(1)} />
                      <Tab label="외관도" {...a11yProps(2)} />
                      <Tab label="안정도" {...a11yProps(3)} />
                      <Tab label="엔진 사양" {...a11yProps(4)} />
                      <Tab label="분해 수송" {...a11yProps(5)} />
                      <Tab label="승인서" {...a11yProps(6)} />
                    </Tabs>
                  </Box>
                  <TabPanel value={tabValue} index={0}>
                    <Dimensions values={values} />
                    <DimensionsTrack />
                    <DimensionsQC />
                  </TabPanel>
                  <TabPanel value={tabValue} index={1}>
                    <Swivel />
                    <TravelHX />
                  </TabPanel>
                  <TabPanel value={tabValue} index={2}>
                    <AddDrawings />
                  </TabPanel>
                  <TabPanel value={tabValue} index={3}>
                    <StabilityCOG {...values} />{' '}
                  </TabPanel>
                  <TabPanel value={tabValue} index={4}>
                    <EngineFields {...values} />
                  </TabPanel>
                  <TabPanel value={tabValue} index={5}>
                    {' '}
                    <TransPortation {...values} />
                  </TabPanel>
                  <TabPanel value={tabValue} index={6}>
                    <TAResult />
                  </TabPanel>
                </Box>
               

                <Stack direction="row" spacing={3} alignItems="flex-end" justifyContent="space-between">
                  <Button variant="outlined" startIcon={<SaveIcon />} type="submit" onClick={snackbarClick}>
                    저장
                  </Button>
                  <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    message="This File was updated successfully"
                    onClose={snackbarClose}
                  />

                  <Button variant="contained" startIcon={<DeleteIcon />} onClick={remove}>
                    삭제
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={5}>
                {values.ChangeModel && <CompareSheet values={values} />}
                <SpecSheet values={values} />

                {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}
              </Grid>
            </Grid>
          </form>
        )}
      />
    </div>
  );
};

export default HEXForm;
