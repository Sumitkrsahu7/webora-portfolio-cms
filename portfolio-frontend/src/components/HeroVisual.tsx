import { Terminal, ShieldCheck, Cpu, Database, Zap } from 'lucide-react'

export default function HeroVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-code-window">
        {/* Terminal Title Bar */}
        <div className="window-header">
          <div className="window-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <div className="window-title">
            <Terminal size={12} /> webora-platform.config.ts
          </div>
          <span className="window-branch">git:(main)</span>
        </div>

        {/* Code Body */}
        <pre className="window-code">
          <code>
            <span className="token-comment">// WEBORA Full-Stack Architecture</span>{'\n'}
            <span className="token-keyword">export const</span> <span className="token-def">weboraSystem</span> = {'{\n'}
            {'  '}name: <span className="token-string">'WEBORA Portfolio CMS'</span>,{'\n'}
            {'  '}stack: {'{\n'}
            {'    '}backend:  <span className="token-string">'Java 21 · Spring Boot 3.5'</span>,{'\n'}
            {'    '}database: <span className="token-string">'Microsoft SQL Server 2022'</span>,{'\n'}
            {'    '}frontend: <span className="token-string">'React 19 · TypeScript 5'</span>,{'\n'}
            {'    '}admin:    <span className="token-string">'Angular 20 CMS'</span>,{'\n'}
            {'  }'},{'\n'}
            {'  '}security: <span className="token-string">'JWT · CSP · HSTS'</span>,{'\n'}
            {'  '}status:   <span className="token-keyword">async</span> () =&gt; <span className="token-string">'PRODUCTION_READY'</span>,{'\n'}
            {'}'};
          </code>
        </pre>

        {/* Live System Telemetry Strip */}
        <div className="window-telemetry">
          <div className="telemetry-item">
            <Zap size={11} className="telemetry-icon active" />
            <span>API: <strong>200 OK</strong></span>
          </div>
          <div className="telemetry-item">
            <Cpu size={11} className="telemetry-icon" />
            <span>LATENCY: <strong>14ms</strong></span>
          </div>
          <div className="telemetry-item">
            <ShieldCheck size={11} className="telemetry-icon" />
            <span>AUTH: <strong>JWT Active</strong></span>
          </div>
          <div className="telemetry-item">
            <Database size={11} className="telemetry-icon" />
            <span>DB: <strong>SQL Server</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}
