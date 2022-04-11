import {
  ActionIcon,
  Center,
  Container,
  Grid,
  Group,
  Image,
  Loader,
  Modal,
  Paper,
  ScrollArea,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ButtonBack, ButtonNext, CarouselProvider, Dot, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { ArrowLeft, ArrowRight, InfoCircle } from 'tabler-icons-react';
import imaginableMockupPng from '../assets/modal/imaginable-mockup.png';
import magdalenaIntroPng from '../assets/modal/magdalena-intro.png';
import magdalenaLogosPng from '../assets/modal/magdalena-logos.png';
import oldOneBurlingtonPng from '../assets/modal/old-one-burlington.png';
import portraitGif from '../assets/modal/portrait.gif';
import safetyDrivesUs2Png from '../assets/modal/safety-drives-us-2.png';
import safetyDrivesUs3Png from '../assets/modal/safety-drives-us-3.png';
import channelPng from '../assets/portfolio/channel.png';
import galaxyBitesPng from '../assets/portfolio/galaxy-bites.png';
import imaginablePng from '../assets/portfolio/imaginable.png';
import magdalenaMockupsPng from '../assets/portfolio/magdalena-mockups.png';
import oneBurlingtonPng from '../assets/portfolio/one-burlington.png';
import portraitPng from '../assets/portfolio/portrait.png';
import safetyDrivesUsPng from '../assets/portfolio/safety-drives-us.png';
import spillTheBeansPng from '../assets/portfolio/spill-the-beans.png';
import ContextCard from './ContextCard';
import SectionTitle from './SectionTitle';

function DotGrouping({ count, matches }: { count: number; matches: boolean }) {
  let dots = [];
  for (let i = 0; i < count; i++) {
    dots.push(
      <Dot slide={i} style={{ width: matches ? 50 : 20, height: 5, borderStyle: 'none' }}></Dot>
    );
  }

  return <Group spacing={matches ? 10 : 3}>{dots}</Group>;
}

const placeholder = <Loader variant='bars' />; //<Skeleton radius='md' />;

function Portfolio() {
  const matches = useMediaQuery('(min-width: 770px)');
  const theme = useMantineTheme();

  const [opened, setOpened] = useState({
    oneBurlington: false,
    galaxyBites: false,
    safetyDrivesUs: false,
    imaginable: false,
    portrait: false,
    magdalena: false,
    channel: false,
    spillTheBeans: false,
  });

  const subHeight = '31.433vh';
  const subWidth = `${31.433 * (16 / 9)}vh`;

  // const baseVw = 29.5;
  // const gutterVw = pixelsToVw(theme.spacing.md);
  // const [columnVh, setColumnVh] = useState((baseVw - gutterVw) / 2);

  // const oneBurlingtonColumnRef = useRef<any>(null);

  // useEffect(() => {
  //   window.addEventListener('resize', () => {
  //     if (oneBurlingtonColumnRef.current) {
  //       const gutterVw = pixelsToVw(theme.spacing.md);
  //       setColumnVh((baseVw - gutterVw) / 2);
  //     }
  //   });
  // }, []);

  // breakpoints={[{ maxWidth: 'xs', cols: 1 }]}

  return (
    <>
      <Container id='portfolio' size={900} style={{ paddingBottom: 20 }}>
        <SectionTitle noPadding>Portfolio</SectionTitle>
      </Container>
      <Modal
        size={matches ? '70%' : '95%'}
        opened={opened.oneBurlington}
        onClose={() => setOpened({ ...opened, oneBurlington: false })}
      >
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>One Burlington Logo Redesign</SectionTitle>
          <CarouselProvider
            naturalSlideWidth={16}
            naturalSlideHeight={9}
            totalSlides={2}
            infinite
            isIntrinsicHeight
          >
            <Slider>
              <Slide index={0}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={'https://i.imgur.com/nVbects.gif'}
                    radius='md'
                    alt='One Burlington Logo Animation'
                    height={matches ? '34vw' : '44vw'}
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
              <Slide index={1}>
                <Group noWrap>
                  <Paper shadow='sm' radius='md'>
                    <Image
                      src={oldOneBurlingtonPng}
                      radius='md'
                      alt='Old One Burlington Logo'
                      height={matches ? '34vw' : '44vw'}
                      withPlaceholder
                      placeholder={placeholder}
                    />
                  </Paper>
                  <Paper shadow='sm' radius='md'>
                    <Image
                      src={oneBurlingtonPng}
                      radius='md'
                      alt='New One Burlington Logo'
                      height={matches ? '34vw' : '44vw'}
                      withPlaceholder
                      placeholder={placeholder}
                    />
                  </Paper>
                </Group>
              </Slide>
            </Slider>
            <Group position='apart'>
              <ButtonBack style={{ all: 'initial' }}>
                <ActionIcon size='xl' radius='xl'>
                  <ArrowLeft />
                </ActionIcon>
              </ButtonBack>
              <DotGrouping count={2} matches={matches} />
              <ButtonNext style={{ all: 'initial' }}>
                <ActionIcon size='xl' radius='xl'>
                  <ActionIcon size='xl' radius='xl'>
                    <ArrowRight />
                  </ActionIcon>
                </ActionIcon>
              </ButtonNext>
            </Group>
          </CarouselProvider>
          <ContextCard programIconCodes={['ai', 'ae']} />
        </div>
      </Modal>
      <Modal
        size={matches ? '70%' : '95%'}
        opened={opened.galaxyBites}
        onClose={() => setOpened({ ...opened, galaxyBites: false })}
      >
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>Galaxy Bites Logo & Animation</SectionTitle>
          <Paper shadow='sm' radius='md' className='iframe-container'>
            <ReactPlayer
              className='responsive-iframe'
              url='https://i.imgur.com/YDYcdgn.mp4'
              loop
              muted
              playing
              width='100%'
              height='100%'
              style={{ borderRadius: theme.spacing.sm, overflow: 'hidden' }}
            />
          </Paper>
          {/* <Paper shadow='sm' radius='md' className='iframe-container'>
            <iframe
              className='responsive-iframe'
              src='https://www.youtube.com/embed/DmxdVQ1exIs?controls=0&version=3&loop=1&playlist=DmxdVQ1exIs'
              title='YouTube video player'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            ></iframe>
          </Paper> */}
          <ContextCard programIconCodes={['ai', 'ae']} />
        </div>
      </Modal>
      <Modal
        size={matches ? '70%' : '95%'}
        opened={opened.safetyDrivesUs}
        onClose={() => setOpened({ ...opened, safetyDrivesUs: false })}
      >
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>Safety Drives Us Website</SectionTitle>
          <CarouselProvider naturalSlideWidth={16} naturalSlideHeight={9} totalSlides={3} infinite>
            <Slider>
              <Slide index={0}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={safetyDrivesUsPng}
                    radius='md'
                    alt='Safety Drives Us Website Intro'
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
              <Slide index={1}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={safetyDrivesUs2Png}
                    radius='md'
                    alt='Safety Drives Us Website Info'
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
              <Slide index={2}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={safetyDrivesUs3Png}
                    radius='md'
                    alt='Safety Drives Us Website Gallery'
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
            </Slider>
            <Group position='apart'>
              <ButtonBack style={{ all: 'initial' }}>
                <ActionIcon size='xl' radius='xl'>
                  <ArrowLeft />
                </ActionIcon>
              </ButtonBack>
              <DotGrouping count={3} matches={matches} />
              <ButtonNext style={{ all: 'initial' }}>
                <ActionIcon size='xl' radius='xl'>
                  <ActionIcon size='xl' radius='xl'>
                    <ArrowRight />
                  </ActionIcon>
                </ActionIcon>
              </ButtonNext>
            </Group>
          </CarouselProvider>
          <ContextCard
            programIconCodes={['sq', 'ai', 'ps']}
            buttonLink='https://www.safetydrivesus.org/'
            buttonText='View Website'
          />
        </div>
      </Modal>
      <Modal
        size={matches ? '70%' : '95%'}
        opened={opened.imaginable}
        onClose={() => setOpened({ ...opened, imaginable: false })}
      >
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>
            <>
              ImaginAble Solutions Branding Mockups & Logo Animation
              <Tooltip label='Logo not made by me' withArrow>
                <ActionIcon size='xl' radius='xl' style={{ pointerEvents: 'none' }}>
                  <InfoCircle />
                </ActionIcon>
              </Tooltip>
            </>
          </SectionTitle>
          <CarouselProvider naturalSlideWidth={16} naturalSlideHeight={9} totalSlides={3} infinite>
            <Slider>
              <Slide index={0}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={'https://i.imgur.com/PyGYZLo.gif'}
                    radius='md'
                    alt='ImaginAble Logo Animation'
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
              <Slide index={1}>
                <Center>
                  <Paper shadow='sm' radius='md'>
                    <Image
                      src={imaginablePng}
                      radius='md'
                      alt='ImaginAble Phone'
                      height={matches ? '34vw' : '44vw'}
                      withPlaceholder
                      placeholder={placeholder}
                    />
                  </Paper>
                </Center>
              </Slide>
              <Slide index={2}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={imaginableMockupPng}
                    radius='md'
                    alt='ImaginAble Mockup'
                    height={matches ? '34vw' : '44vw'}
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
            </Slider>
            <Group position='apart'>
              <ButtonBack style={{ all: 'initial' }}>
                <ActionIcon size='xl' radius='xl'>
                  <ArrowLeft />
                </ActionIcon>
              </ButtonBack>
              <DotGrouping count={3} matches={matches} />
              <ButtonNext style={{ all: 'initial' }}>
                <ActionIcon size='xl' radius='xl'>
                  <ActionIcon size='xl' radius='xl'>
                    <ArrowRight />
                  </ActionIcon>
                </ActionIcon>
              </ButtonNext>
            </Group>
          </CarouselProvider>
          <ContextCard programIconCodes={['ai', 'ae', 'ps']} />
        </div>
      </Modal>
      <Modal
        size={matches ? '70%' : '95%'}
        opened={opened.portrait}
        onClose={() => setOpened({ ...opened, portrait: false })}
      >
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>Self Portrait Persona 5 Style</SectionTitle>
          <Grid>
            <Grid.Col sm={6}>
              <Paper shadow='sm' radius='md'>
                <Image
                  src={'https://i.imgur.com/yOJqRz4.gif'}
                  radius='md'
                  alt='Portrait Animation'
                  height='100%'
                  withPlaceholder
                  placeholder={placeholder}
                />
              </Paper>
            </Grid.Col>
            <Grid.Col sm={6}>
              <Paper shadow='sm' radius='md'>
                <Image
                  src={portraitPng}
                  radius='md'
                  alt='Portrait'
                  height='100%'
                  withPlaceholder
                  placeholder={placeholder}
                />
              </Paper>
            </Grid.Col>
          </Grid>
          <ContextCard programIconCodes={['ai', 'ae']} />
        </div>
      </Modal>
      <Modal
        size={matches ? '70%' : '95%'}
        opened={opened.magdalena}
        onClose={() => setOpened({ ...opened, magdalena: false })}
      >
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>
            <>
              Magdalena Logo Presentation & Animation{' '}
              <Tooltip label='Logo not made by me' withArrow>
                <ActionIcon size='xl' radius='xl' style={{ pointerEvents: 'none' }}>
                  <InfoCircle />
                </ActionIcon>
              </Tooltip>
            </>
          </SectionTitle>
          <CarouselProvider naturalSlideWidth={16} naturalSlideHeight={9} totalSlides={4} infinite>
            <Slider>
              <Slide index={0}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src='https://i.imgur.com/eTYQfQV.gif'
                    radius='md'
                    alt='Magdalena Logo Animation'
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
              <Slide index={1}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={magdalenaIntroPng}
                    radius='md'
                    alt='Magdalena Intro'
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
              <Slide index={2}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={magdalenaLogosPng}
                    radius='md'
                    alt='Magdalena Logos'
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
              <Slide index={3}>
                <Paper shadow='sm' radius='md'>
                  <Image
                    src={magdalenaMockupsPng}
                    radius='md'
                    alt='Magdalena Mockups'
                    withPlaceholder
                    placeholder={placeholder}
                  />
                </Paper>
              </Slide>
            </Slider>
            <Group position='apart'>
              <ButtonBack style={{ all: 'initial' }}>
                <ActionIcon size='xl' radius='xl'>
                  <ArrowLeft />
                </ActionIcon>
              </ButtonBack>
              <DotGrouping count={4} matches={matches} />
              <ButtonNext style={{ all: 'initial' }}>
                <ActionIcon size='xl' radius='xl'>
                  <ActionIcon size='xl' radius='xl'>
                    <ArrowRight />
                  </ActionIcon>
                </ActionIcon>
              </ButtonNext>
            </Group>
          </CarouselProvider>
          <ContextCard
            programIconCodes={['ai', 'ae', 'id']}
            buttonLink='https://onedrive.live.com/view.aspx?resid=D7386AEC8580F07D!2627&ithint=file%2cpptx&authkey=!AKAXu4xzFcDGgAc'
            buttonText='View Presentation'
          />
        </div>
      </Modal>
      <Modal
        size={matches ? '70%' : '95%'}
        opened={opened.channel}
        onClose={() => setOpened({ ...opened, channel: false })}
      >
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>Captain Dan Groove YouTube Channel</SectionTitle>
          <Paper shadow='sm' radius='md'>
            <Image
              src={channelPng}
              radius='md'
              alt='YouTube Channel'
              withPlaceholder
              placeholder={placeholder}
            />
          </Paper>
          <ContextCard
            programIconCodes={['pr', 'ae', 'ps', 'ai']}
            buttonLink='https://www.youtube.com/c/CaptainDanGroove'
            buttonText='View YouTube Channel'
          />
        </div>
      </Modal>
      <Modal
        size={matches ? '70%' : '95%'}
        opened={opened.spillTheBeans}
        onClose={() => setOpened({ ...opened, spillTheBeans: false })}
      >
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>Spill The Beans App Prototype</SectionTitle>
          <Paper shadow='sm' radius='md'>
            <Image
              src={spillTheBeansPng}
              radius='md'
              alt='Spill the Beans'
              withPlaceholder
              placeholder={placeholder}
            />
          </Paper>
          <ContextCard
            programIconCodes={['xd']}
            buttonLink='https://xd.adobe.com/view/4b55e194-f7b1-4bf2-979d-1589af765b48-1e06/'
            buttonText='View Prototype'
          />
        </div>
      </Modal>
      <ScrollArea style={{ height: '71vh', width: 'calc(100% + 32px)', marginLeft: '-16px' }}>
        <Group noWrap spacing='lg' pt={10}>
          <Paper
            shadow='sm'
            radius='md'
            onClick={() => setOpened({ ...opened, oneBurlington: true })}
          >
            <Image
              className='zoom'
              src={oneBurlingtonPng}
              radius='md'
              height='66vh'
              width='auto'
              alt='One Burlington'
              withPlaceholder
              placeholder={placeholder}
            />
          </Paper>

          <Group direction='column'>
            <Paper
              shadow='sm'
              radius='md'
              onClick={() => setOpened({ ...opened, galaxyBites: true })}
            >
              <Image
                className='zoom'
                src={galaxyBitesPng}
                radius='md'
                height={subHeight}
                width={subWidth}
                alt='Galaxy Bites'
                withPlaceholder
                placeholder={placeholder}
              />
            </Paper>
            <Paper
              shadow='sm'
              radius='md'
              onClick={() => setOpened({ ...opened, safetyDrivesUs: true })}
            >
              <Image
                className='zoom'
                src={safetyDrivesUsPng}
                radius='md'
                height={subHeight}
                width={subWidth}
                alt='Safety Drives Us'
                withPlaceholder
                placeholder={placeholder}
              />
            </Paper>
          </Group>
          <Paper shadow='sm' radius='md' onClick={() => setOpened({ ...opened, imaginable: true })}>
            <Image
              className='zoom'
              src={imaginablePng}
              radius='md'
              height='66vh'
              width='auto'
              alt='ImaginAble'
              withPlaceholder
              placeholder={placeholder}
            />
          </Paper>
          <Paper shadow='sm' radius='md' onClick={() => setOpened({ ...opened, portrait: true })}>
            <Image
              className='zoom'
              src={portraitPng}
              radius='md'
              height='66vh'
              width='auto'
              alt='Portrait'
              withPlaceholder
              placeholder={placeholder}
            />
          </Paper>
          <Group direction='column'>
            <Paper
              shadow='sm'
              radius='md'
              onClick={() => setOpened({ ...opened, magdalena: true })}
            >
              <Image
                className='zoom'
                src={magdalenaMockupsPng}
                radius='md'
                height={subHeight}
                width={subWidth}
                alt='Magdalena'
                withPlaceholder
                placeholder={placeholder}
              />
            </Paper>
            <Paper shadow='xl' radius='md' onClick={() => setOpened({ ...opened, channel: true })}>
              <Image
                className='zoom'
                src={channelPng}
                radius='md'
                height={subHeight}
                width={subWidth}
                alt='YouTube Channel'
                withPlaceholder
                placeholder={placeholder}
              />
            </Paper>
          </Group>
          <Paper
            shadow='sm'
            radius='md'
            onClick={() => setOpened({ ...opened, spillTheBeans: true })}
          >
            <Image
              className='zoom'
              src={spillTheBeansPng}
              radius='md'
              height='66vh'
              width='auto'
              alt='Spill the Beans'
              withPlaceholder
              placeholder={placeholder}
            />
          </Paper>
        </Group>
      </ScrollArea>
    </>
  );
}

export default Portfolio;
