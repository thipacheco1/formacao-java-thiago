import React, { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  BarChart3,
  Eye,
  Globe2,
  Link2,
  Monitor,
  MousePointerClick,
  Radio,
  RefreshCw,
  Search,
  Smartphone,
  Users
} from 'lucide-react';

const RANGE_OPTIONS = [7, 30, 90, 365];
const numberFormatter = new Intl.NumberFormat('pt-BR');
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
const timestampFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short'
});

const sourceLabels = {
  direct: 'Acesso direto',
  google: 'Google',
  bing: 'Bing',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  internal: 'Navegação interna',
  email: 'E-mail',
  other: 'Outros sites'
};

const deviceLabels = {
  desktop: 'Computador',
  mobile: 'Celular',
  tablet: 'Tablet',
  other: 'Outro dispositivo'
};

const formatMetric = (value) => numberFormatter.format(Number(value) || 0);

const formatPageName = (pageId) => {
  if (!pageId || pageId === 'home') return 'Página inicial';
  if (pageId === 'public:trilhas') return 'Catálogo das trilhas';

  const publicPage = pageId.match(/^public:(trilha|modulo):(.+)$/);
  if (publicPage) {
    const kind = publicPage[1] === 'trilha' ? 'Trilha' : 'Módulo';
    const title = publicPage[2]
      .replace(/-/g, ' ')
      .toLocaleLowerCase('pt-BR')
      .replace(/(?:^|\s)\p{L}/gu, letter => letter.toLocaleUpperCase('pt-BR'));
    return `${kind} · ${title}`;
  }

  const filename = pageId.replace(/^lesson:/, '').replace(/\.md$/i, '');
  const parts = filename.split('_');
  const sequence = parts[0];
  const readable = filename.startsWith('000_')
    ? parts.slice(1).join(' ')
    : (parts.length >= 4 ? parts.slice(3).join(' ') : filename.replace(/_/g, ' '));

  const title = readable
    .replace(/\s+OFICIAL$/i, '')
    .toLocaleLowerCase('pt-BR')
    .replace(/(?:^|\s)\p{L}/gu, letter => letter.toLocaleUpperCase('pt-BR'));

  return /^\d{3}$/.test(sequence) ? `${sequence} · ${title}` : title;
};

