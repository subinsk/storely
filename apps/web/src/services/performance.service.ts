interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  url?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

interface WebVitals {
  CLS?: number; // Cumulative Layout Shift
  FID?: number; // First Input Delay
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  TTFB?: number; // Time to First Byte
}

interface ErrorReport {
  id: string;
  message: string;
  stack: string;
  url: string;
  lineNumber: number;
  columnNumber: number;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  additionalData?: Record<string, any>;
}

interface PerformanceReport {
  pageLoadTime: number;
  domContentLoadedTime: number;
  resourceLoadTimes: Array<{
    name: string;
    duration: number;
    type: string;
  }>;
  webVitals: WebVitals;
  memoryUsage?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
  networkInfo?: {
    effectiveType: string;
    rtt: number;
    downlink: number;
  };
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private errors: ErrorReport[] = [];
  private isMonitoring = false;
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeMonitoring();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeMonitoring() {
    if (typeof window === 'undefined') return;

    // Initialize performance monitoring
    this.isMonitoring = true;

    // Monitor page load performance
    window.addEventListener('load', () => {
      this.collectPageLoadMetrics();
    });

    // Monitor Web Vitals
    this.initializeWebVitals();

    // Monitor errors
    this.initializeErrorMonitoring();

    // Monitor network performance
    this.initializeNetworkMonitoring();

    // Monitor memory usage
    this.initializeMemoryMonitoring();
  }

  private collectPageLoadMetrics() {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;
    const navigation = window.performance.navigation;

    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    const domContentLoadedTime = timing.domContentLoadedEventEnd - timing.navigationStart;
    const firstByteTime = timing.responseStart - timing.navigationStart;

    this.recordMetric('page_load_time', pageLoadTime);
    this.recordMetric('dom_content_loaded_time', domContentLoadedTime);
    this.recordMetric('time_to_first_byte', firstByteTime);
    this.recordMetric('navigation_type', navigation.type);

    // Collect resource timing
    this.collectResourceTiming();
  }

  private collectResourceTiming() {
    if (!window.performance || !window.performance.getEntriesByType) return;

    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    resources.forEach(resource => {
      this.recordMetric('resource_load_time', resource.duration, {
        resourceName: resource.name,
        resourceType: resource.initiatorType,
        transferSize: resource.transferSize,
        encodedBodySize: resource.encodedBodySize,
        decodedBodySize: resource.decodedBodySize,
      });
    });
  }

  private initializeWebVitals() {
    // This would typically use the 'web-vitals' library
    // For now, we'll simulate Web Vitals collection
    
    // Simulate CLS monitoring
    let clsValue = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // Layout shift not supported
    }

