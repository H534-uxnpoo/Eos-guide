export default function CommandKeys({ command }: { command: string }) {
  const tokens = command.match(/\[[^\]]+\]|Go To Cue|Select Last|Record Only|Save As|Rem Dim|\S+/g) ?? [];
  return <div className="command" role="group" aria-label={command}>{tokens.map((token, index) => ['+', '→', '/'].includes(token) ? <span className="separator" key={index}>{token}</span> : <kbd key={index}>{token.replace(/^\[|\]$/g, '')}</kbd>)}</div>;
}
