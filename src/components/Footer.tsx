import {
  ActionIcon,
  Anchor,
  Container,
  createStyles,
  Group,
  MediaQuery,
  Text,
  Tooltip,
} from '@mantine/core';
import React from 'react';
import { At, BrandLinkedin, BrandYoutube, Phone } from 'tabler-icons-react';

const useStyles = createStyles(theme => ({
  footer: {
    marginTop: 70,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
    }`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
  },

  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,

    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column',
    },
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      marginBottom: theme.spacing.md,
    },
  },
}));

function Footer() {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group spacing={0} className={classes.links} position='right' noWrap>
          <Tooltip label='Email' withArrow>
            <ActionIcon<'a'> size='lg' component='a' href='mailto:danialendrawes@gmail.com'>
              <At size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='Phone' withArrow>
            <ActionIcon<'a'> size='lg' component='a' href='tel:6472447252'>
              <Phone size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='LinkedIn' withArrow>
            <ActionIcon<'a'>
              size='lg'
              component='a'
              href='https://www.linkedin.com/in/DanialEnd'
              target='_blank'
            >
              <BrandLinkedin size={18} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label='YouTube' withArrow>
            <ActionIcon<'a'>
              size='lg'
              component='a'
              href='https://www.youtube.com/c/CaptainDanGroove'
              target='_blank'
            >
              <BrandYoutube size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <MediaQuery largerThan='xs' styles={{ display: 'none' }}>
          <div style={{ textAlign: 'center' }}>
            <Text>© Danial Endrawes 2022.</Text>
            <Text>
              Made by{' '}
              <Anchor href='https://github.com/RenDelaCruz' target='_blank'>
                RDC
              </Anchor>
              .
            </Text>
          </div>
        </MediaQuery>
        <MediaQuery smallerThan='xs' styles={{ display: 'none' }}>
          <Text>
            © Danial Endrawes 2022. Made by{' '}
            <Anchor href='https://github.com/RenDelaCruz' target='_blank'>
              RDC
            </Anchor>
            .
          </Text>
        </MediaQuery>
      </Container>
    </div>
  );
}

export default Footer;
