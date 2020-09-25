import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import findIndex from 'lodash/findIndex';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import isUndefined from 'lodash/isUndefined';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
const useStyles = makeStyles((theme) => ({
  App: {
    flexGrow: 1,
    padding: 10,
    backgroundColor: '#f8f8ff'
  },
  root: {
    '& > *': {
      // margin: theme.spacing(1),
      // width: '25ch',
      width: '85%'
    },
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  btn: {
    width: 'auto',
    marginLeft: 0,
    height: '55px'
  },
  team: {
    width: 300,
    padding: 5,
    marginLeft: 10
  },
  list: {
    width: '100%',
    // maxWidth: 360,
    marginTop: 10,
    backgroundColor: '#5baca9',
    '&:empty': {
      display: 'none'
    }
  },
  btn2: {
    width: '100%',
    marginTop: 5,
    padding: 10
  },
  player: {
    padding: '10px 15px',
    border: '1px solid #f2f2f2',
    borderRadius: 8,
    marginRight: 10,
    background: '#5baca8',
    color: 'white',
    display: 'inline-block'
  }
}));
function App() {
  const classes = useStyles();
  const [playerName, setPalyerName] = useState('');
  const [team, setTeam] = useState([]);
  const [bulkTeamData, setBulkTeamData] = useState([]);
  const handleClick = () => {
    let tempData = JSON.parse(JSON.stringify(team));
    tempData.push(playerName)
    setTeam(tempData);
    setPalyerName('');
  };

  const deletePalyer = (e, name, idx) => {
    const tempData = cloneDeep(team);
    const removeIdx = findIndex(tempData, (n) => n === name);
    tempData.splice(removeIdx, 1);
    setTeam(tempData);
    setBulkTeamData([]);
  }

  const generateTeamHandler = (team) => {
    const data = cloneDeep(team);
    let getTeam = [];
    map(team, (p, idx) => {
      const c = `${p}(Captin)`
      const cloneTeam = Object.assign([], data);
      const sliceTeam = cloneTeam.filter(i => i != p);
      sliceTeam.map((team, subIdx) => {
        let vc = `${sliceTeam[subIdx]}(Vice Captin)`;
        let filterTeam = sliceTeam.filter(i => i != team);
        console.log(filterTeam);
        const temp = [vc, ...filterTeam]
        console.log(temp);
        let mergeTeam = [c, ...temp];
        getTeam.push(mergeTeam);
      })
    })
    setBulkTeamData(getTeam);
    localStorage.setItem('teamData', JSON.stringify(team));
  }
  const getIdx = (item, type) => {
    let _index = findIndex(item, (n) => {
      let isDataHaveType = n.indexOf(type);
      if (isDataHaveType !== -1) {
        return true;
      }
    })
    return item[_index];
  }

  useEffect(() => {
    const getData = JSON.parse(localStorage.getItem('teamData'));
    if (!isUndefined(getData) && !isEmpty(getData)) {
      setTeam(getData);
      generateTeamHandler(getData);
    }

  }, [])

  return (
    <div className={classes.App}>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={4}>
          <Paper className={classes.paper}> <form className={classes.root} noValidate autoComplete="off">
            <TextField id="outlined-basic" value={playerName} label="Player Name" variant="outlined" onChange={(e) => setPalyerName(e.currentTarget.value)} />
            <Button variant="contained" color="primary" type="submit" size="small" disabled={playerName === ''} className={classes.btn} onClick={handleClick}>Add</Button>
          </form>
            {team.length === 11 ? <Button variant="contained" size="lg" color="primary" className={classes.btn2} onClick={(e) => { generateTeamHandler(team) }}>Generate Team</Button> : null}
            <List className={classes.list}>
              {team.length > 0 && team.map((value, idx) => {
                const labelId = `checkbox-list-label-${value}`;
                return (
                  <ListItem key={value} role={undefined} dense button style={{ 'color': 'white' }}>
                    <ListItemText id={labelId} primary={`${value}`} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="comments" onClick={(e) => deletePalyer(e, value, idx)} style={{ 'color': 'white' }}>
                        <HighlightOffIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                )
              })}
            </List></Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
            <Paper className={classes.paper}>
              {!isEmpty(bulkTeamData) ? map(bulkTeamData, (item, idx) => (
                <div>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-label="Expand"
                      aria-controls="additional-actions2-content"
                      id="additional-actions2-header"
                      key={`${item}_${idx}`}
                    >

                      <FormControlLabel
                        aria-label="Acknowledge"
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => event.stopPropagation()}
                        control={<Checkbox />}
                        label={`team${idx}: ${getIdx(item, '(Captin)')} && ${getIdx(item, '(Vice Captin)')}`}
                      />
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="textSecondary">
                        {map(item, (n, nIdx) => (
                          <span className={classes.player}>{n}</span>
                        ))}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                </div>)) : null}
            </Paper>
          </Grid>
          
      </Grid>

    </div>
  );
}

export default App;
