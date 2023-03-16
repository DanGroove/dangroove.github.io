import { Button, Container, createStyles, Group } from '@mantine/core';
import ProgramIcon from './ProgramIcon';

const useStyles = createStyles(theme => ({
  footer: {
    marginTop: 30,
    borderTop: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
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
      marginBottom: theme.spacing.xl,
    },
  },
}));

interface ContextCardProps {
  programIconCodes: string[];
  buttonLink?: string;
  buttonText?: string;
}

function ContextCard({ programIconCodes, buttonLink, buttonText }: ContextCardProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group className={buttonLink ? classes.links : undefined} position='center'>
          {programIconCodes.map(code => (
            <ProgramIcon key={code} programCode={code} />
          ))}
        </Group>
        {buttonLink && buttonText && (
          <Button component='a' target='_blank' href={buttonLink}>
            {buttonText}
          </Button>
        )}
      </Container>
    </div>
  );
}

export default ContextCard;
