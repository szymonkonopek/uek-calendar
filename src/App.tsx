import React, { useState } from 'react';
import {
  Container,
  TextField,
  List,
  ListItemText,
  Typography,
  Link,
  ListItemButton,
  AppBar,
  IconButton,
  Toolbar,
  Stack,
  Box,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Snackbar,
  Card,
} from '@mui/material';
import groupData from './group_folder.json';
import { TransitionProps } from '@mui/material/transitions';
import GitHubIcon from '@mui/icons-material/GitHub';

interface Group {
  name: string;
  id: string;
  parentCategory: string;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction='up' ref={ref} {...props} />;
});

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [open, setOpen] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);

  const groupList: Group[] = Object.entries(groupData).flatMap(
    ([parentCategory, groups]) =>
      groups.map((group) => ({
        name: group[0],
        id: group[1],
        parentCategory: parentCategory,
      }))
  );

  // Search function to filter group by name, ID, or parent category
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length === 0) {
      setFilteredGroups([]);
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = groupList
      .filter(
        (group) =>
          group.name.toLowerCase().includes(lowerCaseQuery) || // Match group name
          group.id.includes(lowerCaseQuery) || // Match group ID
          group.parentCategory.toLowerCase().includes(lowerCaseQuery) // Match parent category
      )
      .slice(0, 10); // Limit results to 10

    setFilteredGroups(filtered);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleGroupClick = (group: Group) => {
    setSelectedGroup(group);
    setOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `https://szymonkonopek.github.io/calendar/schedules/${selectedGroup?.id}.ics`
    );
    setIsToastOpen(true);
  };

  // Render the search bar and results
  return (
    <>
      <Container
        sx={{
          pt: 8,
          background: 'rgb(247, 247, 248)',
          pb: 10,
          position: 'relative',
        }}
      >
        <Stack
          sx={{
            flex: 1,
            background: 'rgb(33, 150, 243);',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            py: 1,
          }}
          direction={'row'}
          alignItems={'center'}
        >
          <Typography
            variant='subtitle1'
            sx={{
              color: 'white',
              ml: 3,
              fontWeight: 500,
            }}
          >
            UEK To Google Calendar
          </Typography>
          <Button
            sx={{ ml: 'auto', pr: 3, cursor: 'pointer' }}
            href='https://github.com/szymonkonopek'
          >
            <GitHubIcon />
          </Button>
        </Stack>

        <Typography variant='h4' gutterBottom>
          Find your Group
        </Typography>
        <TextField
          label='Search by Group Name, ID or Parent Category'
          variant='outlined'
          fullWidth
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Typography variant='subtitle2' color='textDisabled' sx={{ mt: 1 }}>
          Example: Informatyka Stosowana
        </Typography>

        <List sx={{ minHeight: '70vh' }}>
          {filteredGroups.map((group, index) => (
            <ListItemButton
              key={group.id}
              onClick={() => handleGroupClick(group)}
              sx={{
                background: index % 2 === 0 ? 'white' : '#e4e7eb',
              }}
            >
              <ListItemText
                primary={
                  <Stack direction={'row'} gap={0.5}>
                    <Typography variant='subtitle1' fontWeight={500}>
                      {group.name}
                    </Typography>
                    <Typography variant='subtitle1'>
                      {group.parentCategory}
                    </Typography>
                  </Stack>
                }
                secondary={`Group ID: ${group.id}`}
              />
            </ListItemButton>
          ))}
        </List>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogTitle>{'Your calendar URL'}</DialogTitle>
          <DialogContent>
            <Box
              component='span'
              sx={{
                display: 'block',

                background: '#e0e0e0',
                fontFamily: 'monospace',
                overflowWrap: 'break-word',
              }}
              py={3}
              px={1}
            >{`https://szymonkonopek.github.io/calendar/schedules/${selectedGroup?.id}.ics`}</Box>
            <DialogContentText
              id='alert-dialog-slide-description'
              sx={{ pt: 2 }}
            >
              {`Copy this link and paste it into your calendar app to subscribe to the calendar of ${selectedGroup?.name} (${selectedGroup?.parentCategory})`}
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
            <Button onClick={handleCopy}>Copy</Button>
          </DialogActions>
          <Snackbar
            open={isToastOpen}
            autoHideDuration={5000}
            onClose={() => setIsToastOpen(false)}
            message='Group URL copied to clipboard'
          />
        </Dialog>

        <Card sx={{ pb: 5 }}>
          <Typography variant='h5' sx={{ p: 2, mb: 3 }}>
            Google Calendar Tutorial
          </Typography>
          <Stack
            direction={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            spacing={4}
          >
            <Box
              component='img'
              sx={{
                width: 450,

                maxWidth: { xs: 250, md: 450 },
                ml: 2,
                border: '3px solid #e0e0e0',
              }}
              src='https://github.com/user-attachments/assets/3b18f157-4c9c-45ba-980c-3e02ca6e53ff'
            />
            <Box
              component='img'
              sx={{
                width: 450,

                maxWidth: { xs: 250, md: 450 },
                ml: 2,
                border: '3px solid #e0e0e0',
              }}
              src='https://github.com/user-attachments/assets/c19957be-5729-4c04-a532-4d4199ece90b'
            />
            <Box
              component='img'
              sx={{
                width: 450,

                maxWidth: { xs: 250, md: 450 },
                ml: 2,
                border: '3px solid #e0e0e0',
              }}
              src='https://github.com/user-attachments/assets/5381a365-7896-4d07-9acd-14b024859735'
            />
            <Box
              component='img'
              sx={{
                width: 450,

                maxWidth: { xs: 250, md: 450 },
                ml: 2,
                border: '3px solid #e0e0e0',
              }}
              src='https://github.com/user-attachments/assets/e158d11d-941b-492a-8aad-86945f53f3c4'
            />
          </Stack>
        </Card>
      </Container>
    </>
  );
};

export default App;
