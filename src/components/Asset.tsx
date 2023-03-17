import { ActionIcon, Group, Image, Loader, Modal, Paper, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { ButtonBack, ButtonNext, CarouselProvider, Dot, Slide, Slider } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, InfoCircle } from 'tabler-icons-react';
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

const subHeight = '31.433vh';
const subWidth = `${31.433 * (16 / 9)}vh`;

interface Connection {
  source: string;
  alt?: string;
}

interface Page {
  images: Connection[];
}

interface AssetProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'title'> {
  title: string;
  disclaimer?: string;
  thumbnail: Connection;
  assets: Page[];
  tools: string[];
  externalLink?: Connection;
  subsize?: boolean;
  inView: boolean;
  order: number;
}

function Portfolio({
  title,
  disclaimer,
  thumbnail,
  assets,
  tools,
  externalLink,
  subsize,
  inView,
  order,
}: AssetProps) {
  const matches = useMediaQuery('(min-width: 770px)');

  const [opened, setOpened] = useState(false);

  const titleNode = (
    <>
      {title}
      {disclaimer && (
        <Tooltip label={disclaimer} withArrow>
          <ActionIcon size='xl' radius='xl' style={{ pointerEvents: 'none' }}>
            <InfoCircle />
          </ActionIcon>
        </Tooltip>
      )}
    </>
  );

  const assetNode = (
    <>
      {assets.length === 1 ? (
        <Group noWrap>
          {assets[0].images.map((image, imageIndex) => {
            return (
              <Paper shadow='sm' radius='md' key={imageIndex} style={{ margin: '0 auto' }}>
                <Image
                  src={image.source}
                  radius='md'
                  alt={image.alt}
                  withPlaceholder
                  placeholder={placeholder}
                />
              </Paper>
            );
          })}
        </Group>
      ) : (
        <CarouselProvider
          naturalSlideWidth={16}
          naturalSlideHeight={9}
          totalSlides={assets.length}
          infinite
          isIntrinsicHeight
        >
          <Slider>
            {assets.map((page, pageIndex) => {
              return (
                <Slide index={pageIndex} key={pageIndex}>
                  <Group noWrap>
                    {page.images.map((image, imageIndex) => {
                      return (
                        <Paper shadow='sm' radius='md' key={imageIndex}>
                          <Image
                            src={image.source}
                            radius='md'
                            alt={image.alt}
                            withPlaceholder
                            placeholder={placeholder}
                          />
                        </Paper>
                      );
                    })}
                  </Group>
                </Slide>
              );
            })}
          </Slider>
          <Group position='apart'>
            <ButtonBack style={{ all: 'initial' }}>
              <ActionIcon size='xl' radius='xl'>
                <ArrowLeft />
              </ActionIcon>
            </ButtonBack>
            <DotGrouping count={assets.length} matches={matches} />
            <ButtonNext style={{ all: 'initial' }}>
              <ActionIcon size='xl' radius='xl'>
                <ActionIcon size='xl' radius='xl'>
                  <ArrowRight />
                </ActionIcon>
              </ActionIcon>
            </ButtonNext>
          </Group>
        </CarouselProvider>
      )}
    </>
  );

  return (
    <>
      <Modal size={matches ? '70%' : '95%'} opened={opened} onClose={() => setOpened(false)}>
        <div style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: '2vw', paddingRight: '2vw' }}>
          <input type='hidden' data-autofocus />
          <SectionTitle noPadding>{titleNode}</SectionTitle>
          {assetNode}
          <ContextCard
            programIconCodes={tools}
            buttonLink={externalLink?.source}
            buttonText={externalLink?.alt}
          />
        </div>
      </Modal>
      <Paper
        shadow='sm'
        radius='md'
        onClick={() => setOpened(true)}
        className={inView ? 'show hidden' : 'hidden'}
        style={{ '--order': order } as React.CSSProperties}
      >
        <Image
          className='zoom'
          src={thumbnail.source}
          radius='md'
          height={subsize ? subHeight : '66vh'}
          width={subsize ? subWidth : 'auto'}
          alt={thumbnail.alt}
          withPlaceholder
          placeholder={placeholder}
        />
      </Paper>
    </>
  );
}

export default Portfolio;
