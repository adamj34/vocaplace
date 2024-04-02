
export default function Icon(p) {
    return <i id="icon" className={`fas fa-${p.icon} ${p.className}`} onClick={p.onClick} />
}