const MetricCard = ({ icon: Icon, label, value, helper, live = false }) => (
  <article className={`traffic-metric-card ${live ? 'is-live' : ''}`}>
    <span className="traffic-metric-icon" aria-hidden="true"><Icon size={20} /></span>
    <span className="traffic-metric-copy">
      <span className="traffic-metric-label">{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </span>
  </article>
);

const RankedList = ({ items, labels = {}, emptyText, formatName = null }) => {
  const maxValue = Math.max(1, ...items.map(item => Number(item.count) || 0));

  if (items.length === 0) {
    return <p className="traffic-empty-list">{emptyText}</p>;
  }

  return (
    <ol className="traffic-ranked-list">
      {items.map((item, index) => {
        const name = formatName ? formatName(item.name) : (labels[item.name] || item.name);
        const count = Number(item.count) || 0;

        return (
          <li key={`${item.name}-${index}`}>
            <span className="traffic-rank-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="traffic-rank-main">
              <span className="traffic-rank-copy">
                <span title={name}>{name}</span>
                <strong>{formatMetric(count)}</strong>
              </span>
              <span className="traffic-rank-track" aria-hidden="true">
                <span style={{ width: `${Math.max(4, (count / maxValue) * 100)}%` }} />
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
};

const AdminAnalytics = () => {
  const [rangeDays, setRangeDays] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAnalytics = useCallback(async ({ quiet = false } = {}) => {
    if (quiet) setIsRefreshing(true);
    else setIsLoading(true);
    setLoadError('');

    try {
      const response = await fetch(`/api/analytics?days=${rangeDays}`, {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' }
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Sua sessão administrativa expirou. Saia e entre novamente para ver os acessos.');
        }
        throw new Error(payload.error || `Não foi possível carregar os acessos (${response.status}).`);
      }

      setAnalytics(payload);
    } catch (error) {
      setLoadError(error.message || 'Não foi possível carregar as estatísticas de acesso.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [rangeDays]);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    const interval = window.setInterval(() => loadAnalytics({ quiet: true }), 30_000);
    return () => window.clearInterval(interval);
  }, [loadAnalytics]);

  const summary = analytics?.summary || {};
  const today = summary.today || {};
  const series = analytics?.series || [];
  const sources = analytics?.sources || [];
  const pages = analytics?.pages || [];
  const devices = analytics?.devices || [];
  const campaigns = analytics?.campaigns || [];

  const chartMax = Math.max(1, ...series.map(day => Number(day.pageviews) || 0));
  const chartWidth = Math.max(520, series.length * (rangeDays > 90 ? 12 : 24));

  return (
    <section className="admin-report-container traffic-dashboard" aria-busy={isLoading}>
      <header className="admin-header-section traffic-header">
        <div>
          <span className="admin-eyebrow">Analytics próprio e privado</span>
          <h2 className="admin-title">Acessos e audiência</h2>
          <p className="admin-subtitle">
            Acompanhe visitas, pessoas online, páginas mais vistas e como novos visitantes encontraram o curso.
          </p>
        </div>

        <div className="traffic-header-actions">
          <div className="traffic-range-selector" role="group" aria-label="Período das estatísticas">
            {RANGE_OPTIONS.map(days => (
              <button
                key={days}
                type="button"
                className={rangeDays === days ? 'active' : ''}
                onClick={() => setRangeDays(days)}
                aria-pressed={rangeDays === days}
              >
                {days === 365 ? '1 ano' : `${days}d`}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="traffic-refresh-btn"
            onClick={() => loadAnalytics({ quiet: true })}
            disabled={isLoading || isRefreshing}
          >
            <RefreshCw size={15} className={isRefreshing ? 'is-spinning' : ''} />
            Atualizar
          </button>
        </div>
      </header>

      {loadError ? (
        <div className="admin-empty-state admin-load-error" role="alert">
          <p>{loadError}</p>
          <button type="button" onClick={() => loadAnalytics()}>Tentar novamente</button>
        </div>
      ) : isLoading && !analytics ? (
        <div className="admin-empty-state" role="status">
          <p>Carregando estatísticas reais do site...</p>
        </div>
      ) : (
        <>
          <div className="traffic-metrics-grid">
            <MetricCard
              icon={Radio}
              label="Online agora"
              value={formatMetric(summary.online)}
              helper={`Ativos nos últimos ${Math.round((analytics?.onlineWindowSeconds || 130) / 60)} min`}
              live
            />
            <MetricCard
              icon={MousePointerClick}
              label="Acessos"
              value={formatMetric(summary.sessions)}
              helper={`${formatMetric(today.sessions)} hoje`}
            />
            <MetricCard
              icon={Users}
              label="Visitantes únicos"
              value={formatMetric(summary.uniqueVisitors)}
              helper={`${formatMetric(today.visitors)} hoje`}
            />
            <MetricCard
              icon={Eye}
              label="Visualizações"
              value={formatMetric(summary.pageviews)}
              helper={`${formatMetric(today.pageviews)} hoje`}
            />
          </div>

          <div className="traffic-dashboard-grid">
            <article className="traffic-panel traffic-history-panel">
              <header className="traffic-panel-header">
                <div>
                  <span className="traffic-panel-icon"><BarChart3 size={17} /></span>
                  <div>
                    <h3>Movimento no período</h3>
                    <p>Visualizações registradas por dia</p>
                  </div>
                </div>
                <strong>{formatMetric(series.reduce((sum, day) => sum + (Number(day.pageviews) || 0), 0))}</strong>
              </header>

              <div className="traffic-chart-scroll">
                <div className="traffic-bar-chart" style={{ minWidth: `${chartWidth}px` }}>
                  {series.map(day => {
                    const pageviews = Number(day.pageviews) || 0;
                    const height = Math.max(pageviews > 0 ? 5 : 1, (pageviews / chartMax) * 100);
                    return (
                      <div
                        key={day.date}
                        className="traffic-chart-day"
                        title={`${day.date}: ${formatMetric(pageviews)} visualizações, ${formatMetric(day.sessions)} acessos`}
                      >
                        <span className="traffic-chart-value">{pageviews > 0 ? formatMetric(pageviews) : ''}</span>
                        <span className="traffic-chart-column"><span style={{ height: `${height}%` }} /></span>
                        <span className="traffic-chart-label">{dateFormatter.format(new Date(`${day.date}T12:00:00`))}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>

            <article className="traffic-panel traffic-sources-panel">
              <header className="traffic-panel-header">
                <div>
                  <span className="traffic-panel-icon"><Search size={17} /></span>
                  <div>
                    <h3>Como encontraram o curso</h3>
                    <p>Origem dos acessos e compartilhamentos</p>
                  </div>
                </div>
              </header>
              <RankedList items={sources} labels={sourceLabels} emptyText="As origens aparecerão após os primeiros acessos." />
            </article>

            <article className="traffic-panel traffic-pages-panel">
              <header className="traffic-panel-header">
                <div>
                  <span className="traffic-panel-icon"><Globe2 size={17} /></span>
                  <div>
                    <h3>Páginas e aulas mais vistas</h3>
                    <p>Conteúdo que mais desperta interesse</p>
                  </div>
                </div>
              </header>
              <RankedList items={pages} formatName={formatPageName} emptyText="As páginas mais vistas aparecerão aqui." />
            </article>

            <article className="traffic-panel traffic-audience-panel">
              <header className="traffic-panel-header">
                <div>
                  <span className="traffic-panel-icon"><Activity size={17} /></span>
                  <div>
                    <h3>Audiência</h3>
                    <p>Dispositivos e campanhas identificadas</p>
                  </div>
                </div>
              </header>

              <div className="traffic-audience-block">
                <h4><Monitor size={14} /> Dispositivos</h4>
                <RankedList items={devices} labels={deviceLabels} emptyText="Ainda não há dispositivos identificados." />
              </div>

              {campaigns.length > 0 && (
                <div className="traffic-audience-block">
                  <h4><Link2 size={14} /> Campanhas compartilhadas</h4>
                  <RankedList items={campaigns} emptyText="Nenhuma campanha rastreada." />
                </div>
              )}

              <div className="traffic-privacy-note">
                <Smartphone size={15} />
                <span>Sem armazenar IP, e-mail ou histórico individual de navegação.</span>
              </div>
            </article>
          </div>

          <footer className="traffic-dashboard-footer">
            <span><Radio size={13} /> Atualização automática a cada 30 segundos</span>
            {analytics?.generatedAt && <span>Última leitura: {timestampFormatter.format(new Date(analytics.generatedAt))}</span>}
          </footer>
        </>
      )}
    </section>
  );
};

export default AdminAnalytics;
