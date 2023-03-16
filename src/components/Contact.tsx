import {
  Button,
  Container,
  createStyles,
  Group,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import ContactIconsList from './ContactIconList';
import SectionTitle from './SectionTitle';

const useStyles = createStyles(theme => ({
  wrapper: {
    minHeight: 400,
    boxSizing: 'border-box',
    backgroundImage: `linear-gradient(-60deg, ${theme.colors[theme.primaryColor][4]} 0%, ${
      theme.colors[theme.primaryColor][7]
    } 100%)`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl * 2.5,
    overflow: 'hidden',

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: theme.spacing.xl * 1.5,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    color: theme.white,
    lineHeight: 1,
  },

  description: {
    color: theme.colors[theme.primaryColor][0],
    maxWidth: 300,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  form: {
    backgroundColor: theme.white,
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.lg,
  },

  social: {
    color: theme.white,

    '&:hover': {
      color: theme.colors[theme.primaryColor][1],
    },
  },

  input: {
    backgroundColor: theme.white,
    borderColor: theme.colors.gray[4],
    color: theme.black,

    '&::placeholder': {
      color: theme.colors.gray[5],
    },
  },

  inputLabel: {
    color: theme.black,
  },

  control: {
    backgroundColor: theme.colors[theme.primaryColor][6],
  },
}));

function Contact() {
  const { classes } = useStyles();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  return (
    <Container id='contact' size={900}>
      <SectionTitle>Contact</SectionTitle>
      <div className={classes.wrapper}>
        <SimpleGrid cols={2} spacing={50} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          <div>
            <Title className={classes.title}>Get in touch</Title>
            <Text className={classes.description} mt='sm' mb={30}>
              Send me an email and I'll get back to you as soon as I can!
            </Text>

            <ContactIconsList variant='white' />

            {/* <Group mt='xl'>{icons}</Group> */}
          </div>
          <div className={classes.form}>
            {/* <TextInput
              label='Email'
              // placeholder='your@email.com'
              required
              classNames={{ input: classes.input, label: classes.inputLabel }}
            /> */}
            <TextInput
              label='Subject'
              // placeholder='Title'
              mt='md'
              classNames={{ input: classes.input, label: classes.inputLabel }}
              value={subject}
              onChange={event => setSubject(event.currentTarget.value)}
            />
            <Textarea
              // required
              label='Message'
              // placeholder="Let's talk!"
              minRows={4}
              mt='md'
              classNames={{ input: classes.input, label: classes.inputLabel }}
              value={message}
              onChange={event => setMessage(event.currentTarget.value)}
            />
            <Group position='right' mt='md'>
              <Button
                className={classes.control}
                component='a'
                href={`mailto:danialendrawes@gmail.com?subject=${subject}&body=${message}`}
              >
                Send message
              </Button>
            </Group>
          </div>
        </SimpleGrid>
      </div>
    </Container>
  );
}

export default Contact;
