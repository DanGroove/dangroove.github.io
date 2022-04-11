import { createStyles, Group, Switch, useMantineColorScheme } from '@mantine/core';
import React from 'react';
import { MoonStars, Sun } from 'tabler-icons-react';

const useStyles = createStyles(theme => ({
  root: {
    position: 'relative',
    '& *': {
      cursor: 'pointer',
    },
  },

  icon: {
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
    top: 3,
  },

  iconLight: {
    left: 4,
    color: theme.white,
  },

  iconDark: {
    right: 4,
    color: theme.colors.gray[6],
  },
}));

function SwitchToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { classes, cx } = useStyles();

  // Update browser meta theme-color on button toggle
  const themeColor = document.querySelector("meta[name='theme-color']");
  themeColor?.setAttribute('content', colorScheme === 'dark' ? '#B13535' : '#E85E59');
  // themeColor?.setAttribute('content', colorScheme === 'dark' ? '#1A1B1E' : '#FFFFFF');

  return (
    <Group position='center' my={30}>
      <div className={classes.root}>
        <Sun className={cx(classes.icon, classes.iconLight)} size={18} />
        <MoonStars className={cx(classes.icon, classes.iconDark)} size={18} />
        <Switch checked={colorScheme === 'dark'} onChange={() => toggleColorScheme()} size='md' />
      </div>
    </Group>
  );
}

export default SwitchToggle;
