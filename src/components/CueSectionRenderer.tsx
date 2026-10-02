"use client";
/* eslint-disable react-refresh/only-export-components */
import { CueTimingDiagram } from './CueTimingDiagram';
import { FollowHangDiagram } from './FollowHangDiagram';
import { KeyboardReference } from './KeyboardReference';

type CueSection = {
  type?: string;
  title?: string;
  delay?: number;
  times?: Partial<{
    intensity_up: number;
    intensity_down: number;
    focus: number;
    color: number;
    beam: number;
  }>;
  cue_time?: number;
  follow_time?: number;
  hang_time?: number;
  image?: string;
  keys?: Array<{ eos_key: string; pc_keys: string[] }>;
};

export function isCueSection(section: CueSection): boolean {
  return ['cue_timing_diagram', 'follow_hang_diagram', 'keyboard_reference'].includes(
    section?.type ?? '',
  );
}

export function CueSectionRenderer({ section }: { section: CueSection }) {
  if (section.type === 'cue_timing_diagram') {
    return (
      <CueTimingDiagram
        key={`${section.delay}-${JSON.stringify(section.times ?? {})}`}
        title={section.title}
        delay={section.delay}
        times={section.times}
      />
    );
  }

  if (section.type === 'follow_hang_diagram') {
    return (
      <FollowHangDiagram
        key={`${section.cue_time}-${section.follow_time}-${section.hang_time}`}
        title={section.title}
        cue_time={section.cue_time}
        follow_time={section.follow_time}
        hang_time={section.hang_time}
      />
    );
  }

  if (section.type === 'keyboard_reference') {
    return (
      <KeyboardReference
        title={section.title}
        image={section.image}
        keys={section.keys ?? []}
      />
    );
  }

  return null;
}



