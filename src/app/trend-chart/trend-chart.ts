import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ImageUrl } from '../images';

export interface ChartPoint {
  name: string;
  value: number;
}

interface PositionedPoint extends ChartPoint {
  x: number;
  y: number;
}

const WIDTH = 600;
const HEIGHT = 260;
const LEFT = 16;
const RIGHT = 16;
const TOP = 14;
const BOTTOM = 34;
const PLOT_WIDTH = WIDTH - LEFT - RIGHT;
const PLOT_HEIGHT = HEIGHT - TOP - BOTTOM;

@Component({
  selector: 'nutio-trend-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trend-chart.html',
  host: { class: 'block size-full' },
})
export class TrendChart {
  protected readonly logoUrl = ImageUrl.Logo;
  readonly points = input.required<readonly ChartPoint[]>();
  readonly trend = input.required<readonly ChartPoint[]>();
  readonly color = input.required<string>();
  readonly formatLabel = input<(value: string) => string>((value) => value);

  protected readonly positionedPoints = computed(() => this.position(this.points()));
  protected readonly positionedTrend = computed(() => this.position(this.trend()));
  protected readonly gridLines = computed(() =>
    Array.from({ length: 4 }, (_, index) => {
      const ratio = index / 3;
      return {
        y: TOP + ratio * PLOT_HEIGHT,
        value: this.maximum() * (1 - ratio),
      };
    }),
  );
  protected readonly areaPath = computed(() => {
    const points = this.positionedPoints();
    if (!points.length) return '';
    const line = points.map(({ x, y }) => `L ${x} ${y}`).join(' ');
    return `M ${points[0].x} ${TOP + PLOT_HEIGHT} ${line} L ${points.at(-1)!.x} ${TOP + PLOT_HEIGHT} Z`;
  });
  protected readonly linePath = computed(() => this.path(this.positionedPoints()));
  protected readonly trendPath = computed(() => this.path(this.positionedTrend()));

  private readonly maximum = computed(() => {
    const maximum = Math.max(0, ...this.points().map(({ value }) => value));
    return maximum || 1;
  });

  private position(points: readonly ChartPoint[]): PositionedPoint[] {
    const lastIndex = Math.max(points.length - 1, 1);
    return points.map((point, index) => ({
      ...point,
      x: LEFT + (index / lastIndex) * PLOT_WIDTH,
      y: TOP + (1 - point.value / this.maximum()) * PLOT_HEIGHT,
    }));
  }

  private path(points: readonly PositionedPoint[]): string {
    return points.map(({ x, y }, index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
  }
}
