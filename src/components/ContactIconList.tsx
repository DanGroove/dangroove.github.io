import { Box, createStyles, Group, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import { At, BrandLinkedin, BrandYoutube, Phone } from 'tabler-icons-react';

type ContactIconVariant = 'white' | 'gradient';

interface ContactIconStyles {
  variant: ContactIconVariant;
}

const useStyles = createStyles((theme, { variant }: ContactIconStyles) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    color: theme.white,
  },

  icon: {
    marginRight: theme.spacing.md,
    backgroundImage:
      variant === 'gradient'
        ? `linear-gradient(135deg, ${theme.colors[theme.primaryColor][4]} 0%, ${
            theme.colors[theme.primaryColor][6]
          } 100%)`
        : 'none',
    backgroundColor: 'transparent',
  },

  title: {
    color: variant === 'gradient' ? theme.colors.gray[6] : theme.colors[theme.primaryColor][0],
  },

  description: {
    color: variant === 'gradient' ? theme.black : theme.white,
  },
}));

interface ContactIconProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
  link: string;
  variant?: ContactIconVariant;
}

function ContactIcon({
  icon: Icon,
  title,
  description,
  variant = 'gradient',
  link,
  className,
  ...others
}: ContactIconProps) {
  const matches = useMediaQuery('(min-width: 414px)');
  const { classes, cx } = useStyles({ variant });
  return (
    <UnstyledButton
      className='slide-hover'
      onClick={() => {
        if (link.includes('://')) {
          window.open(link, '_blank')?.focus();
        } else {
          window.location.href = link;
        }
      }}
    >
      <div className={cx(classes.wrapper, className)} {...others}>
        <Group direction={matches ? 'row' : 'column'} spacing='xs'>
          {variant === 'gradient' ? (
            <ThemeIcon size={40} radius='md' className={classes.icon}>
              <Icon size={24} />
            </ThemeIcon>
          ) : (
            <Box mr='md'>
              <Icon size={24} />
            </Box>
          )}

          <div>
            <Text size='xs' className={classes.title}>
              {title}
            </Text>
            <Text className={classes.description}>{description}</Text>
          </div>
        </Group>
      </div>
    </UnstyledButton>
  );
}

interface ContactIconsListProps {
  data?: ContactIconProps[];
  variant?: ContactIconVariant;
}

const CONTACT_DATA = [
  {
    title: 'Email',
    description: 'danialendrawes@gmail.com',
    link: 'mailto:danialendrawes@gmail.com',
    icon: At,
  },
  { title: 'Phone', description: '+1 (647) 244-7252', link: 'tel:6472447252', icon: Phone },
  {
    title: 'LinkedIn',
    description: 'linkedin.com/in/DanialEnd',
    link: 'https://www.linkedin.com/in/DanialEnd',
    icon: BrandLinkedin,
  },
  {
    title: 'YouTube',
    description: 'youtube.com/c/CaptainDanGroove',
    link: 'https://www.youtube.com/c/CaptainDanGroove',
    icon: BrandYoutube,
  },
];

function ContactIconsList({ data = CONTACT_DATA, variant }: ContactIconsListProps) {
  const items = data.map((item, index) => <ContactIcon key={index} variant={variant} {...item} />);
  return <Group direction='column'>{items}</Group>;
}

export default ContactIconsList;
