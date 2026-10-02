import type { ContentSection } from '../types';
import StepTimeline from './StepTimeline';
import { CueSectionRenderer, isCueSection } from './CueSectionRenderer';
import CueWorkflow from './CueWorkflow';
import Glossary from './Glossary';
import LiveBlindComparison from './LiveBlindComparison';
import OffsetFanVisualizer from './OffsetFanVisualizer';
import SubmasterVisualizer from './SubmasterVisualizer';
import EffectTypeFlow from './EffectTypeFlow';
export default function ContentSections({ sections }: { sections: ContentSection[] }) {
  return <>{(sections ?? []).map((section, index) => {
    if (isCueSection(section)) return <CueSectionRenderer key={index} section={section} />;
    if (section.type === 'cue_workflow') return <CueWorkflow key={index} section={section} />;
    if (section.type === 'glossary') return <Glossary key={index} section={section} />;
    if (section.type === 'live_blind_comparison') return <LiveBlindComparison key={index} section={section} />;
    if (section.type === 'offset_fan_visualizer') return <OffsetFanVisualizer key={index} section={section} />;
    if (section.type === 'submaster_visualizer') return <SubmasterVisualizer key={index} section={section} />;
    if (section.type === 'effect_type_flow') return <EffectTypeFlow key={index} section={section} />;
    if (section.type === 'step_timeline') return <StepTimeline section={section} key={index} />;
    if (section.type === 'image') return <figure className="diagram content-image" key={index} data-section-type="image"><a href={section.src} target="_blank" rel="noreferrer"><img src={section.src} alt={section.alt} loading="lazy" /></a>{section.caption && <figcaption>{section.caption}</figcaption>}</figure>;
    if (section.type === 'annotated_image') return <figure className="diagram content-image annotated-image" key={index}><div className="annotated-stage"><img src={section.src} alt={section.alt} /></div>{section.caption && <figcaption>{section.caption}</figcaption>}</figure>;
    if (!['paragraphs', 'bullets', 'steps', 'table', 'note'].includes((section as { type?: string }).type ?? '')) {
      if (import.meta.env.DEV) console.warn('Unknown content section type:', (section as { type?: string }).type);
      return null;
    }
    return <section className={`detail-card content-section ${section.type === 'note' ? `note-${section.tone}` : ''}`} key={index} data-section-type={section.type}><h2>{section.title}</h2>{section.type === 'paragraphs' && (section.items ?? []).map((x, i) => <p key={i}>{x}</p>)}{section.type === 'bullets' && <ul>{(section.items ?? []).map((x, i) => <li key={i}>{x}</li>)}</ul>}{section.type === 'steps' && <ol>{(section.items ?? []).map((x, i) => <li key={i}>{x}</li>)}</ol>}{section.type === 'note' && <p>{section.text}</p>}{section.type === 'table' && <div className="content-table-scroll"><table><thead><tr>{(section.columns ?? []).map((x, i) => <th key={i}>{x}</th>)}</tr></thead><tbody>{(section.rows ?? []).map((row, i) => <tr key={i}>{(row ?? []).map((x, j) => j === 0 ? <th key={j}>{x}</th> : <td key={j}>{x}</td>)}</tr>)}</tbody></table></div>}</section>;
  })}</>;
}


