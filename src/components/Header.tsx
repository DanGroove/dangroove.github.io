import {
  Burger,
  Container,
  createStyles,
  Group,
  Header,
  Image,
  Paper,
  Text,
  Transition,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import React, { useState } from 'react';
import { scrollIntoView } from 'seamless-scroll-polyfill';
import dgBlack from '../assets/dg-black.svg';
import dgWhite from '../assets/dg-white.svg';
import SwitchToggle from './SwitchToggle';

const HEADER_HEIGHT = 60;

const APP_LINKS = [
  {
    link: 'home',
    label: 'Home',
  },
  {
    link: 'portfolio',
    label: 'Portfolio',
  },
  {
    link: 'experience',
    label: 'Experience',
  },
  {
    link: 'contact',
    label: 'Contact',
  },
];

const useStyles = createStyles(theme => ({
  root: {
    zIndex: 1,
    borderBottom: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
  },

  dropdown: {
    position: 'absolute',
    top: HEADER_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 99,
    borderTopRightRadius: 0,
    borderTopLeftRadius: 0,
    borderTopWidth: 0,
    overflow: 'hidden',

    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  links: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    userDrag: 'none',
    userSelect: 'none',
    MozUserSelect: 'none',
    WebkitUserDrag: 'none',
    WebkitUserSelect: 'none',
    MsUserSelect: 'none',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('sm')]: {
      borderRadius: 0,
      padding: theme.spacing.md,
    },
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 3 : 7],
    },
  },
}));

interface HeaderResponsiveProps {
  links?: { link: string; label: string }[];
}

function HeaderResponsive({ links = APP_LINKS }: HeaderResponsiveProps) {
  const [opened, toggleOpened] = useBooleanToggle(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const theme = useMantineTheme();

  const items = links.map(link => (
    <a
      key={link.label}
      href={link.link}
      className={cx(classes.link, { [classes.linkActive]: active === link.link })}
      onClick={event => {
        event.preventDefault();
        setActive(link.link);
        toggleOpened(false);

        const section = document.getElementById(link.link);
        if (section) {
          scrollIntoView(section, { behavior: 'smooth' });
        }
      }}
    >
      {link.label}
    </a>
  ));

  return (
    <Header height={HEADER_HEIGHT} mb={120} className={classes.root}>
      <Container className={classes.header}>
        <UnstyledButton
          onClick={(event: any) => {
            event.preventDefault();

            const section = document.getElementById('home');
            if (section) {
              scrollIntoView(section, { behavior: 'smooth' });
            }
          }}
        >
          <Group spacing='xs'>
            <Image
              height={25}
              width='auto'
              src={theme.colorScheme === 'dark' ? dgWhite : dgBlack}
              alt='DG'
            />
            <Text
              size='xl'
              color={theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[8]}
            >
              Danial Endrawes
            </Text>
          </Group>
        </UnstyledButton>

        <Group spacing={17}>
          <Group spacing={5} className={classes.links}>
            {items}
          </Group>

          <SwitchToggle />

          <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size='sm'
          />
        </Group>

        <Transition transition='pop-top-right' duration={200} mounted={opened}>
          {styles => (
            <Paper className={classes.dropdown} withBorder style={styles} shadow='md'>
              {items}
            </Paper>
          )}
        </Transition>
      </Container>
    </Header>
  );
}

export default HeaderResponsive;
