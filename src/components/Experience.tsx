import { Container, Text, Timeline } from '@mantine/core';
import React from 'react';
import { DeviceDesktopAnalytics, Palette, Planet, Video } from 'tabler-icons-react';
import SectionTitle from './SectionTitle';

// const useStyles = createStyles(theme => ({}));

function Experience() {
  return (
    <Container id='experience' size={900}>
      <SectionTitle>Experience</SectionTitle>
      <Timeline active={2} bulletSize={24} lineWidth={2}>
        <Timeline.Item
          bullet={<Video size={12} />}
          title={<Text size='xl'>Graphic Designer / Video Editor / Web Designer</Text>}
        >
          <Text color='dimmed' size='lg'>
            <Text color='red' component='span' inherit>
              HMC Connections
            </Text>{' '}
            - Summer Student
          </Text>
          <Text size='sm' mt={4}>
            April - August 2018
          </Text>
        </Timeline.Item>

        <Timeline.Item
          bullet={<DeviceDesktopAnalytics size={12} />}
          title={<Text size='xl'>Graphic Designer / Web Designer</Text>}
        >
          <Text color='dimmed' size='lg'>
            <Text color='red' component='span' inherit>
              HMC Connections
            </Text>{' '}
            - Summer Student
          </Text>
          <Text size='sm' mt={4}>
            June - August 2020
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title={<Text size='xl'>Graphic Designer / Video Editor / Web Designer</Text>}
          bullet={<Planet size={12} />}
          lineVariant='dashed'
        >
          <Text color='dimmed' size='lg'>
            <Text color='red' component='span' inherit>
              HMC Connections
            </Text>{' '}
            - Summer Student
          </Text>
          <Text size='sm' mt={4}>
            June - August 2021
          </Text>
        </Timeline.Item>

        <Timeline.Item
          title={<Text size='xl'>Graphic Designer / Video Editor / Web Designer</Text>}
          bullet={<Palette size={12} />}
        >
          <Text color='dimmed' size='lg'>
            <Text color='red' component='span' inherit>
              HMC Connections
            </Text>{' '}
            - 7 month contract
          </Text>
          <Text size='sm' mt={4}>
            Sept 2021 - March 2022
          </Text>
        </Timeline.Item>
        
        <Timeline.Item
          title={<Text size='xl'>Junior Graphic Designer</Text>}
          bullet={<Palette size={12} />}
        >
          <Text color='dimmed' size='lg'>
            <Text color='red' component='span' inherit>
              Interkom
            </Text>{' '}
            - 4 month contract
          </Text>
          <Text size='sm' mt={4}>
            Sept 2022 - Dec 2022
          </Text>
        </Timeline.Item>
      </Timeline>
    </Container>
  );
}

export default Experience;
