export type KeyboardReferenceProps = {
  title?: string;
  image?: string;
  keys?: Array<{ eos_key: string; pc_keys: string[] }>;
};

export function KeyboardReference({
  title = '使用するPCキー',
  image,
  keys = [],
}: KeyboardReferenceProps) {
  return (
    <section
      style={{
        margin: '20px 0',
        padding: 16,
        border: '1px solid #334155',
        borderRadius: 14,
        background: '#0b1118',
        color: '#f8fafc',
      }}
    >
      <h3 style={{ margin: '0 0 12px', color: '#f4c44e' }}>{title}</h3>
      {image ? (
        <img
          src={image}
          alt="Eosバーチャルキーボード全体とPCキーボード割り当て"
          style={{ display: 'block', width: '100%', height: 'auto', borderRadius: 8 }}
        />
      ) : null}
      {keys.length ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #334155' }}>Eosキー</th>
                <th style={{ padding: 10, textAlign: 'left', borderBottom: '1px solid #334155' }}>PCキー</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((item) => (
                <tr key={`${item.eos_key}-${item.pc_keys.join('-')}`}>
                  <td style={{ padding: 10, borderBottom: '1px solid #334155' }}>{item.eos_key}</td>
                  <td style={{ padding: 10, borderBottom: '1px solid #334155' }}>
                    {item.pc_keys.join('＋')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  );
}
