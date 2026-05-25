import {
  type HTMLMotionProps,
  type Target,
  type TargetAndTransition,
  type Transition,
  motion,
} from 'framer-motion';
import type React from 'react';

import type { JSX } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
  
type MotionVariantState = {
  filter?: string;
  opacity?: number;
  y?: number;
  transition?: {
    ease?: string;
    duration?: number;
  };
};
 
type SectionVariants = {
  hidden?: MotionVariantState;
  visible?: MotionVariantState;
};
 
type StatItem = {
  id: string;
  // Icon: ElementType;
  value: number | null;
  suffix?: string;
  prefix?: string;
  lines: string[];
  row: 0 | 1;
  col: 0 | 1;
};
 
type StatSectionConfig = {
  stat: StatItem;
  direction: Direction;
  align: 'left' | 'center' | 'right';
  letterAnime?: boolean;
  lineAnime?: boolean;
  variants?: SectionVariants;
  as?: 'h1' | 'h2' | 'h3' | 'p';
};
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
 
/** Builds the animated display string from a stat's value, prefix, suffix, and lines. */
function buildStatText(stat: StatItem): string {
  const numPart =
    stat.prefix != null
      ? stat.prefix
      : `${stat.value ?? ''}${stat.suffix ?? ''}`;
 
  return `${numPart} ${stat.lines.join(' ')}`;
}
 
const alignClass: Record<'left' | 'center' | 'right', string> = {
  left: 'flex items-center text-left',
  center: 'flex flex-col justify-center items-center text-center',
  right: 'flex justify-center items-center text-right',
};
 
const mlClass: Record<'left' | 'center' | 'right', string> = {
  left: '',
  center: 'mx-auto',
  right: 'ml-auto',
};
 
// ─── Data ─────────────────────────────────────────────────────────────────────
 
// Replace Icon values with your actual icon components.
const stats: StatItem[] = [
  {
    id: 'people',
    // Icon: () => null,
    value: 105,
    suffix: '+',
    lines: ['Client', '160+ Students'],
    row: 0,
    col: 0,
  },
  {
    id: 'projects',
    // Icon: () => null,
    value: 272,
    suffix: '+',
    lines: ['Projects', '& Designs'],
    row: 0,
    col: 1,
  },
  {
    id: 'git',
    // Icon: () => null,
    value: 71,
    suffix: '+',
    lines: ['Github Repos'],
    row: 1,
    col: 0,
  },
  {
    id: 'coffee',
    // Icon: () => null,
    value: null,
    prefix: '∞',
    lines: ['Cup of', 'Coffee'],
    row: 1,
    col: 1,
  },
];
 
// Maps each stat to its visual/animation config.
const sectionConfigs: StatSectionConfig[] = [
  {
    // row 0, col 0 — people: center, word-level blur-fade
    stat: stats[0],
    direction: 'up',
    align: 'center',
    as: 'h2',
    variants: {
      hidden: { filter: 'blur(10px)', opacity: 0, y: 20 },
      visible: {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        transition: { ease: 'linear' },
      },
    },
  },
  {
    // row 0, col 1 — projects: left, letter-by-letter
    stat: stats[1],
    direction: 'up',
    align: 'left',
    as: 'p',
    letterAnime: true,
    variants: {
      hidden: { filter: 'blur(4px)', opacity: 0, y: 20 },
      visible: {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
        transition: { duration: 0.2 },
      },
    },
  },
  {
    // row 1, col 0 — git: right, slide-in from right
    stat: stats[2],
    direction: 'right',
    align: 'right',
    as: 'h2',
  },
  {
    // row 1, col 1 — coffee: center, line-level slide from down
    stat: stats[3],
    direction: 'down',
    align: 'center',
    lineAnime: true,
    as: 'h2',
  },
];
export function ScrollTextAnimation(): JSX.Element {
  return (
    <div>
      {/* Hero prompt */}
      <div className="h-[550px] grid place-content-center">
        <h1 className="text-5xl font-semibold">Scroll Down👇</h1>
      </div>
 
      {sectionConfigs.map(
        ({ stat, direction, align, letterAnime, lineAnime, variants, as }) => (
          <div
            key={stat.id}
            className={`h-[80vh] ${alignClass[align]}`}
          >
            <TextAnimation
              as={as}
              text={buildStatText(stat)}
              direction={direction}
              letterAnime={letterAnime}
              lineAnime={lineAnime}
              variants={variants}
              classname={`xl:text-8xl text-7xl max-w-md font-medium capitalize ${mlClass[align]}`}
            />
          </div>
        ),
      )}
    </div>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Direction = 'up' | 'down' | 'left' | 'right';

type MotionVariantState2 = Target & {
  filter?: string;
  transition?: Transition;
};

type MotionVariants = {
  hidden?: MotionVariantState2;
  visible?: TargetAndTransition;
};

type ViewportConfig = {
  amount?: number;
  margin?: string;
  once?: boolean;
};

type TextAnimationProps = {
  text: string;
  classname?: string;
  as?: keyof JSX.IntrinsicElements;
  viewport?: ViewportConfig;
  variants?: MotionVariants;
  direction?: Direction;
  letterAnime?: boolean;
  lineAnime?: boolean;
};

// ─── Variants ─────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const generateVariants = (direction: Direction): Required<MotionVariants> => {
  const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y';
  const value = direction === 'right' || direction === 'down' ? 100 : -100;

  return {
    hidden: {
      filter: 'blur(10px)',
      opacity: 0,
      [`translate${axis}`]: value,
    } as MotionVariantState2,
    visible: {
      filter: 'blur(0px)',
      opacity: 1,
      [`translate${axis}`]: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    } as TargetAndTransition,
  };
};

// ─── Constants ────────────────────────────────────────────────────────────────

const defaultViewport: ViewportConfig = {
  amount: 0.3,
  margin: '0px 0px 0px 0px',
};

// ─── Component ────────────────────────────────────────────────────────────────

const TextAnimation = ({
  as = 'h1',
  text,
  classname = '',
  viewport = defaultViewport,
  variants,
  direction = 'down',
  letterAnime = false,
  lineAnime = false,
}: TextAnimationProps) => {
  const baseVariants = variants ?? generateVariants(direction);

  const modifiedVariants: Required<MotionVariants> = {
    hidden: baseVariants.hidden ?? {},
    visible: {
      ...baseVariants.visible,
    },
  };

  const MotionComponent = motion[
    as as keyof typeof motion
  ] as React.ComponentType<HTMLMotionProps<'div'>>;

  return (
    <MotionComponent
      whileInView="visible"
      initial="hidden"
      variants={containerVariants}
      viewport={viewport}
      className={`inline-block dark:text-white text-black uppercase ${classname}`}
    >
      {lineAnime ? (
        <motion.span className="inline-block" variants={modifiedVariants}>
          {text}
        </motion.span>
      ) : (
        <>
          {text.split(' ').map((word: string, index: number) => (
            <motion.span
              key={`${word}-${index}`}
              className="inline-block"
              variants={letterAnime ? {} : modifiedVariants}
            >
              {letterAnime ? (
                <>
                  {word.split('').map((letter: string, letterIndex: number) => (
                    <motion.span
                      key={`${letter}-${letterIndex}`}
                      className="inline-block"
                      variants={modifiedVariants}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  &nbsp;
                </>
              ) : (
                <>{word}&nbsp;</>
              )}
            </motion.span>
          ))}
        </>
      )}
    </MotionComponent>
  );
};

