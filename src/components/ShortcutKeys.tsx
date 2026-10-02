import { Fragment } from 'react';
import type { KeyboardShortcut } from '../types';
export default function ShortcutKeys({ shortcut }: { shortcut: KeyboardShortcut }) {
  return <div className="pc-shortcut">
    <p className="muted small">{shortcut.platform}</p>
    <div className="command" role="group" aria-label={`${shortcut.label}: ${shortcut.display}`}>
      {shortcut.keycaps.map((key, index) => <Fragment key={index}>{index > 0 && <span className="separator" aria-hidden="true">+</span>}<kbd>{key}</kbd></Fragment>)}
      {shortcut.followed_by.map((key, index) => <Fragment key={index}><span className="separator" aria-hidden="true">→</span><kbd>{key}</kbd></Fragment>)}
    </div>
    <p>{shortcut.purpose}</p>
  </div>;
}
