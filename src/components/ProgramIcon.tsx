import { createStyles, Image, Tooltip } from '@mantine/core';
import React from 'react';
import aeSvg from '../assets/icons/ae.svg';
import aiSvg from '../assets/icons/ai.svg';
import idSvg from '../assets/icons/id.svg';
import prSvg from '../assets/icons/pr.svg';
import psSvg from '../assets/icons/ps.svg';
import sqSvg from '../assets/icons/sq.svg';
import xdSvg from '../assets/icons/xd.svg';

type programCodeToIconMapType = {
  [key: string]: {
    image: any;
    tooltip: string;
  };
};

const programCodeToIconMap: programCodeToIconMapType = {
  ae: {
    image: aeSvg,
    tooltip: 'Adobe After Effects',
  },
  ai: {
    image: aiSvg,
    tooltip: 'Adobe Illustrator',
  },
  id: {
    image: idSvg,
    tooltip: 'Adobe InDesign',
  },
  pr: {
    image: prSvg,
    tooltip: 'Adobe Premiere Pro',
  },
  ps: {
    image: psSvg,
    tooltip: 'Adobe Photoshop',
  },
  sq: {
    image: sqSvg,
    tooltip: 'Squarespace',
  },
  xd: {
    image: xdSvg,
    tooltip: 'Adobe XD',
  },
};

const useStyles = createStyles(theme => ({
  icon: {
    width: theme.spacing.xl * 2,
  },
}));

interface ProgramIconProps {
  programCode: string;
}

function ProgramIcon({ programCode }: ProgramIconProps) {
  const { classes } = useStyles();
  const { image, tooltip } = programCodeToIconMap[programCode];

  return (
    <Tooltip label={tooltip} withArrow>
      <Image src={image} className={classes.icon} />
    </Tooltip>
  );
}

export default ProgramIcon;