    // Record CLS when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.recordMetric('cls', clsValue);
      }
    });

    // Simulate LCP monitoring
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('lcp', lastEntry.startTime);
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      // LCP not supported
    }

    // Simulate FID monitoring
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.recordMetric('fid', (entry as any).processingStart - entry.startTime);
      }
    });

    try {
      fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      // FID not supported
    }
  }

  private initializeErrorMonitoring() {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.recordError({
        message: event.message,
        stack: event.error?.stack || '',
        url: event.filename || window.location.href,
        lineNumber: event.lineno || 0,
        columnNumber: event.colno || 0,
        timestamp: new Date(),
        userId: this.userId,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        additionalData: {
          type: 'javascript_error',
          target: event.target?.toString(),
        },
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.recordError({
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack || '',
        url: window.location.href,
        lineNumber: 0,
        columnNumber: 0,
        timestamp: new Date(),
        userId: this.userId,
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        additionalData: {
          type: 'unhandled_promise_rejection',
          reason: event.reason,
        },
      });
    });
  }

  private initializeNetworkMonitoring() {
    // Monitor network information
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      this.recordMetric('network_effective_type', 0, {
        effectiveType: connection.effectiveType,
        rtt: connection.rtt,
        downlink: connection.downlink,
      });

      connection.addEventListener('change', () => {
        this.recordMetric('network_change', 0, {
          effectiveType: connection.effectiveType,
          rtt: connection.rtt,
          downlink: connection.downlink,
        });
      });
    }
  }

  private initializeMemoryMonitoring() {
    // Monitor memory usage
    if ('memory' in (performance as any)) {
      const memory = (performance as any).memory;
      
      setInterval(() => {
        this.recordMetric('memory_usage', memory.usedJSHeapSize, {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
        });
      }, 30000); // Every 30 seconds
    }
  }

  private recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: new Date(),
      url: window.location.href,
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      metadata,
    };

    this.metrics.push(metric);
    this.sendMetricToServer(metric);
  }

  private recordError(errorData: Partial<ErrorReport>) {
    const error: ErrorReport = {
      id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: errorData.message || 'Unknown error',
      stack: errorData.stack || '',
      url: errorData.url || window.location.href,
      lineNumber: errorData.lineNumber || 0,
      columnNumber: errorData.columnNumber || 0,
      timestamp: new Date(),
      userId: this.userId,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      additionalData: errorData.additionalData,
    };

    this.errors.push(error);
    this.sendErrorToServer(error);
  }

  private async sendMetricToServer(metric: PerformanceMetric) {
    try {
      await fetch('/api/performance/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metric),
      });
    } catch (error) {
      console.error('Failed to send performance metric:', error);
    }
  }

  private async sendErrorToServer(error: ErrorReport) {
    try {
      await fetch('/api/performance/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(error),
      });
    } catch (err) {
      console.error('Failed to send error report:', err);
    }
  }

  // Public API
  public setUserId(userId: string) {
    this.userId = userId;
  }

  public trackCustomMetric(name: string, value: number, metadata?: Record<string, any>) {
    this.recordMetric(name, value, metadata);
  }

  public trackPageView(page: string, metadata?: Record<string, any>) {
    this.recordMetric('page_view', 1, {
      page,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  public trackUserAction(action: string, metadata?: Record<string, any>) {
    this.recordMetric('user_action', 1, {
      action,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  public async generateReport(): Promise<PerformanceReport> {
    const pageLoadMetrics = this.metrics.filter(m => m.name === 'page_load_time');
    const domLoadMetrics = this.metrics.filter(m => m.name === 'dom_content_loaded_time');
    const resourceMetrics = this.metrics.filter(m => m.name === 'resource_load_time');
    const webVitalsMetrics = this.metrics.filter(m => 
      ['cls', 'fid', 'fcp', 'lcp', 'ttfb'].includes(m.name)
    );

    const report: PerformanceReport = {
      pageLoadTime: pageLoadMetrics.length > 0 ? pageLoadMetrics[0].value : 0,
      domContentLoadedTime: domLoadMetrics.length > 0 ? domLoadMetrics[0].value : 0,
      resourceLoadTimes: resourceMetrics.map(m => ({
        name: m.metadata?.resourceName || 'unknown',
        duration: m.value,
        type: m.metadata?.resourceType || 'unknown',
      })),
      webVitals: webVitalsMetrics.reduce((acc, metric) => {
        acc[metric.name.toUpperCase() as keyof WebVitals] = metric.value;
        return acc;
      }, {} as WebVitals),
    };

    // Add memory usage if available
    const memoryMetrics = this.metrics.filter(m => m.name === 'memory_usage');
    if (memoryMetrics.length > 0) {
      const latestMemory = memoryMetrics[memoryMetrics.length - 1];
      report.memoryUsage = latestMemory.metadata as any;
    }

    // Add network info if available
    const networkMetrics = this.metrics.filter(m => m.name === 'network_effective_type');
    if (networkMetrics.length > 0) {
      const latestNetwork = networkMetrics[networkMetrics.length - 1];
      report.networkInfo = latestNetwork.metadata as any;
    }

    return report;
  }

  public getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors];
  }

  public clearMetrics() {
    this.metrics = [];
  }

  public clearErrors() {
    this.errors = [];
  }

  public stop() {
    this.isMonitoring = false;
  }
}

export const performanceService = new PerformanceMonitoringService();
export default performanceService;
