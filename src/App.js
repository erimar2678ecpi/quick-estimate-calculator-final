import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import './App.css';
import Button from './components/Button';
import Textfield from './components/Textfield';

const HOURLY_RATE = 75;
const MAX_SERVICE_HOURS = 24;
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

function App() {
  const [serviceHours, setServiceHours] = useState('');
  const [hoursError, setHoursError] = useState('');
  const [totalEstimate, setTotalEstimate] = useState(null);
  const [history, setHistory] = useState([]);
  const [estimateSaved, setEstimateSaved] = useState(false);

  const handleHoursChange = (e) => {
    setServiceHours(e.target.value);
    setHoursError('');
    setTotalEstimate(null);
    setEstimateSaved(false);
  };

  const handleCalculate = (e) => {
    if (e) {
      e.preventDefault();
    }

    const hours = Number.parseFloat(serviceHours);

    if (serviceHours === '') {
      setHoursError('Please enter service hours.');
      return;
    }

    if (!Number.isFinite(hours) || hours <= 0) {
      setHoursError('Enter a valid number greater than 0.');
      return;
    }

    if (hours > MAX_SERVICE_HOURS) {
      setHoursError(`Use a value between 0.5 and ${MAX_SERVICE_HOURS} hours.`);
      return;
    }

    setHoursError('');
    setTotalEstimate(HOURLY_RATE * hours);
    setEstimateSaved(false);
  };

  const handleAddEstimate = () => {
    if (totalEstimate === null || estimateSaved) {
      return;
    }

    const hours = Number.parseFloat(serviceHours);
    const createdAt = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date());

    setHistory((previousHistory) => [
      {
        id: `${Date.now()}-${hours}-${totalEstimate}`,
        rate: HOURLY_RATE,
        hours,
        total: totalEstimate,
        createdAt,
      },
      ...previousHistory,
    ]);
    setEstimateSaved(true);
  };

  const handleResetForm = () => {
    setServiceHours('');
    setHoursError('');
    setTotalEstimate(null);
    setEstimateSaved(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setEstimateSaved(false);
  };

  const savedEstimateAverage =
    history.length > 0
      ? history.reduce((sum, item) => sum + item.total, 0) / history.length
      : 0;

  const chartData = history
    .slice(0, 5)
    .reverse()
    .map((item, index) => ({
      name: `Saved ${index + 1}`,
      value: item.total,
      fill: '#2f6c5e',
    }));

  if (totalEstimate !== null && !estimateSaved) {
    chartData.push({
      name: 'Current',
      value: totalEstimate,
      fill: '#f4a259',
    });
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Transportation Cost Estimator</p>
          <h1>Quick Estimate Calculator</h1>
          <p className="hero-description">
            Create fast transportation service quotes with clear pricing, readable results,
            saved estimate history, and a simple visual comparison chart.
          </p>
        </div>

        <div className="hero-stats" aria-label="Application highlights">
          <article className="hero-stat-card">
            <span className="stat-label">Hourly Rate</span>
            <strong>{currencyFormatter.format(HOURLY_RATE)}</strong>
            <p>Consistent labor pricing for rapid quote building.</p>
          </article>
          <article className="hero-stat-card">
            <span className="stat-label">Saved Quotes</span>
            <strong>{history.length}</strong>
            <p>Track previous estimate totals without losing them on form reset.</p>
          </article>
        </div>
      </header>

      <main className="dashboard">
        <section className="card calculator-card">
          <div className="section-heading">
            <p className="section-kicker">Input</p>
            <h2>Build an estimate</h2>
          </div>
          <p className="section-copy">
            Enter service hours, calculate a total, and save the estimate to history for
            comparison. Invalid values are blocked before the total updates.
          </p>

          <form className="estimate-form" onSubmit={handleCalculate}>
            <Textfield
              id="hourly-rate"
              label="Hourly Rate"
              value={currencyFormatter.format(HOURLY_RATE)}
              disabled
              helperText="Standard transportation labor rate."
            />
            <Textfield
              id="service-hours"
              label="Service Hours"
              type="number"
              value={serviceHours}
              onChange={handleHoursChange}
              placeholder="Enter hours"
              error={hoursError}
              helperText={`Use 0.5 to ${MAX_SERVICE_HOURS} hours.`}
            />

            <div className="form-actions">
              <Button
                type="submit"
                label="Calculate Estimate"
                className="btn btn-primary"
              />
              <Button
                label="Reset Form"
                onClick={handleResetForm}
                className="btn btn-secondary"
              />
            </div>
          </form>
        </section>

        <section className="card summary-card">
          <div className="section-heading">
            <p className="section-kicker">Summary</p>
            <h2>Current estimate</h2>
          </div>

          <div className="estimate-spotlight">
            <p className="spotlight-label">Projected transportation total</p>
            <p className="spotlight-value">
              {totalEstimate !== null ? currencyFormatter.format(totalEstimate) : '--'}
            </p>
            <p className="spotlight-caption">
              {totalEstimate !== null
                ? `${serviceHours} service hour${Number(serviceHours) === 1 ? '' : 's'} at ${currencyFormatter.format(HOURLY_RATE)} per hour.`
                : 'Calculate an estimate to reveal the total.'}
            </p>
          </div>

          <div className="summary-grid">
            <article className="mini-stat">
              <span className="mini-stat-label">Saved Average</span>
              <strong>
                {history.length > 0 ? currencyFormatter.format(savedEstimateAverage) : '--'}
              </strong>
            </article>
            <article className="mini-stat">
              <span className="mini-stat-label">Status</span>
              <strong>{estimateSaved ? 'Saved' : totalEstimate !== null ? 'Ready' : 'Waiting'}</strong>
            </article>
          </div>

          <div className="result-actions">
            <Button
              label={estimateSaved ? 'Estimate Saved' : 'Save Estimate'}
              onClick={handleAddEstimate}
              disabled={totalEstimate === null || estimateSaved}
              className="btn btn-accent"
            />
            <Button
              label="Clear History"
              onClick={handleClearHistory}
              disabled={history.length === 0}
              className="btn btn-ghost"
            />
          </div>
        </section>

        <section className="card history-card">
          <div className="section-heading">
            <p className="section-kicker">History</p>
            <h2>Saved estimates</h2>
          </div>

          <ul className="history-list">
            {history.length === 0 && (
              <li className="empty-state">
                No estimates saved yet. Add a calculated total to populate this panel.
              </li>
            )}
            {history.map((item) => (
              <li key={item.id} className="history-item">
                <div>
                  <p className="history-total">{currencyFormatter.format(item.total)}</p>
                  <p className="history-meta">
                    {item.hours} hr at {currencyFormatter.format(item.rate)}/hr
                  </p>
                </div>
                <span className="history-date">{item.createdAt}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card chart-card">
          <div className="section-heading">
            <p className="section-kicker">Visual</p>
            <h2>Estimate trend</h2>
          </div>
          <p className="section-copy">
            The bar chart compares the latest saved estimates and highlights the current
            unsaved calculation in orange.
          </p>

          {chartData.length === 0 ? (
            <p className="chart-empty">Calculate and save an estimate to populate the chart.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} margin={{ top: 20, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 46, 63, 0.12)" />
                <XAxis dataKey="name" tick={{ fontSize: 14, fill: '#4b5563' }} />
                <YAxis
                  tickFormatter={(value) => currencyFormatter.format(value)}
                  tick={{ fontSize: 14, fill: '#4b5563' }}
                  width={80}
                />
                <Tooltip
                  formatter={(value) => [currencyFormatter.format(value), 'Estimate']}
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid rgba(34, 46, 63, 0.12)',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
                  }}
                />
                <Bar dataKey="value" radius={[12, 12, 0, 0]} maxBarSize={72}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
