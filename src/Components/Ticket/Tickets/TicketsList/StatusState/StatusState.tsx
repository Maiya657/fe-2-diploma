import './assets/style.css'

interface Props {
  title: string
  description: string
  tone?: 'default' | 'error' | 'loading'
}

function StatusState({
  title,
  description,
  tone = 'default',
}: Props) {
  return (
    <section className={`ticket-status ticket-status_${tone}`}>
      <div className='ticket-status__badge' aria-hidden='true' />
      <div className='ticket-status__content'>
        <h2 className='ticket-status__title'>{title}</h2>
        <p className='ticket-status__description'>{description}</p>
      </div>
    </section>
  )
}

export default StatusState
