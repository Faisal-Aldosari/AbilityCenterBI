// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) {
      console.warn(`No start time found for label: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.metrics.delete(label);

    if (import.meta.env.DEV) {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    // Log slow operations in production
    if (import.meta.env.PROD && duration > 1000) {
      console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measureAsync<T>(label: string, asyncFn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    return asyncFn().finally(() => {
      this.endTiming(label);
    });
  }

  getWebVitals(): void {
    // Core Web Vitals monitoring
    if ('performance' in window && 'getEntriesByType' in performance) {
      // First Contentful Paint
      const fcpEntry = performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        console.log(`🎨 First Contentful Paint: ${fcpEntry.startTime.toFixed(2)}ms`);
      }

      // Largest Contentful Paint
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`📊 Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
      });

      try {
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        // LCP not supported
      }

      // Cumulative Layout Shift
      let cumulativeLayoutShift = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cumulativeLayoutShift += (entry as any).value;
          }
        }
        console.log(`📐 Cumulative Layout Shift: ${cumulativeLayoutShift.toFixed(4)}`);
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // CLS not supported
      }
    }
  }

  measureMemoryUsage(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log(`💾 Memory Usage:`, {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
      });
    }
  }
}

// Hook for performance monitoring
export const usePerformanceMonitor = () => {
  return PerformanceMonitor.getInstance();
};
