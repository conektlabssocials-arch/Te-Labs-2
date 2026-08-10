export default function ClientsMarquee({ clients }) {
  const loop = [...clients, ...clients, ...clients, ...clients, ...clients, ...clients]
  return (
    <div
      style={{
        overflow: 'hidden',
        borderTop: '1px solid #241933',
        borderBottom: '1px solid #241933',
        background: '#0D0814',
      }}
    >
      <div
        className="te-marquee"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          width: 'max-content',
          animation: 'teDrift 36s linear infinite',
        }}
      >
        {loop.map((client, i) => (
          <div
            key={`${client.alt}-${i}`}
            data-lift="1"
            style={{
              width: 'clamp(150px, 18vw, 220px)',
              height: 104,
              padding: '18px 26px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F4F0FA',
              borderRadius: 10,
              marginRight: 10,
            }}
          >
            <img
              src={client.src}
              alt={client.alt}
              loading="lazy"
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
