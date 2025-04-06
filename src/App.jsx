import React, { useEffect, useState } from 'react'

const App = () => {

  const LOCAL_STORAGE_KEY = 'transactions'
  const [transactions, setTransactions] = useState(() => {
    const storedTransactions = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storedTransactions ? JSON.parse(storedTransactions) : []
  })
  const [text, setText] = useState('')
  const [amout, setAmount] = useState('')

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions))
  }, [transactions])

  function addTransaction() {
    if (!text || !amout) return 
    setTransactions((prev) => {
      return [...prev, {
        name: text,
        value: parseFloat(amout),
        id: crypto.randomUUID()
      }]
    })
    setText('')
    setAmount('')
  }

  function removeTransaction(id) {
    setTransactions((prev) => {
      return prev.filter(t => t.id !== id)
    })
  }

  const total = transactions.reduce((acc, t) => acc + t.value, 0)
  const income = transactions.filter(t => t.value > 0).reduce((acc, t) => acc + t.value, 0)
  const expense = transactions.filter(t => t.value < 0).reduce((acc, t) => acc + t.value, 0)

  return (
    <div className='container'>
      <h1>Expense Tracker</h1>
      <div className='balance'>Balance: <span className={total < 0 ? 'minus' : 'plus'}>{total < 0 ? '-' : '+'}${Math.abs(total).toFixed(2)}</span></div>
      <div className="summary">
        <div className='income'>+${income.toFixed(2)}</div>
        <div className='expense'>-${Math.abs(expense).toFixed(2)}</div>
      </div>
      <div className="form">
      <input 
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)} 
      />
      <input 
        type="number"
        value={amout}
        onChange={(e) => setAmount(e.target.value)} 
        onKeyDown={(e) => {
          if (e.key === 'Enter') addTransaction() 
        }}  
      />
      <button onClick={() => addTransaction()}>Add</button>
      </div>
        <ul className='list'>
          {transactions.map(t => (
            <li key={t.id} className={t.value < 0 ? 'minus' : 'plus'}>
              {t.name}
              <span>{t.value < 0 ? '-' : '+'}${Math.abs(t.value).toFixed(2)}</span>
              <button onClick={() => removeTransaction(t.id)}>delete</button>
            </li>
          ))}
        </ul>
    </div>
  )
}

export default App